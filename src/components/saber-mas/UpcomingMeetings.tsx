import { type EventStatus } from '@/data/events';
import { Section } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';

const STATUS_LEGEND: EventStatus[] = ['en_preparacion', 'proximamente', 'inscripciones_abiertas', 'finalizado'];

export function UpcomingMeetings() {
  return (
    <Section id="proximos-encuentros" tone="ink">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-6">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-coral">Próximos encuentros</p>
          <h2 className="font-sans text-3xl text-ivory sm:text-4xl">Esto no ha hecho más que empezar</h2>
          <p className="max-w-2xl text-lg leading-relaxed text-ivory/85">
            Estamos preparando nuevos encuentros, charlas y oportunidades para conectar el talento emergente con el mundo
            profesional. Muy pronto compartiremos más novedades.
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-[2rem] border border-ivory/15 bg-ivory/5 p-8">
          <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-ivory">Estados de los eventos</h3>
          <ul className="flex flex-col items-start gap-3">
            {STATUS_LEGEND.map((status) => (
              <li key={status} className="flex items-center gap-3">
                <StatusBadge status={status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
