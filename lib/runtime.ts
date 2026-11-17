// How the site is being served. The GitHub Pages build is a static export:
// there is no server, so API routes do not exist and files live under a sub-path.

/** True for the GitHub Pages build (set in next.config.mjs). */
export const IS_STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';

/** e.g. "/wrkwithshivam-4i" on GitHub Pages, "" everywhere else. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Optional form-handling service for the static build (Formspree-style URL that
 * accepts a JSON POST and emails the owner). Without it, forms open the visitor's
 * email app instead.
 */
export const FORMS_ENDPOINT = process.env.NEXT_PUBLIC_FORMS_ENDPOINT || '';

/** Prefix a public-folder path (like "/shivam-singh.jpg") with the base path. */
export const withBase = (path: string): string => (path.startsWith('/') ? `${BASE_PATH}${path}` : path);
