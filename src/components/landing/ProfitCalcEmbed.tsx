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
    const marginColor = margin > 20 ? "#00ff85" : margin >= 10 ? "#ffbb00" : "#ff4444";
    return { gross, tiktokFee: fees, netAfterFees, netAfterAds, margin, roi, marginColor };
  }, [cost, price, fee, creator, adSpend]);

  const inputClass =
    "w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-[#00ff85]/50 transition-colors";

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-5">
        {[
          { label: "Product Cost ($)", value: cost, set: setCost },
          { label: "TikTok Sale Price ($)", value: price, set: setPrice },
          { label: "TikTok Referral Fee % (6% most categories)", value: fee, set: setFee },
          { label: "Creator Commission %", value: creator, set: setCreator },
          { label: "Ad Cost per Sale ($)", value: adSpend, set: setAdSpend },
        ].map((input) => (
          <div key={input.label}>
            <label className="text-sm text-[#888] mb-2 block">{input.label}</label>
            <input
              type="number"
              value={input.value}
              onChange={(e) => input.set(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        ))}
      </div>

      <div className="space-y-4">
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
            className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] border border-white/5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-sm text-[#888]">{r.label}</span>
            <span
              className="text-xl font-bold"
              style={{
                color: (r as any).forceColor
                  ? (r as any).forceColor
                  : r.value < 0
                    ? "#ff4444"
                    : "#00ff85",
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
