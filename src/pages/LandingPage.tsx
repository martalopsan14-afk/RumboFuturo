import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, GraduationCap, Handshake, Compass } from 'lucide-react';
import { saveInterest } from '@/lib/interestSignups';

function getCampaignSource(): string {
  const params = new URLSearchParams(window.location.search);
  const fields = [
    ['source', params.get('utm_source')],
    ['medium', params.get('utm_medium')],
    ['campaign', params.get('utm_campaign')],
    ['content', params.get('utm_content')],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));
  if (fields.length === 0) return 'landing_page';
  return `landing_page|${fields.map(([key, value]) => `${key}=${value.slice(0, 60)}`).join('|')}`.slice(0, 250);
}

export function LandingPage() {
  const [email, setEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'duplicate' | 'error'>('idle');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!privacyAccepted) return;
    setStatus('sending');
    const result = await saveInterest(email, 'subscription_news', getCampaignSource(), new Date().toISOString());
    if (result === 'saved') {
      setStatus('success');
      setEmail('');
    } else {
      setStatus(result === 'duplicate' ? 'duplicate' : 'error');
    }
  };

  return (
    <main className="min-h-screen bg-ivory font-body text-graphite">
      <header className="border-b border-ink/10 bg-ivory">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <img src="/Logo_mini.jpeg" alt="Rumbo Futuro" className="h-16 w-auto max-w-[220px] object-contain" />
          <span className="text-right font-sans text-xs font-semibold uppercase tracking-[0.14em] text-coral sm:text-sm">Tu talento, tu puerta al mundo</span>
        </div>
      </header>

      <section className="relative overflow-hidden bg-ink text-ivory">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-editorial text-2xl italic text-coral sm:text-3xl">El periodismo del mañana empieza hoy</p>
            <h1 className="mt-4 font-sans text-4xl font-extrabold leading-tight text-ivory sm:text-5xl lg:text-6xl">
              Conectamos el talento periodístico con nuevas oportunidades.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/85">
              Rumbo Futuro une a jóvenes periodistas con investigadores y profesionales de la comunicación mediante formación práctica, colaboración y experiencias que les acercan al mundo laboral.
            </p>
            <a href="#registro" className="mt-8 inline-flex items-center gap-3 rounded-full bg-coral px-7 py-4 font-sans text-sm font-bold text-ink transition hover:bg-ivory">
              Quiero recibir información <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <aside className="rounded-[2rem] border border-ivory/15 bg-ivory/5 p-7 shadow-xl sm:p-9">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-coral">Nuestra propuesta de valor</p>
            <h2 className="mt-3 font-editorial text-3xl italic leading-snug text-ivory">Aprender, colaborar y dar el siguiente paso profesional.</h2>
            <div className="mt-7 space-y-5">
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral"><GraduationCap className="h-5 w-5" /></span>
                <div><h3 className="font-sans font-bold text-ivory">Formación práctica</h3><p className="mt-1 text-sm leading-relaxed text-ivory/75">Aprendizaje conectado con los retos reales del periodismo.</p></div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral"><Handshake className="h-5 w-5" /></span>
                <div><h3 className="font-sans font-bold text-ivory">Colaboración profesional</h3><p className="mt-1 text-sm leading-relaxed text-ivory/75">Encuentros entre jóvenes periodistas, investigadores y expertos.</p></div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral"><Compass className="h-5 w-5" /></span>
                <div><h3 className="font-sans font-bold text-ivory">Nuevas oportunidades</h3><p className="mt-1 text-sm leading-relaxed text-ivory/75">Experiencias para acercarte al entorno laboral y ampliar tu red.</p></div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section aria-label="Identidad de Rumbo Futuro" className="bg-ivory px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-coral">Rumbo Futuro</p>
          <img
            src="/Logo_normal.jpeg"
            alt="Logotipo completo de Rumbo Futuro"
            className="h-auto w-full max-w-[min(560px,90vw)] object-contain"
          />
          <p className="max-w-xl text-base leading-relaxed text-graphite-soft">
            Talento, periodismo y oportunidades para construir el futuro de la comunicación.
          </p>
        </div>
      </section>

      <section id="registro" className="bg-ivory-deep px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-editorial text-xl italic text-coral">Da el primer paso</p>
            <h2 className="mt-2 font-sans text-3xl font-extrabold text-ink sm:text-4xl">¿Quieres conocer antes que nadie las novedades de Rumbo Futuro?</h2>
            <p className="mt-5 text-lg leading-relaxed">Déjanos tu correo y te avisaremos sobre el proyecto, las actividades, la formación y las próximas oportunidades.</p>
            <p className="mt-4 text-sm leading-relaxed text-graphite-soft">Una única acción: apúntate para mantenerte al día.</p>
          </div>

          <div className="rounded-[2rem] border border-ink/10 bg-white p-7 shadow-sm sm:p-10">
            <h3 className="font-sans text-2xl font-bold text-ink">Recibe noticias y oportunidades</h3>
            <p className="mt-2 text-sm leading-relaxed text-graphite-soft">Introduce tu correo electrónico para registrarte.</p>
            <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
              <label htmlFor="landing-email" className="font-sans text-sm font-semibold text-ink">Correo electrónico</label>
              <input
                id="landing-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                disabled={status === 'sending'}
                onChange={event => { setEmail(event.target.value); setStatus('idle'); }}
                placeholder="tu@correo.com"
                className="w-full rounded-full border border-ink/20 bg-white px-5 py-3 text-base text-graphite placeholder:text-graphite-soft/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-coral"
              />
              <label className="flex items-start gap-3 text-xs leading-relaxed text-graphite">
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
                className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-6 py-4 font-sans text-sm font-bold text-ink transition hover:bg-ink hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? 'Enviando…' : 'Quiero apuntarme'} <ArrowRight className="h-4 w-4" />
              </button>
              <p role="status" aria-live="polite" className="min-h-6 text-sm font-semibold text-ink">
                {status === 'success' ? <><CheckCircle2 className="mr-2 inline h-4 w-4 text-coral" />¡Gracias! Hemos recibido tu registro.</> :
                  status === 'duplicate' ? 'Este correo ya está registrado.' :
                  status === 'error' ? 'No hemos podido guardar el registro. Inténtalo de nuevo.' : ''}
              </p>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <p className="font-editorial text-xl italic text-coral">Conoce el proyecto completo</p>
          <h2 className="font-sans text-2xl font-extrabold text-ink sm:text-3xl">Tu próximo paso puede empezar aquí.</h2>
          <p className="max-w-2xl leading-relaxed text-graphite">Explora nuestras áreas de trabajo, la formación, los colaboradores y las iniciativas que hacen posible Rumbo Futuro.</p>
          <a href="#/inicio" className="mt-2 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-sans text-sm font-bold text-ivory transition hover:bg-coral hover:text-ink">
            Entrar en la web <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <footer className="bg-ink px-5 py-7 text-center text-sm text-ivory/70">© {new Date().getFullYear()} Rumbo Futuro · Tu talento, tu puerta al mundo.</footer>
    </main>
  );
}
