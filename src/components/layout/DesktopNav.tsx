import { ChevronDown } from 'lucide-react';
import { NAV_ITEMS, buildHref, type PageId } from '@/data/navigation';
import { NavChildList } from '@/components/layout/NavChildList';

interface DesktopNavProps {
  activePage: PageId;
}

export function DesktopNav({ activePage }: DesktopNavProps) {
  return (
    <nav aria-label="Menú principal" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.page;
          return (
            <li key={item.page} className="group relative">
              <a
                href={buildHref(item.page)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-sans text-sm font-semibold transition hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral ${
                  isActive ? 'text-ink after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:bg-coral' : 'text-ink/80 hover:text-ink'
                }`}
              >
                {item.label}
                <ChevronDown aria-hidden="true" className="h-4 w-4 transition duration-200 group-hover:rotate-180" />
              </a>
              <div className="invisible absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div className="rounded-2xl border border-ink/10 bg-ivory p-2 shadow-xl">
                  <NavChildList page={item.page} items={item.children} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
