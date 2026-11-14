/* Loads the whole product list the API allows for this caller, 100 rows per call. Logic only. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- product rows are untyped across the app
type Row = any;
export const PAGE_SIZE = 100;
const MAX_ROWS = 5000;

const rowsOf = (res: Row): Row[] => (Array.isArray(res) ? res : res?.products ?? []);

/**
 * Page 0 and /stats in parallel, then exactly the remaining pages at once, then one page at a time
 * if the list grew since /stats. Always resolves to an array.
 * 2026-11-14 bug: when the catalogue was an exact multiple of 100 (200 rows today) the old inline
 * version fell out of its last loop without `return`, so paid users got `undefined` (an error or an
 * empty table) instead of 200 products.
 */
export async function fetchAllProducts(
  getPage: (params: Record<string, string>) => Promise<Row>,
  getStats: () => Promise<Row>,
): Promise<Row[]> {
  const page = async (offset: number) => {
    const res = await getPage({ limit: String(PAGE_SIZE), offset: String(offset) });
    return { res, batch: rowsOf(res) };
  };
  const [first, stats] = await Promise.all([page(0), getStats().catch(() => null)]);
  const all: Row[] = [...first.batch];
  if (first.batch.length < PAGE_SIZE || first.res?.plan === "free") return all;
  const total = Number(stats?.stats?.total_products);
  let offset = PAGE_SIZE;
  if (Number.isFinite(total) && total > PAGE_SIZE) {
    const offsets: number[] = [];
    for (let o = PAGE_SIZE; o < Math.min(total, MAX_ROWS); o += PAGE_SIZE) offsets.push(o);
    const pages = await Promise.all(offsets.map(page));
    for (const p of pages) all.push(...p.batch);
    offset = PAGE_SIZE + offsets.length * PAGE_SIZE;
    if (pages.length && pages[pages.length - 1].batch.length < PAGE_SIZE) return all;
  }
  // Total unknown, or the list grew since /stats: continue one page at a time until a short page.
  for (; offset < MAX_ROWS; offset += PAGE_SIZE) {
    const p = await page(offset);
    all.push(...p.batch);
    if (p.batch.length < PAGE_SIZE) break;
  }
  return all;
}

const shopKey = (s: unknown) => (s ?? "").toString().split(/\s+/).filter(Boolean).join(" ").toLowerCase();

/**
 * A shop's footprint in the loaded product list (same matching as the API's /shops/catalogue:
 * shop name, case- and space-insensitive). revenueOf decides which revenue figure is summed so the
 * share uses the same numbers as the table. Null when the shop has no product in the list.
 */
export function shopFootprint(items: Row[], shopName: unknown, revenueOf: (p: Row) => number | null) {
  const key = shopKey(shopName);
  if (!key) return null;
  let count = 0, revenue = 0, total = 0;
  for (const p of items ?? []) {
    const r = Number(revenueOf(p)) || 0;
    total += r;
    if (shopKey(p?.shop_name) === key) { count += 1; revenue += r; }
  }
  if (!count) return null;
  return { count, revenue, sharePct: total > 0 ? (revenue / total) * 100 : null };
}
