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
    'Estamos preparando una nueva forma de aprender periodismo sin que la distancia sea un obstáculo. Muy pronto podrás acceder a una formación práctica diseñada para desarrollar tus competencias y acercarte al mundo profesional.',
  highlights: [
    'Flexibilidad geográfica',
    'Aprendizaje online',
    'Formación práctica',
    'Contacto con investigadores y expertos',
    'Próximos cursos mediante suscripción',
    'Posibilidad de acreditar competencias mediante microcredenciales, según las condiciones de cada curso',
  ],
  statusTitle: 'Próximamente: nuestros cursos online',
  statusText:
    'Estamos creando nuestros primeros cursos. Muy pronto podrás descubrir los contenidos, las modalidades de suscripción y las opciones formativas.',
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
    'Estamos trabajando para ofrecer nuevas oportunidades de aprendizaje presencial. En breve anunciaremos más información sobre los cursos, sus contenidos y las condiciones de participación.',
  interestType: 'in_person_course',
  ctaLabel: 'Avísame cuando esté disponible',
  formLabel: 'Te avisaremos cuando publiquemos la formación presencial',
};

export const SUBSCRIPTION_COPY = {
  title: 'Estamos preparando algo para tu futuro',
  description:
    'Muy pronto podrás acceder a una formación pensada para ayudarte a desarrollar tus habilidades periodísticas, aprender de profesionales y construir tu camino hacia el mundo laboral.',
  access:
    'La suscripción permitirá acceder a los cursos que se incorporen a la plataforma, según las condiciones de cada plan.',
  pricing:
    'Los precios, las ventajas y las condiciones definitivas se anunciarán cuando estén aprobados.',
  planTitle: 'Tarjeta de suscripción en preparación',
  planBadge: 'Próximamente',
  formLabel: 'Recibe novedades sobre la suscripción y los próximos cursos',
  ctaLabel: 'Quiero recibir información',
};
