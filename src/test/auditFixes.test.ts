import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@/lib/supabase", () => ({
  supabase: { auth: { getSession: async () => ({ data: { session: null } }) } },
}));

import { api, ApiError, API_MESSAGES } from "@/lib/api";
import { normalizeStage, stagesPresent, commonWindowDays, revenueFor, unitsFor, windowText } from "@/lib/productFormat";

afterEach(() => vi.restoreAllMocks());

describe("stages", () => {
  it("maps the v1 names stored in the DB to the stages the UI shows", () => {
    expect(normalizeStage("hot")).toBe("emerging");
    expect(normalizeStage("pass")).toBe("saturated");
    expect(normalizeStage("PASS ")).toBe("saturated");
    expect(normalizeStage("rising")).toBe("rising");
    expect(normalizeStage("watch")).toBe("watch");
    expect(normalizeStage("peaking")).toBe("peaking");
    expect(normalizeStage(undefined)).toBe("unknown");
    expect(normalizeStage("weird")).toBe("unknown");
  });
  it("lists only the stages present, in life-cycle order", () => {
    expect(stagesPresent([{ trend_phase: "pass" }, { trend_phase: "hot" }, { trend_phase: "watch" }, { trend_phase: "rising" }]))
      .toEqual(["emerging", "rising", "watch", "saturated"]);
  });
});

describe("sales window", () => {
  const p = { window_days: 1, revenue_window: 222490, gmv_7d: 1557430, units_window: 2342, units_sold_7d: 16394 };
  it("finds the shared window", () => {
    expect(commonWindowDays([p, { ...p }])).toBe(1);
    expect(commonWindowDays([p, { ...p, window_days: 7 }])).toBeNull();
    expect(commonWindowDays([p, { gmv_7d: 1 }])).toBeNull();
  });
  it("uses the real 1-day figures instead of the x7 extrapolation", () => {
    expect(revenueFor(p, 1)).toBe(222490);
    expect(unitsFor(p, 1)).toBe(2342);
    expect(revenueFor({ gmv_7d: 700 }, 1)).toBe(100);
    expect(revenueFor({}, 1)).toBeNull();
    expect(windowText(1)).toBe("1 day");
    expect(windowText(7)).toBe("7 days");
  });
});

describe("api", () => {
  it("search asks for 100 rows (server default is 20)", async () => {
    const f = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ products: [] }), { status: 200 }));
    await api.searchProducts("lip gloss");
    expect(String(f.mock.calls[0][0])).toContain("limit=100");
    expect(String(f.mock.calls[0][0])).toContain("q=lip+gloss");
  });
  it("502/503 show the server's actionable text; 500 stays generic", async () => {
    const fail = async (status: number, detail: unknown) => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ detail }), { status }));
      try { await api.getStats(); } catch (e) { return e as ApiError; }
      throw new Error("expected failure");
    };
    expect((await fail(502, "GitHub token is wrong or expired")).message).toBe("GitHub token is wrong or expired");
    expect((await fail(503, "Supplier search isn't set up yet: add GITHUB_ACTIONS_TOKEN on Render")).message).toContain("GITHUB_ACTIONS_TOKEN");
    expect((await fail(503, "psycopg2 OperationalError")).message).toBe(API_MESSAGES.server);
    expect((await fail(500, "Internal server error")).message).toBe(API_MESSAGES.server);
  });
});
