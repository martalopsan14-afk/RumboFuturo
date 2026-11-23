import { useEffect, type ComponentType } from 'react';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { HomePage } from '@/pages/HomePage';
import { LandingPage } from '@/pages/LandingPage';
import { RumboPage } from '@/pages/RumboPage';
import { TrabajoPage } from '@/pages/TrabajoPage';
import { FormacionPage } from '@/pages/FormacionPage';
import { ColaboradoresPage } from '@/pages/ColaboradoresPage';
import { SaberMasPage } from '@/pages/SaberMasPage';
import { RumboChatPage } from '@/pages/RumboChatPage';
import { AdminPage } from '@/pages/AdminPage';
import { QrLandingPage } from '@/pages/QrLandingPage';
import { useHashRoute } from '@/hooks/useHashRoute';
import type { PageId } from '@/data/navigation';

const PAGE_COMPONENTS: Record<PageId, ComponentType> = {
  inicio: HomePage,
  'nuestro-rumbo': RumboPage,
  'nuestro-trabajo': TrabajoPage,
  'formacion-dual': FormacionPage,
  colaboradores: ColaboradoresPage,
  'saber-mas': SaberMasPage,
  rumbochat: RumboChatPage,
};

export default function App() {
  const route = useHashRoute();

  useEffect(() => {
    if (route.type !== 'page') return;
    if (!route.anchor) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    document.getElementById(route.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [route]);

  if (route.type === 'landing') return <LandingPage />;
  if (route.type === 'admin') return <AdminPage />;
  if (route.type === 'qr') return <QrLandingPage />;

  const PageComponent = PAGE_COMPONENTS[route.page];
  return (
    <div className="flex min-h-screen flex-col bg-ivory font-body text-graphite">
      <SiteHeader activePage={route.page} />
      <main className="flex-1"><PageComponent /></main>
      <SiteFooter />
    </div>
  );
}
