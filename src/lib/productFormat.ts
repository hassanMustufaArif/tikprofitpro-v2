/* Shared product/supplier display helpers (Products page, Dashboard). Display only. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- product rows are untyped across the app
type Row = any;

const num = (v: unknown): number => Number(v);

/** Average selling price implied by the sales data, when it is usable. */
const impliedAvg = (p: Row): number | null => {
  const gmv = num(p?.gmv_7d), units = num(p?.units_sold_7d);
  return gmv > 0 && units > 0 ? gmv / units : null;
};

const plausible = (price: number, avg: number | null) =>
  Number.isFinite(price) && price > 0 && price < 1000 && (avg == null || (price <= avg * 3 && price >= avg / 3));

/**
 * The product's US price in dollars, or null when it can't be trusted.
 * Some import rows store the price in cents (e.g. 7600 for a $76.00 item, or a
 * 1999 for $19.99); if price/100 agrees with the sales data we use that. A
 * price that matches neither is shown as "—" instead of a wrong number.
 */
export function displayPrice(p: Row): number | null {
  const price = num(p?.tiktok_price);
  const avg = impliedAvg(p);
  if (plausible(price, avg)) return price;
  if (Number.isFinite(price) && price >= 100 && avg != null && plausible(price / 100, avg)) return price / 100;
  return null;
}

export const formatPrice = (p: Row): string => {
  const v = displayPrice(p);
  return v == null ? "—" : `$${v.toFixed(2)}`;
};

/**
 * Revenue/units "7d" figures are extrapolated when the import window is shorter than
 * 7 days (FastMoss exports are 1-day windows scaled to 7).
 */
export function isEstimated7d(p: Row): boolean {
  if ((p?.growth_source ?? "").toString().toLowerCase() === "fastmoss") return true;
  const w = num(p?.window_days);
  return p?.window_days != null && Number.isFinite(w) && w > 0 && w < 7;
}

/** Latest data_end_date across rows, formatted like "Nov 10, 2026". Date-only strings are read as calendar dates (no timezone shift). */
export function latestDataDate(rows: Row[]): string | null {
  let best: string | null = null;
  for (const r of rows ?? []) {
    const d = typeof r?.data_end_date === "string" ? r.data_end_date.slice(0, 10) : null;
    if (d && /^\d{4}-\d{2}-\d{2}$/.test(d) && (!best || d > best)) best = d;
  }
  if (!best) return null;
  const [y, m, day] = best.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Removes duplicate supplier rows, keeping the first (server order is the ranking). */
export function dedupeSuppliers(rows: Row[]): Row[] {
  const seen = new Set<string>();
  return (rows ?? []).filter((s) => {
    const id = s?.external_product_id != null && String(s.external_product_id).trim() !== "" ? `id:${s.external_product_id}` : null;
    const url = typeof s?.supplier_url === "string" && s.supplier_url.trim() ? `url:${s.supplier_url.trim().toLowerCase().replace(/[?#].*$/, "").replace(/\/+$/, "")}` : null;
    // Name + price only when the row has neither an id nor a link.
    const name = id || url ? null : `np:${(s?.supplier_name ?? s?.name ?? "").toString().trim().toLowerCase()}|${Number(s?.unit_cost_min).toFixed(2)}`;
    const keys = [id, url, name].filter(Boolean) as string[];
    if (keys.some((k) => seen.has(k))) return false;
    keys.forEach((k) => seen.add(k));
    return true;
  });
}

/** Server order unless the server sent match scores; then best match first, cheaper first on ties. */
export function rankSuppliers(rows: Row[]): Row[] {
  const list = rows ?? [];
  const scored = list.some((r) => r?.similarity != null);
  const ordered = scored
    ? [...list].sort((a, b) => (num(b.similarity) || 0) - (num(a.similarity) || 0) || (num(a.unit_cost_min) || 0) - (num(b.unit_cost_min) || 0))
    : [...list];
  return dedupeSuppliers(ordered);
}
