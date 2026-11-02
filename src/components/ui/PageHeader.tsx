import { ArrowUpRight } from 'lucide-react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-ivory">
      <ArrowUpRight
        aria-hidden="true"
        strokeWidth={1.25}
        className="pointer-events-none absolute -right-16 -top-12 h-56 w-56 text-coral/15 sm:-right-10 sm:-top-10 sm:h-96 sm:w-96"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24 animate-fade-up">
        <p className="flex items-center gap-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ivory">
          <span aria-hidden="true" className="h-0.5 w-8 bg-coral" />
          {eyebrow}
        </p>
        <h1 className="max-w-3xl font-sans text-4xl leading-[1.15] text-ivory sm:text-5xl">{title}</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-ivory/85">{description}</p>
      </div>
    </section>
  );
}
