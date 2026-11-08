export const PAGE_IDS = [
  'inicio',
  'nuestro-rumbo',
  'nuestro-trabajo',
  'formacion-dual',
  'colaboradores',
  'saber-mas',
  'rumbochat',
] as const;

export type PageId = (typeof PAGE_IDS)[number];

export interface NavChild {
  label: string;
  anchor: string;
  children?: NavChild[];
}

export interface NavItem {
  label: string;
  page: Exclude<PageId, 'inicio'>;
  children: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Nuestro Rumbo',
    page: 'nuestro-rumbo',
    children: [
      { label: 'Nuestra esencia', anchor: 'nuestra-esencia' },
      { label: 'Nuestro equipo', anchor: 'nuestro-equipo' },
    ],
  },
  {
    label: 'Nuestro Trabajo',
    page: 'nuestro-trabajo',
    children: [{ label: 'Artículos realizados', anchor: 'articulos-realizados' }],
  },
  {
    label: 'Formación Dual',
    page: 'formacion-dual',
    children: [
      { label: 'Modalidad online', anchor: 'modalidad-online' },
      { label: 'Modalidad presencial', anchor: 'modalidad-presencial' },
      { label: 'Suscripciones y próximos cursos', anchor: 'suscripciones' },
    ],
  },
  {
    label: 'Colaboradores',
    page: 'colaboradores',
    children: [
      { label: 'Medios locales implicados', anchor: 'medios-locales' },
      { label: 'Respaldo académico', anchor: 'respaldo-academico' },
    ],
  },
  {
    label: 'Saber Más',
    page: 'saber-mas',
    children: [
      {
        label: 'Eventos',
        anchor: 'eventos',
        children: [
          { label: 'Charlas promocionales en la FCom', anchor: 'charlas-fcom' },
          { label: 'Networking de LabProCom', anchor: 'networking-labprocom' },
          { label: 'Consejo de Periodistas', anchor: 'consejo-periodistas' },
          { label: 'Asociación de Prensa', anchor: 'asociacion-prensa' },
          { label: 'Próximos encuentros', anchor: 'proximos-encuentros' },
        ],
      },
    ],
  },
  {
    label: 'RumboChat',
    page: 'rumbochat',
    children: [],
  },
];

export function buildHref(page: PageId, anchor?: string): string {
  return anchor ? `#/${page}/${anchor}` : `#/${page}`;
}
