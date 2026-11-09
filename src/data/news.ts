
export interface NewsItem {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  body: string;
  date: string | null;
  image: string | null;
  link?: string | null;
}

const NEWS_SOURCE = '/Compendio_de_Noticias_de_Rumbo_Futuro.pdf';

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'premios-andaluces-futuro',
    category: 'Economía',
    title: 'CaixaBank y Grupo Joly convocan la XIX edición de Premios Andaluces del Futuro',
    excerpt: 'Los Premios Andaluces del Futuro regresan con una nueva convocatoria para reconocer el talento joven andaluz.',
    body: 'La convocatoria contempla categorías de Ciencia, Cultura, Deporte, Empresa y Acción Social. Las candidaturas pueden presentarse hasta el 15 de noviembre y los galardones recibirán una dotación económica de 6.000 euros brutos.',
    date: '2026-11-01',
    image: '/noticias/Noticia%20laura%201.jpeg',
    link: NEWS_SOURCE,
  },
  {
    id: 'premio-transfiere',
    category: 'Comunicación científica',
    title: 'Transfiere convoca la XII edición de su Premio de Periodismo para reconocer la divulgación científica y tecnológica',
    excerpt: 'El Foro Transfiere abre una nueva convocatoria para reconocer trabajos periodísticos sobre innovación y divulgación científica.',
    body: 'El certamen contempla varias categorías y busca reconocer la labor de profesionales de la información en la difusión de la innovación tecnológica desarrollada en España y su convergencia internacional.',
    date: '2026-11-02',
    image: '/noticias/noticia%201%20adri.jpeg',
    link: NEWS_SOURCE,
  },
  {
    id: 'premios-api',
    category: 'Investigación',
    title: 'Dos investigaciones europeas triunfan en los Premios API',
    excerpt: 'Dos proyectos internacionales han sido reconocidos en la sexta edición de los premios de la Asociación de Periodistas de Investigación.',
    body: 'Los trabajos premiados abordan los desplazamientos de mujeres europeas y las edificaciones ilegales en espacios naturales protegidos, con investigaciones basadas en datos y documentación.',
    date: '2026-11-04',
    image: '/noticias/noticia%202%20adri.jpeg',
    link: NEWS_SOURCE,
  },
  {
    id: 'apm-primer-empleo',
    category: 'Oportunidades profesionales',
    title: 'La Asociación de Prensa de Madrid abre las puertas del mercado laboral a cinco jóvenes periodistas',
    excerpt: 'Cinco periodistas emergentes han sido seleccionados para incorporarse a diferentes medios mediante el programa Primer Empleo.',
    body: 'La iniciativa ofrece un puesto de trabajo en distintos medios de comunicación a jóvenes periodistas seleccionados entre las candidaturas presentadas.',
    date: '2026-11-05',
    image: '/noticias/noticia%20enrique%201.jpeg',
    link: NEWS_SOURCE,
  },
  {
    id: 'foros-fape',
    category: 'Periodismo',
    title: 'La FAPE reúne profesionales para analizar las nuevas oportunidades profesionales del periodismo',
    excerpt: 'El ciclo FOROS FAPE reúne a profesionales para analizar la transformación del mercado laboral y las nuevas oportunidades del sector.',
    body: 'La jornada celebrada en el Campus de Castellana de la Universidad Camilo José Cela abordó las distintas posibilidades laborales que ofrece actualmente el periodismo y la comunicación.',
    date: '2026-11-06',
    image: '/noticias/noticia%20enrique%202.jpeg',
    link: NEWS_SOURCE,
  },
  {
    id: 'frontiers-ciencia-sociedad',
    category: 'Comunicación científica',
    title: 'Frontiers, el espacio donde periodistas e investigadores comparten espacio para acercar la ciencia a la sociedad',
    excerpt: 'Frontiers busca crear conexiones entre periodistas e investigadores para promover la cobertura de temas de investigación.',
    body: 'El proyecto facilita estancias y acciones formativas para que periodistas e instituciones de investigación conozcan mejor sus formas de trabajo y refuercen la comunicación científica.',
    date: '2026-11-07',
    image: '/noticias/noticia%20laura%202.jpeg',
    link: NEWS_SOURCE,
  },
  {
    id: 'rtve-instituto-ue',
    category: 'Formación',
    title: 'RTVE Instituto lanza un programa de mejora de la cobertura informativa en la UE',
    excerpt: 'Un programa formativo acerca la actualidad comunitaria a jóvenes periodistas y mejora sus competencias sobre las instituciones europeas.',
    body: 'La iniciativa reúne a profesionales y especialistas para profundizar en el funcionamiento del Parlamento, la Comisión y el Consejo, así como en la verificación de imágenes y la lucha contra la desinformación.',
    date: '2026-11-08',
    image: '/noticias/noticia%20mariela%201.jpeg',
    link: NEWS_SOURCE,
  },
  {
    id: 'cinco-jovenes-apm',
    category: 'Oportunidades profesionales',
    title: 'Cinco jóvenes periodistas consiguen su primer empleo gracias a la APM',
    excerpt: 'La Asociación de la Prensa de Madrid facilita la incorporación laboral de cinco recién graduados mediante su programa Primer Empleo.',
    body: 'Los seleccionados comenzarán su trayectoria profesional en medios de comunicación madrileños tras superar el proceso de selección del programa.',
    date: '2026-11-09',
    image: '/noticias/noticia%20mariela%202.jpeg',
    link: NEWS_SOURCE,
  },
];
