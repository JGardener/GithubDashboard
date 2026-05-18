import { render, screen } from '@testing-library/react'
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
})
