'use client';

import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme =>
  document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

/** The theme currently shown. Updates when the visitor switches. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, () => 'dark');
}

/** Switch theme and remember the choice. */
export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add('theme-switching');
  root.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private mode etc. — the choice just won't be remembered.
  }
  window.setTimeout(() => root.classList.remove('theme-switching'), 400);
}
