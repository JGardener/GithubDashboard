# Context — GitHub User Compare

## Glossary

### Visitor
The person using the tool. Unauthenticated. Has no account in this system.

### Profile
A GitHub account being looked up and displayed. A Visitor compares two Profiles side-by-side.

### Winner Indicator
A subtle visual accent on the higher value when two Profile stats are compared directly (e.g. bolder text or a muted colour). Applied to quantitative stats only — followers, following, public repo count. Account creation date is context, not a competition metric, and receives no indicator. Repo lists are independent per Profile — no cross-Profile comparison is applied. Severity/style is intentionally minimal for v1 and can be iterated on.

### Input Validation
No client-side format validation. The only client-side gate is an empty input check — don't fire a request for an empty string. All other invalid usernames are handled by the API's 404 response. Requests fire on Enter or explicit submit only — not on keystroke or blur.

### Error Display
Two distinct error display mechanisms matched to the nature of the error:
- **Rate limit (403)** — global banner above both columns, showing reset time extracted from `X-RateLimit-Reset`. Single message because rate limiting is per IP, not per Profile.
- **Not found (404)** — per-Profile error state within the relevant column, since it is specific to that username lookup.

### Compare States
The compare view has three states:
- **Empty** — no params, two blank inputs. Welcome Modal shown on first visit.
- **Single** — one param present (`?user1=` or `?user2=`), one Profile loaded. The empty column shows a prompt ("Enter a second username to compare") rather than a blank space.
- **Full** — both params present (`?user1=torvalds&user2=gaearon`), both Profiles loaded.

### Welcome Modal
A full-screen modal shown to first-time Visitors explaining what the tool does and how to use it. Dismissed state is persisted in `localStorage` so repeat Visitors skip it. A persistent button in the UI allows the Visitor to re-open it at any time. Content covers three things only: what the tool does ("Compare any two GitHub developers side-by-side"), how to use it (enter two usernames, hit Enter, get a shareable URL), and one gotcha (public GitHub API, heavy use may hit rate limits).

### Language Distribution
The proportion of a Profile's top repos that use each language, derived by counting repos per primary language across the top 10 repos by stars. Does not require extra API calls — the `language` field on each repo response is sufficient. Top 5 repos are displayed in the UI; all 10 are used for the Language Distribution calculation. Rendered as a proportional strip — a single segmented horizontal bar coloured by language, with labelled swatches below. Repos with a `null` language are excluded from the calculation silently — no "Unknown" segment.
