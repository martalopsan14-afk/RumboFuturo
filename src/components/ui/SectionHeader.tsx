interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
}

export function SectionHeader({ eyebrow, title, description, tone = 'light', align = 'left' }: SectionHeaderProps) {
  const isDark = tone === 'dark';
  const alignment = align === 'center' ? 'mx-auto text-center items-center' : 'items-start';

  return (
    <header className={`flex max-w-3xl flex-col gap-4 ${alignment}`}>
      {eyebrow && (
        <p className="flex items-center gap-3 font-sans text-xs font-semibold uppercase tracking-[0.2em]">
          <span aria-hidden="true" className="h-0.5 w-8 bg-coral" />
          <span className={isDark ? 'text-ivory' : 'text-ink'}>{eyebrow}</span>
        </p>
      )}
      <h2 className={`font-sans text-3xl sm:text-4xl ${isDark ? 'text-ivory' : 'text-ink'}`}>{title}</h2>
      {description && (
        <p className={`text-lg leading-relaxed ${isDark ? 'text-ivory/85' : 'text-graphite'}`}>{description}</p>
      )}
    </header>
  );
}
