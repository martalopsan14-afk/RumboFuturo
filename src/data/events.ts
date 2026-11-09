export type EventStatus = 'en_preparacion' | 'proximamente' | 'inscripciones_abiertas' | 'finalizado';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  details: string;
  date: string | null;
  place: string | null;
  status: EventStatus;
  image: string | null;
}

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  en_preparacion: 'En preparación',
  proximamente: 'Próximamente',
  inscripciones_abiertas: 'Abierto a inscripciones',
  finalizado: 'Finalizado',
};

export const EVENTS: EventItem[] = [
  {
    id: 'charlas-fcom',
    title: 'Charlas promocionales en la FCom',
    description:
      'Estamos preparando charlas promocionales para presentar Rumbo Futuro, explicar nuestra propuesta y acercar el proyecto a los futuros profesionales de la comunicación.',
    details:
      'Sesiones pensadas para dar a conocer la plataforma y resolver dudas sobre la formación. Fechas, lugar y participantes se anunciarán cuando estén confirmados.',
    date: null,
    place: null,
    status: 'en_preparacion',
    image: null,
  },
  {
    id: 'networking-labprocom',
    title: 'Networking de LabProCom',
    description:
      'Queremos impulsar encuentros que permitan conectar a jóvenes periodistas con personas del ámbito académico y profesional, compartir experiencias y descubrir nuevas posibilidades de colaboración.',
    details:
      'Un espacio informal para conversar con investigadores y profesionales de la comunicación. No hay fecha confirmada todavía.',
    date: null,
    place: null,
    status: 'proximamente',
    image: null,
  },
  {
    id: 'consejo-periodistas',
    title: 'Consejo de Periodistas',
    description:
      'Encuentros y charlas en torno al Consejo de Periodistas para acercar a los participantes a la realidad profesional, la ética periodística y los retos actuales del sector.',
    details:
      'Las sesiones se planificarán con los ponentes que participen. Te informaremos cuando existan fechas y programa.',
    date: null,
    place: null,
    status: 'en_preparacion',
    image: null,
  },
  {
    id: 'asociacion-prensa',
    title: 'Asociación de Prensa',
    description:
      'Encuentros y actividades vinculados a asociaciones de prensa para conocer el funcionamiento del sector, sus experiencias profesionales y los retos de la profesión.',
    details:
      'Actividades orientadas a conocer de primera mano cómo se organiza la profesión. Pendientes de confirmar.',
    date: null,
    place: null,
    status: 'en_preparacion',
    image: null,
  },
];
