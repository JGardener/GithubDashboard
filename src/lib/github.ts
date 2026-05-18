export type Profile = {
  login: string
  avatarUrl: string
  bio: string | null
  followers: number
  following: number
  publicRepos: number
  createdAt: string
}

export type Repo = {
  name: string
  stars: number
  forks: number
  language: string | null
  description: string | null
}

export class RateLimitError extends Error {
  constructor(public readonly resetAt: Date) {
    super('GitHub rate limit exceeded')
    this.name = 'RateLimitError'
  }
}

export class NotFoundError extends Error {
  constructor(username: string) {
    super(`GitHub user not found: ${username}`)
    this.name = 'NotFoundError'
  }
}

const BASE = 'https://api.github.com'

async function request<T>(url: string, username: string): Promise<T> {
  const res = await fetch(url)
  if (res.status === 403) {
    const reset = res.headers.get('X-RateLimit-Reset')
    const resetAt = reset ? new Date(Number(reset) * 1000) : new Date()
    throw new RateLimitError(resetAt)
  }
  if (res.status === 404) {
    throw new NotFoundError(username)
  }
  return res.json() as Promise<T>
}

type GithubUser = {
  login: string
  avatar_url: string
  bio: string | null
  followers: number
  following: number
  public_repos: number
  created_at: string
}

type GithubRepo = {
  name: string
  stargazers_count: number
  forks_count: number
  language: string | null
  description: string | null
}

export async function fetchProfile(username: string): Promise<Profile> {
  const data = await request<GithubUser>(`${BASE}/users/${username}`, username)
  return {
    login: data.login,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    followers: data.followers,
    following: data.following,
    publicRepos: data.public_repos,
    createdAt: data.created_at,
  }
}

export async function fetchRepos(username: string): Promise<Repo[]> {
  const data = await request<GithubRepo[]>(
    `${BASE}/users/${username}/repos?sort=stars&per_page=10`,
    username,
  )
  return data.map((r) => ({
    name: r.name,
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language,
    description: r.description,
  }))
}
