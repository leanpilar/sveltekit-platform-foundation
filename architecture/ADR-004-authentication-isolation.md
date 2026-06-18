# ADR-004: Layout-Guarded Authentication Boundaries

## Status
Accepted

## Context
Anonymous traffic hitting `/dashboard` paths must execute an immediate server-side short-circuit redirect to `/login`. However, implementing these checks within a global server hook (`hooks.server.ts`) forces those execution contexts to build into both Edge and Node runtimes, causing edge build pollution risks.

## Decision
We implement session routing validation strictly via SvelteKit’s file-system layout hierarchy using an isolated layout group handler (`src/routes/(auth)/dashboard/+layout.server.ts`). This layout explicitly handles the runtime override configuration to serverless Node.js.

## Consequences
* **Positive:** Absolute cryptographic validation isolation; Node.js modules are completely blocked from leaking into the Edge runtime deployment footprint.
* **Positive:** Zero middleware processing overhead on public marketing or blog routes.
* **Negative:** Sub-routes under the dashboard folder cannot selectively opt-out of the authentication cascade without physically migrating outside the layout group boundary. This matches our binary design surfaces constraint.