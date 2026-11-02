import { useId, useState } from 'react';

interface ExpandableTextProps {
  text: string;
  collapsedLabel?: string;
  expandedLabel?: string;
  className?: string;
}

export function ExpandableText({
  text,
  collapsedLabel = 'Leer más',
  expandedLabel = 'Leer menos',
  className = '',
}: ExpandableTextProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-2 rounded-full font-sans text-sm font-semibold text-ink underline decoration-coral decoration-2 underline-offset-4 transition hover:text-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
      >
        {isOpen ? expandedLabel : collapsedLabel}
      </button>
      <div
        id={contentId}
        hidden={!isOpen}
        className="mt-3 border-l-2 border-coral pl-4 text-base leading-relaxed text-graphite animate-fade-up"
      >
        {text}
      </div>
    </div>
  );
}
