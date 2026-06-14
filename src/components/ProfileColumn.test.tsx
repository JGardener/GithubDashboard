import { render, screen, within } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
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
  { name: 'linux',      stars: 180000, forks: 50000, language: 'C',   description: 'Linux kernel', updatedAt: '2024-01-01T00:00:00Z' },
  { name: 'subsurface', stars: 2000,   forks: 300,   language: 'C++', description: null,           updatedAt: '2024-01-01T00:00:00Z' },
]

function renderInRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('ProfileColumn', () => {
  test('renders avatar, name, login, bio, all stats, and formatted creation date', () => {
    renderInRouter(<ProfileColumn profile={baseProfile} repos={repos} />)

    expect(screen.getByRole('img', { name: /torvalds/i })).toBeInTheDocument()
    expect(screen.getByText('Linus Torvalds')).toBeInTheDocument()
    expect(screen.getByText('@torvalds')).toBeInTheDocument()
    expect(screen.getByText('Just a programmer')).toBeInTheDocument()
    expect(screen.getByTestId('stat-followers-value')).toHaveTextContent('236k')
    expect(screen.getByTestId('stat-following-value')).toHaveTextContent('0')
    expect(screen.getByTestId('stat-repos-value')).toHaveTextContent('8')
    expect(screen.getByTestId('stat-member-since-value')).toHaveTextContent('September 2011')
  })

  test('higher follower count gets data-winner, lower does not', () => {
    const { rerender } = renderInRouter(
      <ProfileColumn profile={baseProfile} repos={repos} compareWith={opponent} />,
    )

    expect(screen.getByTestId('stat-followers-value')).toHaveAttribute('data-winner', 'true')

    rerender(
      <MemoryRouter>
        <ProfileColumn profile={opponent} repos={repos} compareWith={baseProfile} />
      </MemoryRouter>,
    )
    expect(screen.getByTestId('stat-followers-value')).not.toHaveAttribute('data-winner')
  })

  test('no data-winner attributes when compareWith is absent', () => {
    renderInRouter(<ProfileColumn profile={baseProfile} repos={repos} />)

    expect(document.querySelector('[data-winner]')).toBeNull()
  })

  test('creation date never gets data-winner even with compareWith', () => {
    renderInRouter(<ProfileColumn profile={baseProfile} repos={repos} compareWith={opponent} />)

    expect(screen.getByTestId('stat-member-since-value')).not.toHaveAttribute('data-winner')
  })

  test('renders repo names from the repos list', () => {
    renderInRouter(<ProfileColumn profile={baseProfile} repos={sampleRepos} />)

    expect(screen.getByText('linux')).toBeInTheDocument()
    expect(screen.getByText('subsurface')).toBeInTheDocument()
  })

  test('repo description is rendered when present', () => {
    renderInRouter(<ProfileColumn profile={baseProfile} repos={sampleRepos} />)

    expect(screen.getByText('Linux kernel')).toBeInTheDocument()
  })

  test('repo with null description renders no description text', () => {
    renderInRouter(<ProfileColumn profile={baseProfile} repos={sampleRepos} />)

    const subsurfaceItem = screen.getByText('subsurface').closest('li')!
    expect(subsurfaceItem.querySelector('[data-testid="repo-description"]')).toBeNull()
  })

  test('repo name links to the correct GitHub repo URL', () => {
    renderInRouter(<ProfileColumn profile={baseProfile} repos={sampleRepos} />)

    const link = screen.getByRole('link', { name: 'linux' })
    expect(link).toHaveAttribute('href', 'https://github.com/torvalds/linux')
  })

  test('each repo card shows star count, fork count, and language', () => {
    renderInRouter(<ProfileColumn profile={baseProfile} repos={sampleRepos} />)

    const linuxCard = screen.getByText('linux').closest('li')!
    expect(within(linuxCard).getByText('180k')).toBeInTheDocument()
    expect(within(linuxCard).getByText('50k')).toBeInTheDocument()
    expect(within(linuxCard).getByText('C')).toBeInTheDocument()
  })

  test('language swatch labels appear below the strip', () => {
    const langRepos: Repo[] = [
      { name: 'r1', stars: 0, forks: 0, language: 'TypeScript', description: null, updatedAt: '2024-01-01T00:00:00Z' },
      { name: 'r2', stars: 0, forks: 0, language: 'Rust',       description: null, updatedAt: '2024-01-01T00:00:00Z' },
    ]
    renderInRouter(<ProfileColumn profile={baseProfile} repos={langRepos} />)

    const legend = screen.getByTestId('language-legend')
    expect(within(legend).getByText('TypeScript')).toBeInTheDocument()
    expect(within(legend).getByText('Rust')).toBeInTheDocument()
  })

  test('null-language repos do not produce a strip segment', () => {
    const mixedRepos: Repo[] = [
      { name: 'r1', stars: 0, forks: 0, language: 'Go',  description: null, updatedAt: '2024-01-01T00:00:00Z' },
      { name: 'r2', stars: 0, forks: 0, language: null,  description: null, updatedAt: '2024-01-01T00:00:00Z' },
      { name: 'r3', stars: 0, forks: 0, language: null,  description: null, updatedAt: '2024-01-01T00:00:00Z' },
    ]
    renderInRouter(<ProfileColumn profile={baseProfile} repos={mixedRepos} />)

    const segments = document.querySelectorAll('[data-testid="language-segment"]')
    expect(segments).toHaveLength(1)
  })

  test('language strip renders one segment per distinct language', () => {
    const langRepos: Repo[] = [
      { name: 'r1', stars: 0, forks: 0, language: 'TypeScript', description: null, updatedAt: '2024-01-01T00:00:00Z' },
      { name: 'r2', stars: 0, forks: 0, language: 'TypeScript', description: null, updatedAt: '2024-01-01T00:00:00Z' },
      { name: 'r3', stars: 0, forks: 0, language: 'Rust',       description: null, updatedAt: '2024-01-01T00:00:00Z' },
    ]
    renderInRouter(<ProfileColumn profile={baseProfile} repos={langRepos} />)

    const segments = document.querySelectorAll('[data-testid="language-segment"]')
    expect(segments).toHaveLength(2)
  })

  test('shows only top 5 repos by stars when more than 5 provided', () => {
    const sixRepos: Repo[] = [
      { name: 'repo-a', stars: 6, forks: 0, language: null, description: null, updatedAt: '2024-01-01T00:00:00Z' },
      { name: 'repo-b', stars: 5, forks: 0, language: null, description: null, updatedAt: '2024-01-01T00:00:00Z' },
      { name: 'repo-c', stars: 4, forks: 0, language: null, description: null, updatedAt: '2024-01-01T00:00:00Z' },
      { name: 'repo-d', stars: 3, forks: 0, language: null, description: null, updatedAt: '2024-01-01T00:00:00Z' },
      { name: 'repo-e', stars: 2, forks: 0, language: null, description: null, updatedAt: '2024-01-01T00:00:00Z' },
      { name: 'repo-f', stars: 1, forks: 0, language: null, description: null, updatedAt: '2024-01-01T00:00:00Z' },
    ]
    renderInRouter(<ProfileColumn profile={baseProfile} repos={sixRepos} />)

    expect(screen.getByText('repo-a')).toBeInTheDocument()
    expect(screen.getByText('repo-e')).toBeInTheDocument()
    expect(screen.queryByText('repo-f')).not.toBeInTheDocument()
  })
})
