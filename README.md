# git/compare

[![CI](https://github.com/JGardener/GithubDashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/JGardener/GithubDashboard/actions/workflows/ci.yml)

Compare any two GitHub users side-by-side.

> **[Live demo →](https://jgardener-githubdashboard.vercel.app)**

---

## What it does

Enter two GitHub usernames and get an instant side-by-side breakdown of their profiles — followers, repos, languages, and top projects. The URL updates as you type so every comparison is shareable: paste the link and anyone sees the same view.

Click a username to open the Profile Page: their full repo catalogue with sorting (stars, forks, recently updated) and language filtering.

## User flow

1. Open the app — two empty inputs, a Welcome Modal explains the tool on first visit
2. Type a GitHub username in the left input and press Enter — the profile loads while the right column prompts for a second username
3. Type a second username in the right input and press Enter — both profiles appear side-by-side
4. Winner indicators highlight the higher value across followers, following, and repo count
5. The URL (e.g. `/compare?user1=torvalds&user2=gaearon`) is now shareable — paste it anywhere
6. Click either `@username` to open the Profile Page for that user
7. On the Profile Page, sort and filter repos, or hit "Compare with..." to jump back into a new comparison

## Why these choices

**TanStack Query over custom hooks** — the compare view fires four requests in parallel (profile + repos for each user). `useQueries` handles this in a single call with caching, deduplication, and error states built in. Writing equivalent behaviour with `useEffect` would require non-trivial custom logic. See [ADR 0001](docs/adr/0001-tanstack-query-over-custom-hooks.md).

**Query params over path params** — `/compare?user1=torvalds` is a valid intermediate state (one user entered, second not yet). Path params would force a navigation event on each input change or require deferring the URL update until both fields are filled, breaking the shareable-URL guarantee mid-entry. See [ADR 0002](docs/adr/0002-query-params-over-path-params.md).

## Running locally

```bash
npm install
npm run dev
```

Tests:

```bash
npm test
```
