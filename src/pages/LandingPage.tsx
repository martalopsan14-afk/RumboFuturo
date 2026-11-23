import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { saveInterest } from '@/lib/interestSignups';

export function LandingPage() {
  const [email, setEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'duplicate' | 'error'>('idle');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!privacyAccepted) return;
    setStatus('sending');
    const result = await saveInterest(email, 'subscription_news', 'landing_page', new Date().toISOString());
    if (result === 'saved') {
      setStatus('success');
      setEmail('');
    } else {
      setStatus(result === 'duplicate' ? 'duplicate' : 'error');
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-ivory text-graphite">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-center px-6 py-8">
        <img src="/Logo_mini.jpeg" alt="Rumbo Futuro" className="h-20 w-auto max-w-[260px] object-contain" />
      </header>

      <section className="flex flex-1 items-center justify-center bg-ink px-6 py-14 text-ivory sm:py-20">
        <div className="w-full max-w-2xl text-center">
          <p className="font-editorial text-xl italic text-coral sm:text-2xl">Tu talento, tu puerta al mundo</p>
          <h1 className="mt-4 font-sans text-3xl font-extrabold leading-tight text-ivory sm:text-5xl">
            Conectamos el talento periodístico con nuevas oportunidades.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ivory/85 sm:text-lg">
            Rumbo Futuro une a jóvenes periodistas con investigadores y profesionales de la comunicación mediante formación práctica, colaboración y experiencias que les acercan al mundo laboral.
          </p>

          <div className="mx-auto mt-10 max-w-lg rounded-3xl border border-ivory/15 bg-ivory/5 p-6 text-left sm:p-8">
            <h2 className="font-sans text-xl font-bold text-ivory">Regístrate para recibir novedades</h2>
            <p className="mt-2 text-sm leading-relaxed text-ivory/75">
              Déjanos tu correo y te informaremos sobre el proyecto, las actividades y las próximas oportunidades.
            </p>
            <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
              <label htmlFor="landing-email" className="text-sm font-semibold text-ivory">Correo electrónico</label>
              <input
                id="landing-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                disabled={status === 'sending'}
                onChange={event => { setEmail(event.target.value); setStatus('idle'); }}
                placeholder="tu@correo.com"
                className="w-full rounded-full border border-ivory/25 bg-ivory px-5 py-3 text-base text-ink placeholder:text-graphite-soft focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral"
              />
              <label className="flex items-start gap-3 text-xs leading-relaxed text-ivory/75">
                <input
                  type="checkbox"
                  required
                  checked={privacyAccepted}
                  onChange={event => setPrivacyAccepted(event.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#E8674A]"
                />
                <span>Consiento que Rumbo Futuro utilice mi correo para enviarme información sobre el proyecto y sus actividades.</span>
              </label>
              <button
                type="submit"
                disabled={status === 'sending' || !privacyAccepted}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-6 py-3 font-sans text-sm font-bold text-ink transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? 'Enviando…' : 'Registrarme'} <ArrowRight className="h-4 w-4" />
              </button>
              <p role="status" aria-live="polite" className="min-h-5 text-sm font-semibold text-ivory">
                {status === 'success' ? <><CheckCircle2 className="mr-2 inline h-4 w-4 text-coral" />¡Gracias! Hemos recibido tu registro.</> :
                  status === 'duplicate' ? 'Este correo ya está registrado.' :
                  status === 'error' ? 'No hemos podido guardar el registro. Inténtalo de nuevo.' : ''}
              </p>
            </form>
          </div>

          <a
            href="#/inicio"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-ivory/50 px-6 py-3 font-sans text-sm font-semibold text-ivory transition hover:border-coral hover:bg-ivory/10"
          >
            Entrar en la web <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <footer className="px-6 py-5 text-center text-xs text-graphite-soft">
        © {new Date().getFullYear()} Rumbo Futuro
      </footer>
    </main>
  );
}
