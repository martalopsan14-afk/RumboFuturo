import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { PurposeBlocks } from '@/components/rumbo/PurposeBlocks';
import { DifferentiatorsGrid } from '@/components/rumbo/DifferentiatorsGrid';
import { TeamGrid } from '@/components/rumbo/TeamGrid';

export function RumboPage() {
  return (
    <>
      <PageHeader
        eyebrow="Rumbo Futuro"
        title="Nuestro Rumbo"
        description="El propósito de la empresa, el problema que queremos resolver y las personas que hacen posible el proyecto."
      />
      <Section id="nuestro-equipo" tone="deep">
        <TeamGrid />
      </Section>
      <Section id="nuestra-esencia">
        <div className="flex flex-col gap-16 sm:gap-24">
          <PurposeBlocks />
          <DifferentiatorsGrid />
        </div>
      </Section>
    </>
  );
}
