/**
 * TikTok Shop US fee model (checked Oct 2026 against TikTok Shop Seller University summaries).
 * - Referral fee: 6% for most categories, 5% for select fine jewelry and pre-owned.
 * - Payment processing is INCLUDED in the referral fee (no separate 2.9% fee in the US).
 * - Base = customer payment (incl. buyer-paid shipping) + platform discount - tax.
 * - Creator affiliate commission, ads, and shipping labels are extra and set by the seller.
 * Always confirm against your own settlement statement.
 */
export const DEFAULT_REFERRAL_PCT = 6;
export const DEFAULT_CREATOR_PCT = 15;

export interface ProfitInput {
  sellingPrice: number;
  productCost: number;
  shippingCost?: number;
  referralPct?: number;
  creatorPct?: number;
  adCostPerUnit?: number;
  quantity?: number;
}

export interface ProfitBreakdown {
  revenue: number;
  referralFee: number;
  creatorCommission: number;
  productCost: number;
  shippingCost: number;
  adCost: number;
  totalCost: number;
  profit: number;
  profitPerUnit: number;
  margin: number;
  breakEvenPrice: number | null;
}

const n = (v: unknown, d = 0) => {
  const x = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(x) ? x : d;
};

export function calcProfit(input: ProfitInput): ProfitBreakdown {
  const price = n(input.sellingPrice);
  const cost = n(input.productCost);
  const ship = n(input.shippingCost);
  const refPct = n(input.referralPct, DEFAULT_REFERRAL_PCT) / 100;
  const crePct = n(input.creatorPct, 0) / 100;
  const ads = n(input.adCostPerUnit);
  const qty = Math.max(1, n(input.quantity, 1));

  const referral = price * refPct;
  const creator = price * crePct;
  const perUnitCost = cost + ship + ads + referral + creator;
  const profitPerUnit = price - perUnitCost;
  const pctTaken = refPct + crePct;
  const breakEvenPrice = pctTaken < 1 ? (cost + ship + ads) / (1 - pctTaken) : null;

  return {
    revenue: price * qty,
    referralFee: referral * qty,
    creatorCommission: creator * qty,
    productCost: cost * qty,
    shippingCost: ship * qty,
    adCost: ads * qty,
    totalCost: perUnitCost * qty,
    profit: profitPerUnit * qty,
    profitPerUnit,
    margin: price > 0 ? (profitPerUnit / price) * 100 : 0,
    breakEvenPrice,
  };
}
