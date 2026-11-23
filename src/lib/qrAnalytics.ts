import { supabase } from '@/lib/supabase';

type QrEventType = 'page_view' | 'registration';
const VISITOR_KEY = 'rumbo_qr_visitor';
const SESSION_KEY = 'rumbo_qr_session';

function getId(key: string): string {
  let value = sessionStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    sessionStorage.setItem(key, value);
  }
  return value;
}

function getVisitorId(): string {
  let value = localStorage.getItem(VISITOR_KEY);
  if (!value) {
    value = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, value);
  }
  return value;
}

export async function trackQrEvent(eventType: QrEventType): Promise<void> {
  try {
    if (localStorage.getItem('rumbo_qr_analytics_consent') !== 'accepted') return;
    if (eventType === 'page_view' && sessionStorage.getItem('rumbo_qr_page_viewed') === '1') return;
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source') || params.get('source') || 'direct';
    const campaign = source === 'qr' ? 'rumbo_futuro' : null;
    const { error } = await supabase.from('qr_events').insert({
      visitor_id: getVisitorId(),
      session_id: getId(SESSION_KEY),
      event_type: eventType,
      source: source.slice(0, 80),
      campaign_id: campaign,
    });
    if (!error && eventType === 'page_view') sessionStorage.setItem('rumbo_qr_page_viewed', '1');
  } catch {
    // Analytics failures must never block a registration or page render.
  }
}

export interface QrAnalytics {
  totalVisits: number;
  qrVisits: number;
  qrUniqueVisitors: number;
  qrUniqueSessions: number;
  participantCount: number;
  participants: Array<{ id: string; email: string; created_at: string; source: string; status: string; interestType: string }>;
  totalSignups: number;
  uniqueVisitors: number;
  uniqueSessions: number;
  registrations: number;
  conversionRate: number;
  daily: Array<{ day: string; visits: number; registrations: number }>;
}

export async function getQrAnalytics(token: string, range: '7d' | '30d' | '90d' | 'all' = '30d'): Promise<QrAnalytics> {
  // Reuse the application's configured Supabase client so the project URL,
  // public API key and standard request handling stay consistent everywhere.
  const { data, error } = await supabase.functions.invoke<QrAnalytics>(
    `admin-analytics?range=${encodeURIComponent(range)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (error) {
    const context = (error as { context?: unknown }).context;
    if (context instanceof Response) {
      const body = await context.clone().json().catch(() => null) as { error?: string } | null;
      if (body?.error) throw new Error(body.error);
      throw new Error(`Supabase respondió con HTTP ${context.status}: ${context.statusText || error.message}`);
    }

    // Keep the underlying SDK message visible: it distinguishes CORS,
    // DNS/network failures and other fetch-level errors.
    throw new Error(`No se pudo completar la petición a Supabase: ${error.message}`);
  }

  if (!data) {
    throw new Error('Supabase no devolvió datos de analítica.');
  }

  return data;
}
