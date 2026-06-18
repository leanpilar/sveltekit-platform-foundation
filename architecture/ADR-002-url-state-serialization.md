# ADR-002: URL-As-State Serialization Engine

## Status
Accepted

## Context
The specifications require that both public search facets (`/search`) and interactive dashboard matrix parameters (`/dashboard/items`) remain fully shareable, history-compliant, and durable across reload cycles.

## Decision
We reject internal framework memory states or global store caching for routing parameters. All layout sorting, pagination offsets, and multi-facet filtering parameters must map symmetrically through the browser URL query state.

We enforce symmetric functional codecs powered by Zod schemas to parse and stringify values at the loader boundary.

## Consequences
* **Positive:** Complete alignment with browser back/forward mechanics without layout thrashing or presentation state mismatch.
* **Positive:** Deep-linking and bookmark tracking work out of the box across both application surfaces.
* **Negative:** URL query strings become complex when dealing with multiple simultaneous filter conditions. Handled cleanly using precise, structural type coercion layers on the server.