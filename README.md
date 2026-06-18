# Platform Foundation  — Enterprise SvelteKit Implementation

An architect-grade SvelteKit application built to demonstrate high reliability, strict runtime isolation, and programmatic performance enforcement.

## Architectural Topology
The workspace is split into two distinct execution environments to balance global distribution against data processing capability:
* **Public Surface (Edge Runtime + ISR):** Powers high-speed anonymous landing, search, and paginated blog routes.
* **Authenticated Surface (Node.js Runtime + Streamed SSR):** Secures the application dashboard using strict file-system layout guards, cryptographic cookie session boundaries, and server-side row transformations.

## Defensive Engineering Gates

### 1. Unified Schema and Contract Validation
We treat raw static JSON data layers as an untrusted third-party service API boundary. The system translates informal specs into robust Zod runtime validation matrices:
* `src/lib/server/contracts/` isolates intake parsing filters.
* Shared validation logic is mounted to maintain consistency between client form structures and server update endpoints.

### 2. CI/CD Performance Budgets
Performance metrics are programmatically enforced via automated checking pipelines; a merge request fails automatically if regression thresholds are violated:
* **Lighthouse CI:** Enforces scores $\ge 95$ across Performance, Accessibility, SEO, and Best Practices on simulated mobile profiles.
* **Size Limits:** Hard-blocked bundle gates restrict initial public routing footprints to $\le 80\text{ KB}$ and dashboard views to $\le 150\text{ KB}$.
* **Accessibility Automation:** `@axe-core/playwright` blocks any PR displaying serious or critical accessibility defects.

## Getting Started

### Prerequisites
* Node.js v24.x or higher
* npm v11.x or higher

### Installation
```bash
npm install