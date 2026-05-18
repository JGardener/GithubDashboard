# GitHub User Compare — Handover

Everything decided during the portfolio grilling session. Start here when building the new repo.

---

## What this project is

A GitHub user comparison tool. Enter any two GitHub usernames, get a side-by-side breakdown of their profiles, top repos, and language usage. The URL is shareable — paste it to anyone and they see the same comparison.

One-liner for the README: **Compare any two GitHub users side-by-side.**

---

## Why it exists

Portfolio project targeting mid-level product/SaaS frontend roles. The existing portfolio is PixiJS-heavy (creative/technical). This project fills the gap by demonstrating:

- React component architecture in a product context
- Modern SaaS data-fetching patterns (TanStack Query)
- Routing, shareable URL state, async loading/error states
- Testing

---

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | React + TypeScript | Existing strength |
| Data fetching | **TanStack Query** | Industry standard for SaaS; `useQueries` handles parallel fetching cleanly; caching and error states free |
| Component library | **shadcn/ui** | Ubiquitous in SaaS job listings; accessible out of the box; lets focus time on the differentiating parts |
| Styling | Tailwind CSS | Existing strength; pairs naturally with shadcn/ui |
| Testing | **Vitest + React Testing Library** | Previously used; covers the signal gap (zero tests in existing portfolio) |
| Bundler | Vite | Consistent with existing projects |
| Routing | React Router | Most recognisable on a CV |

---

## Routing

**Query params, not path params.**

```
/compare?a=torvalds&b=gaearon
```

Rationale: the compare view has a natural in-progress state — one user entered, second not yet. Query params represent `/compare?a=torvalds` as a valid intermediate state. Show the first profile while the second input is still empty, then update the URL as the second is entered. Path params force a navigation on each change, which is worse UX here.

---

## Data fetched

Two API calls per user, four total per compare load:

1. `GET /users/:username` — avatar, bio, followers, following, public repo count, account creation date
2. `GET /users/:username/repos?sort=stars&per_page=10` — top repos by stars (name, stars, forks, primary language, description)

Language breakdown is **derived from the repos response** — aggregate languages across top repos into a proportional strip or bar. No extra API call.

Recent activity is explicitly **out of scope for v1**.

---

## Error handling

- Detect 403 / rate limit responses in TanStack Query's `onError`
- Show a clear human-readable message: "GitHub rate limit reached. Resets at HH:MM."
- Extract reset time from the `X-RateLimit-Reset` response header
- Do **not** build a personal access token flow — out of scope

User-not-found (404) also needs a handled state — show a clear message rather than a broken layout.

---

## Tests

Vitest + React Testing Library. Target: 8–10 solid tests, not exhaustive coverage. Must cover:

- Compare view renders both user profiles when data loads
- Loading state renders correctly while fetching
- Rate limit error state shows the correct message
- User-not-found error state shows the correct message
- Language breakdown renders from repo data

Tests should use TanStack Query's test utilities (`QueryClient` wrapper) — don't mock the query hooks directly.

---

## ADRs to write

Two decisions worth recording once the repo exists:

1. **TanStack Query over custom hooks** — hard to reverse once the data layer is built around it; surprising without context; real trade-off.
2. **Query params over path params for compare URL** — surprising choice; real trade-off between shareable intermediate state vs clean URLs.

Use the repo's `docs/adr/` directory. Number them `0001-` and `0002-`.

---

## Out of scope (v1)

- Personal access token flow for rate limit bypass
- Recent activity / events feed
- Individual user deep-dive route (`/user/:username`)
- Backend of any kind

Add these later if the project needs more depth.

---

## How this fits the wider portfolio

| Project | Angle |
|---|---|
| Asteroid Blaster | Creative/technical — PixiJS, game loop, object pooling |
| VISIO | Creative/technical — PixiJS, Claude AI integration |
| **GitHub User Compare** | **Product/SaaS — TanStack Query, routing, testing, real data** |

The story: deep creative-technical specialist who can also build the everyday product work.
