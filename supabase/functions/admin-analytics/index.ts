import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin, Access-Control-Request-Headers",
};
function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
function decodeBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - base64.length % 4) % 4);
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
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
  } catch { return false; }
}
Deno.serve(async req => {
  if (req.method === "OPTIONS") {
    // Reflect the browser SDK headers requested during preflight. This keeps
    // CORS working when supabase-js adds or changes client headers.
    const requestedHeaders = req.headers.get("Access-Control-Request-Headers");
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Headers": requestedHeaders || corsHeaders["Access-Control-Allow-Headers"],
      },
    });
  }
  if (req.method !== "GET") return response({ error: "Método no permitido" }, 405);
  const match = req.headers.get("Authorization")?.match(/^Bearer\s+(.+)$/i);
  if (!match || !(await verifyAdminToken(match[1]))) return response({ error: "No autorizado" }, 401);
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return response({ error: "Configuración de Supabase incompleta" }, 500);
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const range = new URL(req.url).searchParams.get('range') ?? '30d';
  const days = range === '7d' ? 7 : range === '90d' ? 90 : range === 'all' ? null : 30;
  const cutoff = days === null ? null : new Date(Date.now() - days * 24 * 60 * 60 * 1000);
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
    const allRegistrations = allSignups.filter((signup: any) => (signup.source ?? "").toLowerCase() === "qr");
    const registrations = allRegistrations.filter((signup: any) => !cutoff || new Date(signup.created_at) >= cutoff);
    const periodSignups = allSignups.filter((signup: any) => !cutoff || new Date(signup.created_at) >= cutoff);
    const websiteRegistrations = periodSignups.filter((signup: any) => signup.interest_type !== "qr_landing");
    const landingPageRegistrations = periodSignups.filter((signup: any) => signup.interest_type === "qr_landing");
    const daily = new Map<string, { day: string; visits: number; registrations: number }>();
    const chartDays = days ?? 30;
    const start = new Date(); start.setDate(start.getDate() - (chartDays - 1)); start.setHours(0, 0, 0, 0);
    for (let i = 0; i < chartDays; i++) {
      const date = new Date(start); date.setDate(start.getDate() + i);
      const day = date.toISOString().slice(0, 10);
      daily.set(day, { day, visits: 0, registrations: 0 });
    }
    for (const event of allPageViews.filter((event: any) => (event.source ?? "").toLowerCase() === "qr")) {
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
    return response({
      totalVisits: pageViews.length,
      qrVisits: qrViews.length,
      uniqueVisitors: new Set(pageViews.map((event: any) => event.visitor_id).filter(Boolean)).size,
      uniqueSessions: new Set(pageViews.map((event: any) => event.session_id).filter(Boolean)).size,
      qrUniqueVisitors: new Set(qrViews.map((event: any) => event.visitor_id).filter(Boolean)).size,
      qrUniqueSessions: qrSessions.size,
      registrations: registrations.length,
      qrRegistrations: registrations.length,
      websiteRegistrations: websiteRegistrations.length,
      landingPageRegistrations: landingPageRegistrations.length,
      totalRegistrations: periodSignups.length,
      participantCount: participants.length,
      totalSignups: participants.length,
      conversionRate: qrSessions.size ? Number(((registrations.length / qrSessions.size) * 100).toFixed(2)) : 0,
      daily: [...daily.values()], participants,
      note: "Las visitas y eventos de analítica se registran únicamente con consentimiento. Las inscripciones se guardan siempre con su procedencia (QR o web), con independencia del consentimiento de analítica.",
    });
  } catch (error) {
    console.error("admin-analytics", error);
    return response({ error: "No se han podido cargar las estadísticas y participantes" }, 500);
  }
});