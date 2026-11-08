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

const JWT_SECRET = Deno.env.get("RUMBO_JWT_SECRET") ?? "rumbo-fallback-secret-change-me";

async function verifyToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) return false;
    return payload.role === "rumbo-admin" && payload.username === "rumbofuturoo";
  } catch {
    return false;
  }
}

function getAdminToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const token = getAdminToken(req.headers.get("Authorization"));
  if (!token || !(await verifyToken(token))) {
    return makeResponse({ error: "No autorizado" }, 401);
  }

  // GET: retrieve current system prompt
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("agent_config")
      .select("system_prompt, updated_at")
      .limit(1)
      .maybeSingle();

    if (error) {
      return makeResponse({ error: "Error al obtener el system prompt" }, 500);
    }

    if (!data) {
      return makeResponse({ error: "No hay system prompt configurado" }, 404);
    }

    return makeResponse({ systemPrompt: data.system_prompt, updatedAt: data.updated_at });
  }

  // PUT: update system prompt
  if (req.method === "PUT") {
    let body;
    try {
      body = await req.json();
    } catch {
      return makeResponse({ error: "Cuerpo de la petición inválido" }, 400);
    }

    const { systemPrompt } = body;
    if (!systemPrompt || typeof systemPrompt !== "string" || systemPrompt.trim().length === 0) {
      return makeResponse({ error: "El system prompt no puede estar vacío" }, 400);
    }

    const { data: existing } = await supabase
      .from("agent_config")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("agent_config")
        .update({ system_prompt: systemPrompt, updated_at: new Date().toISOString() })
        .eq("id", existing.id);

      if (error) {
        return makeResponse({ error: "Error al guardar el system prompt" }, 500);
      }
    } else {
      const { error } = await supabase
        .from("agent_config")
        .insert({ system_prompt: systemPrompt });

      if (error) {
        return makeResponse({ error: "Error al crear el system prompt" }, 500);
      }
    }

    return makeResponse({ success: true });
  }

  return makeResponse({ error: "Método no permitido" }, 405);
});

