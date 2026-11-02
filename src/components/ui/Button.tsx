import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  children: ReactNode;
}

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-sm font-semibold tracking-wide transition duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-coral text-ink shadow-sm hover:bg-ink hover:text-ivory',
  secondary: 'bg-ink text-ivory hover:bg-ink-soft',
  outline: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink/5',
};

export function Button({ variant = 'primary', href, className = '', children, type = 'button', ...rest }: ButtonProps) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
