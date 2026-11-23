import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { saveInterest } from '@/lib/interestSignups';
import { trackQrEvent } from '@/lib/qrAnalytics';

const ANALYTICS_CONSENT_KEY = 'rumbo_qr_analytics_consent';

function getSignupSource(): 'qr' | 'website' {
  const params = new URLSearchParams(window.location.search);
  const source = (params.get('utm_source') || params.get('source') || '').toLowerCase();
  return source === 'qr' ? 'qr' : 'website';
}

export function LandingPage() {
  const [email, setEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'duplicate' | 'error'>('idle');
  const [analyticsConsent, setAnalyticsConsent] = useState<'accepted' | 'rejected' | null>(() => {
    try {
      const value = localStorage.getItem(ANALYTICS_CONSENT_KEY);
      return value === 'accepted' || value === 'rejected' ? value : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (analyticsConsent === 'accepted') void trackQrEvent('page_view', getSignupSource());
  }, [analyticsConsent]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!privacyAccepted) return;
    setStatus('sending');
    const source = getSignupSource();
    const result = await saveInterest(email, source === 'qr' ? 'qr_landing' : 'subscription_news', source, new Date().toISOString());
    if (result === 'saved') {
      if (analyticsConsent === 'accepted') void trackQrEvent('registration', getSignupSource());
      setStatus('success');
      setEmail('');
    } else {
      setStatus(result === 'duplicate' ? 'duplicate' : 'error');
    }
  };

  const chooseAnalyticsConsent = (value: 'accepted' | 'rejected') => {
    setAnalyticsConsent(value);
    try { localStorage.setItem(ANALYTICS_CONSENT_KEY, value); } catch { /* storage may be unavailable */ }
  };

  return (
    <main className="min-h-screen bg-ivory font-body text-graphite">
      <header className="border-b border-ink/10 bg-ivory">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-4 sm:px-8">
          <a href="#/" aria-label="Rumbo Futuro, inicio" className="flex items-center gap-3">
            <img src="/Logo_mini.jpeg" alt="" className="h-14 w-14 rounded-full object-contain" />
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
            Una plataforma que conecta el talento periodístico emergente con investigadores y profesionales de la comunicación para convertir la formación en experiencia y oportunidades reales.
          </p>
          <a href="#registro" className="mt-8 inline-flex items-center gap-3 rounded-full bg-coral px-7 py-4 font-sans text-sm font-bold text-ink transition hover:bg-ivory">
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
              «Ofrecemos una formación práctica y flexible geográficamente que conecta a los periodistas emergentes con el mundo laboral a través de los investigadores, a un precio competitivo».
            </p>
            <p className="mt-5 text-base leading-relaxed text-graphite-soft">
              Queremos acercar el aprendizaje a la realidad profesional y que la distancia o el coste no sean un obstáculo para desarrollar el talento periodístico.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ivory px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <img
            src="/Logo_normal.jpeg"
            alt="Identidad visual de Rumbo Futuro"
            className="mx-auto h-auto max-h-[560px] w-full object-contain"
          />
        </div>
      </section>

      <section className="bg-ivory-deep px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-editorial text-2xl italic text-coral">Tu siguiente paso empieza aquí</p>
            <h2 className="mt-3 font-sans text-3xl font-extrabold leading-tight text-ink sm:text-5xl">
              ¿Te gustaría contar con tu propio portfolio, ampliar tu red de contactos y dar el salto al mundo laboral?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-graphite">
              Conecta con expertos en comunicación, participa en experiencias prácticas y crea oportunidades profesionales. Todo de manera flexible y a un precio competitivo, para que ni la distancia ni el coste frenen tu talento.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border border-ink/10 bg-white p-6">
              <span className="font-editorial text-3xl italic text-coral">01</span>
              <h3 className="mt-3 font-sans text-lg font-bold text-ink">Construye tu portfolio</h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite-soft">Desarrolla trabajos periodísticos para mostrar tus capacidades y dar visibilidad a tu talento.</p>
            </article>
            <article className="rounded-2xl border border-ink/10 bg-white p-6">
              <span className="font-editorial text-3xl italic text-coral">02</span>
              <h3 className="mt-3 font-sans text-lg font-bold text-ink">Amplía tu red de contactos</h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite-soft">Acércate a profesionales, investigadores, expertos y otros perfiles del ámbito de la comunicación.</p>
            </article>
            <article className="rounded-2xl border border-ink/10 bg-white p-6">
              <span className="font-editorial text-3xl italic text-coral">03</span>
              <h3 className="mt-3 font-sans text-lg font-bold text-ink">Conecta con expertos</h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite-soft">Aprende de personas con experiencia y aplica sus conocimientos a proyectos y trabajos reales.</p>
            </article>
            <article className="rounded-2xl border border-ink/10 bg-white p-6">
              <span className="font-editorial text-3xl italic text-coral">04</span>
              <h3 className="mt-3 font-sans text-lg font-bold text-ink">Avanza a tu ritmo</h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite-soft">Accede a una propuesta flexible geográficamente y pensada para que el coste no cierre puertas.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="registro" className="scroll-mt-6 bg-ink px-5 py-16 text-ivory sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-editorial text-2xl italic text-coral">¿Te interesa formar parte?</p>
            <h2 className="mt-3 font-sans text-3xl font-extrabold leading-tight text-ivory sm:text-5xl">
              Da el primer paso con Rumbo Futuro.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ivory/80">
              Déjanos tu correo y te mantendremos al tanto de las novedades del proyecto, las actividades y las próximas oportunidades.
            </p>
          </div>

          <div className="rounded-3xl bg-ivory p-7 text-graphite shadow-xl sm:p-9">
            <h3 className="font-sans text-2xl font-extrabold text-ink">Estoy interesado/a</h3>
            <p className="mt-2 text-sm leading-relaxed text-graphite-soft">Déjanos tu correo y te enviaremos información sobre el proyecto, las propuestas formativas y las próximas oportunidades.</p>
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
                {status === 'sending' ? 'Enviando…' : 'Estoy interesado/a'} <ArrowRight className="h-4 w-4" />
              </button>
              <p role="status" aria-live="polite" className="min-h-6 text-sm font-semibold text-ink">
                {status === 'success' ? '¡Gracias! Hemos recibido tu registro.' :
                  status === 'duplicate' ? 'Este correo ya está registrado.' :
                  status === 'error' ? 'No hemos podido guardar el registro. Inténtalo de nuevo.' : ''}
              </p>
            </form>
          </div>
        </div>
      </section>

      {analyticsConsent === null && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/15 bg-white p-4 shadow-2xl sm:p-5">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-3xl text-sm leading-relaxed text-graphite">
              Podemos utilizar analítica propia y seudónima para medir las visitas a esta página y las inscripciones. Solo se activa si la aceptas.
            </p>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => chooseAnalyticsConsent('rejected')} className="rounded-full border border-ink/20 px-4 py-2 font-sans text-xs font-semibold text-ink">Rechazar</button>
              <button type="button" onClick={() => chooseAnalyticsConsent('accepted')} className="rounded-full bg-coral px-4 py-2 font-sans text-xs font-semibold text-ink">Aceptar analítica</button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-ivory px-5 py-12 text-center sm:px-8 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="font-editorial text-xl italic text-coral">Sigue nuestro rumbo</p>
          <h2 className="mt-2 font-sans text-2xl font-extrabold text-ink sm:text-3xl">¿Quieres conocer Rumbo Futuro más a fondo?</h2>
          <p className="mt-3 text-base leading-relaxed text-graphite-soft">
            Entra en nuestra web y descubre mejor el proyecto, lo que hacemos y cómo puedes formar parte.
          </p>
          <a href="https://rumbo-futuro-corpora-8ae8.bolt.host" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-coral px-7 py-3 font-sans text-sm font-bold text-ink transition hover:bg-ink hover:text-ivory">
            Visita nuestra web <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-10 border-t border-ink/10 pt-7">
          <p className="font-sans text-sm font-bold text-ink">También estamos en redes</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-ink">
            <a href="https://www.instagram.com/rumbofuturoo?dlrf=MWZ5emxqdm05OTg3Zw==" target="_blank" rel="noopener noreferrer" className="hover:text-coral">Instagram: @rumbofuturoo</a>
            <a href="https://www.tiktok.com/@rumbofuturoo" target="_blank" rel="noopener noreferrer" className="hover:text-coral">TikTok: @rumbofuturoo</a>
            <a href="mailto:Rumbofuturoo@gmail.com" className="hover:text-coral">Rumbofuturoo@gmail.com</a>
          </div>
          <p className="mt-8 text-xs text-graphite-soft">© {new Date().getFullYear()} Rumbo Futuro</p>
        </div>
      </footer>
    </main>
  );
}
