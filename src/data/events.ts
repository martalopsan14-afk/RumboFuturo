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
    id: 'networking-labprocom',
    title: 'VIII edición Sinercom y Networking',
    description:
      'Organizado por LabProCom, Sinercom es una sesión de networking dinámico para fomentar la colaboración, el intercambio de ideas y la visibilidad de proyectos emergentes.',
    details:
      'La VIII edición Sinercom y Networking, organizada por LabProCom, es un encuentro para conectar proyectos, compartir ideas y generar nuevas oportunidades de colaboración. La sesión busca dar visibilidad a iniciativas emergentes y facilitar el contacto entre sus participantes. La inscripción está abierta: puedes reservar tu plaza desde este formulario. Puedes ampliar la información en las publicaciones de LabProCom enlazadas a continuación.',
    date: '24 de noviembre de 2026 · 12:00 h',
    place: 'Facultad de Comunicación (FCom), Universidad de Sevilla',
    status: 'inscripciones_abiertas',
    image: '/sabermaseventos/labprocom.png',
  },
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
    image: '/sabermaseventos/Facultad%20de%20comunicación.jpeg',
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
    image: '/sabermaseventos/Consejo%20de%20periodistas.jpeg',
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
    image: '/sabermaseventos/Asociacion%20de%20prensa%20Sevilla.jpeg',
  },
];
