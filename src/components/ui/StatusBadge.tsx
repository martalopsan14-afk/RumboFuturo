import { EVENT_STATUS_LABELS, type EventStatus } from '@/data/events';

const STATUS_CLASSES: Record<EventStatus, string> = {
  en_preparacion: 'bg-ivory-deep text-ink border-ink/20',
  proximamente: 'bg-coral-soft text-ink border-coral',
  inscripciones_abiertas: 'bg-ink text-ivory border-ink',
  finalizado: 'bg-transparent text-graphite-soft border-graphite/30',
};

export function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-sans text-xs font-semibold tracking-wide ${STATUS_CLASSES[status]}`}
    >
      {EVENT_STATUS_LABELS[status]}
    </span>
  );
}
