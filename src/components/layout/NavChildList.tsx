import { buildHref, type NavChild, type PageId } from '@/data/navigation';

interface NavChildListProps {
  page: PageId;
  items: NavChild[];
  onNavigate?: () => void;
  depth?: number;
}

export function NavChildList({ page, items, onNavigate, depth = 0 }: NavChildListProps) {
  const listClasses =
    depth === 0 ? 'flex flex-col gap-0.5' : 'ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-ink/10 pl-3';

  return (
    <ul className={listClasses}>
      {items.map((child) => (
        <li key={child.anchor}>
          <a
            href={buildHref(page, child.anchor)}
            onClick={onNavigate}
            className="block rounded-xl px-3 py-2 text-sm text-graphite transition hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
          >
            {child.label}
          </a>
          {child.children && (
            <NavChildList page={page} items={child.children} onNavigate={onNavigate} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}
