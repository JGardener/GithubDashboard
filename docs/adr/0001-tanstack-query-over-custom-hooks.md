# ADR 0001 — TanStack Query over custom hooks

## Status

Accepted

## Context

The compare view needs to fetch data for two GitHub users in parallel — profile and repos for each, four requests total. The options considered were:

1. **Custom hooks with `useEffect`** — familiar, zero dependencies, full control
2. **TanStack Query** — purpose-built for async server state, widely adopted in SaaS products

The data-fetching layer is a foundational choice. Once components are written against TanStack Query's `useQuery` / `useQueries` API, migrating away requires rewriting every data-dependent component.

## Decision

Use TanStack Query.

`useQueries` handles the four parallel requests cleanly with a single call. Caching, deduplication, loading states, and error states come free — writing equivalent behaviour with `useEffect` would require non-trivial custom logic and would be harder to test.

TanStack Query is also the dominant pattern in mid-level SaaS frontend roles, which is the portfolio signal this project is optimising for.

## Consequences

- All data-fetching components depend on a `QueryClientProvider` in the tree — tests must wrap components in a `QueryClient` wrapper rather than mocking hooks directly.
- The `useQueries` API returns an array of query results; components must index into that array, which is slightly less ergonomic than named return values from a custom hook.
- Rate limit and 404 error states are handled uniformly via TanStack Query's error boundary integration, rather than bespoke per-hook logic.
