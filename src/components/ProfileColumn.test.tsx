import { render, screen, within } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { ProfileColumn } from './ProfileColumn'
import type { Profile, Repo } from '@/lib/github'

const baseProfile: Profile = {
  login: 'torvalds',
  name: 'Linus Torvalds',
  avatarUrl: 'https://avatars.githubusercontent.com/u/1',
  bio: 'Just a programmer',
  followers: 236000,
  following: 0,
  publicRepos: 8,
  createdAt: '2011-09-03T15:26:22Z',
}

const opponent: Profile = {
  login: 'gaearon',
  name: 'Dan Abramov',
  avatarUrl: 'https://avatars.githubusercontent.com/u/810438',
  bio: null,
  followers: 87000,
  following: 171,
  publicRepos: 263,
  createdAt: '2011-07-11T17:55:13Z',
}

const repos: Repo[] = []

const sampleRepos: Repo[] = [
  { name: 'linux', stars: 180000, forks: 50000, language: 'C', description: 'Linux kernel' },
  { name: 'subsurface', stars: 2000, forks: 300, language: 'C++', description: null },
]

describe('ProfileColumn', () => {
  test('renders avatar, name, login, bio, all stats, and formatted creation date', () => {
    render(<ProfileColumn profile={baseProfile} repos={repos} />)

    expect(screen.getByRole('img', { name: /torvalds/i })).toBeInTheDocument()
    expect(screen.getByText('Linus Torvalds')).toBeInTheDocument()
    expect(screen.getByText('torvalds')).toBeInTheDocument()
    expect(screen.getByText('Just a programmer')).toBeInTheDocument()
    expect(screen.getByText(/236[,\s]?000/)).toBeInTheDocument()
    expect(screen.getByText(/0 following/i)).toBeInTheDocument()
    expect(screen.getByText(/8 repos/i)).toBeInTheDocument()
    expect(screen.getByText('September 2011')).toBeInTheDocument()
  })

  test('higher follower count gets data-winner, lower does not', () => {
    const { rerender } = render(
      <ProfileColumn profile={baseProfile} repos={repos} compareWith={opponent} />,
    )

    // torvalds has 236000 followers vs gaearon's 87000 — torvalds wins
    expect(screen.getByText(/236[,\s]?000/i).closest('[data-winner]')).not.toBeNull()

    // from opponent's perspective — gaearon should NOT win followers
    rerender(<ProfileColumn profile={opponent} repos={repos} compareWith={baseProfile} />)
    expect(screen.queryByText(/87[,\s]?000/i)?.closest('[data-winner]')).toBeNull()
  })

  test('no data-winner attributes when compareWith is absent', () => {
    render(<ProfileColumn profile={baseProfile} repos={repos} />)

    expect(document.querySelector('[data-winner]')).toBeNull()
  })

  test('creation date never gets data-winner even with compareWith', () => {
    render(<ProfileColumn profile={baseProfile} repos={repos} compareWith={opponent} />)

    expect(screen.getByText('September 2011').closest('[data-winner]')).toBeNull()
  })

  test('renders repo names from the repos list', () => {
    render(<ProfileColumn profile={baseProfile} repos={sampleRepos} />)

    expect(screen.getByText('linux')).toBeInTheDocument()
    expect(screen.getByText('subsurface')).toBeInTheDocument()
  })

  test('repo description is rendered when present', () => {
    render(<ProfileColumn profile={baseProfile} repos={sampleRepos} />)

    expect(screen.getByText('Linux kernel')).toBeInTheDocument()
  })

  test('repo with null description renders no description text', () => {
    render(<ProfileColumn profile={baseProfile} repos={sampleRepos} />)

    // subsurface has null description — no placeholder should appear
    const subsurfaceItem = screen.getByText('subsurface').closest('li')!
    expect(subsurfaceItem.querySelector('p')).toBeNull()
  })

  test('repo name links to the correct GitHub repo URL', () => {
    render(<ProfileColumn profile={baseProfile} repos={sampleRepos} />)

    const link = screen.getByRole('link', { name: 'linux' })
    expect(link).toHaveAttribute('href', 'https://github.com/torvalds/linux')
  })

  test('each repo card shows star count, fork count, and language', () => {
    render(<ProfileColumn profile={baseProfile} repos={sampleRepos} />)

    const linuxCard = screen.getByText('linux').closest('li')!
    expect(within(linuxCard).getByText(/180[,\s]?000/)).toBeInTheDocument()
    expect(within(linuxCard).getByText(/50[,\s]?000/)).toBeInTheDocument()
    expect(within(linuxCard).getByText('C')).toBeInTheDocument()
  })

  test('language swatch labels appear below the strip', () => {
    const langRepos: Repo[] = [
      { name: 'r1', stars: 0, forks: 0, language: 'TypeScript', description: null },
      { name: 'r2', stars: 0, forks: 0, language: 'Rust', description: null },
    ]
    render(<ProfileColumn profile={baseProfile} repos={langRepos} />)

    const legend = screen.getByTestId('language-legend')
    expect(within(legend).getByText('TypeScript')).toBeInTheDocument()
    expect(within(legend).getByText('Rust')).toBeInTheDocument()
  })

  test('null-language repos do not produce a strip segment', () => {
    const mixedRepos: Repo[] = [
      { name: 'r1', stars: 0, forks: 0, language: 'Go', description: null },
      { name: 'r2', stars: 0, forks: 0, language: null, description: null },
      { name: 'r3', stars: 0, forks: 0, language: null, description: null },
    ]
    render(<ProfileColumn profile={baseProfile} repos={mixedRepos} />)

    const segments = document.querySelectorAll('[data-testid="language-segment"]')
    expect(segments).toHaveLength(1)
  })

  test('language strip renders one segment per distinct language', () => {
    const langRepos: Repo[] = [
      { name: 'r1', stars: 0, forks: 0, language: 'TypeScript', description: null },
      { name: 'r2', stars: 0, forks: 0, language: 'TypeScript', description: null },
      { name: 'r3', stars: 0, forks: 0, language: 'Rust', description: null },
    ]
    render(<ProfileColumn profile={baseProfile} repos={langRepos} />)

    const segments = document.querySelectorAll('[data-testid="language-segment"]')
    expect(segments).toHaveLength(2)
  })

  test('shows only top 5 repos by stars when more than 5 provided', () => {
    const sixRepos: Repo[] = [
      { name: 'repo-a', stars: 6, forks: 0, language: null, description: null },
      { name: 'repo-b', stars: 5, forks: 0, language: null, description: null },
      { name: 'repo-c', stars: 4, forks: 0, language: null, description: null },
      { name: 'repo-d', stars: 3, forks: 0, language: null, description: null },
      { name: 'repo-e', stars: 2, forks: 0, language: null, description: null },
      { name: 'repo-f', stars: 1, forks: 0, language: null, description: null },
    ]
    render(<ProfileColumn profile={baseProfile} repos={sixRepos} />)

    expect(screen.getByText('repo-a')).toBeInTheDocument()
    expect(screen.getByText('repo-e')).toBeInTheDocument()
    expect(screen.queryByText('repo-f')).not.toBeInTheDocument()
  })
})
