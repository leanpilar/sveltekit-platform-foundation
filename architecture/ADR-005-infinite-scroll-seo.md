# ADR-005: Progressively Enhanced Infinite Blog Loading

## Status

Accepted

## Context

The `/blog` path is SEO-critical. Standard Intersection Observer-driven infinite feeds break indexing because crawlers do not execute viewport scrolling operations, rendering deep paginated content invisible to search spiders. Furthermore, Vercel’s native ISR engine strips query strings from cache keys, breaking traditional parameterized pagination setups.

## Decision

We use path-parameter route hierarchies (`/blog/page/[page]`) to support clean Edge CDN cache compilation per page slice.

The feed loads page `1` natively, rendering semantic fallback navigation anchors (`<a href="/blog/page/2">Next</a>`) within a `<noscript>` tag. Upon initialization, our Svelte 5 runtime hijacks this interaction anchor via an Intersection Observer to background-fetch JSON payloads and smoothly append them to state, updating the URL string cleanly using browser history state APIs.

## Consequences

- **Positive:** Complete, uncompromised SEO visibility. Spiders easily crawl the semantic link tree to index older blog entries.
- **Positive:** Perfect alignment with Vercel's edge caching tier.
- **Negative:** Increased layout preservation work to safeguard our rigid <0.1 Cumulative Layout Shift (CLS) performance budget during real-time client append cycles.
