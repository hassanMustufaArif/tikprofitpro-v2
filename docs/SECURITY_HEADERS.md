# Security headers for tikprofitpro.shop

The live site (Lovable hosting behind Cloudflare) currently sends only `X-Content-Type-Options` and
`Referrer-Policy`. It has no CSP, no clickjacking protection, no HSTS and no Permissions-Policy.

`public/_headers` holds the headers in Netlify / Cloudflare Pages format and is copied to `dist/`.
**Lovable hosting may ignore `_headers`.** The reliable place to set them is a Cloudflare Response
Header Transform Rule on the `tikprofitpro.shop` zone, described below.

## Header values

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy-Report-Only` (step 1), then `Content-Security-Policy` (step 2) | see below |

CSP value (one line):

```
default-src 'self'; script-src 'self' https://*.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; media-src 'self' blob:; connect-src 'self' https://api.tikprofitpro.shop https://daxptnybsofquelczugc.supabase.co wss://daxptnybsofquelczugc.supabase.co https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net https://www.google.com; frame-src https://www.youtube.com https://www.youtube-nocookie.com https://*.lemonsqueezy.com; form-action 'self' https://daxptnybsofquelczugc.supabase.co https://accounts.google.com https://*.lemonsqueezy.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests
```

What each source is for:

| Directive | Source | Why |
|---|---|---|
| `script-src` | `'self'`, `https://*.googletagmanager.com` | App bundle, `/gtag-init.js`, Google tag (gtag.js). The inline gtag snippet was moved to `public/gtag-init.js`, so no `'unsafe-inline'` or hash is needed. |
| `style-src` | `'self' 'unsafe-inline'`, `https://fonts.googleapis.com` | React `style={...}`, the shadcn chart `<style>`, and the Inter / JetBrains Mono `@import` in the CSS. |
| `font-src` | `'self' data:`, `https://fonts.gstatic.com` | Google Fonts files and the bundled @fontsource fonts. |
| `img-src` | `'self' data: blob: https:` | Product and supplier photos come from several hosts (Supabase storage, TikTok CDN, alicdn, Amazon and others), plus local `data:` previews in the listing builder. |
| `media-src` | `'self' blob:` | `/dashboard-demo.mp4`. |
| `connect-src` | `https://api.tikprofitpro.shop`, `https://daxptnybsofquelczugc.supabase.co`, `wss://daxptnybsofquelczugc.supabase.co`, Google Analytics endpoints | API, Supabase auth / REST (and realtime if ever used), GA4 beacons. |
| `frame-src` | `https://www.youtube.com`, `https://www.youtube-nocookie.com`, `https://*.lemonsqueezy.com` | Demo / tutorial videos; Lemon Squeezy in case the overlay checkout is used later (checkout today is a full-page redirect, which CSP does not restrict). |
| `form-action` | `'self'`, Supabase, `https://accounts.google.com`, `https://*.lemonsqueezy.com` | Auth and checkout flows. |
| `frame-ancestors` | `'none'` | Clickjacking. Same intent as `X-Frame-Options: DENY`. |

How the source list was checked: `npm run build`, then the built bundle (`dist/assets/*.js`, `*.css`)
and `dist/index.html` were searched for every external origin. The only ones the app loads at runtime
are `api.tikprofitpro.shop`, the Supabase project, `fonts.googleapis.com` (CSS `@import`),
`www.googletagmanager.com` and `www.youtube.com` (iframes). Everything else in the bundle
(alibaba.com, blog.tikprofitpro.shop, linkedin.com, seller-us.tiktok.com and similar) is a plain link,
which CSP does not restrict. No `eval` / `new Function` and no Lovable badge script is in the build.
This was not tested in a real browser; that is what the Report-Only step is for.

### Known report you will see: Cloudflare JavaScript Detections

Cloudflare injects an inline `<script>` that loads `/cdn-cgi/challenge-platform/...` (Bot Fight Mode /
JavaScript Detections). The CSP above has no `'unsafe-inline'` for scripts, so that loader is reported
(and blocked once the policy is enforced). The app keeps working; only Cloudflare's bot fingerprinting
is affected. Options: accept it, turn JS Detections off (Security → Bots), or follow Cloudflare's CSP
guidance for JS Detections. Do **not** add `'unsafe-inline'` to `script-src` for it; that removes most
of the XSS protection.

## Step 1: add the headers in Cloudflare (Report-Only CSP)

1. Cloudflare dashboard → select the **tikprofitpro.shop** zone.
2. **Rules → Transform Rules → Modify Response Header** (newer dashboards: **Rules → Overview → Create rule → Response Header Transform Rule**). Click **Create rule**.
3. Rule name: `Security headers`.
4. **If incoming requests match…** → **Custom filter expression**:
   - Field `Hostname`, operator `equals`, value `tikprofitpro.shop`
   - (Expression: `(http.host eq "tikprofitpro.shop")`. Add `or http.host eq "www.tikprofitpro.shop"` once www works.)
   - Do **not** match `api.tikprofitpro.shop` with this rule; the API is a separate origin.
5. **Then… Modify response header**. Add one **Set static** row per header:

   | Operation | Header name | Value |
   |---|---|---|
   | Set static | `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
   | Set static | `X-Frame-Options` | `DENY` |
   | Set static | `X-Content-Type-Options` | `nosniff` |
   | Set static | `Referrer-Policy` | `strict-origin-when-cross-origin` |
   | Set static | `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
   | Set static | `Content-Security-Policy-Report-Only` | the CSP value above |

6. **Deploy**.
7. Check: `curl -sI https://tikprofitpro.shop/ | grep -iE "strict-transport|x-frame|content-security|permissions|referrer|x-content"`.

Notes:
- `includeSubDomains` in HSTS also forces HTTPS on `api.`, `blog.` and `www.`. All of them must serve valid HTTPS (www must be fixed first, see below, or it just stays broken over HTTPS). Leave `preload` off until you are sure.
- HSTS can alternatively be set at **SSL/TLS → Edge Certificates → HTTP Strict Transport Security (HSTS)**. Use one place, not both.
- `upgrade-insecure-requests` and `frame-ancestors` are ignored in Report-Only mode (browsers log a warning). `X-Frame-Options: DENY` covers framing in the meantime.

## Step 2: enforce the CSP

1. With Report-Only live, open the site in Chrome with DevTools → Console and walk the main flows: landing,
   pricing, signup / login (email and Google), dashboard, products (open a product, supplier lookup,
   List product → Write description), settings, admin review and upload, tutorials / demo video, checkout redirect.
2. Look for `[Report Only] Refused to …` messages. Any from the app's own flows mean a source is missing;
   add it to the rule. The Cloudflare `/cdn-cgi/challenge-platform` one is expected (see above).
3. After a few clean days, edit the rule: rename the header `Content-Security-Policy-Report-Only` →
   `Content-Security-Policy` (same value). Deploy and re-check the flows. Do the same in `public/_headers`.

Optional: to collect reports instead of watching the console, add `; report-uri https://<your-collector>`
(for example a free report-uri.com endpoint) to the Report-Only value.

## www.tikprofitpro.shop returns Cloudflare 522

`https://www.tikprofitpro.shop` answers **522 (connection timed out)**: Cloudflare proxies `www` but
cannot reach an origin for it. Lovable's hosting only answers for the domains connected in the project.

Fix it one of two ways (B is simpler and keeps one canonical domain):

**A. Point www at the same host as the apex**
1. Lovable → Project → Settings → Domains → add `www.tikprofitpro.shop` (Lovable shows the DNS record it wants).
2. Cloudflare → DNS → Records: make the `www` record match what Lovable asks for (usually the same target as the apex `A` / `CNAME`). Keep it proxied (orange cloud) only if Lovable's instructions allow it; otherwise set DNS only until Lovable verifies the domain.

**B. Redirect www to the apex at Cloudflare (no origin needed)**
1. Cloudflare → DNS → Records: make sure a **proxied** record exists for `www`, e.g. `CNAME www → tikprofitpro.shop` (orange cloud). Remove any `www` record pointing at an old or dead origin.
2. **Rules → Redirect Rules → Create rule** (or Rules → Overview → Create rule → Redirect Rule):
   - Name: `www to apex`
   - Expression: `(http.host eq "www.tikprofitpro.shop")`
   - Then: **Dynamic** redirect, expression `concat("https://tikprofitpro.shop", http.request.uri.path)`, status **301**, **Preserve query string** on.
3. Check: `curl -sI https://www.tikprofitpro.shop/pricing` → `301` with `location: https://tikprofitpro.shop/pricing`.

Because the redirect is served by Cloudflare, no origin is contacted and the 522 goes away.
