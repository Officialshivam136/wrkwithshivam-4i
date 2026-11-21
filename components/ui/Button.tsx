import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaLabel?: string;
}

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'default',
  className,
  type = 'button',
  disabled = false,
  ariaLabel,
}: ButtonProps) {
  const baseStyles = cn(
    'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:opacity-50 disabled:pointer-events-none',
    variant === 'primary' &&
      'bg-accent text-accent-fg hover:bg-accent-hover shadow-lg shadow-black/20',
    variant === 'secondary' &&
      'border border-border-light text-text-primary hover:border-accent hover:text-accent',
    size === 'default' && 'px-6 py-3 text-sm',
    size === 'lg' && 'px-8 py-4 text-base',
    className
  );

  if (href) {
    const isExternal = href.startsWith('http');
    if (isExternal) {
      return (
        <a href={href} className={baseStyles} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={baseStyles} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseStyles} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
