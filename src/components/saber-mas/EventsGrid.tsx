import { EVENTS, type EventItem } from '@/data/events';
import { ExpandableText } from '@/components/ui/ExpandableText';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section } from '@/components/ui/Section';

function EventCard({ event }: { event: EventItem }) {
  return (
    <article
      id={event.id}
      className="group flex h-full scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-ink/10 bg-ivory shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={event.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
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
            <dd>{event.date ?? 'Por confirmar'}</dd>
          </div>
          <div>
            <dt className="font-sans text-xs font-semibold uppercase tracking-wider text-graphite-soft">Lugar</dt>
            <dd>{event.place ?? 'Por confirmar'}</dd>
          </div>
        </dl>
        <div className="mt-auto">
          <ExpandableText text={event.details} collapsedLabel="Saber más" expandedLabel="Ver menos" />
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
