import { useId, useState, type FormEvent } from 'react';
import { saveInterest, type InterestType, type SaveInterestResult } from '@/lib/interestSignups';

interface InterestFormProps {
  interestType: InterestType;
  label: string;
  submitLabel: string;
  successMessage: string;
}

type FormStatus = 'idle' | 'sending' | SaveInterestResult;

const STATUS_MESSAGES: Record<Exclude<FormStatus, 'idle' | 'sending' | 'saved'>, string> = {
  duplicate: 'Este correo ya está registrado para esta información.',
  error: 'No hemos podido guardar tu correo. Inténtalo de nuevo en unos minutos.',
};

export function InterestForm({ interestType, label, submitLabel, successMessage }: InterestFormProps) {
  const inputId = useId();
  const messageId = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const isSending = status === 'sending';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    const result = await saveInterest(email, interestType);
    setStatus(result);
    if (result === 'saved') setEmail('');
  };

  const message =
    status === 'saved' ? successMessage : status === 'duplicate' || status === 'error' ? STATUS_MESSAGES[status] : '';
  const messageTone = status === 'saved' ? 'text-ink' : 'font-semibold text-ink';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label htmlFor={inputId} className="font-sans text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          value={email}
          disabled={isSending}
          aria-describedby={messageId}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== 'sending') setStatus('idle');
          }}
          className="min-w-0 flex-1 rounded-full border border-ink/20 bg-white px-5 py-3 text-base text-graphite placeholder:text-graphite-soft/70 transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-coral disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isSending}
          className="inline-flex items-center justify-center rounded-full bg-coral px-6 py-3 font-sans text-sm font-semibold text-ink transition duration-200 hover:bg-ink hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? 'Enviando...' : submitLabel}
        </button>
      </div>
      <p id={messageId} role="status" aria-live="polite" className={`min-h-[1.5rem] text-sm ${messageTone}`}>
        {message}
      </p>
    </form>
  );
}
