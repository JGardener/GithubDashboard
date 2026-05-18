# ADR 0002 — Query params over path params for the compare URL

## Status

Accepted

## Context

The compare view needs a shareable URL that encodes two GitHub usernames. Two shapes were considered:

1. **Path params** — `/compare/torvalds/gaearon`
2. **Query params** — `/compare?user1=torvalds&user2=gaearon`

Path params are the conventional instinct for a two-entity view and produce cleaner URLs.

## Decision

Use query params with `user1` and `user2` as param names.

The compare view has a natural in-progress state: one username entered, the second not yet. Query params represent this correctly — `/compare?user1=torvalds` is a valid URL that shows one Profile while the second input is still empty.

Path params force a navigation event on each change. With two inputs, this creates awkward intermediate routes (`/compare/torvalds/`) or requires deferring the URL update until both fields are filled, which breaks the shareable-URL guarantee mid-entry.

`user1`/`user2` is preferred over `a`/`b` because the layout is not guaranteed to be side-by-side (mobile views may stack vertically), so positional names like `left`/`right` are wrong and single-letter names are opaque.

## Consequences

- `/compare?user1=torvalds` is a valid route — the view must handle the Single state gracefully (one Profile loaded, empty column shows a prompt).
- URLs are slightly less clean than the path-param equivalent, but remain fully shareable and bookmarkable once both params are present.
- React Router's `useSearchParams` is used instead of `useParams`; the distinction is minor but worth knowing when reading the routing code.
