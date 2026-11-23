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
    if (eventType === 'page_view') sessionStorage.setItem('rumbo_qr_page_viewed', '1');
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source') || params.get('source') || 'direct';
    const campaign = source === 'qr' ? 'rumbo_futuro' : null;
    await supabase.from('qr_events').insert({
      visitor_id: getVisitorId(),
      session_id: getId(SESSION_KEY),
      event_type: eventType,
      source: source.slice(0, 80),
      campaign_id: campaign,
    });
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
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error('Falta la configuración pública de Supabase en esta versión de la aplicación.');
  }

  let response: Response;
  try {
    response = await fetch(`${supabaseUrl}/functions/v1/admin-analytics?range=${range}`, {
      method: 'GET',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  } catch {
    throw new Error('No se pudo conectar con Supabase para cargar las estadísticas. Comprueba la conexión e inténtalo de nuevo.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Error al cargar las analíticas (HTTP ${response.status})`);
  }
  return data as QrAnalytics;
}
