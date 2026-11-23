import { useState, type FormEvent } from 'react';
import { EVENTS, type EventItem } from '@/data/events';
import { saveInterest } from '@/lib/interestSignups';
import { ExpandableText } from '@/components/ui/ExpandableText';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section } from '@/components/ui/Section';


function EventSignupForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'duplicate' | 'error'>('idle');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!privacyAccepted) return;
    setStatus('sending');
    const params = new URLSearchParams(window.location.search);
    const sourceParam = params.get('utm_source') || params.get('source');
    const source = sourceParam === 'qr' ? 'qr' : 'website';
    const result = await saveInterest(email, 'event_sinercom', source, new Date().toISOString());
    if (result === 'saved') {
      setStatus('success');
      setEmail('');
    } else {
      setStatus(result === 'duplicate' ? 'duplicate' : 'error');
    }
  };

  return (
    <div className="mt-5">
      <button type="button" aria-expanded={isOpen} aria-controls="sinercom-signup-panel" onClick={() => setIsOpen(open => !open)} className="flex w-full items-center justify-between gap-4 rounded-2xl border border-coral/40 bg-white px-5 py-4 text-left shadow-sm transition hover:border-coral hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral">
        <span className="flex flex-col gap-1">
          <span className="font-sans text-base font-semibold text-ink">Inscripción abierta</span>
          <span className="text-xs text-graphite-soft">{isOpen ? 'Cierra el formulario' : 'Pulsa para reservar tu plaza'}</span>
        </span>
        <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral/15 font-sans text-xl font-medium text-ink">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div id="sinercom-signup-panel" className="mt-3 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
      <p className="text-sm leading-relaxed text-graphite">Déjanos tu correo para registrar tu interés en asistir a la VIII edición Sinercom y Networking, organizada por LabProCom.</p>
      <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
        <label htmlFor="sinercom-email" className="font-sans text-sm font-semibold text-ink">Correo electrónico</label>
        <input id="sinercom-email" type="email" required autoComplete="email" value={email} onChange={e => { setEmail(e.target.value); setStatus('idle'); }} placeholder="tu@correo.com" className="w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-sm text-graphite focus:border-ink focus:outline-none focus:ring-2 focus:ring-coral" />
        <label className="flex items-start gap-2 text-xs leading-relaxed text-graphite">
          <input type="checkbox" required checked={privacyAccepted} onChange={e => setPrivacyAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#E8674A]" />
          <span>Consiento que Rumbo Futuro trate mi correo para gestionar esta inscripción y contactar conmigo sobre el evento. He leído y acepto la política de privacidad.</span>
        </label>
        <button type="submit" disabled={status === 'sending' || !privacyAccepted} className="inline-flex w-fit items-center justify-center rounded-full bg-coral px-6 py-3 font-sans text-sm font-semibold text-ink transition hover:bg-ink hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60">
          {status === 'sending' ? 'Enviando…' : 'Inscribirme al evento'}
        </button>
        {status === 'success' && <p role="status" className="text-sm font-semibold text-ink">¡Gracias! Tu inscripción ha quedado registrada.</p>}
        {status === 'duplicate' && <p role="status" className="text-sm text-graphite">Este correo ya está inscrito en el evento.</p>}
        {status === 'error' && <p role="alert" className="text-sm text-coral">No se ha podido guardar la inscripción. Inténtalo de nuevo.</p>}
      </form>
      </div>}
    </div>
  );
}

function EventCard({ event }: { event: EventItem }) {
  const showFullImage =
    event.id === 'networking-labprocom' ||
    event.id === 'asociacion-prensa';

  return (
    <article
      id={event.id}
      className="group flex h-full scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-ink/10 bg-ivory shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex aspect-[16/9] items-center justify-center overflow-hidden bg-ivory-deep px-6 text-center font-sans text-xs font-semibold uppercase tracking-wider text-graphite-soft">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            className={
              showFullImage
                ? 'h-full w-full object-contain object-center'
                : 'h-full w-full object-cover transition duration-500 group-hover:scale-105'
            }
          />
        ) : (
          'Fotografía del evento pendiente de incorporar'
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={event.status} />
        </div>
        <h3 className="font-sans text-xl leading-snug">{event.title}</h3>
        <p className="leading-relaxed">{event.description}</p>
        <dl className="grid grid-cols-2 gap-4 border-y border-ink/10 py-4 text-sm">
          <div>
            <dt className="font-sans text-xs font-semibold uppercase tracking-wider text-graphite-soft">Fecha</dt>
            <dd>
              {event.date?.includes(' · ') ? (
                <>
                  {event.date.split(' · ')[0]} ·{' '}
                  <span className="whitespace-nowrap">{event.date.split(' · ')[1]}</span>
                </>
              ) : (
                event.date ?? 'Por confirmar'
              )}
            </dd>
          </div>
          <div>
            <dt className="font-sans text-xs font-semibold uppercase tracking-wider text-graphite-soft">Lugar</dt>
            <dd>{event.place ?? 'Por confirmar'}</dd>
          </div>
        </dl>
        <div className="mt-auto">
          <ExpandableText text={event.details} collapsedLabel="Saber más" expandedLabel="Ver menos" />
          {event.id === 'networking-labprocom' && (
            <div className="mt-4 flex flex-col items-start gap-2 text-sm">
              <EventSignupForm />
              <a
                href="https://www.instagram.com/p/DgFC29Mxj0a/?lqvp=MWthb3p5eHBnNjF1Mg=="
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-ink underline decoration-coral decoration-2 underline-offset-4 hover:text-ink-soft"
              >
                Conoce más sobre Sinercom
              </a>
              <a
                href="https://www.instagram.com/p/DgAPcIXkePG/?knvt=MWxxM3A0M3Vybm14cg=="
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-ink underline decoration-coral decoration-2 underline-offset-4 hover:text-ink-soft"
              >
                Descubre más sobre el networking
              </a>
              <p className="pt-2 text-graphite">
                ¿Quieres conocer más? Visita{' '}
                <a
                  href="https://www.instagram.com/labprocom?avpt=MW51cnRxanJ0ZW50dA=="
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-ink underline decoration-coral decoration-2 underline-offset-4 hover:text-ink-soft"
                >
                  LabProCom
                </a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function EventsGrid() {
  return (
    <Section id="eventos" tone="deep">
      <div className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="Eventos"
          title="Las oportunidades también nacen de una conversación"
          description="En Rumbo Futuro queremos crear espacios donde los jóvenes periodistas puedan conocer a profesionales, descubrir nuevas oportunidades y ampliar sus conocimientos sobre el mundo de la comunicación."
        />
        <ul className="grid gap-6 md:grid-cols-2">
          {EVENTS.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
