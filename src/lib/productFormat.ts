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

/* ─────────────── life-cycle stages ─────────────── */

/**
 * Stage keys the UI shows. The DB still has the v1 check constraint, so import_kalodata.py
 * writes v1 names (emerging→hot, peaking→watch, saturated→pass, unknown→watch). Read those
 * back as the v2 stage they came from. "watch" stays its own key: it is either peaking or
 * unknown and the importer can't tell them apart once written.
 */
export type StageKey = "emerging" | "rising" | "peaking" | "watch" | "saturated" | "stable" | "unknown";
export const STAGE_ORDER: StageKey[] = ["emerging", "rising", "peaking", "watch", "saturated", "stable", "unknown"];

const STAGE_ALIASES: Record<string, StageKey> = {
  emerging: "emerging", hot: "emerging",
  rising: "rising",
  peaking: "peaking",
  watch: "watch",
  saturated: "saturated", pass: "saturated",
  stable: "stable",
  unknown: "unknown",
};

export function normalizeStage(phase: unknown): StageKey {
  const k = (phase ?? "").toString().trim().toLowerCase();
  return STAGE_ALIASES[k] ?? "unknown";
}

/** Stages present in these rows, in life-cycle order (for filter chips that match the data). */
export function stagesPresent(rows: Row[]): StageKey[] {
  const seen = new Set((rows ?? []).map((r) => normalizeStage(r?.trend_phase)));
  return STAGE_ORDER.filter((s) => seen.has(s));
}

/* ─────────────── sales window ─────────────── */

const posInt = (v: unknown): number | null => {
  const n = Number(v);
  return v != null && Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};

/** The sales window (in days) every row shares, or null when rows differ or don't say. */
export function commonWindowDays(rows: Row[]): number | null {
  let w: number | null = null;
  for (const r of rows ?? []) {
    const d = posInt(r?.window_days);
    if (d == null) return null;
    if (w == null) w = d;
    else if (w !== d) return null;
  }
  return w;
}

/** "1 day" / "7 days". */
export const windowText = (days: number) => `${days} ${days === 1 ? "day" : "days"}`;

/**
 * Revenue for `days` days. Uses the real window figure when the row's window is exactly `days`,
 * otherwise scales the stored 7-day figure. Null when there is no figure.
 */
export function revenueFor(p: Row, days: number): number | null {
  if (posInt(p?.window_days) === days && Number(p?.revenue_window) > 0) return Number(p.revenue_window);
  const g = Number(p?.gmv_7d);
  return Number.isFinite(g) && g > 0 ? (g / 7) * days : null;
}

export function unitsFor(p: Row, days: number): number | null {
  if (posInt(p?.window_days) === days && Number(p?.units_window) > 0) return Number(p.units_window);
  const u = Number(p?.units_sold_7d);
  return Number.isFinite(u) && u > 0 ? (u / 7) * days : null;
}
