import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { buildHref } from '@/data/navigation';
import { saveInterest } from '@/lib/interestSignups';

const HERO_IMAGE_URL = '/Logo_normal.jpeg';

function HomeInterestSignup() {
  const [email, setEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'duplicate' | 'error'>('idle');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!privacyAccepted) return;
    setStatus('sending');
    const result = await saveInterest(email, 'subscription_news', 'website', new Date().toISOString());
    if (result === 'saved') {
      setStatus('success');
      setEmail('');
    } else {
      setStatus(result === 'duplicate' ? 'duplicate' : 'error');
    }
  };

  return (
    <div className="mt-2 rounded-2xl border border-coral/50 bg-ivory/5 p-4 sm:p-5">
      <div className="mb-3">
        <h2 className="font-sans text-lg font-semibold text-ivory">Quiero estar al tanto</h2>
        <p className="mt-1 text-sm leading-relaxed text-ivory/75">
          Recibe novedades, cursos y oportunidades para impulsar tu futuro en la comunicación.
        </p>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="home-interest-email" className="sr-only">Correo electrónico</label>
          <input
            id="home-interest-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Tu correo electrónico"
            value={email}
            disabled={status === 'sending'}
            onChange={event => { setEmail(event.target.value); setStatus('idle'); }}
            className="min-w-0 flex-1 rounded-full border border-ivory/25 bg-ivory px-4 py-2.5 text-sm text-ink placeholder:text-graphite-soft focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === 'sending' || !privacyAccepted}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-coral px-5 py-2.5 font-sans text-sm font-semibold text-ink transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'sending' ? 'Enviando…' : 'Avisadme'}
          </button>
        </div>
        <label className="flex items-start gap-2 text-xs leading-relaxed text-ivory/70">
          <input
            type="checkbox"
            required
            checked={privacyAccepted}
            onChange={event => setPrivacyAccepted(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#E8674A]"
          />
          <span>Consiento que Rumbo Futuro utilice mi correo para enviarme novedades y comunicaciones sobre sus actividades. He leído y acepto la política de privacidad.</span>
        </label>
        {status === 'success' && <p role="status" className="text-sm font-semibold text-coral">¡Genial! Te mantendremos al tanto.</p>}
        {status === 'duplicate' && <p role="status" className="text-sm text-ivory/85">Este correo ya está registrado para recibir novedades.</p>}
        {status === 'error' && <p role="alert" className="text-sm text-coral">No hemos podido guardar tu correo. Inténtalo de nuevo.</p>}
      </form>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-ivory">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-28 lg:pt-28">
        <div className="flex flex-col gap-7 animate-fade-up">
          <p className="font-editorial text-2xl italic text-coral sm:text-3xl">Tu talento, tu puerta al mundo</p>
          <h1 className="font-sans text-4xl leading-[1.1] text-ivory sm:text-5xl lg:text-6xl">
            El futuro del periodismo empieza con tu oportunidad
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-ivory/85">
            Conectamos a periodistas emergentes con investigadores, expertos y profesionales de la comunicación para
            que desarrollen sus competencias, ganen experiencia práctica y encuentren nuevas oportunidades en el mundo
            laboral.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={buildHref('nuestro-rumbo')}>Descubre nuestro rumbo</Button>
            <Button
              variant="outline"
              href={buildHref('formacion-dual')}
              className="border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory/10"
            >
              Explora la formación
            </Button>
          </div>
          <HomeInterestSignup />
        </div>

        <div className="relative flex flex-col gap-5 animate-fade-up [animation-delay:150ms]">
          <div className="rounded-[2rem] border-2 border-coral p-2 shadow-xl">
            <img
              src={HERO_IMAGE_URL}
              alt="Rumbo Futuro"
              width={940}
              height={650}
              className="relative aspect-[4/5] w-full rounded-[1.5rem] bg-ink object-contain shadow-2xl sm:aspect-[5/4]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
