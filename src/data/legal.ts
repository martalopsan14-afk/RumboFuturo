export interface LegalDocument {
  id: string;
  title: string;
  body: string;
  url: string | null;
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'aviso-legal',
    title: 'Aviso legal',
    body: 'Documento pendiente de incorporación.',
    url: null,
  },
  {
    id: 'politica-privacidad',
    title: 'Política de privacidad',
    body: 'Documento pendiente de incorporación.',
    url: null,
  },
  {
    id: 'politica-cookies',
    title: 'Política de cookies',
    body: 'Documento pendiente de incorporación.',
    url: null,
  },
  {
    id: 'terminos-suscripcion',
    title: 'Términos y condiciones de suscripción',
    body: 'Documento pendiente de incorporación.',
    url: null,
  },
  {
    id: 'uso-inteligencia-artificial',
    title: 'Información sobre el uso de inteligencia artificial',
    body: 'Documento pendiente de incorporación.',
    url: null,
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
