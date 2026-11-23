import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] ?? char);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const resendKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("RESEND_FROM_EMAIL");
  const to = Deno.env.get("RUMBO_NOTIFICATION_EMAIL") || "rumbofuturoo@gmail.com";
  if (!resendKey || !from) {
    console.error("Missing RESEND_API_KEY or RESEND_FROM_EMAIL");
    return json({ error: "Email provider is not configured yet" }, 503);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Supabase server configuration missing" }, 500);

  let payload: { table?: string; id?: string };
  try { payload = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const table = payload.table;
  const id = payload.id;
  if (!id || !/^[0-9a-f-]{36}$/i.test(id) || !["qr_events", "interest_signups"].includes(table ?? "")) {
    return json({ error: "Invalid event reference" }, 400);
  }

  const db = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let event: Record<string, unknown> | null = null;
  if (table === "qr_events") {
    const { data, error } = await db.from("qr_events")
      .select("id,event_type,source,created_at,visitor_id,session_id")
      .eq("id", id).maybeSingle();
    if (error) return json({ error: "Could not read QR event" }, 500);
    event = data as Record<string, unknown> | null;
    if (!event || event.event_type !== "page_view" || String(event.source).toLowerCase() !== "qr") {
      return json({ ignored: true, reason: "Not a QR page view" });
    }
  } else {
    const { data, error } = await db.from("interest_signups")
      .select("id,email,interest_type,source,created_at")
      .eq("id", id).maybeSingle();
    if (error) return json({ error: "Could not read signup" }, 500);
    event = data as Record<string, unknown> | null;
    if (!event) return json({ error: "Signup not found" }, 404);
  }

  const { data: existing, error: readLogError } = await db.from("notification_deliveries")
    .select("id,status").eq("event_table", table).eq("event_id", id).maybeSingle();
  if (readLogError) return json({ error: "Could not check notification status" }, 500);
  if (existing?.status === "sent") return json({ ok: true, duplicate: true });

  if (existing) {
    const { error } = await db.from("notification_deliveries")
      .update({ status: "pending", error: null }).eq("id", existing.id);
    if (error) return json({ error: "Could not retry notification" }, 500);
  } else {
    const { error } = await db.from("notification_deliveries").insert({
      event_table: table, event_id: id, status: "pending",
    });
    if (error) {
      if (error.code === "23505") return json({ ok: true, duplicate: true });
      return json({ error: "Could not create notification record" }, 500);
    }
  }

  const timestamp = new Date(String(event.created_at)).toLocaleString("es-ES", {
    dateStyle: "long", timeStyle: "short", timeZone: "Europe/Madrid",
  });

  let subject = "";
  let details = "";
  if (table === "qr_events") {
    subject = "Rumbo Futuro | Nueva visita desde un código QR";
    details = `
      <p><b>Actividad:</b> Nueva visita a la landing QR</p>
      <p><b>Procedencia:</b> Código QR de Rumbo Futuro</p>
      <p><b>Fecha:</b> ${escapeHtml(timestamp)}</p>
      <p><b>Visitante:</b> identificador seudónimo registrado</p>
    `;
  } else {
    const landing = event.interest_type === "qr_landing";
    subject = landing
      ? "Rumbo Futuro | Nueva inscripción desde la landing QR"
      : "Rumbo Futuro | Nueva inscripción en la web";
    details = `
      <p><b>Actividad:</b> Nueva inscripción recibida</p>
      <p><b>Procedencia:</b> ${landing ? "Landing QR" : escapeHtml(event.source === "qr" ? "QR" : "Web principal")}</p>
      <p><b>Correo de la persona:</b> ${escapeHtml(event.email)}</p>
      <p><b>Tipo de interés:</b> ${escapeHtml(event.interest_type)}</p>
      <p><b>Fecha:</b> ${escapeHtml(timestamp)}</p>
    `;
  }

  const html = `<div style="font-family:Arial,sans-serif;color:#172b43;max-width:600px;margin:auto">
    <h2 style="color:#e8674a">Rumbo Futuro</h2>
    <h3>${escapeHtml(subject.replace("Rumbo Futuro | ", ""))}</h3>
    ${details}
    <hr style="border:0;border-top:1px solid #ddd;margin:24px 0">
    <p style="font-size:12px;color:#687789">Aviso automático de actividad de Rumbo Futuro.</p>
  </div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      await db.from("notification_deliveries").update({
        status: "failed", error: JSON.stringify(result).slice(0, 1000),
      }).eq("event_table", table).eq("event_id", id);
      console.error("Resend delivery failed", response.status, result);
      return json({ error: "Email provider rejected the message" }, 502);
    }
    await db.from("notification_deliveries").update({
      status: "sent", sent_at: new Date().toISOString(), error: null,
    }).eq("event_table", table).eq("event_id", id);
    return json({ ok: true, id: result.id ?? null });
  } catch (error) {
    await db.from("notification_deliveries").update({
      status: "failed", error: String(error).slice(0, 1000),
    }).eq("event_table", table).eq("event_id", id);
    console.error("Email notification error", error);
    return json({ error: "Could not send email" }, 502);
  }
});
