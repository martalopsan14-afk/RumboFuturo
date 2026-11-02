export interface NewsItem {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  image: string;
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'primer-empleo',
    category: 'Empleo',
    title: 'El reto del primer empleo periodístico',
    excerpt: 'Los recién graduados buscan su primera oportunidad en un sector en transformación.',
    body: 'Contenido de demostración. Este espacio recogerá análisis reales sobre el acceso al primer empleo cuando se publiquen.',
    date: '2026-10-28',
    image: 'https://images.pexels.com/photos/10464544/pexels-photo-10464544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'medios-locales',
    category: 'Medios locales',
    title: 'La transformación de los medios locales',
    excerpt: 'La información de proximidad se reinventa con nuevos formatos y nuevas audiencias.',
    body: 'Contenido de demostración. Próximamente incorporaremos reportajes sobre la evolución de los medios de cercanía.',
    date: '2026-10-24',
    image: 'https://images.pexels.com/photos/38623491/pexels-photo-38623491.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'ia-redacciones',
    category: 'Inteligencia artificial',
    title: 'La inteligencia artificial en las redacciones',
    excerpt: 'Herramientas, límites y responsabilidades periodísticas ante la automatización.',
    body: 'Contenido de demostración. Este espacio reunirá reflexiones y casos prácticos sobre el uso de la IA en la profesión.',
    date: '2026-10-21',
    image: 'https://images.pexels.com/photos/177557/pexels-photo-177557.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'formacion-microcredenciales',
    category: 'Formación',
    title: 'Formación práctica y microcredenciales',
    excerpt: 'Cómo acreditar competencias concretas y demostrarlas ante futuros empleadores.',
    body: 'Contenido de demostración. Más adelante explicaremos cómo funcionarán las microcredenciales en cada curso.',
    date: '2026-10-17',
    image: 'https://images.pexels.com/photos/7611198/pexels-photo-7611198.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'periodismo-investigacion',
    category: 'Investigación',
    title: 'El periodismo de investigación se aprende en equipo',
    excerpt: 'Documentación, paciencia y colaboración para sostener historias de largo recorrido.',
    body: 'Contenido de demostración. Este espacio abordará métodos de investigación periodística con expertos del sector.',
    date: '2026-10-13',
    image: 'https://images.pexels.com/photos/9572418/pexels-photo-9572418.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'narrativas-digitales',
    category: 'Narrativas digitales',
    title: 'Nuevas narrativas digitales para jóvenes periodistas',
    excerpt: 'Formatos breves, visuales y participativos que están cambiando la forma de contar.',
    body: 'Contenido de demostración. Próximamente publicaremos guías sobre formatos digitales y su aplicación práctica.',
    date: '2026-10-09',
    image: 'https://images.pexels.com/photos/8036328/pexels-photo-8036328.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'universidades-medios',
    category: 'Colaboración',
    title: 'Universidades y medios: un puente que se construye',
    excerpt: 'La colaboración entre la academia y la redacción abre nuevas vías de aprendizaje.',
    body: 'Contenido de demostración. En esta sección daremos cuenta de las colaboraciones formalizadas cuando existan.',
    date: '2026-10-05',
    image: 'https://images.pexels.com/photos/8349431/pexels-photo-8349431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'oportunidades-profesionales',
    category: 'Oportunidades',
    title: 'Oportunidades profesionales para jóvenes periodistas',
    excerpt: 'Un panorama de los caminos disponibles para quienes empiezan su carrera.',
    body: 'Contenido de demostración. Este espacio recopilará oportunidades reales cuando estén confirmadas.',
    date: '2026-10-01',
    image: 'https://images.pexels.com/photos/7610783/pexels-photo-7610783.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];
