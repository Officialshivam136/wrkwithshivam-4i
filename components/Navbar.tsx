'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/data/site';
import { cn } from '@/lib/utils';
import { BookingModal } from '@/components/BookingModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
    );

    siteConfig.navItems.forEach((item) => {
      const id = item.href.substring(1);
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('#')) {
      const id = href.substring(1);
      if (id === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setIsMobileMenuOpen(false);
      window.history.pushState(null, '', href);
    }
  };

  return (
    <>
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled
          ? 'bg-bg-primary/90 backdrop-blur-xl border-b border-border shadow-lg shadow-black/5'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        <div
          className={cn(
            'flex items-center justify-between transition-all duration-300',
            isScrolled ? 'h-16' : 'h-20'
          )}
        >
          {/* Logo */}
          <Link
            href="#top"
            onClick={(e) => handleSmoothScroll(e, '#top')}
            className="font-heading font-bold text-lg tracking-tight text-text-primary z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm flex items-center gap-2 py-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            {siteConfig.logo}
          </Link>

          {/* Desktop Nav — right-aligned with CTA */}
          <div className="hidden md:flex items-center gap-1">
            <nav className="flex items-center">
              {siteConfig.navItems.map((item) => {
                const id = item.href.substring(1);
                const isActive = activeSection === id;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className={cn(
                      'relative px-4 py-2 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md',
                      isActive ? 'text-text-primary' : 'text-text-secondary'
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-md bg-bg-elevated/50"
                        style={{ zIndex: -1 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="w-px h-6 bg-border-light mx-4" />

            <ThemeToggle className="mr-3" />

            <button
              onClick={() => setIsBookingOpen(true)}
              className="inline-flex h-9 items-center gap-2 justify-center rounded-md bg-accent px-5 text-[13px] font-semibold uppercase tracking-[0.05em] text-accent-fg transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Book a Call
            </button>
          </div>

          {/* Mobile: theme switch + menu button */}
          <div className="md:hidden z-50 flex items-center gap-1">
          <ThemeToggle className="h-9 w-9" />
          <button
            className="z-50 flex flex-col justify-center items-center w-10 h-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <motion.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: -4 }}
              className="w-5 h-0.5 bg-text-primary block"
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-0.5 bg-text-primary block my-1.5"
            />
            <motion.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 4 }}
              className="w-5 h-0.5 bg-text-primary block"
            />
          </button>
          </div>
        </div>
      </div>

    </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-bg-primary/98 backdrop-blur-xl flex flex-col items-center justify-center overflow-y-auto py-24"
          >
            <nav className="flex flex-col items-center gap-6">
              {siteConfig.navItems.map((item, i) => {
                const id = item.href.substring(1);
                const isActive = activeSection === id;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleSmoothScroll(e, item.href)}
                      className={cn(
                        'text-2xl font-heading font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm px-2 py-1',
                        isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: siteConfig.navItems.length * 0.08, duration: 0.3 }}
                className="mt-6"
              >
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setIsBookingOpen(true); }}
                  className="inline-flex h-12 items-center gap-2 justify-center rounded-md bg-accent px-8 text-base font-semibold uppercase tracking-wider text-accent-fg transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  Book a Call
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
