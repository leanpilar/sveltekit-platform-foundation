# ADR-003: Design Tokenization, Fluid Layouts, and Style Queries

## Status
Accepted

## Context
The layout requires a dark/light system and defensive engineering against utility class sprawl. The project baseline must also enforce strict bundle weight constraints (<80KB public, <150KB dashboard).

## Decision
We decouple themes from markup by mapping theme variations strictly to CSS variables inside a global token directory (`src/app.css`). Tailwind configs consume functional CSS custom properties rather than hardcoded palette definitions.

To push optimization further, we utilize modern browser properties:
1. **Fluid Calculations:** Using `clamp()`, `min()`, and `max()` to dynamically compute responsive typography and layout container padding grids without generating excessive device-breakpoint media-query class strings.
2. **Container Style Queries:** Utilizing `@container style()` hooks to pass micro-theme variants down specific isolated atomic component blocks out-of-band from standard class cascade variations.

## Consequences
* **Positive:** Drastic reduction in raw HTML payload weights; component definitions remain clear of duplicate class lists.
* **Negative:** Style Queries increase onboarding complexity for engineering team members unfamiliar with modern, cross-engine CSS specifications. We accept this trade-off to prioritize a two-year forward scaling horizon.