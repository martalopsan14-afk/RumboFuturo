import { useEffect, useState } from 'react';
import { PAGE_IDS, type PageId } from '@/data/navigation';

export type AppRoute = { type: 'page'; page: PageId; anchor: string | null } | { type: 'admin' };

function parseHash(hash: string): AppRoute {
  const [pageSegment = '', anchor = ''] = hash.replace(/^#\/?/, '').split('/');

  if (pageSegment === 'admin') {
    return { type: 'admin' };
  }

  const page = (PAGE_IDS as readonly string[]).includes(pageSegment) ? (pageSegment as PageId) : 'inicio';
  return { type: 'page', page, anchor: anchor || null };
}

export function useHashRoute(): AppRoute {
  const [route, setRoute] = useState<AppRoute>(() => parseHash(window.location.hash));

  useEffect(() => {
    const handleChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);

  return route;
}
