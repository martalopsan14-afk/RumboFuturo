import { supabase } from '@/lib/supabase';

export type InterestType =
  | 'online_course'
  | 'in_person_course'
  | 'subscription_news'
  | 'event_news'
  | 'qr_landing'
  | 'event_sinercom';

export type SaveInterestResult = 'saved' | 'duplicate' | 'error';

const UNIQUE_VIOLATION_CODE = '23505';

function getSignupSourceFromUrl(): 'qr' | 'website' {
  if (typeof window === 'undefined') return 'website';
  const params = new URLSearchParams(window.location.search);
  const source = (params.get('utm_source') || params.get('source') || '').toLowerCase();
  return source === 'qr' ? 'qr' : 'website';
}

export async function saveInterest(
  email: string,
  interestType: InterestType,
  source = getSignupSourceFromUrl(),
  privacyAcceptedAt: string | null = null
): Promise<SaveInterestResult> {
  try {
    const { error } = await supabase
      .from('interest_signups')
      .insert({
        email: email.trim().toLowerCase(),
        interest_type: interestType,
        source,
        privacy_accepted_at: privacyAcceptedAt,
      });

    if (!error) return 'saved';
    if (error.code === UNIQUE_VIOLATION_CODE) return 'duplicate';

    // Keep the underlying Supabase error available for diagnosis without
    // exposing database details to people using the public form.
    console.error('No se pudo guardar la inscripción en Supabase:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return 'error';
  } catch (error) {
    // Network failures and unexpected fetch errors must not leave the form
    // permanently stuck in its "sending" state.
    console.error('Falló la petición de inscripción:', error);
    return 'error';
  }
}
