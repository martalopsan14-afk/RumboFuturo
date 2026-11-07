import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const JWT_SECRET = Deno.env.get("RUMBO_JWT_SECRET") ?? "rumbo-fallback-secret-change-me";

function makeResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

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

async function signToken(payload: Record<string, unknown>): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const encHeader = btoa(JSON.stringify(header)).replace(/=/g, "");
  const encPayload = btoa(JSON.stringify(payload)).replace(/=/g, "");
  const data = `${encHeader}.${encPayload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const sig = btoa(String.fromCharCode(...new Uint8Array(sigBuf))).replace(/=/g, "");
  return `${data}.${sig}`;
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

  const url = new URL(req.url);
  const action = url.searchParams.get("action") ?? "login";

  // POST /admin-auth?action=login
  if (action === "login" && req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return makeResponse({ error: "Cuerpo de la petición inválido" }, 400);
    }

    const { username, password } = body;
    if (!username || !password) {
      return makeResponse({ error: "Usuario y contraseña son obligatorios" }, 400);
    }

    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("id, username, password_hash, must_change_password")
      .eq("username", username)
      .maybeSingle();

    if (error || !admin) {
      return makeResponse({ error: "Credenciales incorrectas" }, 401);
    }

    // Verify password using Postgres crypt()
    const { data: matchResult, error: matchError } = await supabase.rpc("verify_admin_password", {
      input_username: username,
      input_password: password,
    });

    if (matchError || !matchResult) {
      return makeResponse({ error: "Credenciales incorrectas" }, 401);
    }

    const token = await signToken({
      username: admin.username,
      role: "rumbo-admin",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    });

    return makeResponse({
      token,
      mustChangePassword: admin.must_change_password,
    });
  }

  // POST /admin-auth?action=change-password
  if (action === "change-password" && req.method === "POST") {
    const token = getAdminToken(req.headers.get("Authorization"));
    if (!token || !(await verifyToken(token))) {
      return makeResponse({ error: "No autorizado" }, 401);
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return makeResponse({ error: "Cuerpo de la petición inválido" }, 400);
    }

    const { newPassword } = body;
    if (!newPassword || newPassword.length < 8) {
      return makeResponse({ error: "La contraseña debe tener al menos 8 caracteres" }, 400);
    }

    // Generate bcrypt hash using Postgres
    const { data: hashResult, error: hashError } = await supabase.rpc("hash_admin_password", {
      input_password: newPassword,
    });

    if (hashError || !hashResult) {
      return makeResponse({ error: "Error al procesar la contraseña" }, 500);
    }

    const { error: updateError } = await supabase
      .from("admin_users")
      .update({ password_hash: hashResult, must_change_password: false, updated_at: new Date().toISOString() })
      .eq("username", "rumbofuturoo");

    if (updateError) {
      return makeResponse({ error: "Error al actualizar la contraseña" }, 500);
    }

    return makeResponse({ success: true });
  }

  // GET /admin-auth?action=verify
  if (action === "verify" && req.method === "GET") {
    const token = getAdminToken(req.headers.get("Authorization"));
    if (!token || !(await verifyToken(token))) {
      return makeResponse({ valid: false }, 401);
    }
    return makeResponse({ valid: true });
  }

  return makeResponse({ error: "Acción no válida" }, 400);
});
