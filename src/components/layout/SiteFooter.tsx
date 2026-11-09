
import { useCallback, useState } from 'react';
import { Instagram } from 'lucide-react';
import { LegalDialog } from '@/components/layout/LegalDialog';
import { LEGAL_DOCUMENTS, SOCIAL_PROFILES, type LegalDocument } from '@/data/legal';
import { NAV_ITEMS, buildHref } from '@/data/navigation';

function TikTokIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.26 0 .5.04.73.11V9.7a5.7 5.7 0 1 0 4.95 5.65V8.92a7.35 7.35 0 0 0 4.3 1.38V7.21a4.27 4.27 0 0 1-2.3-.69 4.2 4.2 0 0 1-1.97-2.7z" />
    </svg>
  );
}

const SOCIAL_ICONS = {
  instagram: () => <Instagram aria-hidden="true" className="h-5 w-5" />,
  tiktok: TikTokIcon,
} as const;

export function SiteFooter() {
  const [openDocument, setOpenDocument] = useState<LegalDocument | null>(null);
  const closeDocument = useCallback(() => setOpenDocument(null), []);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ivory">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-3">

        {/* LOGO Y CORREO */}
        <div className="flex flex-col items-start gap-3">
          <img
            src="/Logo_mini.jpeg"
            alt="Rumbo Futuro"
            className="h-auto w-36 object-contain border-2 border-white rounded-lg p-2"
          />

          <a
            href="mailto:Rumbofuturoo@gmail.com"
            className="font-sans text-sm text-ivory/90 underline-offset-4 transition hover:text-coral hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
          >
            Rumbofuturoo@gmail.com
          </a>
        </div>

        {/* NAVEGACIÓN */}
        <nav aria-label="Navegación del pie">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ivory/70">
            Navegación
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.page}>
                <a
                  href={buildHref(item.page)}
                  className="font-sans text-sm font-semibold text-ivory transition hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* REDES SOCIALES E INFORMACIÓN LEGAL */}
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ivory/70">
              Redes sociales
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {SOCIAL_PROFILES.map((profile) => {
                const Icon = SOCIAL_ICONS[profile.id];
                const content = (
                  <>
                    <Icon />
                    <span className="font-sans text-sm">
                      {profile.label}{' '}
                      <span className="text-ivory/75">{profile.handle}</span>
                    </span>
                  </>
                );

                return (
                  <li key={profile.id}>
                    {profile.url ? (
                      <a
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 rounded-lg transition hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                      >
                        {content}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-3 text-ivory/80">
                        {content}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ivory/70">
              Información legal
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {LEGAL_DOCUMENTS.map((document) => (
                <li key={document.id}>
                  <button
                    type="button"
                    onClick={() => setOpenDocument(document)}
                    className="text-left font-sans text-sm text-ivory/90 underline-offset-4 transition hover:text-coral hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                  >
                    {document.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/15">
        <p className="mx-auto w-full max-w-6xl px-5 py-6 text-sm text-ivory/75 sm:px-8">
          © {currentYear} Rumbo Futuro. Todos los derechos reservados.
        </p>
      </div>

      <LegalDialog document={openDocument} onClose={closeDocument} />
    </footer>
  );
}
