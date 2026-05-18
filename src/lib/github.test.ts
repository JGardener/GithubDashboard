import { describe, test, expect, vi, afterEach } from 'vitest'
import { fetchProfile, fetchRepos, RateLimitError, NotFoundError } from './github'

function mockFetch(status: number, body: unknown, headers: Record<string, string> = {}) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      status,
      ok: status >= 200 && status < 300,
      json: () => Promise.resolve(body),
      headers: { get: (key: string) => headers[key] ?? null },
    }),
  )
}

afterEach(() => vi.unstubAllGlobals())

describe('fetchRepos', () => {
  test('returns a shaped Repo array on 200', async () => {
    mockFetch(200, [
      {
        name: 'Hello-World',
        stargazers_count: 2000,
        forks_count: 300,
        language: 'TypeScript',
        description: 'My first repository',
      },
    ])

    const repos = await fetchRepos('octocat')

    expect(repos).toEqual([
      {
        name: 'Hello-World',
        stars: 2000,
        forks: 300,
        language: 'TypeScript',
        description: 'My first repository',
      },
    ])
  })
})

describe('error handling', () => {
  test('403 throws RateLimitError with resetAt parsed from header', async () => {
    const resetUnix = 1700000000
    mockFetch(403, {}, { 'X-RateLimit-Reset': String(resetUnix) })

    await expect(fetchProfile('octocat')).rejects.toBeInstanceOf(RateLimitError)

    try {
      await fetchProfile('octocat')
    } catch (e) {
      expect(e).toBeInstanceOf(RateLimitError)
      expect((e as RateLimitError).resetAt).toEqual(new Date(resetUnix * 1000))
    }
  })

  test('404 throws NotFoundError', async () => {
    mockFetch(404, {})

    await expect(fetchProfile('ghost')).rejects.toBeInstanceOf(NotFoundError)
  })
})

describe('fetchProfile', () => {
  test('returns a shaped Profile on 200', async () => {
    mockFetch(200, {
      login: 'octocat',
      avatar_url: 'https://avatars.githubusercontent.com/u/583231',
      bio: 'A mysterious octocat',
      followers: 100,
      following: 50,
      public_repos: 25,
      created_at: '2011-01-25T18:44:36Z',
    })

    const profile = await fetchProfile('octocat')

    expect(profile).toEqual({
      login: 'octocat',
      avatarUrl: 'https://avatars.githubusercontent.com/u/583231',
      bio: 'A mysterious octocat',
      followers: 100,
      following: 50,
      publicRepos: 25,
      createdAt: '2011-01-25T18:44:36Z',
    })
  })
})
