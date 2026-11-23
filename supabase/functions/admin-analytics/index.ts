import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function decodeBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - base64.length % 4) % 4));
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const secret = Deno.env.get("RUMBO_JWT_SECRET");
    if (!secret) return false;
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const header = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[0])));
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[1])));
    if (header.alg !== "HS256" || header.typ !== "JWT") return false;
    if (payload.role !== "rumbo-admin" || payload.username !== "rumbofuturoo") return false;
    if (typeof payload.exp !== "number" || Date.now() >= payload.exp * 1000) return false;
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    return await crypto.subtle.verify("HMAC", key, decodeBase64Url(parts[2]), new TextEncoder().encode(parts[0] + "." + parts[1]));
  } catch {
    return false;
  }
}

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== "GET") return response({ error: "Método no permitido" }, 405);
  const match = req.headers.get("Authorization")?.match(/^Bearer\s+(.+)$/i);
  if (!match || !(await verifyAdminToken(match[1]))) return response({ error: "No autorizado" }, 401);

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return response({ error: "Configuración de Supabase incompleta" }, 500);

  const supabase = createClient(url, key);
  const { data, error } = await supabase.rpc("get_qr_analytics");
  if (error) return response({ error: "No se han podido consultar las analíticas" }, 500);
  return response(data);
});
