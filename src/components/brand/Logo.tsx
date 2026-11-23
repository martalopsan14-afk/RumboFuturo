import { Camera, Newspaper } from 'lucide-react';

interface LogoProps {
  variant?: 'full' | 'compact';
  tone?: 'light' | 'dark';
  className?: string;
}

export function Logo({ variant = 'full', tone = 'light', className = '' }: LogoProps) {
  const isDark = tone === 'dark';
  const isCompact = variant === 'compact';
  const wordColor = isDark ? 'text-ivory' : 'text-ink';
  const tileClasses = isDark ? 'bg-ivory' : 'bg-ink';
  const newspaperColor = isDark ? 'text-ink' : 'text-ivory';

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tileClasses}`}>
        <Newspaper aria-hidden="true" className={`h-5 w-5 ${newspaperColor}`} strokeWidth={2} />
        <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-coral ring-2 ring-ivory">
          <Camera aria-hidden="true" className="h-3 w-3 text-ink" strokeWidth={2.5} />
        </span>
      </span>

      <span className="flex flex-col items-start leading-none">
        <span className="relative flex flex-col items-start pt-3">
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-coral"
          >
            <path
              d="M 8 58 L 8 6 L 92 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 86 1 L 93 6 L 86 11"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={`self-end text-[11px] font-semibold tracking-wide ${wordColor}`}>Rumbo</span>
          <span className={`font-sans text-[22px] font-extrabold tracking-tight ${wordColor}`}>Futuro</span>
        </span>
        {!isCompact && (
          <span
            className={`mt-1.5 font-editorial text-[13px] italic ${isDark ? 'text-ivory/85' : 'text-graphite'}`}
          >
            Tu talento, tu puerta al mundo
          </span>
        )}
      </span>
    </span>
  );
}
