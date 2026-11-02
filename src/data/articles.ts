export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  outlet: string;
  journalist: string;
  expert: string;
  excerpt: string;
  body: string;
  image: string;
}

const PENDING_JOURNALIST = 'Periodista participante (por confirmar)';
const PENDING_EXPERT = 'Investigador o experto (por confirmar)';

export const ARTICLES: ArticleItem[] = [
  {
    id: 'rueda-de-prensa',
    title: 'Cómo cubrir una rueda de prensa sin perder el contexto',
    category: 'Práctica informativa',
    outlet: 'Diario de Espartinas',
    journalist: PENDING_JOURNALIST,
    expert: PENDING_EXPERT,
    excerpt: 'Preparar preguntas, identificar los datos clave y contrastar lo dicho en la sala antes de escribir.',
    body: 'Ejemplo de demostración: el texto completo de este artículo se incorporará cuando exista una publicación real.',
    image: 'https://images.pexels.com/photos/6950229/pexels-photo-6950229.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'entrevista-directo',
    title: 'Entrevistar en directo: preguntas que abren conversaciones',
    category: 'Entrevistas',
    outlet: 'Universidad de Sevilla (US)',
    journalist: PENDING_JOURNALIST,
    expert: PENDING_EXPERT,
    excerpt: 'Una guía práctica para escuchar, repreguntar y sacar el mejor testimonio en pocos minutos.',
    body: 'Ejemplo de demostración: el texto completo de este artículo se incorporará cuando exista una publicación real.',
    image: 'https://images.pexels.com/photos/10464544/pexels-photo-10464544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'datos-cercanos',
    title: 'Datos locales, historias cercanas',
    category: 'Periodismo de datos',
    outlet: 'Diario Territorio Digital',
    journalist: PENDING_JOURNALIST,
    expert: PENDING_EXPERT,
    excerpt: 'Cómo convertir cifras municipales en relatos que importan a los vecinos.',
    body: 'Ejemplo de demostración: el texto completo de este artículo se incorporará cuando exista una publicación real.',
    image: 'https://images.pexels.com/photos/7610783/pexels-photo-7610783.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'verificar-antes',
    title: 'Verificar antes de publicar: una guía de campo',
    category: 'Verificación',
    outlet: 'LabProCom',
    journalist: PENDING_JOURNALIST,
    expert: PENDING_EXPERT,
    excerpt: 'Fuentes, imágenes y testimonios: los pasos que evitan errores en la redacción.',
    body: 'Ejemplo de demostración: el texto completo de este artículo se incorporará cuando exista una publicación real.',
    image: 'https://images.pexels.com/photos/32957317/pexels-photo-32957317.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'reportaje-visual',
    title: 'Reportaje visual en el barrio',
    category: 'Multimedia',
    outlet: 'Diario de Espartinas',
    journalist: PENDING_JOURNALIST,
    expert: PENDING_EXPERT,
    excerpt: 'Imagen, sonido y texto para contar la vida cotidiana de una comunidad.',
    body: 'Ejemplo de demostración: el texto completo de este artículo se incorporará cuando exista una publicación real.',
    image: 'https://images.pexels.com/photos/8456858/pexels-photo-8456858.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'del-aula-redaccion',
    title: 'Del aula a la redacción: primeras crónicas',
    category: 'Crónica',
    outlet: 'Diario Territorio Digital',
    journalist: PENDING_JOURNALIST,
    expert: PENDING_EXPERT,
    excerpt: 'El proceso completo de una crónica, desde la idea inicial hasta la publicación.',
    body: 'Ejemplo de demostración: el texto completo de este artículo se incorporará cuando exista una publicación real.',
    image: 'https://images.pexels.com/photos/6393024/pexels-photo-6393024.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];
