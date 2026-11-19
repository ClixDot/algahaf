/**
 * Rewrites Cloudinary delivery URLs so the CDN serves a compressed,
 * browser-appropriate format (WebP/AVIF for images) instead of the raw upload.
 *
 *   .../image/upload/v123/folder/file.png
 *   -> .../image/upload/f_auto,q_auto,c_limit,w_2400/v123/folder/file.png
 *
 * URLs that already carry transformations, and non-Cloudinary URLs, are left untouched.
 */
const CLOUDINARY_UPLOAD_RE =
  /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\/)(v\d+\/.+)$/;

const TRANSFORMS = {
  image: 'f_auto,q_auto,c_limit,w_2400',
  video: 'f_auto,q_auto',
} as const;

export function optimizeMediaUrl(url: string): string {
  const match = CLOUDINARY_UPLOAD_RE.exec(url);
  if (!match) return url;
  const [, base, kind, rest] = match;
  return `${base}${TRANSFORMS[kind as 'image' | 'video']}/${rest}`;
}

/** Deep-walks plain data (CMS sections, products) and optimizes every Cloudinary URL string. */
export function optimizeMediaDeep<T>(value: T): T {
  if (typeof value === 'string') return optimizeMediaUrl(value) as T;
  if (Array.isArray(value)) return value.map((v) => optimizeMediaDeep(v)) as T;
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = optimizeMediaDeep(v);
    return out as T;
  }
  return value;
}
