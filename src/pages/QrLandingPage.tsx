import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Compass, GraduationCap, Handshake, Mail, ShieldCheck } from 'lucide-react';
import { saveInterest } from '@/lib/interestSignups';
import { trackQrEvent } from '@/lib/qrAnalytics';

const CONSENT_KEY = 'rumbo_qr_analytics_consent';

export function QrLandingPage() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState<'accepted' | 'rejected' | null>(() => {
    try {
      const value = localStorage.getItem(CONSENT_KEY);
      return value === 'accepted' || value === 'rejected' ? value : null;
    } catch { return null; }
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'duplicate' | 'error'>('idle');

  useEffect(() => {
    if (consent === 'accepted') void trackQrEvent('page_view');
  }, [consent]);

  const chooseConsent = (value: 'accepted' | 'rejected') => {
    setConsent(value);
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* storage may be unavailable */ }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    const result = await saveInterest(email, 'qr_landing');
    if (result === 'saved') {
      if (consent === 'accepted') void trackQrEvent('registration');
      setStatus('success');
      setEmail('');
    } else {
      setStatus(result === 'duplicate' ? 'duplicate' : 'error');
    }
  };

  return (
    <main className="min-h-screen bg-ivory font-body text-graphite">
      <header className="bg-ink text-ivory">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="#/" aria-label="Rumbo Futuro, inicio"><img src="/Logo_normal.jpeg" alt="Rumbo Futuro" className="h-14 w-auto rounded-lg object-contain" /></a>
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-coral sm:text-sm">Tu talento, tu puerta al mundo</span>
        </div>
      </header>

      <section className="relative overflow-hidden bg-ink text-ivory">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-7">
            <p className="font-editorial text-2xl italic text-coral sm:text-3xl">El siguiente paso empieza aquí</p>
            <h1 className="font-sans text-4xl font-extrabold leading-tight text-ivory sm:text-5xl lg:text-6xl">Tu futuro en el periodismo no tiene por qué esperar.</h1>
            <p className="max-w-2xl text-lg leading-relaxed text-ivory/85">Rumbo Futuro conecta a periodistas emergentes con investigadores, expertos y profesionales de la comunicación. Queremos acercarte a la formación práctica, el conocimiento especializado y las oportunidades que impulsan tu carrera.</p>
            <a href="#inscripcion" className="inline-flex w-fit items-center gap-3 rounded-full bg-coral px-7 py-4 font-sans text-sm font-bold text-ink transition hover:bg-ivory">
              Quiero dar el siguiente paso <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-[2rem] border-2 border-coral p-3">
            <img src="/Logo_normal.jpeg" alt="Identidad de Rumbo Futuro" className="aspect-[5/4] w-full rounded-[1.5rem] bg-ivory object-contain p-8" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 font-editorial text-xl italic text-coral">Una conexión que abre caminos</p>
          <h2 className="font-sans text-3xl font-extrabold text-ink sm:text-4xl">¿Qué es Rumbo Futuro?</h2>
          <p className="mt-5 text-lg leading-relaxed">Un punto de encuentro entre talento joven y experiencia profesional. Facilitamos que periodistas emergentes encuentren orientación, formación y conexiones para desarrollar su perfil y acercarse al mundo laboral.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-[1.5rem] border border-ink/10 bg-white p-7 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-coral/15 text-coral"><GraduationCap className="h-6 w-6" /></div>
            <h3 className="font-sans text-xl font-bold text-ink">Aprende haciendo</h3>
            <p className="mt-3 leading-relaxed">Acércate a una formación conectada con la práctica y con los retos reales de la comunicación.</p>
          </article>
          <article className="rounded-[1.5rem] border border-ink/10 bg-white p-7 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-coral/15 text-coral"><Handshake className="h-6 w-6" /></div>
            <h3 className="font-sans text-xl font-bold text-ink">Conecta con expertos</h3>
            <p className="mt-3 leading-relaxed">Encuentra referentes, investigadores y profesionales que pueden compartir conocimiento y experiencia.</p>
          </article>
          <article className="rounded-[1.5rem] border border-ink/10 bg-white p-7 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-coral/15 text-coral"><Compass className="h-6 w-6" /></div>
            <h3 className="font-sans text-xl font-bold text-ink">Define tu camino</h3>
            <p className="mt-3 leading-relaxed">Explora áreas de especialización y oportunidades para orientar tu desarrollo profesional.</p>
          </article>
        </div>
      </section>

      <section id="inscripcion" className="bg-ivory-deep">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 font-editorial text-xl italic text-coral">Empieza hoy</p>
            <h2 className="font-sans text-3xl font-extrabold text-ink sm:text-4xl">Da el primer paso con Rumbo Futuro.</h2>
            <p className="mt-5 text-lg leading-relaxed">Déjanos tu correo y te podremos informar sobre el proyecto, sus propuestas formativas y próximas oportunidades.</p>
            <div className="mt-7 flex items-start gap-3 text-sm text-graphite"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-coral" /><span>Utilizaremos tu correo únicamente para gestionar esta solicitud y las comunicaciones relacionadas. Puedes solicitar la baja cuando quieras.</span></div>
          </div>
          <div className="rounded-[2rem] border border-ink/10 bg-white p-7 shadow-sm sm:p-10">
            <div className="mb-6 flex items-center gap-3"><Mail className="h-6 w-6 text-coral" /><h3 className="font-sans text-2xl font-bold text-ink">Quiero recibir información</h3></div>
            <form onSubmit={submit} className="flex flex-col gap-4">
              <label htmlFor="qr-email" className="font-sans text-sm font-semibold text-ink">Correo electrónico</label>
              <input id="qr-email" type="email" required autoComplete="email" value={email} onChange={e => { setEmail(e.target.value); setStatus('idle'); }} placeholder="tu@correo.com" className="w-full rounded-full border border-ink/20 bg-white px-5 py-3 text-base text-graphite placeholder:text-graphite-soft/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-coral" />
              <button type="submit" disabled={status === 'sending'} className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-6 py-4 font-sans text-sm font-bold text-ink transition hover:bg-ink hover:text-ivory disabled:opacity-60">{status === 'sending' ? 'Enviando…' : 'Enviar mi solicitud'} <ArrowRight className="h-4 w-4" /></button>
              <p role="status" aria-live="polite" className="min-h-6 text-sm font-semibold text-ink">{status === 'success' ? <><CheckCircle2 className="mr-2 inline h-4 w-4 text-coral" />¡Gracias! Hemos recibido tu solicitud.</> : status === 'duplicate' ? 'Este correo ya está registrado.' : status === 'error' ? 'No hemos podido guardar la solicitud. Inténtalo de nuevo.' : ''}</p>
            </form>
            <p className="mt-3 text-xs leading-relaxed text-graphite-soft">Al enviar el formulario solicitas recibir información de Rumbo Futuro. Consulta nuestra información de privacidad en el apartado legal de la web.</p>
          </div>
        </div>
      </section>

      <footer className="bg-ink px-5 py-8 text-center text-sm text-ivory/70">© {new Date().getFullYear()} Rumbo Futuro. Tu talento, tu puerta al mundo.</footer>

      {consent === null && <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/15 bg-white p-4 shadow-2xl sm:p-5"><div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-3xl text-sm leading-relaxed text-graphite">Podemos utilizar analítica propia y anónima para medir las visitas a esta página y las inscripciones. La medición utiliza identificadores seudónimos y solo se activa si la aceptas.</p><div className="flex shrink-0 gap-2"><button onClick={() => chooseConsent('rejected')} className="rounded-full border border-ink/20 px-4 py-2 font-sans text-xs font-semibold text-ink">Rechazar</button><button onClick={() => chooseConsent('accepted')} className="rounded-full bg-coral px-4 py-2 font-sans text-xs font-semibold text-ink">Aceptar analítica</button></div></div></div>}
    </main>
  );
}
