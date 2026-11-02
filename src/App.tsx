import { useEffect, type ComponentType } from 'react';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { HomePage } from '@/pages/HomePage';
import { RumboPage } from '@/pages/RumboPage';
import { TrabajoPage } from '@/pages/TrabajoPage';
import { FormacionPage } from '@/pages/FormacionPage';
import { ColaboradoresPage } from '@/pages/ColaboradoresPage';
import { SaberMasPage } from '@/pages/SaberMasPage';
import { useHashRoute } from '@/hooks/useHashRoute';
import type { PageId } from '@/data/navigation';

const PAGE_COMPONENTS: Record<PageId, ComponentType> = {
  inicio: HomePage,
  'nuestro-rumbo': RumboPage,
  'nuestro-trabajo': TrabajoPage,
  'formacion-dual': FormacionPage,
  colaboradores: ColaboradoresPage,
  'saber-mas': SaberMasPage,
};

export default function App() {
  const route = useHashRoute();
  const PageComponent = PAGE_COMPONENTS[route.page];

  useEffect(() => {
    if (!route.anchor) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    const target = document.getElementById(route.anchor);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [route.page, route.anchor]);

  return (
    <div className="flex min-h-screen flex-col bg-ivory font-body text-graphite">
      <SiteHeader activePage={route.page} />
      <main className="flex-1">
        <PageComponent />
      </main>
      <SiteFooter />
    </div>
  );
}
