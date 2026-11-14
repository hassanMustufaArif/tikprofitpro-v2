import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchAllProducts, shopFootprint } from "@/lib/productPaging";

const rows = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `p${i}` }));
const pager = (all: any[], plan = "pro") => vi.fn(async (p: Record<string, string>) => {
  const off = Number(p.offset);
  return { plan, products: all.slice(off, off + Number(p.limit)) };
});

describe("fetchAllProducts", () => {
  it.each([0, 1, 99, 100, 101, 200, 250, 300])("returns all %i rows (never undefined)", async (n) => {
    const all = rows(n);
    const out = await fetchAllProducts(pager(all), async () => ({ stats: { total_products: n } }));
    expect(out).toHaveLength(n);
  });

  it("keeps going when /stats is stale or fails", async () => {
    const all = rows(230);
    expect(await fetchAllProducts(pager(all), async () => ({ stats: { total_products: 120 } }))).toHaveLength(230);
    expect(await fetchAllProducts(pager(all), async () => { throw new Error("down"); })).toHaveLength(230);
  });

  it("stops after page 0 for the free plan", async () => {
    const get = pager(rows(100), "free");
    expect(await fetchAllProducts(get, async () => ({ stats: { total_products: 200 } }))).toHaveLength(100);
    expect(get).toHaveBeenCalledTimes(1);
  });
});

describe("shopFootprint", () => {
  const items = [
    { shop_name: "Medicube  US Store", revenue_window: 300 },
    { shop_name: "medicube us store", revenue_window: 100 },
    { shop_name: "Other", revenue_window: 600 },
    { shop_name: null, revenue_window: 1000 },
  ];
  const rev = (p: any) => Number(p.revenue_window) || null;
  it("counts a shop's products and revenue share, name-insensitive", () => {
    expect(shopFootprint(items, "MEDICUBE US STORE", rev)).toEqual({ count: 2, revenue: 400, sharePct: 20 });
    expect(shopFootprint(items, "Nobody", rev)).toBeNull();
    expect(shopFootprint(items, "", rev)).toBeNull();
  });
});

// usePlan's loader: /me first (admins = ultimate), Supabase users.plan as the fallback.
const getMe = vi.fn();
const maybeSingle = vi.fn();
vi.mock("@/lib/api", () => ({ api: { getMe: () => getMe() } }));
vi.mock("@/lib/supabase", () => ({
  supabase: { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: () => maybeSingle() }) }) }) },
}));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ user: null, loading: false }) }));

describe("loadPlan", () => {
  beforeEach(() => { getMe.mockReset(); maybeSingle.mockReset(); });

  it("uses the API's effective plan: admin with a free billing plan is ultimate", async () => {
    const { loadPlan } = await import("@/hooks/usePlan");
    getMe.mockResolvedValue({ plan: "ultimate", billing_plan: "free", admin: true });
    expect(await loadPlan("boss@x.com")).toEqual({ plan: "ultimate", billingPlan: "free", admin: true });
    expect(maybeSingle).not.toHaveBeenCalled();
  });

  it("falls back to users.plan when /me is missing (old API)", async () => {
    const { loadPlan } = await import("@/hooks/usePlan");
    getMe.mockRejectedValue(new Error("404"));
    maybeSingle.mockResolvedValue({ data: { plan: " Pro " } });
    expect(await loadPlan("a@b.c")).toEqual({ plan: "pro", billingPlan: "pro", admin: false });
  });
});
