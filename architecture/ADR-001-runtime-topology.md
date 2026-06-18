# ADR-001: Runtime Topology and Edge/Node.js Split

## Status
Accepted

## Context
The application features distinct rendering requirements: a public, anonymous marketing surface that demands low Time-to-First-Byte (TTFB) and search indexing optimization, and an interactive, authenticated dashboard that processes high-density datasets.

## Decision
We enforce a split runtime architecture at the file-system boundary using `@sveltejs/adapter-vercel`:

1.**Public Surface (`/`, `/blog`):** Bound to the Vercel Edge Runtime using Incremental Static Regeneration (ISR).This eliminates cold-start overhead and scales delivery across global CDN points close to end-users.
2.**Authenticated Surface (`/dashboard`):** Bound to the Node.js Serverless Runtime to safely handle data manipulation, large payload validation transformations, and cryptography modules.

## Consequences
* **Positive:** Absolute protection against cold-start penalties on critical marketing routes.
* **Positive:** Decoupled bundler context preventing thick server-side dependencies from inflating lightweight edge runtime memory boundaries.
* **Negative:** Cross-region data fetching latency if data endpoints do not match compute locations. Mitigated by isolating heavy processing layers to regionalized Serverless function zones.