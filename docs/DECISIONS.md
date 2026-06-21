# Architecture & rendering decisions

Scope: the public (anonymous, SEO-critical) surface. Each choice below is meant to
be defensible on the follow-up call.

## Rendering & runtime boundaries

| Route                                   | Runtime                 | Strategy            | Why                                                                                                                                                                                              |
| --------------------------------------- | ----------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`, `/de` (landing)                    | Edge                    | SSR                 | Static-ish marketing content, no per-user data. Edge keeps TTFB low globally; SSR (not SSG) because the layout resolves locale per request and the redirect rules live in the edge layout guard. |
| `/[lang]/blog`, `/[lang]/blog/page/[n]` | Edge                    | SSR                 | Locale-resolved lists; cheap to render at the edge, no Node-only deps.                                                                                                                           |
| `/[lang]/blog/[slug]`                   | Edge                    | SSR                 | Read-only content; LCP is text, so edge SSR is fast. Good ISR/SSG candidate (see "Known cuts").                                                                                                  |
| `/[lang]/search`                        | Edge                    | SSR + client filter | Server returns a projected post list; filtering/sorting round-trips through the URL on the client (`searchCodec`). Shareable + back/forward correct.                                             |
| `/api/posts`                            | **Node** (`nodejs24.x`) | endpoint            | Data access goes through the persistence layer (`redis` client), which is Node-only. This is the deliberate Node ↔ Edge split.                                                                   |
| `/api/rum`                              | Node                    | endpoint            | Beacon sink; trivial, kept on Node alongside the data API.                                                                                                                                       |
| `/sitemap.xml`                          | Node                    | dynamic             | Reads posts via `/api/posts`; uses request origin for absolute URLs.                                                                                                                             |
| `/robots.txt`                           | Node                    | dynamic             | Emitted dynamically so the `Sitemap:` line uses the real request origin.                                                                                                                         |

Edge ⇄ Node split: anything touching the persistence layer (Node-only `redis`)
runs on Node; everything else (locale resolution, rendering) runs on the edge for
latency. This is the "at least one edge + at least one Node" requirement, made on
dependency-constraint grounds rather than arbitrarily.

## Pagination: infinite scroll with a `/blog/page/[n]` fallback

The blog list uses `IntersectionObserver`-driven load-more that navigates to
`/blog/page/[n]` (each page accumulates `5 × n` posts) with `noScroll`/`keepFocus`.

- **Why infinite scroll:** a blog index is a browse-to-discover surface; load-more
  keeps the reader in flow.
- **Why URL-backed pages underneath:** every "page" is a real route, so the state is
  shareable, crawlable, and survives back/forward. A `<noscript>` "Next page" link
  keeps it usable without JS.
- **SEO:** `page > 1` is `noindex` to avoid duplicate-content dilution; page 1 and the
  canonical `/blog` are indexable.

## Data layer & contract

- Zod schemas in `src/lib/server/dto.ts` are the single source of truth. `/api/posts`
  validates `posts.json` with `blogPostSchema.array()` **at the boundary** — the JSON
  is never trusted blindly.
- Loaders (read) are separate from form actions/endpoints (write).
- Login validation (`loginSchema`) is shared between the client form and the server
  action.

## i18n & SEO

- Locale lives in the URL (`/en/blog`, `/de/blog`); the English home collapses to `/`.
- `Seo.svelte` emits per-route `<title>`/description/canonical, `hreflang` alternates
  (en, de, x-default), Open Graph, and Twitter tags.
- JSON-LD: `Organization` on home, `Article` + `BreadcrumbList` on posts.
- `sitemap.xml` is locale-aware (per-locale `<url>` + `xhtml:link` alternates).
- UI strings come from the provided `i18n.{en,de}.json` dictionaries (wired via
  `createTranslator`); dates/currency use `Intl`, not string templates.

## Performance & observability

- `size-limit` enforces JS budgets; Lighthouse CI (`lighthouserc.json`) fails the
  build if Performance/Accessibility/SEO/Best-Practices drop below 0.95 or if
  LCP ≥ 2s / CLS ≥ 0.1 on `/`, `/en/blog`, and a post.
- RUM: `web-vitals` (LCP/INP/CLS/TTFB) + client error/unhandledrejection are sampled
  per client and shipped to `/api/rum` via `navigator.sendBeacon`.

## Known cuts / follow-ups

- **ISR/SSG for posts:** posts are ideal for ISR/on-demand revalidation. Kept on edge
  SSR for now to avoid coupling prerender to the redirect-based routing under a 7-day
  budget. First thing I'd add next.
- **Lighthouse on the dashboard:** budgets are enforced on public routes only; the
  dashboard needs an authenticated LHCI run (session cookie injection).
- **Visual baselines:** both `landing-hero-win32.png` (local dev) and
  `landing-hero-linux.png` (CI) are committed; tolerance (`maxDiffPixelRatio: 0.05`)
  absorbs sub-pixel AA differences. The Linux baseline is generated in the matching
  Playwright Docker image so it agrees with the runner:
  `docker run --rm -v "$PWD":/work -v /work/node_modules -w /work
mcr.microsoft.com/playwright:v1.61.0-noble bash -lc
"npm ci && npx playwright test -g visual --update-snapshots"`.
  (`playwright.config` binds preview to `127.0.0.1` so Playwright's IPv4 port probe
  detects vite's server, which otherwise binds IPv6-only on some runners.)
- **Dynamic OG images:** static OG tags are emitted; per-post generated images
  (satori/edge) are not done yet.
