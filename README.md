# SvelteKit Platform Foundation

A production-shaped SvelteKit slice: a SEO-critical public marketing/blog surface
and an authenticated, interactive dashboard, with the rendering boundaries,
performance budgets, a11y, i18n and CI gates wired up end to end.

- **Live demo:** _<add your deployed URL here>_
- **Dashboard demo login:** `admin@demo.test` / `demo1234`
  (also `editor@demo.test` and `viewer@demo.test`, same password)

## Stack

SvelteKit (Svelte 5 runes) · TypeScript (strict) · Tailwind v4 (CSS-first tokens) ·
Zod · Vitest · Playwright · Lighthouse CI · `@sveltejs/adapter-vercel`.

## Getting started

### Prerequisites

- Node.js 24.x
- npm 10+

### Install & run

```bash
npm install
npm run dev            # dev server on http://localhost:5173
npm run build          # production build
npm run preview        # preview the build on http://localhost:4173
```

The mock data store defaults to an in-memory provider; it is seeded automatically
in dev and CI, so no database is required to run locally.

## Testing

```bash
npm run test:unit      # Vitest (node business-logic + browser component tests)
npm run test:e2e       # Playwright e2e (builds + previews, then runs)
npm run check          # svelte-check + tsc
npm run lint           # prettier --check + eslint
npm run size           # size-limit bundle budgets
```

**Visual regression baselines** are committed per platform
(`landing-hero-{linux,win32}.png`). CI runs the e2e suite inside the
`mcr.microsoft.com/playwright` container so screenshots match the committed Linux
baseline. To (re)generate after an intentional UI change:

```bash
docker run --rm -v "$PWD":/work -v /work/node_modules -w /work \
  mcr.microsoft.com/playwright:v1.61.0-noble \
  bash -lc "npm ci && npx playwright test -g visual --update-snapshots"
```

## Architecture

Full rationale (per-route rendering choices, edge↔node split, pagination,
optimistic-edit mechanics, i18n/SEO, perf budgets) lives in
[docs/DECISIONS.md](docs/DECISIONS.md).

### Rendering & runtime boundaries

| Surface                                                   | Runtime  | Strategy              |
| --------------------------------------------------------- | -------- | --------------------- |
| `/`, `/[lang]` landing, `/[lang]/blog*`, `/[lang]/search` | **Edge** | SSR                   |
| `/dashboard/*`                                            | **Node** | SSR + streamed `load` |
| `/api/posts`, `/api/rum`, `/sitemap.xml`, `/robots.txt`   | **Node** | endpoints             |

Anything touching the persistence layer (Node-only `redis` client) runs on Node;
locale resolution and rendering run at the edge for latency. The dashboard items
table streams its rows as a promise (skeleton → table) with a separately-streamed
summary so it can fail independently (partial-failure state).

### State management

Svelte 5 **runes** throughout (`$state`/`$derived`/`$effect`). Optimistic edits use
an id-keyed overlay map rather than mutating streamed data; URL search params are
the source of truth for all list/filter/sort/pagination state.

### Data contract

Zod schemas in `src/lib/server/dto.ts` are the single source of truth; `posts`,
`items` and `users` are validated at the boundary before use. The inline-edit
schema (`src/lib/dashboard/itemEdit.ts`) is shared by the client form and the
server action.

## CI gates

CI fails the PR on any regression: lint → `svelte-check`/`tsc` → unit → build →
bundle-size (`size-limit`) → Playwright e2e (incl. `@axe-core/playwright`) →
Lighthouse CI (Performance/Accessibility/SEO/Best-Practices ≥ 0.95, LCP ≤ 2s,
CLS ≤ 0.1 on the public routes, median of 3 runs). A Husky + lint-staged
pre-commit hook blocks bad commits locally.

## Project structure

```
src/
  lib/
    components/        UI components + primitives/ (Button, Badge, ...)
    dashboard/         items query, URL codec, shared edit schema
    i18n/              locale dictionaries (en/de) + translator
    seo/               <Seo> component, JSON-LD, canonical/hreflang helpers
    server/            dto (Zod schemas), data-model, db, auth
  routes/
    (main)/            public surface (edge SSR), locale-prefixed
    (auth)/            authenticated dashboard (node, layout guard)
    api/, sitemap.xml/, robots.txt/
tests/
  unit/                vitest (server + component)
  e2e/                 playwright flows + visual baselines
```
