# ADR-007: Serverless State Persistence via Vercel KV

## Status

Accepted

## Context

Deploying to serverless edge platforms means our live production functions run completely stateless. In-memory data collections vanish on cold starts or container recycling. To showcase operational write operations and Role-Based Access Control (RBAC) persistence, the hosted environment requires a remote persistent engine.

However, forcing a dependency on an active network database connection strings during local development or detached GitHub Actions testing environments introduces unwanted latency, third-party network failure risks, and testing state pollution.

## Decision

We will build an environment-aware database abstraction module driven by a dedicated environment variable (`DATABASE_PROVIDER`).

The system will resolve to:

1. **`memory` Mode:** Used for local development (`npm run dev`) and automation test loops. It maintains mutable runtime state arrays completely offline without infrastructure requirements.
2. **`redis` Mode:** Used on production cloud deployments. It connects directly to our remote Redis instance (via Upstash or Redis Cloud marketplace instances) to survive stateless function execution lifecycles.

## Consequences

- **Decoupled Architecture:** Developers and evaluation reviewers can fork and run the codebase fully offline out of the box with zero setup.
- **Consistency Safeguards:** Integration tests and frontend UI features must respect async data resolution paths across both adapter engines.egrity:\*\* Independent test blocks must ensure isolation inside the key-value registry to prevent state leakage between parallel runs.
