import { NAV_ITEMS, buildHref, type PageId } from '@/data/navigation';
import { NavChildList } from '@/components/layout/NavChildList';

interface MobileNavProps {
  id: string;
  isOpen: boolean;
  activePage: PageId;
  onNavigate: () => void;
}

export function MobileNav({ id, isOpen, activePage, onNavigate }: MobileNavProps) {
  return (
    <nav
      id={id}
      aria-label="Menú principal móvil"
      hidden={!isOpen}
      className="absolute right-5 top-full mt-3 max-h-[calc(100vh-7rem)] w-[min(20rem,calc(100vw-2.5rem))] origin-top-right animate-fade-up overflow-y-auto rounded-3xl border border-ink/10 bg-ivory p-4 shadow-xl lg:hidden"
    >
      <ul className="flex flex-col gap-4">
        {NAV_ITEMS.map((item) => (
          <li key={item.page} className="flex flex-col gap-2">
            <a
              href={buildHref(item.page)}
              onClick={onNavigate}
              aria-current={activePage === item.page ? 'page' : undefined}
              className={`rounded-xl px-3 py-2 font-sans text-base font-semibold ${
                activePage === item.page ? 'bg-ink text-ivory' : 'text-ink'
              }`}
            >
              {item.label}
            </a>
            <NavChildList page={item.page} items={item.children} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
