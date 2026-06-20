# Contributing & Code Style Guidelines

## Git Workflow Standards

We enforce strict **Conventional Commits** compilation tracking rules. Branch merges require clean, atomic change histories. Single squash-commits are rejected during review gates.

- `feat(ui):` Introduction of new components or interactive features.
- `fix(a11y):` Correcting accessibility regressions flagged by testing gates.
- `docs(adr):` Updates or alterations to active architectural logs.

## Engineering Quality Gates

Before initiating a remote push to origin, ensure your local workspace compiles cleanly against all automated validation hooks:

1. **Type Cleanliness:** Strict TypeScript compliance (`tsc --noEmit`). No `any` variants are permitted.
2. **A11y Metrics:** Semantic structural markups must pass local automated Lighthouse checks with scores $\ge 95$.
