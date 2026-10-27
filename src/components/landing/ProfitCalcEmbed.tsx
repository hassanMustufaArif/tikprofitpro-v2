import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { calcProfit, DEFAULT_CREATOR_PCT, DEFAULT_REFERRAL_PCT } from "@/lib/fees";

export default function ProfitCalcEmbed() {
  const [cost, setCost] = useState(5);
  const [price, setPrice] = useState(24.99);
  const [fee, setFee] = useState(DEFAULT_REFERRAL_PCT);
  const [creator, setCreator] = useState(DEFAULT_CREATOR_PCT);
  const [adSpend, setAdSpend] = useState(0);

  const results = useMemo(() => {
    const before = calcProfit({ sellingPrice: price, productCost: cost, referralPct: fee, creatorPct: creator });
    const after = calcProfit({ sellingPrice: price, productCost: cost, referralPct: fee, creatorPct: creator, adCostPerUnit: adSpend });
    const gross = price - cost;
    const fees = before.referralFee + before.creatorCommission;
    const netAfterFees = before.profit;
    const netAfterAds = after.profit;
    const margin = before.margin;
    const roi = adSpend > 0 ? (netAfterAds / adSpend) * 100 : 0;
    const marginColor = margin > 20 ? "#067647" : margin >= 10 ? "#B54708" : "#D92D20";
    return { gross, tiktokFee: fees, netAfterFees, netAfterAds, margin, roi, marginColor };
  }, [cost, price, fee, creator, adSpend]);

  const inputClass =
    "w-full mk-num bg-white border border-[#E4E4E7] rounded-xl px-4 h-12 text-[#0B0B0C] text-[16px] focus:outline-none focus:border-[#0B0B0C] focus:ring-4 focus:ring-black/5 transition";

  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-10">
      <div className="space-y-4">
        {[
          { label: "Product Cost ($)", value: cost, set: setCost },
          { label: "TikTok Sale Price ($)", value: price, set: setPrice },
          { label: "TikTok Referral Fee % (6% most categories)", value: fee, set: setFee },
          { label: "Creator Commission %", value: creator, set: setCreator },
          { label: "Ad Cost per Sale ($)", value: adSpend, set: setAdSpend },
        ].map((input) => (
          <div key={input.label}>
            <label className="text-[13px] font-medium text-[#2A2C30] mb-1.5 block">{input.label}</label>
            <input
              type="number"
              value={input.value}
              onChange={(e) => input.set(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {[
          { label: "Gross Profit", value: results.gross, prefix: "$" },
          { label: "TikTok Fee + Creator Commission", value: results.tiktokFee, prefix: "$", negative: true },
          { label: "Net Profit (after fees)", value: results.netAfterFees, prefix: "$" },
          { label: "Net Profit (after fees + ads)", value: results.netAfterAds, prefix: "$" },
          { label: "Profit Margin", value: results.margin, suffix: "%", forceColor: results.marginColor },
          ...(adSpend > 0 ? [{ label: "ROI on Ad Spend", value: results.roi, suffix: "%" }] : []),
        ].map((r) => (
          <motion.div
            key={r.label}
            className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-[#F7F7F8]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-[14px] text-[#55595F]">{r.label}</span>
            <span
              className="mk-num text-[18px] font-semibold"
              style={{
                color: (r as any).forceColor
                  ? (r as any).forceColor
                  : r.value < 0
                    ? "#D92D20"
                    : "#0B0B0C",
              }}
            >
              {r.prefix}
              {r.value.toFixed(2)}
              {r.suffix}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
