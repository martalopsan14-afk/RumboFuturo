import { useEffect, useState } from 'react';
import { PAGE_IDS, type PageId } from '@/data/navigation';

export interface HashRoute {
  page: PageId;
  anchor: string | null;
}

function parseHash(hash: string): HashRoute {
  const [pageSegment = '', anchor = ''] = hash.replace(/^#\/?/, '').split('/');
  const page = (PAGE_IDS as readonly string[]).includes(pageSegment) ? (pageSegment as PageId) : 'inicio';
  return { page, anchor: anchor || null };
}

export function useHashRoute(): HashRoute {
  const [route, setRoute] = useState<HashRoute>(() => parseHash(window.location.hash));

  useEffect(() => {
    const handleChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);

  return route;
}
