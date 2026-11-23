import { useState, type FormEvent } from 'react';
import { BookOpen, Handshake, PenLine, type LucideIcon } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { buildHref } from '@/data/navigation';
import { saveInterest } from '@/lib/interestSignups';

interface Benefit {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const BENEFITS: Benefit[] = [
  {
    title: 'Aprende',
    description: 'Desarrolla competencias periodísticas mediante formación práctica.',
    icon: BookOpen,
    href: buildHref('formacion-dual'),
  },
  {
    title: 'Conecta',
    description: 'Acércate a investigadores, expertos y profesionales de la comunicación.',
    icon: Handshake,
    href: buildHref('saber-mas', 'eventos'),
  },
  {
    title: 'Proyecta tu talento',
    description: 'Desarrolla trabajos para demostrar tus competencias y construir tu portfolio profesional.',
    icon: PenLine,
    href: buildHref('nuestro-trabajo'),
  },
];

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
    <div className="rounded-2xl border border-coral/50 bg-ink p-5 text-ivory shadow-sm sm:p-6">
      <div className="mb-4">
        <h2 className="font-sans text-xl font-semibold text-ivory">Quiero estar al tanto</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-ivory/75 sm:text-base">
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
            className="min-w-0 flex-1 rounded-full border border-ivory/25 bg-ivory px-5 py-3 text-sm text-ink placeholder:text-graphite-soft focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === 'sending' || !privacyAccepted}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-coral px-7 py-3 font-sans text-sm font-semibold text-ink transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-50"
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

export function BenefitsSection() {
  return (
    <Section>
      <div className="flex flex-col gap-10">
        <HomeInterestSignup />
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <SectionHeader
            eyebrow="Nuestra propuesta de valor"
            title="El talento está ahí. En Rumbo Futuro acercamos las oportunidades."
            description="Muchos jóvenes periodistas terminan su formación sin disponer de experiencia suficiente, contactos profesionales u oportunidades para demostrar sus capacidades. Rumbo Futuro existe para cerrar esa distancia."
          />
          <ul className="grid gap-5 self-center">
            {BENEFITS.map(({ title, description, icon: Icon, href }) => (
              <li key={title}>
                <a
                  href={href}
                  className="group flex h-full gap-5 rounded-3xl border border-ink/10 bg-ivory p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-coral/60 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
                  aria-label={`${title}: ${description}`}
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-coral-soft transition group-hover:bg-coral">
                    <Icon aria-hidden="true" className="h-7 w-7 text-ink" strokeWidth={1.75} />
                  </span>
                  <span className="flex flex-col gap-2">
                    <span className="font-sans text-lg font-semibold text-ink">{title}</span>
                    <span className="leading-relaxed text-graphite">{description}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
