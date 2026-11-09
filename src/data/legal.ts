
import legalSource from './legal-content.txt?raw';

export interface LegalDocument {
  id: string;
  title: string;
  body: string;
  url: string | null;
}

function extractSection(title: string, nextTitle?: string): string {
  const start = legalSource.indexOf(`\n${title}\n`);
  const end = nextTitle
    ? legalSource.indexOf(`\n${nextTitle}\n`, start + title.length)
    : -1;

  return legalSource
    .slice(start + title.length + 2, end === -1 ? undefined : end)
    .trim();
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'aviso-legal',
    title: 'Aviso Legal',
    body: extractSection('Aviso Legal', 'Política de Privacidad'),
    url: null,
  },
  {
    id: 'politica-privacidad',
    title: 'Política de Privacidad',
    body: extractSection('Política de Privacidad', 'Política de Cookies'),
    url: null,
  },
  {
    id: 'politica-cookies',
    title: 'Política de Cookies',
    body: extractSection('Política de Cookies', 'Personalizar  Cookies'),
    url: null,
  },
  {
    id: 'personalizar-cookies',
    title: 'Personalizar Cookies',
    body: extractSection('Personalizar  Cookies'),
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
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@rumbofuturoo',
    url: 'https://www.instagram.com/rumbofuturoo?dlrf=MWZ5emxqdm05OTg3Zw==',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    handle: '@rumbofuturooy',
    url: 'https://www.tiktok.com/@rumbofuturooy',
  },
];
