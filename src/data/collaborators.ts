export interface CollaboratorItem {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  website: string | null;
}

export const MEDIA_PARTNERS: CollaboratorItem[] = [
  {
    id: 'diario-espartinas',
    name: 'Diario de Espartinas',
    description:
      'Medio de comunicación centrado en la actualidad y las noticias de interés para la comunidad de Espartinas, con especial atención a la información de proximidad.',
    logo: '/logoscolaboradores/Diario%20de%20Espartinas.jpeg',
    website: null,
  },
  {
    id: 'diario-territorio-digital',
    name: 'El Territorio Cadista',
    description:
      'Medio digital dedicado a la información y a la actualidad, con contenidos periodísticos dirigidos a sus lectores a través de plataformas digitales.',
    logo: '/logoscolaboradores/El%20Territorio%20Cadista.svg',
    website: null,
  },
];

export const ACADEMIC_PARTNERS: CollaboratorItem[] = [
  {
    id: 'universidad-sevilla',
    name: 'Universidad de Sevilla (US)',
    description:
      'Universidad pública con actividad docente e investigadora en distintas áreas del conocimiento, entre ellas la comunicación y el periodismo.',
    logo: '/logoscolaboradores/logo-universidad-sevilla.png',
    website: null,
  },
  {
    id: 'labprocom',
    name: 'LabProCom',
    description:
      'Iniciativa vinculada a la investigación y la comunicación, relevante para el entorno académico y profesional en el que se desarrolla Rumbo Futuro.',
    logo: '/logoscolaboradores/labprocom.png',
    website: null,
  },
  {
    id: 'secretariado-divulgacion-cultural-cientifica',
    name: 'Secretariado de Divulgación Cultural y Científica de la Universidad de Sevilla',
    description:
      'Equipos académicos que desarrollan investigación en comunicación y que pueden aportar conocimiento especializado al análisis y la práctica periodística.',
    logo: '/logoscolaboradores/secretariado-divulgacion.png',
    website: null,
  },
];
