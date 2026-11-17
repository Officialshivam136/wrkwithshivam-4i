import fs from 'fs/promises';
import path from 'path';

/** Escape text before putting it inside HTML (emails). */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Read a field the client sent. Returns undefined when it is missing, not a
 * string, or too long. Control characters are removed; line breaks are kept
 * only when `multiline` is set (e.g. the message body).
 */
export function cleanText(value: unknown, max: number, multiline = false): string | undefined {
  if (typeof value !== 'string') return undefined;
  // eslint-disable-next-line no-control-regex
  const pattern = multiline ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  const text = value.replace(pattern, '').trim();
  if (text.length > max) return undefined;
  return text;
}

const EMAIL_PATTERN = /^[^\s@"'<>]+@[^\s@"'<>]+\.[^\s@"'<>]+$/;

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}

/** Best-effort client address for rate limiting. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

/** Read a JSON body, refusing anything larger than `maxBytes`. Returns null if invalid. */
export async function readJsonBody(request: Request, maxBytes = 20_000): Promise<Record<string, unknown> | null> {
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > maxBytes) return null;
  try {
    const text = await request.text();
    if (text.length > maxBytes) return null;
    const data = JSON.parse(text);
    return data && typeof data === 'object' && !Array.isArray(data) ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Simple in-memory limiter. Resets on restart; fine for a portfolio site. */
export function createRateLimiter({ windowMs, max }: { windowMs: number; max: number }) {
  const hits = new Map<string, { count: number; resetTime: number }>();
  return (key: string): boolean => {
    const now = Date.now();
    // Drop expired entries so the map cannot grow forever.
    if (hits.size > 500) {
      hits.forEach((record, k) => {
        if (now > record.resetTime) hits.delete(k);
      });
    }
    const record = hits.get(key);
    if (!record || now > record.resetTime) {
      hits.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    if (record.count >= max) return false;
    record.count++;
    return true;
  };
}

const MAX_FILE_BYTES = 2_000_000;
let writeQueue: Promise<unknown> = Promise.resolve();

async function readList(file: string): Promise<unknown[] | null> {
  try {
    const existing = await fs.readFile(path.join(process.cwd(), 'submissions', file), 'utf-8');
    if (existing.length > MAX_FILE_BYTES) return null;
    const parsed = JSON.parse(existing);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    // A missing file just means nothing has been saved yet.
    return (err as NodeJS.ErrnoException)?.code === 'ENOENT' ? [] : null;
  }
}

/** Everything saved in submissions/<file>, or [] if there is nothing (or it cannot be read). */
export async function readSubmissions<T = Record<string, unknown>>(file: string): Promise<T[]> {
  return ((await readList(file)) ?? []) as T[];
}

export type SaveResult = 'saved' | 'rejected' | 'failed';

/**
 * Append an entry to submissions/<file>. Writes run one at a time so two
 * requests cannot overwrite each other, and `reject` is checked inside that
 * queue, so two people cannot both take the same slot.
 *   'saved'    – written
 *   'rejected' – `reject` said no (e.g. slot already taken)
 *   'failed'   – the file cannot be written (read-only hosting, disk full, too large)
 */
export function appendToSubmissions(
  file: string,
  entry: Record<string, unknown>,
  reject?: (existing: Record<string, unknown>[]) => boolean
): Promise<SaveResult> {
  const job = writeQueue.then(async (): Promise<SaveResult> => {
    try {
      const list = await readList(file);
      if (list === null) return 'failed';
      if (reject && reject(list as Record<string, unknown>[])) return 'rejected';
      list.push(entry);
      const dir = path.join(process.cwd(), 'submissions');
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, file), JSON.stringify(list, null, 2));
      return 'saved';
    } catch (err) {
      console.error(`Could not save to ${file}:`, err instanceof Error ? err.message : err);
      return 'failed';
    }
  });
  writeQueue = job.catch(() => undefined);
  return job;
}
