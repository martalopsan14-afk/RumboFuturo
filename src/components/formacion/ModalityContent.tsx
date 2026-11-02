import { useId, useState } from 'react';
import { Check } from 'lucide-react';
import { InterestForm } from '@/components/forms/InterestForm';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { ModalityData } from '@/data/courses';

export function ModalityContent({ data }: { data: ModalityData }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formId = useId();

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
      <div className="flex flex-col gap-8">
        <SectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} />
        <ul className="grid gap-3">
          {data.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3 leading-relaxed">
              <Check aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-coral" strokeWidth={2.5} />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <article className="flex flex-col gap-6 rounded-[2rem] border border-ink/10 bg-ivory p-8 shadow-sm sm:p-10">
        <div className="flex flex-col gap-3">
          <h3 className="font-sans text-xl text-ink">{data.statusTitle}</h3>
          <p className="leading-relaxed">{data.statusText}</p>
        </div>
        <div>
          <Button
            variant="secondary"
            aria-expanded={isFormOpen}
            aria-controls={formId}
            onClick={() => setIsFormOpen((open) => !open)}
          >
            {data.ctaLabel}
          </Button>
        </div>
        <div id={formId} hidden={!isFormOpen} className="border-t border-ink/10 pt-6 animate-fade-up">
          <InterestForm
            interestType={data.interestType}
            label={data.formLabel}
            submitLabel="Registrar mi interés"
            successMessage="Gracias. Te avisaremos cuando haya novedades."
          />
        </div>
      </article>
    </div>
  );
}
