import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function makeResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface QuestionnaireAnswers {
  profile: "journalist" | "researcher";
  level: string;
  interests: string[];
  format: {
    modality: "online" | "in_person" | "either";
    duration: "course" | "event" | "either";
  };
}

// Retrieve relevant RAG chunks based on keyword matching with the user's answers
async function retrieveRagContext(
  supabase: ReturnType<typeof createClient>,
  answers: QuestionnaireAnswers,
): Promise<string> {
  const searchTerms = [
    ...answers.interests,
    answers.level,
    answers.profile === "journalist" ? "curso" : "colaboración",
    answers.format.modality === "online" ? "online" : answers.format.modality === "in_person" ? "presencial" : "",
    answers.format.duration === "course" ? "curso suscripción" : answers.format.duration === "event" ? "encuentro evento" : "",
  ].filter((t) => t.length > 0);

  // Get all chunks (for a small knowledge base, we retrieve all and rank)
  const { data: chunks, error } = await supabase
    .from("rag_chunks")
    .select("content, document_id")
    .limit(500);

  if (error || !chunks || chunks.length === 0) {
    return "";
  }

  // Simple keyword-based scoring
  const scored = chunks.map((chunk) => {
    const lowerContent = chunk.content.toLowerCase();
    let score = 0;
    for (const term of searchTerms) {
      const lowerTerm = term.toLowerCase();
      if (lowerContent.includes(lowerTerm)) {
        score += lowerTerm.length > 4 ? 3 : 1;
      }
    }
    return { content: chunk.content, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const topChunks = scored.filter((c) => c.score > 0).slice(0, 5);

  if (topChunks.length === 0) {
    return "";
  }

  return topChunks.map((c) => c.content).join("\n\n---\n\n");
}

// Build the context string from Rumbo Futuro's static data
function buildStaticContext(): string {
  return `INFORMACIÓN INTERNA DE RUMBO FUTURO:

ESTADO DE CURSOS: Todos los cursos están en preparación ("Próximamente"). No hay cursos disponibles actualmente. Las modalidades serán online y presencial, mediante suscripción. Los precios se anunciarán cuando estén aprobados.

EVENTOS DISPONIBLES (todos en preparación o próximamente):
1. Charlas promocionales en la FCom — En preparación. Sesiones para presentar Rumbo Futuro.
2. Networking de LabProCom — Próximamente. Encuentros para conectar jóvenes periodistas con académicos y profesionales.
3. Consejo de Periodistas — En preparación. Encuentros sobre ética periodística y retos del sector.
4. Asociación de Prensa — En preparación. Actividades para conocer el funcionamiento del sector.

EQUIPO DE RUMBO FUTURO (cargos por definir):
Enrique Jiménez García, Adrián Márquez Domínguez, Laura Prado Álvarez, Marta López Sanromán, Laura Gallego Rodríguez, Mariela Reyes Chaves.

COLABORADORES (no son acuerdos formales confirmados):
- Diario de Espartinas: medio de comunicación local de Espartinas.
- El Territorio Cadista: medio digital de actualidad.
- Universidad de Sevilla (US): universidad pública con actividad docente e investigadora en comunicación.
- LabProCom: iniciativa vinculada a investigación y comunicación.
- Secretariado de Divulgación Cultural y Científica de la Universidad de Sevilla: respaldo académico y divulgación.

VALOR DE RUMBO FUTURO: «Ofrecemos una formación práctica y flexible geográficamente que conecta a los periodistas emergentes con el mundo laboral a través de los investigadores, a un precio competitivo.»

NOTA: No hay perfiles de antiguos alumnos disponibles todavía. No hay currículums detallados de investigadores disponibles públicamente. No inventes información que no esté aquí.`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return makeResponse({ error: "Método no permitido" }, 405);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  let body: { answers: QuestionnaireAnswers; testMode?: boolean };
  try {
    body = await req.json();
  } catch {
    return makeResponse({ error: "Cuerpo de la petición inválido" }, 400);
  }

  if (!body.answers || !body.answers.profile || !body.answers.level || !body.answers.interests) {
    return makeResponse({ error: "Faltan respuestas del cuestionario" }, 400);
  }

  const answers = body.answers;

  // Get the current system prompt from the database
  const { data: config, error: configError } = await supabase
    .from("agent_config")
    .select("system_prompt")
    .limit(1)
    .maybeSingle();

  if (configError || !config) {
    return makeResponse({ error: "No hay system prompt configurado" }, 500);
  }

  // Retrieve RAG context from uploaded documents
  const ragContext = await retrieveRagContext(supabase, answers);

  // Build the static context from Rumbo Futuro's data
  const staticContext = buildStaticContext();

  // Build the user message with questionnaire answers
  const profileLabel = answers.profile === "journalist"
    ? "Periodista emergente / talento en formación"
    : "Investigador o profesional";

  const userMessage = `Perfil del usuario: ${profileLabel}

Nivel académico/profesional: ${answers.level}

Intereses y temáticas: ${answers.interests.join(", ")}

Preferencias de formato:
- Modalidad preferida: ${answers.format.modality === "online" ? "Online" : answers.format.modality === "in_person" ? "Presencial" : "Indiferente"}
- Duración preferida: ${answers.format.duration === "course" ? "Curso de mayor duración (suscripción)" : answers.format.duration === "event" ? "Actividad puntual / encuentro" : "Indiferente"}

${answers.profile === "journalist"
  ? "Mensaje inicial del usuario: «Hola, quiero una guía para saber qué curso es el mejor para mí»."
  : "Mensaje inicial del usuario: «Hola, quiero una guía para saber qué usuarios estarían dispuestos a colaborar conmigo»."}`;

  // Combine all context for the agent (Instruimos a la IA a no incluir asteriscos y añadir siempre el correo al final)
  const fullContext = `${staticContext}

${ragContext ? `BASE DE CONOCIMIENTO (documentos subidos):
${ragContext}
` : ""}

REGLAS DE FORMATO OBLIGATORIAS:
1. No uses ningún asterisco (*) ni formato negrita en la respuesta.
2. Al final de tu recomendación incluye siempre el correo rumbofuturo@gmail.com invitando a escribirnos directamente.`;

  // Get OpenRouter API key from environment
  const openRouterKey = Deno.env.get("OPENROUTER_API_KEY");

  if (!openRouterKey) {
    // Return a fallback response when no API key is configured
    return makeResponse({
      recommendation: "Conoce más sobre el proyecto contactando con Rumbo Futuro para valorar tu incorporación a futuras convocatorias. Puedes escribirnos a rumbofuturo@gmail.com",
      justification: answers.profile === "journalist"
        ? `Por tus intereses en ${answers.interests.join(", ")} y tu preferencia por la modalidad ${answers.format.modality === "online" ? "online" : "presencial"}, te recomendamos estar atento al lanzamiento de nuestros primeros cursos. Puedes consultarnos cualquier duda escribiendo a rumbofuturo@gmail.com.`
        : `Por tu perfil como ${answers.level} y tus intereses en ${answers.interests.join(", ")}, te invitamos a participar en los próximos encuentros de Rumbo Futuro. Puedes escribirnos a rumbofuturo@gmail.com para coordinar tu colaboración.`,
      cta: "Escribir a rumbofuturo@gmail.com",
      ctaLink: "mailto:rumbofuturo@gmail.com",
      showContactForm: true,
      warning: "El agente de IA no está configurado. Falta la API key de OpenRouter. La recomendación mostrada es orientativa y no ha sido generada por el agente LangChain.",
      chunksUsed: [],
    });
  }

  // Call OpenRouter API in free auto mode
  try {
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": Deno.env.get("SUPABASE_URL") ?? "https://rumbofuturo.com",
        "X-Title": "RumboChat Agent",
      },
      body: JSON.stringify({
        model: "openrouter/auto", // free auto mode: OpenRouter routes to the best available free model
        messages: [
          { role: "system", content: config.system_prompt },
          { role: "system", content: fullContext },
          { role: "user", content: userMessage },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openRouterResponse.ok) {
      const errText = await openRouterResponse.text();
      return makeResponse({
        error: "Error en el agente de IA",
        details: `OpenRouter respondió con código ${openRouterResponse.status}`,
        recommendation: null,
      }, 502);
    }

    const aiResult = await openRouterResponse.json();
    let aiMessage = aiResult.choices?.[0]?.message?.content ?? "";

    if (!aiMessage || aiMessage.trim().length === 0) {
      return makeResponse({
        error: "El agente no generó una respuesta válida",
        recommendation: null,
      }, 502);
    }

    // Limpiamos cualquier asterisco generado dinámicamente por la IA
    aiMessage = aiMessage.replace(/\*/g, "");

    return makeResponse({
      recommendation: aiMessage,
      justification: null,
      cta: "Escribir a rumbofuturo@gmail.com",
      ctaLink: "mailto:rumbofuturo@gmail.com",
      showContactForm: true,
      warning: null,
      chunksUsed: ragContext ? [1] : [],
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Error desconocido";
    return makeResponse({
      error: "Error de conexión con el agente de IA",
      details: errMsg,
      recommendation: null,
    }, 502);
  }
});
