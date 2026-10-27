import { describe, it, expect } from "vitest";
import { calcProfit } from "@/lib/fees";

describe("calcProfit", () => {
  it("applies 6% referral and creator commission, no separate payment fee", () => {
    const r = calcProfit({ sellingPrice: 50, productCost: 10, shippingCost: 5, referralPct: 6, creatorPct: 10 });
    expect(r.referralFee).toBeCloseTo(3);
    expect(r.creatorCommission).toBeCloseTo(5);
    expect(r.profit).toBeCloseTo(27);
    expect(r.margin).toBeCloseTo(54);
  });
  it("computes break-even price", () => {
    const r = calcProfit({ sellingPrice: 20, productCost: 8, shippingCost: 2, referralPct: 6, creatorPct: 14 });
    expect(r.breakEvenPrice).toBeCloseTo(12.5);
  });
  it("multiplies by quantity", () => {
    const r = calcProfit({ sellingPrice: 10, productCost: 4, referralPct: 0, quantity: 3 });
    expect(r.profit).toBeCloseTo(18);
  });
});
