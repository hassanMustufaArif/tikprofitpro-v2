import { useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calcProfit, DEFAULT_CREATOR_PCT, DEFAULT_REFERRAL_PCT } from "@/lib/fees";

const FIELDS: { id: keyof FormState; label: string; placeholder: string; hint?: string }[] = [
  { id: "selling_price", label: "Selling Price ($)", placeholder: "24.99" },
  { id: "product_cost", label: "Product Cost per Unit ($)", placeholder: "5.00", hint: "Supplier unit price plus packaging" },
  { id: "shipping_cost", label: "Shipping per Unit ($)", placeholder: "4.50", hint: "Label or fulfillment cost you pay" },
  { id: "referral_fee", label: "TikTok Referral Fee (%)", placeholder: "6", hint: "6% for most US categories, 5% for select jewelry and pre-owned. Payment processing is included." },
  { id: "creator_pct", label: "Creator Commission (%)", placeholder: "15", hint: "Affiliate commission you offer creators. Use 0 if you sell without creators." },
  { id: "ad_cost", label: "Ad Cost per Unit ($)", placeholder: "0", hint: "Average ad spend per sale, if you run ads" },
  { id: "quantity", label: "Quantity", placeholder: "1" },
];

type FormState = {
  selling_price: string; product_cost: string; shipping_cost: string;
  referral_fee: string; creator_pct: string; ad_cost: string; quantity: string;
};

const money = (v: number) => `${v < 0 ? "-" : ""}$${Math.abs(v).toFixed(2)}`;

const ProfitCalculatorContent = () => {
  const [form, setForm] = useState<FormState>({
    selling_price: "",
    product_cost: "",
    shipping_cost: "",
    referral_fee: String(DEFAULT_REFERRAL_PCT),
    creator_pct: String(DEFAULT_CREATOR_PCT),
    ad_cost: "0",
    quantity: "1",
  });

  const update = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const hasInput = parseFloat(form.selling_price) > 0;
  const r = useMemo(() => calcProfit({
    sellingPrice: parseFloat(form.selling_price),
    productCost: parseFloat(form.product_cost),
    shippingCost: parseFloat(form.shipping_cost),
    referralPct: parseFloat(form.referral_fee),
    creatorPct: parseFloat(form.creator_pct),
    adCostPerUnit: parseFloat(form.ad_cost),
    quantity: parseFloat(form.quantity),
  }), [form]);

  const rows = [
    { label: "Revenue", value: money(r.revenue) },
    { label: "Product cost", value: money(-r.productCost) },
    { label: "Shipping", value: money(-r.shippingCost) },
    { label: "TikTok referral fee", value: money(-r.referralFee) },
    { label: "Creator commission", value: money(-r.creatorCommission) },
    { label: "Ads", value: money(-r.adCost) },
  ];

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 animate-slide-up pb-20 md:pb-6">
      <div>
        <h1 className="text-[26px] md:text-[32px] font-semibold leading-tight tracking-[-0.035em]">Profit calculator</h1>
        <p className="text-muted-foreground mt-1 text-sm">TikTok Shop US fees, creator commission and ads in one place. Results update as you type.</p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 md:p-7 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-16px_rgba(16,24,40,0.14)] space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground"><Calculator className="h-3.5 w-3.5 text-background" /></span>
            <h2 className="font-semibold text-sm md:text-base">Your numbers</h2>
          </div>
          <div className="space-y-3">
            {FIELDS.map((f) => (
              <div key={f.id}>
                <Label htmlFor={f.id}>{f.label}</Label>
                <Input id={f.id} type="number" inputMode="decimal" placeholder={f.placeholder} value={form[f.id]}
                  onChange={(e) => update(f.id, e.target.value)} className="mt-1.5 h-11 rounded-xl bg-white tabular-nums" />
                {f.hint && <p className="text-xs text-muted-foreground mt-1">{f.hint}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-7 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-16px_rgba(16,24,40,0.14)]">
          <h2 className="font-semibold mb-4 text-sm md:text-base">Results</h2>
          {hasInput ? (
            <div className="space-y-1">
              {rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className="text-sm md:text-base font-medium tabular-nums">{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm font-semibold">Net profit</span>
                <span className={`text-lg md:text-xl font-bold tabular-nums ${r.profit >= 0 ? "text-success" : "text-destructive"}`}>{money(r.profit)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                <div className="rounded-xl bg-[#F5F5F6] p-3">
                  <div className="text-xs text-muted-foreground">Per unit</div>
                  <div className="font-semibold tabular-nums">{money(r.profitPerUnit)}</div>
                </div>
                <div className="rounded-xl bg-[#F5F5F6] p-3">
                  <div className="text-xs text-muted-foreground">Margin</div>
                  <div className="font-semibold tabular-nums">{r.margin.toFixed(1)}%</div>
                </div>
                <div className="rounded-xl bg-[#F5F5F6] p-3">
                  <div className="text-xs text-muted-foreground">Break-even price</div>
                  <div className="font-semibold tabular-nums">{r.breakEvenPrice != null ? money(r.breakEvenPrice) : "—"}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-3">Estimates only. Sales tax is excluded. Confirm your category rate on your TikTok Shop settlement statement.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center text-muted-foreground">
              <Calculator className="h-8 w-8 md:h-10 md:w-10 mb-3 opacity-40" />
              <p className="text-sm">Enter a selling price to see your profit.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProfitCalculator() {
  const { user } = useAuth();

  if (user) {
    return (
      <Layout>
        <ProfitCalculatorContent />
      </Layout>
    );
  }

  return (
    <div className="mk-page min-h-screen flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 pt-28 md:pt-32 pb-20 px-5 md:px-8">
        <ProfitCalculatorContent />
      </main>
      <Footer variant="light" />
    </div>
  );
}

