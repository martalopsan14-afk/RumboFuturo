import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
  Instagram,
  MessageCircle,
  Newspaper,
  Users,
} from 'lucide-react';
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
          <a href="#/" aria-label="Rumbo Futuro, inicio">
            <img src="/Logo_mini.jpeg" alt="Rumbo Futuro" className="h-16 w-auto max-w-[220px] object-contain" />
          </a>
          <a href="#registro" className="rounded-full bg-coral px-5 py-3 font-sans text-sm font-bold text-ink transition hover:bg-ink hover:text-ivory">
            Estoy interesado/a <ArrowRight className="ml-1 inline h-4 w-4" />
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-ink text-ivory">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-editorial text-2xl italic text-coral sm:text-3xl">Tu talento, tu puerta al mundo</p>
            <h1 className="mt-4 font-sans text-4xl font-extrabold leading-tight text-ivory sm:text-5xl lg:text-6xl">
              El futuro del periodismo empieza con tu oportunidad.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/85">
              Rumbo Futuro nace para facilitar el paso de la formación académica al mundo profesional. Conectamos a periodistas emergentes con investigadores, expertos y profesionales de la comunicación para desarrollar competencias, ganar experiencia práctica y dar visibilidad a su trabajo.
            </p>
            <a href="#registro" className="mt-8 inline-flex items-center gap-3 rounded-full bg-coral px-7 py-4 font-sans text-sm font-bold text-ink transition hover:bg-ivory">
              Estoy interesado/a <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <aside className="rounded-[2rem] border border-ivory/15 bg-ivory/5 p-7 shadow-xl sm:p-9">
            <img src="/Logo_normal.jpeg" alt="Logotipo de Rumbo Futuro" className="mx-auto mb-7 max-h-36 w-full max-w-sm rounded-xl bg-ivory object-contain p-3" />
            <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-coral">Qué hacemos</p>
            <h2 className="mt-3 font-editorial text-3xl italic leading-snug text-ivory">Formación, práctica periodística y conexión profesional.</h2>
            <div className="mt-7 space-y-5">
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral"><GraduationCap className="h-5 w-5" /></span>
                <div><h3 className="font-sans font-bold text-ivory">Formación dual</h3><p className="mt-1 text-sm leading-relaxed text-ivory/75">Propuesta formativa online y presencial, actualmente en preparación.</p></div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral"><Newspaper className="h-5 w-5" /></span>
                <div><h3 className="font-sans font-bold text-ivory">Trabajo periodístico</h3><p className="mt-1 text-sm leading-relaxed text-ivory/75">Artículos de periodistas emergentes con acompañamiento de investigadores y profesionales.</p></div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral"><Handshake className="h-5 w-5" /></span>
                <div><h3 className="font-sans font-bold text-ivory">Colaboración y comunidad</h3><p className="mt-1 text-sm leading-relaxed text-ivory/75">Vínculos con medios locales, entorno académico y profesionales del sector.</p></div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="font-editorial text-2xl italic text-coral">¿Y ahora qué?</p>
            <h2 className="mt-3 font-sans text-3xl font-extrabold leading-tight text-ink sm:text-5xl">
              Un puente entre el talento periodístico y el mundo laboral.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-graphite-soft">
              Muchos jóvenes periodistas terminan sus estudios con dificultades para acceder a su primer empleo, conseguir experiencia práctica o establecer contactos profesionales. A esto se suman las barreras geográficas y el coste de determinadas formaciones. Rumbo Futuro quiere contribuir a cerrar esa distancia.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl bg-ivory p-7">
              <BookOpen className="h-7 w-7 text-coral" />
              <h3 className="mt-4 font-sans text-xl font-bold text-ink">Formación práctica y flexible</h3>
              <p className="mt-3 leading-relaxed text-graphite-soft">Estamos preparando formación dual en dos modalidades: online, para facilitar el acceso desde distintos lugares, y presencial, con experiencias prácticas y aprendizaje colaborativo.</p>
            </article>
            <article className="rounded-3xl bg-ivory p-7">
              <BriefcaseBusiness className="h-7 w-7 text-coral" />
              <h3 className="mt-4 font-sans text-xl font-bold text-ink">Experiencia y portfolio</h3>
              <p className="mt-3 leading-relaxed text-graphite-soft">Nuestro trabajo incluye artículos realizados por periodistas emergentes con el acompañamiento de investigadores y profesionales. Una forma de aplicar conocimientos y mostrar capacidades.</p>
            </article>
            <article className="rounded-3xl bg-ivory p-7">
              <Users className="h-7 w-7 text-coral" />
              <h3 className="mt-4 font-sans text-xl font-bold text-ink">Investigadores y colaboradores</h3>
              <p className="mt-3 leading-relaxed text-graphite-soft">Acercamos el talento joven a expertos, medios de comunicación y entidades académicas vinculadas al proyecto, entre ellas la Universidad de Sevilla y LabProCom.</p>
            </article>
            <article className="rounded-3xl bg-ivory p-7">
              <MessageCircle className="h-7 w-7 text-coral" />
              <h3 className="mt-4 font-sans text-xl font-bold text-ink">Encuentros y comunidad</h3>
              <p className="mt-3 leading-relaxed text-graphite-soft">También impulsamos espacios de intercambio a través de eventos, charlas y encuentros profesionales, además de iniciativas como RumboChat.</p>
            </article>
          </div>

          <div className="mt-12 rounded-[2rem] bg-ink px-7 py-9 text-center sm:px-12 sm:py-14">
            <p className="font-editorial text-2xl italic text-coral">Nuestra propuesta de valor</p>
            <p className="mx-auto mt-4 max-w-4xl font-sans text-2xl font-bold leading-snug text-ivory sm:text-3xl">
              Formación práctica, flexibilidad geográfica y conexión con investigadores y profesionales, a un precio competitivo.
            </p>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-ivory/75">
              Queremos que la distancia, la falta de experiencia o el coste de la formación no sean barreras innecesarias para desarrollar una trayectoria en el periodismo.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Identidad de Rumbo Futuro" className="bg-ivory px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center">
          <img src="/Logo_normal.jpeg" alt="Logotipo completo de Rumbo Futuro" className="h-auto w-full max-w-[min(560px,90vw)] object-contain" />
          <p className="max-w-xl text-base leading-relaxed text-graphite-soft">
            El talento de hoy merece oportunidades para participar en el periodismo de mañana.
          </p>
        </div>
      </section>

      <section id="registro" className="scroll-mt-6 bg-ivory-deep px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-editorial text-xl italic text-coral">Da el primer paso</p>
            <h2 className="mt-2 font-sans text-3xl font-extrabold text-ink sm:text-4xl">¿Te interesa Rumbo Futuro?</h2>
            <p className="mt-5 text-lg leading-relaxed">Déjanos tu correo y te enviaremos novedades sobre el proyecto, la formación dual, las actividades y las próximas oportunidades.</p>
          </div>

          <div className="rounded-[2rem] border border-ink/10 bg-white p-7 shadow-sm sm:p-10">
            <h3 className="font-sans text-2xl font-bold text-ink">Quiero recibir información</h3>
            <p className="mt-2 text-sm leading-relaxed text-graphite-soft">Apúntate para estar al tanto de las novedades.</p>
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

      <section className="bg-white px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
          <p className="font-editorial text-xl italic text-coral">Sigue el rumbo</p>
          <h2 className="font-sans text-3xl font-extrabold text-ink">Visita nuestra web y redes sociales.</h2>
          <p className="max-w-2xl leading-relaxed text-graphite">Conoce nuestro trabajo, la formación dual, los colaboradores, los eventos y las novedades del proyecto.</p>
          <a href="#/inicio" className="inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-sans text-sm font-bold text-ivory transition hover:bg-coral hover:text-ink">
            Visita nuestra web <ArrowRight className="h-4 w-4" />
          </a>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <a href="https://www.instagram.com/rumbofuturoo?dlrf=MWZ5emxqdm05OTg3Zw==" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 font-sans text-sm font-semibold text-ink transition hover:border-coral hover:text-coral">
              <Instagram className="h-4 w-4" /> Instagram @rumbofuturoo
            </a>
            <a href="https://www.tiktok.com/@rumbofuturoo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 font-sans text-sm font-semibold text-ink transition hover:border-coral hover:text-coral">
              TikTok @rumbofuturoo
            </a>
          </div>
          <a href="mailto:Rumbofuturoo@gmail.com" className="text-sm text-graphite-soft underline underline-offset-4 hover:text-coral">Rumbofuturoo@gmail.com</a>
        </div>
      </section>

      <footer className="bg-ink px-5 py-7 text-center text-sm text-ivory/70">
        © {new Date().getFullYear()} Rumbo Futuro · Tu talento, tu puerta al mundo.
      </footer>
    </main>
  );
}
