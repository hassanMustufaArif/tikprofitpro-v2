import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X, Undo2, EyeOff, Eye, ExternalLink, Loader2, Plus } from "lucide-react";
import { api } from "@/lib/api";

/**
 * Supplier review (admins only; the API checks ADMIN_EMAILS).
 * - To review: near-miss photo matches (default 60-79%). Same product with a different bottle,
 *   label or angle lands here. Approve -> users see it and it's charged like a normal match.
 * - No match: sourcing found nothing verified; check the near-misses or paste a link yourself.
 * - Live: what users see now. Hide a wrong auto-match; re-sourcing keeps it hidden.
 */

const VIEWS = [
  { id: "pending", label: "To review" },
  { id: "no_match", label: "No match" },
  { id: "live", label: "Live" },
] as const;

const pct = (v: any) => (v == null ? "—" : `${Math.round(Number(v) * 100)}%`);
const usd = (v: any) => (v == null || v === "" ? "—" : `$${Number(v).toFixed(2)}`);
const img = (p: any) => p?.image_storage_url || p?.thumbnail_url || "";

const Badge = ({ children, tone = "gray" }: { children: React.ReactNode; tone?: "green" | "amber" | "red" | "gray" | "blue" }) => {
  const tones = {
    green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700", gray: "bg-gray-100 text-gray-600", blue: "bg-blue-50 text-blue-700",
  };
  return <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium ${tones[tone]}`}>{children}</span>;
};

const SupplierCard = ({ s, children }: { s: any; children?: React.ReactNode }) => (
  <div className="rounded-lg border border-border bg-card p-3 flex gap-3">
    {s.image_url
      ? <img src={s.image_url} alt="" className="h-24 w-24 rounded object-cover border border-border shrink-0" />
      : <div className="h-24 w-24 rounded bg-muted shrink-0" />}
    <div className="min-w-0 flex-1 space-y-1">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-sm font-semibold">{pct(s.similarity)} match</span>
        <Badge tone="blue">{s.platform}</Badge>
        {s.match_method && <Badge>{s.match_method}</Badge>}
      </div>
      <div className="text-[13px] text-foreground truncate" title={s.product_title}>{s.product_title || "—"}</div>
      <div className="text-[12px] text-muted-foreground">
        {s.supplier_name || "—"} · {usd(s.unit_cost_min)}{s.unit_cost_max && s.unit_cost_max !== s.unit_cost_min ? `–${usd(s.unit_cost_max)}` : ""} · MOQ {s.moq ?? "—"}
      </div>
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {s.supplier_url && (
          <a href={s.supplier_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[12px] underline">
            Open listing <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {children}
      </div>
    </div>
  </div>
);

const Btn = ({ onClick, children, tone = "default", busy }: any) => (
  <button
    onClick={onClick}
    disabled={busy}
    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[12px] font-medium border disabled:opacity-50 ${
      tone === "approve" ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
      : tone === "reject" ? "bg-white text-red-700 border-red-200 hover:bg-red-50"
      : "bg-white text-foreground border-border hover:bg-muted"}`}
  >
    {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : null}{children}
  </button>
);

const AddSupplierForm = ({ productId, onDone }: { productId: string; onDone: () => void }) => {
  const [f, setF] = useState({ platform: "alibaba", supplier_url: "", supplier_name: "", unit_cost_min: "", moq: "", image_url: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    setErr(""); setBusy(true);
    try {
      await api.adminAddSupplier({
        product_id: productId, platform: f.platform, supplier_url: f.supplier_url, supplier_name: f.supplier_name,
        unit_cost_min: Number(f.unit_cost_min), moq: f.moq ? Number(f.moq) : null, image_url: f.image_url || null,
      });
      setF({ ...f, supplier_url: "", supplier_name: "", unit_cost_min: "", moq: "", image_url: "" });
      onDone();
    } catch (e: any) {
      setErr(String(e?.message || e).slice(0, 200));
    } finally { setBusy(false); }
  };
  const input = "h-8 rounded-md border border-border bg-white px-2 text-[13px]";
  return (
    <div className="rounded-lg border border-dashed border-border p-3 space-y-2">
      <div className="text-sm font-semibold">Add a supplier the search missed</div>
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
        <select className={input} value={f.platform} onChange={set("platform")}>
          <option value="alibaba">Alibaba</option><option value="aliexpress">AliExpress</option><option value="amazon">Amazon</option>
        </select>
        <input className={`${input} sm:col-span-2`} placeholder="https://… listing link" value={f.supplier_url} onChange={set("supplier_url")} />
        <input className={input} placeholder="Supplier name" value={f.supplier_name} onChange={set("supplier_name")} />
        <input className={input} placeholder="Unit price $" inputMode="decimal" value={f.unit_cost_min} onChange={set("unit_cost_min")} />
        <input className={input} placeholder="MOQ" inputMode="numeric" value={f.moq} onChange={set("moq")} />
        <input className={`${input} sm:col-span-5`} placeholder="Photo URL (optional)" value={f.image_url} onChange={set("image_url")} />
        <Btn tone="approve" onClick={submit} busy={busy}><Plus className="h-3 w-3" /> Add</Btn>
      </div>
      {err && <div className="text-[12px] text-red-700">{err}</div>}
    </div>
  );
};

const AdminReview = () => {
  const qc = useQueryClient();
  const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("pending");
  const [platform, setPlatform] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const me = useQuery({ queryKey: ["admin-me"], queryFn: api.adminMe });
  const queue = useQuery({
    queryKey: ["admin-queue", view, platform],
    queryFn: () => api.adminQueue(view, platform || undefined),
    enabled: !!me.data?.admin,
  });
  const detail = useQuery({
    queryKey: ["admin-product", selected],
    queryFn: () => api.adminProduct(selected!),
    enabled: !!selected && !!me.data?.admin,
  });

  const act = async (key: string, fn: () => Promise<any>) => {
    setBusyId(key);
    try {
      await fn();
      await Promise.all([qc.invalidateQueries({ queryKey: ["admin-product", selected] }), qc.invalidateQueries({ queryKey: ["admin-queue"] })]);
    } finally { setBusyId(null); }
  };

  if (me.isLoading) return <div className="p-6"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  if (!me.data?.admin) return <div className="p-6 text-sm text-muted-foreground">This page is for TikProfitPro admins.</div>;

  const items: any[] = queue.data?.items ?? [];
  const d = detail.data;
  const live = (d?.suppliers ?? []).filter((s: any) => s.visible);
  const hidden = (d?.suppliers ?? []).filter((s: any) => !s.visible);
  const pending = (d?.candidates ?? []).filter((c: any) => c.status === "pending");
  const rejected = (d?.candidates ?? []).filter((c: any) => c.status === "rejected");

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Supplier review</h1>
          <Link to="/admin/upload" className="text-[13px] underline">Weekly upload</Link>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Approve same-product matches the photo check scored below {pct(d?.min_similarity ?? 0.8)}, hide wrong ones, or add a link yourself.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {VIEWS.map(v => (
          <button key={v.id} onClick={() => { setView(v.id); setSelected(null); }}
            className={`rounded-md px-3 py-1.5 text-[13px] font-medium border ${view === v.id ? "bg-foreground text-background border-foreground" : "bg-white border-border"}`}>
            {v.label}
          </button>
        ))}
        <select value={platform} onChange={e => setPlatform(e.target.value)} className="h-8 rounded-md border border-border bg-white px-2 text-[13px]">
          <option value="">All platforms</option><option value="alibaba">Alibaba</option><option value="aliexpress">AliExpress</option>
        </select>
        {queue.data && <span className="text-[12px] text-muted-foreground">{queue.data.count} products</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4">
        {/* queue */}
        <div className="rounded-lg border border-border bg-card divide-y divide-border max-h-[75vh] overflow-auto">
          {queue.isLoading && <div className="p-4"><Loader2 className="h-4 w-4 animate-spin" /></div>}
          {!queue.isLoading && items.length === 0 && <div className="p-4 text-sm text-muted-foreground">Nothing here.</div>}
          {items.map(p => (
            <button key={`${p.id}-${p.platform}`} onClick={() => setSelected(String(p.id))}
              className={`w-full text-left p-3 flex gap-3 hover:bg-muted/50 ${selected === String(p.id) ? "bg-muted" : ""}`}>
              {img(p) ? <img src={img(p)} alt="" className="h-12 w-12 rounded object-cover border border-border shrink-0" /> : <div className="h-12 w-12 rounded bg-muted shrink-0" />}
              <div className="min-w-0">
                <div className="text-[13px] font-medium line-clamp-2">{p.product_name}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge tone="blue">{p.platform}</Badge>
                  {p.pending > 0 && <Badge tone="amber">{p.pending} to review</Badge>}
                  {p.status === "no_match" && <Badge tone="red">no match</Badge>}
                  <span className="text-[11px] text-muted-foreground">{usd(p.tiktok_price)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* detail */}
        <div className="space-y-4">
          {!selected && <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Pick a product.</div>}
          {selected && detail.isLoading && <div className="p-6"><Loader2 className="h-5 w-5 animate-spin" /></div>}
          {d && (
            <>
              <div className="rounded-lg border border-border bg-card p-4 flex gap-4 items-start">
                {img(d.product) ? <img src={img(d.product)} alt="" className="h-36 w-36 rounded object-cover border border-border shrink-0" /> : null}
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">TikTok product</div>
                  <div className="font-semibold">{d.product.product_name}</div>
                  <div className="text-sm text-muted-foreground">{usd(d.product.tiktok_price)} · {d.product.category || "—"}</div>
                  <div className="text-[12px] text-muted-foreground space-y-0.5 pt-1">
                    {(d.jobs ?? []).slice(0, 2).map((j: any, i: number) => (
                      <div key={i}>Last {j.platform} run: <b>{j.status}</b>{j.error ? ` · ${j.error}` : ""}</div>
                    ))}
                  </div>
                </div>
              </div>

              <section className="space-y-2">
                <h2 className="text-sm font-semibold">To review ({pending.length})</h2>
                {pending.length === 0 && <div className="text-[13px] text-muted-foreground">No near-misses waiting.</div>}
                {pending.map((c: any) => (
                  <SupplierCard key={c.id} s={c}>
                    <Btn tone="approve" busy={busyId === `a${c.id}`} onClick={() => act(`a${c.id}`, () => api.adminApprove(c.id))}><Check className="h-3 w-3" /> Same product</Btn>
                    <Btn tone="reject" busy={busyId === `r${c.id}`} onClick={() => act(`r${c.id}`, () => api.adminReject(c.id))}><X className="h-3 w-3" /> Different</Btn>
                  </SupplierCard>
                ))}
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-semibold">Live, users see these ({live.length})</h2>
                {live.length === 0 && <div className="text-[13px] text-muted-foreground">Users see no suppliers for this product yet.</div>}
                {live.map((s: any) => (
                  <SupplierCard key={s.id} s={s}>
                    {s.match_method === "manual" ? <Badge tone="green">approved by {s.reviewed_by || "admin"}</Badge> : <Badge tone="green">auto-verified</Badge>}
                    <Btn busy={busyId === `h${s.id}`} onClick={() => act(`h${s.id}`, () => api.adminSetHidden(s.id, true))}><EyeOff className="h-3 w-3" /> Hide</Btn>
                  </SupplierCard>
                ))}
              </section>

              <AddSupplierForm productId={String(d.product.id)} onDone={() => act("add", async () => {})} />

              {(rejected.length > 0 || hidden.length > 0) && (
                <details className="rounded-lg border border-border bg-card p-3">
                  <summary className="cursor-pointer text-sm font-semibold">Rejected and hidden ({rejected.length + hidden.length})</summary>
                  <div className="space-y-2 pt-3">
                    {rejected.map((c: any) => (
                      <SupplierCard key={`c${c.id}`} s={c}>
                        <Badge tone="red">rejected</Badge>
                        <Btn busy={busyId === `o${c.id}`} onClick={() => act(`o${c.id}`, () => api.adminReopen(c.id))}><Undo2 className="h-3 w-3" /> Undo</Btn>
                      </SupplierCard>
                    ))}
                    {hidden.map((s: any) => (
                      <SupplierCard key={`s${s.id}`} s={s}>
                        <Badge>{s.hidden ? "hidden" : "below threshold"}</Badge>
                        {s.hidden && <Btn busy={busyId === `u${s.id}`} onClick={() => act(`u${s.id}`, () => api.adminSetHidden(s.id, false))}><Eye className="h-3 w-3" /> Show</Btn>}
                      </SupplierCard>
                    ))}
                  </div>
                </details>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReview;
