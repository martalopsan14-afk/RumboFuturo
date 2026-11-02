import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { ArticlesGallery } from '@/components/trabajo/ArticlesGallery';
import { PortfolioCallout } from '@/components/trabajo/PortfolioCallout';

export function TrabajoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Rumbo Futuro"
        title="Nuestro Trabajo"
        description="Artículos realizados por periodistas emergentes con el acompañamiento de investigadores y profesionales."
      />
      <Section id="articulos-realizados">
        <ArticlesGallery />
      </Section>
      <Section tone="deep">
        <PortfolioCallout />
      </Section>
    </>
  );
}
