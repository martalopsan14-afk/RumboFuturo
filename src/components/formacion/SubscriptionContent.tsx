import { InterestForm } from '@/components/forms/InterestForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SUBSCRIPTION_COPY } from '@/data/courses';

export function SubscriptionContent() {
  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
      <div className="flex flex-col gap-8">
        <SectionHeader title={SUBSCRIPTION_COPY.title} description={SUBSCRIPTION_COPY.description} />
        <article className="relative flex flex-col gap-5 overflow-hidden rounded-[2rem] border border-dashed border-ink/30 bg-ivory-deep/60 p-8">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-sans text-xl text-ink">{SUBSCRIPTION_COPY.planTitle}</h3>
            <span className="shrink-0 rounded-full bg-coral-soft px-3 py-1 font-sans text-xs font-semibold text-ink">
              {SUBSCRIPTION_COPY.planBadge}
            </span>
          </div>
          <p className="leading-relaxed">{SUBSCRIPTION_COPY.access}</p>
          <p className="leading-relaxed">{SUBSCRIPTION_COPY.pricing}</p>
        </article>
      </div>

      <article className="rounded-[2rem] border border-ink/10 bg-ivory p-8 shadow-xl sm:p-10">
        <InterestForm
          interestType="subscription_news"
          label={SUBSCRIPTION_COPY.formLabel}
          submitLabel={SUBSCRIPTION_COPY.ctaLabel}
          successMessage="Gracias. Te enviaremos la información cuando esté disponible."
        />
      </article>
    </div>
  );
}
