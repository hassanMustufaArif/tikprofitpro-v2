import { describe, it, expect, vi, afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { render, cleanup, allByText, buttonsNamed, waitFor } from "./miniRender";

// FastMoss-style rows: 1-day window, v1 stage names as stored in the DB.
const PHASES = ["hot", "rising", "watch", "pass"];
const make = (n: number) => Array.from({ length: n }, (_, i) => ({
  id: `id${i}`, product_name: `Test product ${i}`, category: "Beauty", tiktok_price: 95,
  window_days: 1, data_end_date: "2026-11-10", revenue_window: 222490, gmv_7d: 1557430,
  units_window: 2342, units_sold_7d: 16394, growth_source: "fastmoss", gmv_growth_pct: 12,
  trend_phase: PHASES[i % 4], virality_score: 70 - (i % 40), launch_date: "2024-11-13", thumbnail_url: "",
}));
let products = make(250);

vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ user: { id: "u1", email: "a@b.c" }, loading: false }) }));
vi.mock("@/hooks/usePlan", () => ({ usePlan: () => ({ plan: "pro", isFree: false, isPaid: true, isLoading: false, label: "Pro" }) }));
const getProducts = vi.fn(async (p?: Record<string, string>) => {
  const off = Number(p?.offset ?? 0);
  return { plan: "pro", products: products.slice(off, off + 100) };
});
vi.mock("@/lib/api", async (orig) => {
  const real: any = await orig();
  return { ...real, api: {
    getProducts: (p: any) => getProducts(p),
    getStats: async () => ({ stats: { total_products: products.length } }),
    getCredits: async () => ({}),
    getShops: async () => { throw new real.ApiError("Too many requests, try again in a minute.", { status: 429, kind: "rate_limit" }); },
    getCreators: async () => ({ creators: [] }),
  } };
});

import Products from "@/pages/Products";

const mount = () => render(<QueryClientProvider client={new QueryClient()}><MemoryRouter><Products /></MemoryRouter></QueryClientProvider>);

afterEach(() => { cleanup(); getProducts.mockClear(); });

describe("Products page", () => {
  it("labels 1-day data honestly, offers the stored stages, fetches only needed pages", async () => {
    products = make(250);
    mount();
    await waitFor(() => expect(allByText("Revenue 1d").length).toBeGreaterThan(0));
    expect(allByText("Units 1d").length).toBeGreaterThan(0);
    expect(allByText("Revenue 7d").length).toBe(0);
    // stage chips come from the data: hot→Emerging, pass→Saturated
    for (const l of ["Emerging", "Rising", "Watch", "Saturated"]) expect(buttonsNamed(l).length).toBeGreaterThan(0);
    expect(buttonsNamed("Peaking").length).toBe(0);
    expect(allByText("$222.5K").length).toBeGreaterThan(0);   // real 1-day revenue, not $1.56M (x7)
    expect(getProducts).toHaveBeenCalledTimes(3);              // 250 rows -> offsets 0,100,200
  });

  it("shows all products when the catalogue is an exact multiple of 100 (200 today)", async () => {
    products = make(200);
    mount();
    await waitFor(() => expect(allByText("Revenue 1d").length).toBeGreaterThan(0));
    // The tab label carries the loaded count; before the fix the list was undefined -> 0.
    await waitFor(() => expect(document.body.textContent).toContain("200"));
    expect(getProducts).toHaveBeenCalledTimes(3);              // 0, 100, then 200 (empty) ends it
  });
});
