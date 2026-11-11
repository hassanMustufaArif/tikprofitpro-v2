import { describe, it, expect } from "vitest";
import { displayPrice, formatPrice, isEstimated7d, latestDataDate, dedupeSuppliers, rankSuppliers } from "@/lib/productFormat";

describe("displayPrice", () => {
  it("keeps a normal price", () => {
    expect(displayPrice({ tiktok_price: 28.99, gmv_7d: 404061.9, units_sold_7d: 18220 })).toBe(28.99);
  });
  it("reads a cents-looking price as dollars when the sales data agrees", () => {
    expect(displayPrice({ tiktok_price: 7600, gmv_7d: 760000, units_sold_7d: 10000 })).toBe(76);
    expect(formatPrice({ tiktok_price: 1999, gmv_7d: 2000, units_sold_7d: 100 })).toBe("$19.99");
  });
  it("returns null (shown as —) when nothing fits", () => {
    expect(displayPrice({ tiktok_price: 7600 })).toBeNull();
    expect(displayPrice({ tiktok_price: 0 })).toBeNull();
    expect(formatPrice({ tiktok_price: 7600, gmv_7d: 100, units_sold_7d: 10 })).toBe("—");
  });
});

describe("isEstimated7d", () => {
  it("flags FastMoss and short windows", () => {
    expect(isEstimated7d({ growth_source: "fastmoss" })).toBe(true);
    expect(isEstimated7d({ window_days: 1 })).toBe(true);
    expect(isEstimated7d({ window_days: 7 })).toBe(false);
    expect(isEstimated7d({})).toBe(false);
  });
});

describe("latestDataDate", () => {
  it("picks the newest date without timezone drift", () => {
    expect(latestDataDate([{ data_end_date: "2026-11-01" }, { data_end_date: "2026-11-10" }, {}])).toBe("Nov 10, 2026");
    expect(latestDataDate([{ data_end_date: null }])).toBeNull();
  });
});

describe("suppliers", () => {
  it("dedupes by id, then url, then name+price", () => {
    const rows = [
      { external_product_id: "1", supplier_name: "A", unit_cost_min: 2.38 },
      { external_product_id: "1", supplier_name: "A", unit_cost_min: 2.38 },
      { supplier_url: "https://x.com/p/2?ref=1", supplier_name: "B", unit_cost_min: 3 },
      { supplier_url: "https://x.com/p/2", supplier_name: "B", unit_cost_min: 3 },
      { supplier_name: "C", unit_cost_min: 4 },
      { supplier_name: "c ", unit_cost_min: 4.0 },
    ];
    expect(dedupeSuppliers(rows).map((r) => r.supplier_name)).toEqual(["A", "B", "C"]);
  });
  it("keeps server order when similarity is null", () => {
    const rows = [{ supplier_name: "Z", unit_cost_min: 9 }, { supplier_name: "A", unit_cost_min: 1 }];
    expect(rankSuppliers(rows).map((r) => r.supplier_name)).toEqual(["Z", "A"]);
  });
  it("sorts by similarity when present", () => {
    const rows = [{ supplier_name: "Z", similarity: 0.6 }, { supplier_name: "A", similarity: 0.9 }];
    expect(rankSuppliers(rows).map((r) => r.supplier_name)).toEqual(["A", "Z"]);
  });
});
