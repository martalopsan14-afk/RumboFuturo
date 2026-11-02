export interface LegalDocument {
  id: string;
  title: string;
  body: string;
}

// Pendiente de aclaración por el equipo: la referencia "ERP asistido por la IA" no se interpreta ni se usa como categoría jurídica.
export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'aviso-legal',
    title: 'Aviso legal',
    body: 'Texto pendiente de revisión. Los datos identificativos de la empresa se incorporarán cuando estén validados.',
  },
  {
    id: 'politica-privacidad',
    title: 'Política de privacidad',
    body: 'Texto pendiente de revisión. Describirá cómo se tratan los correos electrónicos de interés y las suscripciones.',
  },
  {
    id: 'politica-cookies',
    title: 'Política de cookies',
    body: 'Texto pendiente de revisión. Se detallarán las cookies utilizadas por la web una vez confirmadas.',
  },
  {
    id: 'terminos-suscripcion',
    title: 'Términos y condiciones de suscripción',
    body: 'Texto pendiente de revisión. Las condiciones definitivas se publicarán cuando las suscripciones estén aprobadas.',
  },
  {
    id: 'uso-inteligencia-artificial',
    title: 'Información sobre el uso de inteligencia artificial',
    body: 'Texto pendiente de revisión. Explicará cómo se utiliza la inteligencia artificial en Rumbo Futuro.',
  },
];

export interface SocialProfile {
  id: 'instagram' | 'tiktok';
  label: string;
  handle: string;
  url: string | null;
}

export const SOCIAL_PROFILES: SocialProfile[] = [
  { id: 'instagram', label: 'Instagram', handle: '@RumboFuturo_', url: null },
  { id: 'tiktok', label: 'TikTok', handle: '@RumboFuturo_', url: null },
];
