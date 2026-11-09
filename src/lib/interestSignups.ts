
import { supabase } from '@/lib/supabase';

export type InterestType =
  | 'online_course'
  | 'in_person_course'
  | 'subscription_news'
  | 'event_news';

export type SaveInterestResult = 'saved' | 'duplicate' | 'error';

const UNIQUE_VIOLATION_CODE = '23505';

export async function saveInterest(
  email: string,
  interestType: InterestType
): Promise<SaveInterestResult> {
  const { error } = await supabase
    .from('interest_signups')
    .insert({
      email: email.trim().toLowerCase(),
      interest_type: interestType,
    });

  if (!error) return 'saved';
  if (error.code === UNIQUE_VIOLATION_CODE) return 'duplicate';
  return 'error';
}
