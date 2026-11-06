import { supabase } from "@/lib/supabase";

const BASE_URL = "https://api.tikprofitpro.shop";

const API_KEY = "88f6c492c9fcde83687bce9d9cce0b03fdd5b84ca962de228e0dc4ad5d2bad20";

async function apiFetch(path: string, options?: RequestInit) {
  const { data: { session } } = await supabase.auth.getSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
    ...options?.headers as Record<string, string>,
  };

  if (session?.access_token) {
    headers["Authorization"] = "Bearer " + session.access_token;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiUpload(path: string, form: FormData) {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = { "X-API-Key": API_KEY };
  if (session?.access_token) headers["Authorization"] = "Bearer " + session.access_token;
  const res = await fetch(`${BASE_URL}${path}`, { method: "POST", body: form, headers });
  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try { msg = JSON.parse(text).detail || text; } catch { /* plain text */ }
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  getStats: () => apiFetch("/stats"),
  getProducts: (params?: Record<string, string>) =>
    apiFetch(`/products?${new URLSearchParams(params)}`),
  searchProducts: (query: string) =>
    apiFetch(`/search?q=${encodeURIComponent(query)}`),
  calcProfit: (data: object) =>
    apiFetch("/calculate-profit", { method: "POST", body: JSON.stringify(data) }),
  getSuppliers: (product_id: string, platform: string) =>
    apiFetch(`/products/${product_id}/suppliers/${platform}`),
  getCredits: () => apiFetch("/credits"),
  getSourcingJob: (jobId: number) => apiFetch(`/sourcing/jobs/${jobId}`),
  generateListing: (data: { product_name: string; price: number; category: string; image_url?: string }) =>
    apiFetch("/generate-listing", { method: "POST", body: JSON.stringify(data) }),
  getShops: (params?: Record<string, string>) =>
    apiFetch(`/shops?${new URLSearchParams(params)}`),
  getCreators: (params?: Record<string, string>) =>
    apiFetch(`/creators?${new URLSearchParams(params)}`),
  // Admin: supplier review queue
  adminMe: () => apiFetch("/admin/me"),
  adminQueue: (view: string, platform?: string) =>
    apiFetch(`/admin/review/queue?${new URLSearchParams({ view, ...(platform ? { platform } : {}) })}`),
  adminProduct: (productId: string) => apiFetch(`/admin/review/products/${productId}`),
  adminApprove: (id: number) => apiFetch(`/admin/candidates/${id}/approve`, { method: "POST" }),
  adminReject: (id: number) => apiFetch(`/admin/candidates/${id}/reject`, { method: "POST" }),
  adminReopen: (id: number) => apiFetch(`/admin/candidates/${id}/reopen`, { method: "POST" }),
  adminSetHidden: (supplierId: number, hidden: boolean) =>
    apiFetch(`/admin/suppliers/${supplierId}/visibility`, { method: "POST", body: JSON.stringify({ hidden }) }),
  adminImport: (files: File[], opts: { dryRun: boolean; deactivate: boolean }) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    form.append("dry_run", String(opts.dryRun));
    form.append("deactivate", String(opts.deactivate));
    form.append("rehost", "true");
    return apiUpload("/admin/import", form);
  },
  adminImportStatus: (jobId: string) => apiFetch(`/admin/import/${jobId}`),
  adminSourcingRun: (data: { mode: "new" | "all"; max_requests: number; limit?: number }) =>
    apiFetch("/admin/sourcing/run", { method: "POST", body: JSON.stringify(data) }),
  adminSourcingRuns: () => apiFetch("/admin/sourcing/runs"),
  adminAddSupplier: (data: object) =>
    apiFetch("/admin/suppliers", { method: "POST", body: JSON.stringify(data) }),
  createCheckout: async (plan: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const data = await apiFetch("/create-checkout", {
      method: "POST",
      body: JSON.stringify({ email: session?.user?.email ?? '', plan }),
    });
    const checkoutUrl = data.checkout_url ?? data.url;
    if (!checkoutUrl) {
      throw new Error('No checkout URL returned. Response: ' + JSON.stringify(data));
    }
    window.location.href = checkoutUrl;
  },
};
