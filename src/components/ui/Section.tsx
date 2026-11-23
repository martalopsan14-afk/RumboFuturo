import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  tone?: 'ivory' | 'deep' | 'ink';
  className?: string;
  children: ReactNode;
}

const TONE_CLASSES = {
  ivory: 'bg-ivory text-graphite',
  deep: 'bg-ivory-deep/60 text-graphite',
  ink: 'bg-ink text-ivory',
};

export function Section({ id, tone = 'ivory', className = '', children }: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-28 py-16 sm:py-24 ${TONE_CLASSES[tone]} ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}
