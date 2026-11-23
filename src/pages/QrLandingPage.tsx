import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2, GraduationCap, Handshake, Mail, MapPin, ShieldCheck, Wallet } from 'lucide-react';
import { saveInterest } from '@/lib/interestSignups';
import { trackQrEvent } from '@/lib/qrAnalytics';

const CONSENT_KEY = 'rumbo_qr_analytics_consent';

export function QrLandingPage() {
  const [email, setEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [consent, setConsent] = useState<'accepted' | 'rejected' | null>(() => {
    try {
      const value = localStorage.getItem(CONSENT_KEY);
      return value === 'accepted' || value === 'rejected' ? value : null;
    } catch { return null; }
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'duplicate' | 'error'>('idle');

  useEffect(() => {
    if (consent === 'accepted') void trackQrEvent('page_view', 'qr');
  }, [consent]);

  const chooseConsent = (value: 'accepted' | 'rejected') => {
    setConsent(value);
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* storage may be unavailable */ }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!privacyAccepted) return;
    setStatus('sending');
    const result = await saveInterest(email, 'qr_landing', 'qr', new Date().toISOString());
    if (result === 'saved') {
      if (consent === 'accepted') void trackQrEvent('registration', 'qr');
      setStatus('success');
      setEmail('');
    } else {
      setStatus(result === 'duplicate' ? 'duplicate' : 'error');
    }
  };

  return (
    <main className="min-h-screen bg-ivory font-body text-graphite">
      <header className="border-b border-ink/10 bg-ivory">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-4 sm:px-8">
          <a href="#/" aria-label="Rumbo Futuro, inicio" className="flex items-center gap-3">
            <img src="/Logo_mini.jpeg" alt="Logotipo de Rumbo Futuro" className="h-14 w-14 rounded-full object-contain" />
            <span className="font-sans text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Rumbo Futuro</span>
          </a>
        </div>
      </header>

      <section className="bg-ink px-5 py-16 text-ivory sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-editorial text-2xl italic text-coral sm:text-3xl">Rumbo Futuro</p>
          <h1 className="mx-auto mt-4 max-w-4xl font-sans text-4xl font-extrabold leading-tight text-ivory sm:text-6xl">
            Tu talento, Tu puerta al mundo
          </h1>
          <div className="mx-auto mt-8 h-1 w-20 rounded-full bg-coral" />
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-ivory/85 sm:text-xl">
            Una plataforma que conecta el talento periodístico emergente con investigadores y profesionales de la comunicación.
          </p>
          <a href="#inscripcion" className="mt-8 inline-flex items-center gap-3 rounded-full bg-coral px-7 py-4 font-sans text-sm font-bold text-ink transition hover:bg-ivory">
            Quiero dar el siguiente paso <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <div>
            <p className="font-editorial text-2xl italic text-coral">Nuestra propuesta de valor</p>
            <h2 className="mt-3 font-sans text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Formación práctica. Conexión real. Nuevas oportunidades.
            </h2>
          </div>
          <div className="border-l-4 border-coral pl-6 sm:pl-8">
            <p className="font-editorial text-2xl italic leading-relaxed text-ink sm:text-3xl">
              Somos RUMBO FUTURO, la plataforma que conecta ambos mundos.
            </p>
            <p className="mt-5 text-base leading-relaxed text-graphite-soft">
              A través de encuentros, charlas y cursos prácticos a precios competitivos, conectamos a periodistas emergentes con investigadores y profesionales de la comunicación para que colaboren en trabajos reales.
            </p>
            <p className="mt-4 text-base leading-relaxed text-graphite-soft">
              Los periodistas ganan experiencia y oportunidades para acercarse al mundo laboral. Los investigadores y profesionales descubren nuevos talentos que colaboran en sus proyectos, y nuestros medios asociados reciben contenido riguroso y listo para publicar.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-graphite-soft">
              <strong className="text-ink">Nuestro modelo:</strong> suscripciones accesibles para periodistas, acuerdos con organizaciones y cuotas de colaboración de los medios de comunicación que publican el trabajo conjunto.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ivory px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <img src="/Logo_normal.jpeg" alt="Logotipo completo de Rumbo Futuro" className="mx-auto h-auto max-h-[560px] w-full object-contain" />
        </div>
      </section>

      <section className="bg-ivory-deep px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-editorial text-2xl italic text-coral">Tu siguiente paso empieza aquí</p>
            <h2 className="mt-3 font-sans text-3xl font-extrabold leading-tight text-ink sm:text-5xl">
              ¿Te gustaría tener tu propio portfolio, crear una red de contactos y dar el salto al mundo laboral?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-graphite">
              En Rumbo Futuro podrás conectar con expertos en comunicación, aprender de profesionales y participar en experiencias prácticas. Todo ello de manera flexible y a un precio competitivo, para que la distancia o el coste no frenen tu talento.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border border-ink/10 bg-white p-6">
              <span className="font-editorial text-3xl italic text-coral">01</span>
              <div className="mt-3 flex items-center gap-2"><GraduationCap className="h-5 w-5 text-coral" /><h3 className="font-sans text-lg font-bold text-ink">Construye tu portfolio</h3></div>
              <p className="mt-2 text-sm leading-relaxed text-graphite-soft">Desarrolla trabajos prácticos para mostrar tus capacidades y dar visibilidad a tu talento.</p>
            </article>
            <article className="rounded-2xl border border-ink/10 bg-white p-6">
              <span className="font-editorial text-3xl italic text-coral">02</span>
              <div className="mt-3 flex items-center gap-2"><Handshake className="h-5 w-5 text-coral" /><h3 className="font-sans text-lg font-bold text-ink">Amplía tus contactos</h3></div>
              <p className="mt-2 text-sm leading-relaxed text-graphite-soft">Conecta con periodistas, investigadores, especialistas y profesionales del sector.</p>
            </article>
            <article className="rounded-2xl border border-ink/10 bg-white p-6">
              <span className="font-editorial text-3xl italic text-coral">03</span>
              <div className="mt-3 flex items-center gap-2"><MapPin className="h-5 w-5 text-coral" /><h3 className="font-sans text-lg font-bold text-ink">Aprende con flexibilidad</h3></div>
              <p className="mt-2 text-sm leading-relaxed text-graphite-soft">Participa desde donde estés y compatibiliza la formación con tu ritmo y tus circunstancias.</p>
            </article>
            <article className="rounded-2xl border border-ink/10 bg-white p-6">
              <span className="font-editorial text-3xl italic text-coral">04</span>
              <div className="mt-3 flex items-center gap-2"><Wallet className="h-5 w-5 text-coral" /><h3 className="font-sans text-lg font-bold text-ink">Accede a buen precio</h3></div>
              <p className="mt-2 text-sm leading-relaxed text-graphite-soft">Acércate a formación especializada y oportunidades profesionales con un coste competitivo.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="inscripcion" className="scroll-mt-6 bg-ink px-5 py-16 text-ivory sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-editorial text-2xl italic text-coral">¿Te interesa formar parte?</p>
            <h2 className="mt-3 font-sans text-3xl font-extrabold leading-tight text-ivory sm:text-5xl">Da el primer paso con Rumbo Futuro.</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ivory/80">
              Déjanos tu correo y te enviaremos información sobre el proyecto, las propuestas formativas y las próximas oportunidades.
            </p>
            <div className="mt-7 flex items-start gap-3 text-sm text-ivory/75"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-coral" /><span>Usaremos tu correo para gestionar esta solicitud y las comunicaciones relacionadas. Puedes solicitar la baja cuando quieras.</span></div>
          </div>
          <div className="rounded-3xl bg-ivory p-7 text-graphite shadow-xl sm:p-9">
            <div className="mb-6 flex items-center gap-3"><Mail className="h-6 w-6 text-coral" /><h3 className="font-sans text-2xl font-extrabold text-ink">Estoy interesado/a</h3></div>
            <p className="mt-2 text-sm leading-relaxed text-graphite-soft">Regístrate para recibir información de Rumbo Futuro.</p>
            <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
              <label htmlFor="qr-email" className="font-sans text-sm font-semibold text-ink">Correo electrónico</label>
              <input id="qr-email" type="email" required autoComplete="email" value={email} disabled={status === 'sending'} onChange={e => { setEmail(e.target.value); setStatus('idle'); }} placeholder="tu@correo.com" className="w-full rounded-full border border-ink/20 bg-white px-5 py-3 text-base text-graphite placeholder:text-graphite-soft/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-coral" />
              <label className="flex items-start gap-3 text-xs leading-relaxed text-graphite"><input type="checkbox" required checked={privacyAccepted} onChange={e => setPrivacyAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#E8674A]" /><span>Consiento que Rumbo Futuro utilice mi correo para enviarme información sobre el proyecto y sus actividades.</span></label>
              <button type="submit" disabled={status === 'sending' || !privacyAccepted} className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-6 py-4 font-sans text-sm font-bold text-ink transition hover:bg-ink hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60">{status === 'sending' ? 'Enviando…' : 'Estoy interesado/a'} <ArrowRight className="h-4 w-4" /></button>
              <p role="status" aria-live="polite" className="min-h-6 text-sm font-semibold text-ink">{status === 'success' ? <><CheckCircle2 className="mr-2 inline h-4 w-4 text-coral" />¡Gracias! Hemos recibido tu registro.</> : status === 'duplicate' ? 'Este correo ya está registrado.' : status === 'error' ? 'No hemos podido guardar el registro. Inténtalo de nuevo.' : ''}</p>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-12 sm:py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <p className="font-editorial text-xl italic text-coral">Sigue nuestro rumbo</p>
          <h2 className="font-sans text-2xl font-extrabold text-ink sm:text-3xl">Conoce Rumbo Futuro más a fondo.</h2>
          <p className="max-w-2xl leading-relaxed text-graphite">Descubre el proyecto, nuestras actividades y cómo puedes formar parte.</p>
          <a href="https://rumbo-futuro-corpora-8ae8.bolt.host" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-sans text-sm font-bold text-ivory transition hover:bg-coral hover:text-ink">Visitar la web de Rumbo Futuro <ArrowUpRight className="h-4 w-4" /></a>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm font-semibold text-ink">
            <a href="https://www.instagram.com/rumbofuturoo?dlrf=MWZ5emxqdm05OTg3Zw==" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-coral">Instagram · @rumbofuturoo</a>
            <a href="https://www.tiktok.com/@rumbofuturoo" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-coral">TikTok · @rumbofuturoo</a>
          </div>
        </div>
      </section>

      <footer className="bg-ink px-5 py-8 text-center text-sm text-ivory/70">© {new Date().getFullYear()} Rumbo Futuro. Tu talento, tu puerta al mundo. <span className="mx-2 text-coral">·</span><a href="https://rumbo-futuro-corpora-8ae8.bolt.host" target="_blank" rel="noopener noreferrer" className="font-semibold text-ivory underline underline-offset-4 hover:text-coral">Ir a la web principal</a></footer>

      {consent === null && <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/15 bg-white p-4 shadow-2xl sm:p-5"><div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-3xl text-sm leading-relaxed text-graphite">Podemos utilizar analítica propia y seudónima para medir las visitas a esta página y las inscripciones. Solo se activa si la aceptas.</p><div className="flex shrink-0 gap-2"><button onClick={() => chooseConsent('rejected')} className="rounded-full border border-ink/20 px-4 py-2 font-sans text-xs font-semibold text-ink">Rechazar</button><button onClick={() => chooseConsent('accepted')} className="rounded-full bg-coral px-4 py-2 font-sans text-xs font-semibold text-ink">Aceptar analítica</button></div></div></div>}
    </main>
  );
}
