/**
 * Tiny in-process cache for public-site reads (CMS sections, settings, products).
 *
 * Without it, every page navigation waits on a MongoDB round trip before the
 * server can respond. Entries live for TTL_MS and are cleared immediately
 * whenever the admin saves anything (see invalidateLiveCache callers), so
 * edits still show up right away.
 */
const TTL_MS = 60_000;

type Entry = { at: number; value: Promise<unknown> };

const globalStore = globalThis as unknown as { __alghafLiveCache?: Map<string, Entry> };
const store = (globalStore.__alghafLiveCache ??= new Map<string, Entry>());

export function cachedRead<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value as Promise<T>;

  // Cache the promise itself so concurrent requests share one DB query.
  const value = loader().catch((err) => {
    store.delete(key);
    throw err;
  });
  store.set(key, { at: Date.now(), value });
  return value;
}

export function invalidateLiveCache(): void {
  store.clear();
}

/** Wraps a write function so the live cache is cleared once it finishes. */
export function invalidatesLiveCache<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>
): (...args: A) => Promise<R> {
  return async (...args: A) => {
    try {
      return await fn(...args);
    } finally {
      invalidateLiveCache();
    }
  };
}
