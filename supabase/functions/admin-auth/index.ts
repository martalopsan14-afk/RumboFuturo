
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Se conserva el secreto que ya tienes configurado en Supabase.
const JWT_SECRET = Deno.env.get("RUMBO_JWT_SECRET");

function makeResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded =
    base64 + "=".repeat((4 - (base64.length % 4)) % 4);

  const binary = atob(padded);

  return Uint8Array.from(binary, (char) =>
    char.charCodeAt(0)
  );
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    if (!JWT_SECRET) return false;

    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const header = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(parts[0]))
    );

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(parts[1]))
    );

    if (header.alg !== "HS256" || header.typ !== "JWT") {
      return false;
    }

    if (
      typeof payload.exp !== "number" ||
      Date.now() >= payload.exp * 1000
    ) {
      return false;
    }

    if (
      payload.role !== "rumbo-admin" ||
      payload.username !== "rumbofuturoo"
    ) {
      return false;
    }

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(JWT_SECRET),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      false,
      ["verify"]
    );

    return await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(parts[2]),
      new TextEncoder().encode(
        `${parts[0]}.${parts[1]}`
      )
    );
  } catch {
    return false;
  }
}

async function signToken(
  payload: Record<string, unknown>
): Promise<string> {
  if (!JWT_SECRET) {
    throw new Error("Falta configurar RUMBO_JWT_SECRET en Supabase");
  }

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const encodedHeader = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify(header))
  );

  const encodedPayload = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify(payload))
  );

  const data = `${encodedHeader}.${encodedPayload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_SECRET),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );

  return `${data}.${base64UrlEncode(
    new Uint8Array(signature)
  )}`;
}

function getAdminToken(
  authHeader: string | null
): string | null {
  if (!authHeader) return null;

  const match = authHeader.match(/^Bearer\s+(.+)$/i);

  return match ? match[1] : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get(
    "SUPABASE_SERVICE_ROLE_KEY"
  );

  if (!supabaseUrl || !serviceRoleKey) {
    return makeResponse(
      { error: "Falta configuración de Supabase" },
      500
    );
  }

  const supabase = createClient(
    supabaseUrl,
    serviceRoleKey
  );

  const url = new URL(req.url);
  const action = url.searchParams.get("action") ?? "login";

  // ESTADÍSTICAS QR: endpoint autenticado del panel.
  if (action === "analytics" && req.method === "GET") {
    const token = getAdminToken(req.headers.get("Authorization"));
    if (!token || !(await verifyToken(token))) {
      return makeResponse({ error: "No autorizado. Cierra sesión y vuelve a entrar." }, 401);
    }
    const range = url.searchParams.get("range") ?? "30d";
    const days = range === "7d" ? 7 : range === "90d" ? 90 : range === "all" ? null : 30;
    const cutoff = days === null ? null : new Date(Date.now() - days * 86400000);
    try {
      const [{ data: events, error: eventsError }, { data: signups, error: signupsError }] = await Promise.all([
        supabase.from("qr_events").select("id,visitor_id,session_id,event_type,source,created_at").order("created_at", { ascending: true }).limit(20000),
        supabase.from("interest_signups").select("id,email,interest_type,source,created_at").order("created_at", { ascending: false }).limit(10000),
      ]);
      if (eventsError) throw eventsError;
      if (signupsError) throw signupsError;
      const allEvents = events ?? [];
      const allPageViews = allEvents.filter((event: any) => ["page_view", "landing_view"].includes(event.event_type));
      const pageViews = allPageViews.filter((event: any) => !cutoff || new Date(event.created_at) >= cutoff);
      const qrViews = pageViews.filter((event: any) => (event.source ?? "").toLowerCase() === "qr");
      const qrSessions = new Set(qrViews.map((event: any) => event.session_id).filter(Boolean));
      const allSignups = signups ?? [];
      const allRegistrations = allSignups.filter((signup: any) => signup.interest_type === "qr_landing");
      const registrations = allRegistrations.filter((signup: any) => !cutoff || new Date(signup.created_at) >= cutoff);
      const daily = new Map<string, { day: string; visits: number; registrations: number }>();
      const chartDays = days ?? 30;
      const start = new Date();
      start.setDate(start.getDate() - (chartDays - 1));
      start.setHours(0, 0, 0, 0);
      for (let i = 0; i < chartDays; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        const day = date.toISOString().slice(0, 10);
        daily.set(day, { day, visits: 0, registrations: 0 });
      }
      for (const event of allPageViews) {
        const row = daily.get(new Date(event.created_at).toISOString().slice(0, 10));
        if (row) row.visits++;
      }
      for (const signup of registrations) {
        const row = daily.get(new Date(signup.created_at).toISOString().slice(0, 10));
        if (row) row.registrations++;
      }
      const participants = allSignups.map((signup: any) => ({
        id: signup.id, email: signup.email, created_at: signup.created_at,
        source: signup.source === "qr" ? "QR" : (signup.source ?? "Web"),
        interestType: signup.interest_type, status: "Registrado",
      }));
      return makeResponse({
        totalVisits: pageViews.length, qrVisits: qrViews.length,
        uniqueVisitors: new Set(pageViews.map((event: any) => event.visitor_id).filter(Boolean)).size,
        uniqueSessions: new Set(pageViews.map((event: any) => event.session_id).filter(Boolean)).size,
        qrUniqueVisitors: new Set(qrViews.map((event: any) => event.visitor_id).filter(Boolean)).size,
        qrUniqueSessions: qrSessions.size, registrations: registrations.length,
        participantCount: participants.length, totalSignups: participants.length,
        conversionRate: qrSessions.size ? Number(((registrations.length / qrSessions.size) * 100).toFixed(2)) : 0,
        daily: [...daily.values()], participants,
        note: "Las visitas se registran únicamente con consentimiento de analítica. Las llegadas QR se identifican con utm_source=qr.",
      });
    } catch (error) {
      console.error("admin-auth analytics", error);
      return makeResponse({ error: "No se han podido cargar las estadísticas y participantes" }, 500);
    }
  }

  // INICIO DE SESIÓN
  if (action === "login" && req.method === "POST") {
    let body: {
      username?: string;
      password?: string;
    };

    try {
      body = await req.json();
    } catch {
      return makeResponse(
        { error: "Cuerpo de la petición inválido" },
        400
      );
    }

    const { username, password } = body;

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username ||
      !password
    ) {
      return makeResponse(
        { error: "Usuario y contraseña son obligatorios" },
        400
      );
    }

    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("id, username, password_hash, must_change_password")
      .eq("username", username)
      .maybeSingle();

    if (error || !admin) {
      return makeResponse(
        { error: "Credenciales incorrectas" },
        401
      );
    }

    const { data: matchResult, error: matchError } =
      await supabase.rpc("verify_admin_password", {
        input_username: username,
        input_password: password,
      });

    if (matchError || !matchResult) {
      return makeResponse(
        { error: "Credenciales incorrectas" },
        401
      );
    }

    if (!JWT_SECRET) {
      return makeResponse(
        { error: "Falta configurar RUMBO_JWT_SECRET en Supabase" },
        500
      );
    }

    try {
      const token = await signToken({
        username: admin.username,
        role: "rumbo-admin",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      });

      return makeResponse({
        token,
        mustChangePassword: admin.must_change_password,
      });
    } catch {
      return makeResponse(
        { error: "No se pudo crear la sesión" },
        500
      );
    }
  }

  // CAMBIAR CONTRASEÑA
  if (
    action === "change-password" &&
    req.method === "POST"
  ) {
    const token = getAdminToken(
      req.headers.get("Authorization")
    );

    if (!token || !(await verifyToken(token))) {
      return makeResponse(
        { error: "No autorizado" },
        401
      );
    }

    let body: {
      newPassword?: string;
    };

    try {
      body = await req.json();
    } catch {
      return makeResponse(
        { error: "Cuerpo de la petición inválido" },
        400
      );
    }

    const { newPassword } = body;

    if (
      typeof newPassword !== "string" ||
      newPassword.length < 8
    ) {
      return makeResponse(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        400
      );
    }

    const { data: hashResult, error: hashError } =
      await supabase.rpc("hash_admin_password", {
        input_password: newPassword,
      });

    if (hashError || !hashResult) {
      return makeResponse(
        { error: "Error al procesar la contraseña" },
        500
      );
    }

    const { error: updateError } = await supabase
      .from("admin_users")
      .update({
        password_hash: hashResult,
        must_change_password: false,
        updated_at: new Date().toISOString(),
      })
      .eq("username", "rumbofuturoo");

    if (updateError) {
      return makeResponse(
        { error: "Error al actualizar la contraseña" },
        500
      );
    }

    return makeResponse({ success: true });
  }

  // VERIFICAR SESIÓN
  if (action === "verify" && req.method === "GET") {
    const token = getAdminToken(
      req.headers.get("Authorization")
    );

    if (!token || !(await verifyToken(token))) {
      return makeResponse(
        { valid: false },
        401
      );
    }

    return makeResponse({ valid: true });
  }

  return makeResponse(
    { error: "Acción no válida" },
    400
  );
});
