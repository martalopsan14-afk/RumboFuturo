import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CollaboratorCards } from '@/components/colaboradores/CollaboratorCards';
import { ACADEMIC_PARTNERS, MEDIA_PARTNERS } from '@/data/collaborators';

export function ColaboradoresPage() {
  return (
    <>
      <PageHeader
        eyebrow="Rumbo Futuro"
        title="Colaboradores"
        description="Medios de comunicación y entidades académicas relacionadas con la propuesta de Rumbo Futuro."
      />
      <Section id="medios-locales">
        <div className="flex flex-col gap-12">
          <SectionHeader
            eyebrow="Medios locales implicados"
            title="Los medios que acercan el talento a la realidad"
          />
          <CollaboratorCards items={MEDIA_PARTNERS} />
        </div>
      </Section>
      <Section id="respaldo-academico" tone="deep">
        <div className="flex flex-col gap-12">
          <SectionHeader
            eyebrow="Respaldo académico"
            title="Investigación y conocimiento al servicio del periodismo"
          />
          <CollaboratorCards items={ACADEMIC_PARTNERS} />
        </div>
      </Section>
    </>
  );
}
