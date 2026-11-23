import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2, Compass, GraduationCap, Handshake, Mail, MapPin, ShieldCheck, Wallet } from 'lucide-react';
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
    if (consent === 'accepted') void trackQrEvent('page_view');
  }, [consent]);

  const chooseConsent = (value: 'accepted' | 'rejected') => {
    setConsent(value);
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* storage may be unavailable */ }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    if (!privacyAccepted) { setStatus('error'); return; }
    const result = await saveInterest(email, 'qr_landing', 'qr', new Date().toISOString());
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
      <header className="border-b border-ink/10 bg-ivory text-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <a href="#/" aria-label="Rumbo Futuro, inicio" className="shrink-0">
            <img src="/Logo_normal.jpeg" alt="Rumbo Futuro" className="h-16 w-auto max-w-[220px] object-contain sm:h-[4.5rem]" />
          </a>
          <span className="text-right font-sans text-xs font-semibold uppercase tracking-[0.16em] text-coral sm:text-sm">Tu talento, tu puerta al mundo</span>
        </div>
      </header>

      <section className="relative overflow-hidden bg-ink text-ivory">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-7">
            <p className="font-editorial text-2xl italic text-coral sm:text-3xl">El reto que queremos resolver</p>
            <h1 className="font-sans text-4xl font-extrabold leading-tight text-ivory sm:text-5xl lg:text-6xl">Conectamos el talento periodístico con el conocimiento que merece llegar más lejos.</h1>
            <p className="max-w-2xl text-lg leading-relaxed text-ivory/85">¿Sabías que muchos periodistas recién graduados tienen dificultades para encontrar trabajo por falta de experiencia práctica, mientras que muchos investigadores de la comunicación generan conocimiento especializado que nunca llega al gran público?</p>
            <a href="#inscripcion" className="inline-flex w-fit items-center gap-3 rounded-full bg-coral px-7 py-4 font-sans text-sm font-bold text-ink transition hover:bg-ivory">
              Quiero dar el siguiente paso <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <aside className="rounded-[2rem] border border-ivory/20 bg-ivory/5 p-7 shadow-xl sm:p-9">
            <p className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-coral">Nuestra propuesta de valor</p>
            <p className="font-editorial text-2xl italic leading-snug text-ivory sm:text-3xl">Somos RUMBO FUTURO, la plataforma que conecta ambos mundos.</p>
            <div className="mt-7 h-px bg-ivory/20" />
            <p className="text-base leading-relaxed text-ivory/85">A través de encuentros, charlas y cursos prácticos a precios competitivos, conectamos a periodistas emergentes con investigadores y profesionales de la comunicación para que colaboren en trabajos reales.</p>
            <p className="mt-4 text-base leading-relaxed text-ivory/85">Los periodistas ganan experiencia y oportunidades para acercarse al mundo laboral. Los investigadores y profesionales descubren nuevos talentos que colaboran en sus proyectos, y nuestros medios asociados reciben contenido riguroso y listo para publicar.</p>
            <p className="mt-4 text-sm leading-relaxed text-ivory/70"><strong className="text-coral">Nuestro modelo:</strong> suscripciones accesibles para periodistas, acuerdos con organizaciones y cuotas de colaboración de los medios de comunicación que publican el trabajo conjunto.</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <p className="mb-3 font-editorial text-xl italic text-coral">Una conexión que abre caminos</p>
          <h2 className="font-sans text-3xl font-extrabold text-ink sm:text-4xl">¿Qué es Rumbo Futuro?</h2>
          <p className="mt-5 text-lg leading-relaxed">Rumbo Futuro es un punto de encuentro entre el talento periodístico emergente y la experiencia profesional. Acercamos a jóvenes periodistas a investigadores, especialistas y profesionales de la comunicación para que amplíen sus conocimientos, desarrollen habilidades útiles y conozcan de cerca las exigencias y posibilidades del sector.</p>
          <p className="mt-4 text-lg leading-relaxed">Damos respuesta a una etapa especialmente importante: el paso de la formación académica al ejercicio profesional. Para ello, combinamos formación aplicada, acompañamiento experto y oportunidades de conexión con el entorno laboral. Apostamos por un modelo flexible, que elimina barreras geográficas y busca que el precio no sea un obstáculo para seguir aprendiendo.</p>
        </div>

        <div className="mb-14 grid gap-6 md:grid-cols-2">
          <article className="rounded-[1.5rem] border-t-2 border-coral bg-white p-7 shadow-sm sm:p-9">
            <h3 className="font-sans text-xl font-bold text-ink">El reto al que respondemos</h3>
            <p className="mt-4 leading-relaxed">Al terminar sus estudios, muchos jóvenes periodistas se encuentran con dificultades para acceder a su primera oportunidad laboral, conseguir experiencia práctica y construir una red de contactos. La falta de experiencia suele convertirse en una barrera precisamente cuando más necesitan demostrar lo que saben hacer.</p>
          </article>
          <article className="rounded-[1.5rem] border-t-2 border-ink bg-white p-7 shadow-sm sm:p-9">
            <h3 className="font-sans text-xl font-bold text-ink">Cómo aportamos valor</h3>
            <p className="mt-4 leading-relaxed">Creamos espacios de aprendizaje conectados con la realidad del periodismo, en los que el conocimiento de investigadores y profesionales se une al trabajo práctico. Así, los participantes refuerzan sus competencias, amplían su perspectiva y se acercan a personas y experiencias que enriquecen su desarrollo profesional.</p>
          </article>
        </div>

        <div className="mb-8 text-center">
          <p className="font-editorial text-xl italic text-coral">Los cuatro pilares de nuestra propuesta</p>
          <h2 className="mt-2 font-sans text-2xl font-extrabold text-ink sm:text-3xl">Una formación conectada con el mundo real</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[1.5rem] border border-ink/10 bg-white p-7 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-coral/15 text-coral"><GraduationCap className="h-6 w-6" /></div>
            <h3 className="font-sans text-xl font-bold text-ink">Formación práctica</h3>
            <p className="mt-3 leading-relaxed">Trabajamos competencias que se aplican al día a día del periodismo. El aprendizaje se vincula a situaciones, herramientas y retos reales para que los conocimientos no se queden únicamente en la teoría.</p>
          </article>
          <article className="rounded-[1.5rem] border border-ink/10 bg-white p-7 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-coral/15 text-coral"><MapPin className="h-6 w-6" /></div>
            <h3 className="font-sans text-xl font-bold text-ink">Flexibilidad geográfica</h3>
            <p className="mt-3 leading-relaxed">La modalidad online facilita el acceso desde distintos lugares y permite participar sin que vivir lejos de los principales centros de actividad profesional limite las posibilidades de formación.</p>
          </article>
          <article className="rounded-[1.5rem] border border-ink/10 bg-white p-7 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-coral/15 text-coral"><Handshake className="h-6 w-6" /></div>
            <h3 className="font-sans text-xl font-bold text-ink">Conexión profesional</h3>
            <p className="mt-3 leading-relaxed">Ponemos en contacto a periodistas emergentes con investigadores, expertos y profesionales de la comunicación. Su experiencia aporta orientación, contexto y una visión directa del sector.</p>
          </article>
          <article className="rounded-[1.5rem] border border-ink/10 bg-white p-7 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-coral/15 text-coral"><Wallet className="h-6 w-6" /></div>
            <h3 className="font-sans text-xl font-bold text-ink">Accesibilidad económica</h3>
            <p className="mt-3 leading-relaxed">Apostamos por una formación especializada a un precio competitivo. Queremos facilitar que más jóvenes puedan seguir aprendiendo y acceder a contenidos de calidad sin que el coste suponga una barrera innecesaria.</p>
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
              <label className="flex items-start gap-3 text-sm leading-relaxed text-graphite"><input type="checkbox" required checked={privacyAccepted} onChange={e => setPrivacyAccepted(e.target.checked)} className="mt-1 h-4 w-4 accent-[#E8674A]" /><span>He leído la información de privacidad y consiento que Rumbo Futuro utilice mi correo para enviarme información sobre el proyecto y sus oportunidades.</span></label>
              <button type="submit" disabled={status === 'sending'} className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-6 py-4 font-sans text-sm font-bold text-ink transition hover:bg-ink hover:text-ivory disabled:opacity-60">{status === 'sending' ? 'Enviando…' : 'Enviar mi solicitud'} <ArrowRight className="h-4 w-4" /></button>
              <p role="status" aria-live="polite" className="min-h-6 text-sm font-semibold text-ink">{status === 'success' ? <><CheckCircle2 className="mr-2 inline h-4 w-4 text-coral" />¡Gracias! Hemos recibido tu solicitud.</> : status === 'duplicate' ? 'Este correo ya está registrado.' : status === 'error' ? 'No hemos podido guardar la solicitud. Inténtalo de nuevo.' : ''}</p>
            </form>
            <p className="mt-3 text-xs leading-relaxed text-graphite-soft">Al enviar el formulario solicitas recibir información de Rumbo Futuro. Consulta nuestra información de privacidad en el apartado legal de la web.</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-12 sm:py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <p className="font-editorial text-xl italic text-coral">¿Quieres conocer el proyecto en profundidad?</p>
          <h2 className="font-sans text-2xl font-extrabold text-ink sm:text-3xl">Descubre todo lo que ofrece Rumbo Futuro.</h2>
          <p className="max-w-2xl leading-relaxed text-graphite">En nuestra web encontrarás más información sobre el proyecto, las áreas de trabajo, la formación y las personas que lo hacen posible.</p>
          <a href="#/" className="mt-2 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-sans text-sm font-bold text-ivory transition hover:bg-coral hover:text-ink">
            Visitar la web de Rumbo Futuro <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <footer className="bg-ink px-5 py-8 text-center text-sm text-ivory/70">© {new Date().getFullYear()} Rumbo Futuro. Tu talento, tu puerta al mundo. <span className="mx-2 text-coral">·</span><a href="#/" className="font-semibold text-ivory underline underline-offset-4 hover:text-coral">Ir a la web principal</a></footer>

      {consent === null && <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/15 bg-white p-4 shadow-2xl sm:p-5"><div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-3xl text-sm leading-relaxed text-graphite">Podemos utilizar analítica propia y anónima para medir las visitas a esta página y las inscripciones. La medición utiliza identificadores seudónimos y solo se activa si la aceptas.</p><div className="flex shrink-0 gap-2"><button onClick={() => chooseConsent('rejected')} className="rounded-full border border-ink/20 px-4 py-2 font-sans text-xs font-semibold text-ink">Rechazar</button><button onClick={() => chooseConsent('accepted')} className="rounded-full bg-coral px-4 py-2 font-sans text-xs font-semibold text-ink">Aceptar analítica</button></div></div></div>}
    </main>
  );
}
