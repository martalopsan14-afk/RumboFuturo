import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { PageId } from '@/data/navigation';
import { DesktopNav } from '@/components/layout/DesktopNav';
import { MobileNav } from '@/components/layout/MobileNav';

interface SiteHeaderProps {
  activePage: PageId;
}

export function SiteHeader({ activePage }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeMenu();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#/inicio"
          aria-label="Rumbo Futuro, ir al inicio"
          onClick={closeMenu}
          className="shrink-0 rounded-lg transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
        >
          <img
            src="/Logo_mini.jpeg"
            alt="Rumbo Futuro"
            width="180"
            height="64"
            className="h-12 w-auto max-w-[180px] object-contain sm:h-14"
          />
        </a>

        <DesktopNav activePage={activePage} />

        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
          className={`flex h-11 items-center gap-2 rounded-full border px-4 font-sans text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral lg:hidden ${
            isMenuOpen
              ? 'border-ink bg-ink text-ivory'
              : 'border-ink/15 text-ink hover:border-ink hover:bg-ink/5'
          }`}
        >
          {isMenuOpen ? <X aria-hidden="true" className="h-4 w-4" /> : <Menu aria-hidden="true" className="h-4 w-4" />}
          {isMenuOpen ? 'Cerrar' : 'Menú'}
        </button>
      </div>

      <MobileNav id="mobile-menu" isOpen={isMenuOpen} activePage={activePage} onNavigate={closeMenu} />
    </header>
  );
}
