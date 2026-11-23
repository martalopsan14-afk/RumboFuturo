import type { InterestType } from '@/lib/interestSignups';

export interface ModalityData {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  statusTitle: string;
  statusText: string;
  interestType: InterestType;
  ctaLabel: string;
  formLabel: string;
}

export const ONLINE_MODALITY: ModalityData = {
  id: 'modalidad-online',
  eyebrow: 'Modalidad online',
  title: 'Aprende desde cualquier lugar',
  description:
    'Diseñamos una propuesta para aprender periodismo sin que la distancia sea un obstáculo. Nuestra formación práctica se centra en desarrollar tus competencias y acercarte al mundo profesional. Actualmente preparamos los primeros cursos online.',
  highlights: [
    'Flexibilidad geográfica',
    'Aprendizaje online',
    'Formación práctica',
    'Contacto con investigadores y expertos',
    'Próximos cursos mediante suscripción',
    'Posibilidad de acreditar competencias mediante microcredenciales, según las condiciones de cada curso',
  ],
  statusTitle: 'Cursos online en preparación',
  statusText:
    'Preparamos nuestros primeros cursos y definimos sus contenidos, las modalidades de suscripción y las opciones formativas.',
  interestType: 'online_course',
  ctaLabel: 'Quiero estar al tanto',
  formLabel: 'Recibe un aviso cuando publiquemos los cursos online',
};

export const IN_PERSON_MODALITY: ModalityData = {
  id: 'modalidad-presencial',
  eyebrow: 'Modalidad presencial',
  title: 'Aprende haciendo, conecta en persona',
  description:
    'Estamos preparando experiencias formativas presenciales para que los jóvenes periodistas puedan aprender mediante actividades prácticas, compartir conocimientos y acercarse al trabajo real de los profesionales de la comunicación.',
  highlights: [
    'Talleres prácticos',
    'Actividades presenciales',
    'Aprendizaje colaborativo',
    'Contacto con expertos',
    'Próximas experiencias formativas mediante suscripción',
    'Posibilidad de obtener una microcredencial cuando corresponda',
  ],
  statusTitle: 'Próximamente: nuestra formación presencial',
  statusText:
    'Preparamos nuevas oportunidades de aprendizaje presencial. Los cursos, sus contenidos y las condiciones de participación están en fase de definición.',
  interestType: 'in_person_course',
  ctaLabel: 'Avísame cuando esté disponible',
  formLabel: 'Te avisaremos cuando publiquemos la formación presencial',
};

export interface CourseDraft {
  id: string;
  name: string;
  description: string;
  status: 'Próximamente';
  objectives: string[];
  contents: string[];
  modality: string;
  duration: string;
  price: string;
  enrollment: string;
  image: string | null;
}

export const COURSE_DRAFTS: CourseDraft[] = [
  'Periodismo de Datos e Inteligencia Artificial',
  'Campañas de Desinformación en materia de Inmigración',
  'Fast Fashion y Políticas Medioambientales',
].map((name, index) => ({
  id: `curso-${index + 1}`,
  name,
  description: 'Descripción pendiente de validación.',
  status: 'Próximamente',
  objectives: [],
  contents: [],
  modality: 'Pendiente de confirmar',
  duration: 'Pendiente de confirmar',
  price: 'Pendiente de confirmar',
  enrollment: 'Información de inscripción pendiente.',
  image: null,
}));

export const SUBSCRIPTION_COPY = {
  title: 'Una formación pensada para tu futuro',
  description:
    'Preparamos una formación que te ayuda a desarrollar tus habilidades periodísticas, aprender de profesionales y avanzar en tu camino hacia el mundo laboral.',
  access:
    'La suscripción da acceso a los cursos de la plataforma, según las condiciones de cada plan.',
  pricing:
    'Los precios, las ventajas y las condiciones definitivas están pendientes de aprobación.',
  planTitle: 'Tarjeta de suscripción en preparación',
  planBadge: 'Próximamente',
  formLabel: 'Recibe novedades sobre la suscripción y los próximos cursos',
  ctaLabel: 'Quiero recibir información',
};
