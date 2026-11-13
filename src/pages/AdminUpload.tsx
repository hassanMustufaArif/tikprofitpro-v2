import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, FileText, X, Loader2, Search, ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { safeHref } from "@/lib/safeUrl";

/**
 * Weekly upload (admins only; the API checks ADMIN_EMAILS).
 * 1) Drop the Kalodata CSV exports or the FastMoss product .xlsx. The type is read from each file's columns.
 * 2) Check: previews the counts, writes nothing.
 * 3) Import: writes products/creators/shops, copies photos, retires products missing from this export.
 * 4) Find suppliers: runs the supplier search on GitHub Actions. With photo matching off (SOURCING_MATCHING=off,
 *    the backend default) the top 3 Alibaba/AliExpress search results go live as "auto" rows, unscored.
 */

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const when = (iso?: string) => (iso ? new Date(iso).toLocaleString() : "");

const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <section className="rounded-lg border border-border bg-card p-4 space-y-3">
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-[12px] font-semibold">{n}</span>
      <h2 className="text-sm font-semibold">{title}</h2>
    </div>
    {children}
  </section>
);

const Btn = ({ onClick, children, primary, busy, disabled }: any) => (
  <button
    onClick={onClick}
    disabled={busy || disabled}
    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium border disabled:opacity-50 ${
      primary ? "bg-foreground text-background border-foreground hover:opacity-90" : "bg-white text-foreground border-border hover:bg-muted"}`}
  >
    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}{children}
  </button>
);

// Scrolls to the newest line: the import's "Stopped: …" reason is always the LAST line, and it used
// to sit below the fold of this box, so a failed import looked like a wall of normal progress.
const Log = ({ lines }: { lines?: string[] }) => {
  const ref = useRef<HTMLPreElement>(null);
  const text = (lines ?? []).join("\n");
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [text]);
  return <pre ref={ref} className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-[12px] leading-5 whitespace-pre-wrap">{text || "…"}</pre>;
};

/** The reason a job stopped: the backend's "Stopped: <Error>: <message>" log line, else its error name. */
const failureReason = (j: any): string => {
  const line = [...(j?.log ?? [])].reverse().find((l: string) => /^Stopped:/.test(String(l)));
  return line ? String(line).replace(/^Stopped:\s*/, "") : j?.error ? String(j.error) : "No reason was recorded. Open the log below.";
};

/** Products written/previewed, from the job summary (null when the job had no product files). */
const productCount = (j: any): number | null => {
  const n = j?.summary?.products?.products;
  return typeof n === "number" ? n : null;
};

const KIND_LABEL: Record<string, string> = { products: "Products", creators: "Creators", shops: "Shops" };

const AdminUpload = () => {
  const qc = useQueryClient();
  const me = useQuery({ queryKey: ["admin-me"], queryFn: api.adminMe });
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [drag, setDrag] = useState(false);
  const [deactivate, setDeactivate] = useState(true);
  const [preview, setPreview] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [busy, setBusy] = useState<"" | "check" | "import" | "source">("");
  const [err, setErr] = useState("");
  const [mode, setMode] = useState<"new" | "all">("new");
  const [maxReq, setMaxReq] = useState(1500);
  const [srcMsg, setSrcMsg] = useState("");

  const runs = useQuery({
    queryKey: ["admin-sourcing-runs"],
    queryFn: api.adminSourcingRuns,
    enabled: !!me.data?.admin,
    refetchInterval: 30000,
    retry: false,
  });

  // poll a running import. A single network blip used to stop polling for good and leave the page
  // on "Importing…" forever; now transient errors are retried, and a 404 (server restarted, job lost)
  // or repeated failures mark the job as failed so the page says so.
  useEffect(() => {
    if (!job || job.status !== "running") return;
    let misses = 0;
    const t = setInterval(async () => {
      try { setJob(await api.adminImportStatus(job.id)); misses = 0; }
      catch (e: any) {
        misses += 1;
        if (e?.status === 404 || e?.kind === "auth" || e?.kind === "forbidden" || misses >= 5) {
          clearInterval(t);
          setErr(e?.message ?? "Lost track of the import.");
          setJob((j: any) => (j ? { ...j, status: "failed", error: e?.message ?? "Lost track of the import",
            log: [...(j.log ?? []), `Stopped: ${e?.message ?? "lost track of the import"}. Check the Products page before importing again.`] } : j));
        }
      }
    }, 3000);
    return () => clearInterval(t);
  }, [job?.id, job?.status]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const csv = Array.from(list).filter((f) => /\.(csv|xlsx)$/i.test(f.name));
    setFiles((old) => [...old, ...csv.filter((f) => !old.some((o) => o.name === f.name && o.size === f.size))]);
    setPreview(null); setJob(null); setErr("");
  };

  const check = async () => {
    setErr(""); setBusy("check"); setJob(null);
    try {
      const p = await api.adminImport(files, { dryRun: true, deactivate });
      setPreview(p);
      // The dry run comes back as HTTP 200 even when parsing failed; say so instead of unlocking Import.
      if (p?.status === "failed") setErr(`Check failed: ${failureReason(p)}`);
    }
    catch (e: any) { setErr(e.message); }
    finally { setBusy(""); }
  };

  const doImport = async () => {
    setErr(""); setBusy("import");
    try { setJob(await api.adminImport(files, { dryRun: false, deactivate })); }
    catch (e: any) { setErr(e.message); }
    finally { setBusy(""); }
  };

  const findSuppliers = async () => {
    setSrcMsg(""); setErr(""); setBusy("source");
    try {
      const r = await api.adminSourcingRun({ mode, max_requests: maxReq });
      setSrcMsg(r.message);
      setTimeout(() => qc.invalidateQueries({ queryKey: ["admin-sourcing-runs"] }), 4000);
    } catch (e: any) { setErr(e.message); }
    finally { setBusy(""); }
  };

  if (me.isLoading) return <div className="p-6"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  // A failed /admin/me (rate limit, server down, expired session) used to read as "not an admin".
  if (me.isError) return <div className="p-6 text-sm text-red-700">Couldn't check admin access: {(me.error as any)?.message ?? "request failed"}. Refresh to try again.</div>;
  if (!me.data?.admin) return <div className="p-6 text-sm text-muted-foreground">This page is for TikProfitPro admins.</div>;

  const importing = job?.status === "running";
  const lastRun = runs.data?.runs?.[0];
  const sourcingRunning = lastRun && lastRun.status !== "completed";

  return (
    <div className="space-y-4 pb-20 md:pb-6 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Weekly upload</h1>
          <p className="text-muted-foreground mt-1 text-sm">Upload this week's FastMoss product export (or Kalodata CSVs), then find suppliers. Takes a few minutes of your time each week.</p>
        </div>
        <Link to="/admin/review" className="text-[13px] underline">Supplier review</Link>
      </div>

      {err && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> <span>{err}</span>
        </div>
      )}
      {job?.status === "failed" && (
        <div role="alert" className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <span><span className="font-semibold">Import failed. Nothing after the failing step was written.</span> {failureReason(job)}</span>
        </div>
      )}

      <Step n={1} title="Add the Kalodata CSV or FastMoss product (.xlsx) files">
        <p className="text-[13px] text-muted-foreground">
          FastMoss: the product sales-rank .xlsx (its date range, e.g. 1 day, is read from the file). Kalodata: export the same date range for products (one file per category is fine), creators and shops. Drop them all here; the type is detected from the columns.
        </p>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center text-[13px] ${drag ? "border-foreground bg-muted" : "border-border"}`}
        >
          <Upload className="mx-auto h-5 w-5 mb-1" />
          Drag CSV or XLSX files here, or click to choose
          <input ref={inputRef} type="file" accept=".csv,.xlsx,text/csv" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
        </div>
        {files.length > 0 && (
          <ul className="space-y-1">
            {files.map((f, i) => {
              const kind = preview?.files?.find((p: any) => p.name === f.name)?.kind;
              return (
                <li key={f.name + f.size} className="flex items-center gap-2 text-[13px]">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{f.name}</span>
                  <span className="text-muted-foreground">{kb(f.size)}</span>
                  {preview && (kind
                    ? <span className="rounded bg-emerald-50 px-1.5 text-[11px] text-emerald-700">{KIND_LABEL[kind]}</span>
                    : <span className="rounded bg-red-50 px-1.5 text-[11px] text-red-700">not recognised</span>)}
                  <button className="ml-auto text-muted-foreground hover:text-foreground" disabled={importing}
                    onClick={() => { setFiles(files.filter((_, j) => j !== i)); setPreview(null); }}>
                    <X className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <label className="flex items-start gap-2 text-[13px]">
          <input type="checkbox" className="mt-0.5" checked={deactivate} onChange={(e) => { setDeactivate(e.target.checked); setPreview(null); }} />
          <span>This is the full weekly export. Hide products that haven't appeared for 3 weeks. Untick it if you're only adding one category.</span>
        </label>
      </Step>

      <Step n={2} title="Check, then import">
        <div className="flex flex-wrap gap-2">
          <Btn onClick={check} busy={busy === "check"} disabled={!files.length || importing}>Check files (writes nothing)</Btn>
          <Btn primary onClick={doImport} busy={busy === "import" || importing} disabled={!preview || preview.status === "failed" || importing || job?.status === "done"}>
            {importing ? "Importing…" : "Import"}
          </Btn>
        </div>
        {!preview && files.length > 0 && <p className="text-[12px] text-muted-foreground">Run Check first. Import unlocks once the preview looks right.</p>}
        {preview && !job && (
          <>
            {preview.status === "failed" ? (
              <p className="flex items-center gap-2 text-[13px] text-red-700"><AlertTriangle className="h-4 w-4" /> Check failed: {failureReason(preview)}</p>
            ) : productCount(preview) === 0 ? (
              <p className="flex items-center gap-2 text-[13px] text-amber-700"><AlertTriangle className="h-4 w-4" /> Check found 0 products in these files. Importing would add nothing.</p>
            ) : productCount(preview) != null ? (
              <p className="flex items-center gap-2 text-[13px] text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Check passed: {productCount(preview)} products ready to import.</p>
            ) : null}
            <Log lines={preview.log} />
          </>
        )}
        {job && (
          <>
            <div className="flex items-center gap-2 text-[13px]">
              {job.status === "running" && <><Loader2 className="h-4 w-4 animate-spin" /> Importing. Photos are copied too, so a full week takes about 5 to 15 minutes. You can leave this page open.</>}
              {job.status === "done" && <><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Import finished {when(job.finished_at)}{productCount(job) != null ? `: ${productCount(job)} products written` : ""}.</>}
              {job.status === "failed" && <span className="text-red-700"><AlertTriangle className="inline h-4 w-4 mr-1 text-red-600" /> Import failed {when(job.finished_at)}: {failureReason(job)}. Fix the cause, then run it again (it's safe to repeat).</span>}
            </div>
            <Log lines={job.log} />
          </>
        )}
      </Step>

      <Step n={3} title="Find suppliers">
        <p className="text-[13px] text-muted-foreground">
          Runs the supplier search on GitHub's servers. With photo matching off (the default), the top 3 Alibaba/AliExpress
          search results for each product go live straight away, with no match score. Spot-check them in{" "}
          <Link to="/admin/review" className="underline">Supplier review</Link> and hide any that are the wrong product.
          (Only if photo matching is switched on: 80%+ go live and 60–79% wait in the review queue.)
        </p>
        <div className="flex flex-wrap items-end gap-3 text-[13px]">
          <label className="space-y-1">
            <div className="text-muted-foreground text-[12px]">Which products</div>
            <select value={mode} onChange={(e) => setMode(e.target.value as any)} className="rounded-md border border-border bg-white px-2 py-1.5">
              <option value="new">New products only (weekly)</option>
              <option value="all">All products again</option>
            </select>
          </label>
          <label className="space-y-1">
            <div className="text-muted-foreground text-[12px]">Max paid searches</div>
            <input type="number" min={10} max={5000} value={maxReq} onChange={(e) => setMaxReq(Number(e.target.value) || 0)}
              className="w-28 rounded-md border border-border bg-white px-2 py-1.5" />
          </label>
          <Btn primary onClick={findSuppliers} busy={busy === "source"} disabled={importing || sourcingRunning}>
            <Search className="h-3.5 w-3.5" /> Find suppliers
          </Btn>
        </div>
        {importing && <p className="text-[12px] text-muted-foreground">Wait for the import to finish first.</p>}
        {srcMsg && <p className="text-[13px] text-emerald-700">{srcMsg}</p>}
        {runs.isError && <p className="text-[12px] text-amber-700">{JSON.stringify((runs.error as any)?.detail ?? (runs.error as any)?.message ?? "").includes("GITHUB_ACTIONS_TOKEN") ? "Not set up yet: add GITHUB_ACTIONS_TOKEN on Render." : "Couldn't load recent runs."}</p>}
        {(runs.data?.runs ?? []).length > 0 && (
          <div className="space-y-1">
            <div className="text-[12px] font-medium text-muted-foreground">Recent runs</div>
            {runs.data.runs.map((r: any) => (
              <div key={r.id} className="flex flex-wrap items-center gap-2 text-[13px]">
                {r.status !== "completed" ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : r.conclusion === "success" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  : <AlertTriangle className="h-3.5 w-3.5 text-red-600" />}
                <span>{when(r.created_at)}</span>
                <span className="text-muted-foreground">{r.status === "completed" ? r.conclusion : r.status.replace("_", " ")}</span>
                <a href={safeHref(r.url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline">Log <ExternalLink className="h-3 w-3" /></a>
              </div>
            ))}
          </div>
        )}
      </Step>
    </div>
  );
};

export default AdminUpload;
