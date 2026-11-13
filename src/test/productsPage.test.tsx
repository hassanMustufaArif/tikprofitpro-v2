import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
// 250 FastMoss-style rows: 1-day window, v1 stage names as stored in the DB.
const PHASES = ["hot", "rising", "watch", "pass"];
const products = Array.from({ length: 250 }, (_, i) => ({
  id: `id${i}`, product_name: `Test product ${i}`, category: "Beauty", tiktok_price: 95,
  window_days: 1, data_end_date: "2026-11-10", revenue_window: 222490, gmv_7d: 1557430,
  units_window: 2342, units_sold_7d: 16394, growth_source: "fastmoss", gmv_growth_pct: 12,
  trend_phase: PHASES[i % 4], virality_score: 70 - (i % 40), launch_date: "2024-11-13", thumbnail_url: "",
}));

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

describe("Products page", () => {
  it("labels 1-day data honestly, offers the stored stages, fetches only needed pages", async () => {
    render(<QueryClientProvider client={new QueryClient()}><MemoryRouter><Products /></MemoryRouter></QueryClientProvider>);
    await waitFor(() => expect(screen.getByText("Revenue 1d")).toBeInTheDocument());
    expect(screen.getByText("Units 1d")).toBeInTheDocument();
    expect(screen.queryByText("Revenue 7d")).toBeNull();
    // stage chips come from the data: hot→Emerging, pass→Saturated
    for (const l of ["Emerging", "Rising", "Watch", "Saturated"]) expect(screen.getAllByRole("button", { name: l }).length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "Peaking" })).toBeNull();
    expect(screen.getAllByText("$222.5K").length).toBeGreaterThan(0);   // real 1-day revenue, not $1.56M (x7)
    expect(getProducts).toHaveBeenCalledTimes(3);                     // 250 rows -> offsets 0,100,200
  });
});
