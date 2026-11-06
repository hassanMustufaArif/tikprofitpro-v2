/**
 * URL guards for anything rendered from API / scraped / imported data.
 *
 * React 18 still renders `javascript:` URLs in href (it only warns), so every
 * data-driven href, window.open target or redirect must pass through safeUrl().
 */

const WEB_PROTOCOLS = new Set(["http:", "https:"]);

/** Returns the URL if it is an absolute http(s) URL, otherwise undefined. */
export function safeUrl(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const value = raw.trim();
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return WEB_PROTOCOLS.has(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/** Like safeUrl but returns "#" so it can be dropped straight into href. */
export function safeHref(raw: unknown): string {
  return safeUrl(raw) ?? "#";
}

/** True when the value is an absolute http(s) URL. */
export function isHttpUrl(raw: unknown): boolean {
  return safeUrl(raw) !== undefined;
}

/**
 * For <img src>: allows http(s), plus data:image/* and blob: (used for local
 * previews of files the user picked themselves). Anything else is dropped.
 */
export function safeImageSrc(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const value = raw.trim();
  if (/^data:image\/[a-z0-9.+-]+[;,]/i.test(value)) return value;
  if (/^blob:/i.test(value)) return value;
  return safeUrl(value);
}
