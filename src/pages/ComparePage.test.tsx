import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, afterEach } from 'vitest'
import { ComparePage } from './ComparePage'

function mockGitHub(profiles: Record<string, object>) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) => {
      const reposMatch = url.match(/\/users\/([^/]+)\/repos/)
      if (reposMatch) {
        return Promise.resolve({ status: 200, ok: true, json: () => Promise.resolve([]) })
      }
      const profileMatch = url.match(/\/users\/([^/]+)$/)
      if (profileMatch) {
        const data = profiles[profileMatch[1]] ?? {}
        return Promise.resolve({ status: 200, ok: true, json: () => Promise.resolve(data) })
      }
      return Promise.resolve({ status: 404, ok: false, json: () => Promise.resolve({}) })
    }),
  )
}

afterEach(() => vi.unstubAllGlobals())

function renderAt(url: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <MemoryRouter initialEntries={[url]}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/compare" element={<ComparePage />} />
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

test('Empty state renders two empty username inputs', () => {
  renderAt('/compare')

  const inputs = screen.getAllByRole('textbox')
  expect(inputs).toHaveLength(2)
  expect(inputs[0]).toHaveValue('')
  expect(inputs[1]).toHaveValue('')
})

test('Single state pre-fills first input and shows prompt in second area', () => {
  renderAt('/compare?user1=torvalds')

  expect(screen.getByRole('textbox', { name: 'Username 1' })).toHaveValue('torvalds')
  expect(screen.getByText('Enter a second username to compare')).toBeInTheDocument()
})

test('typing a username and pressing Enter transitions to Single state', async () => {
  const user = userEvent.setup()
  renderAt('/compare')

  await user.type(screen.getByRole('textbox', { name: 'Username 1' }), 'torvalds')
  await user.keyboard('{Enter}')

  expect(screen.getByText('Enter a second username to compare')).toBeInTheDocument()
})

test('pressing Enter with empty inputs does not change state', async () => {
  const user = userEvent.setup()
  renderAt('/compare')

  await user.keyboard('{Enter}')

  expect(screen.queryByText('Enter a second username to compare')).not.toBeInTheDocument()
  expect(screen.getAllByRole('textbox')).toHaveLength(2)
})

test('Single param: resolved profile data appears in column 1', async () => {
  mockGitHub({
    torvalds: {
      login: 'torvalds',
      name: 'Linus Torvalds',
      avatar_url: 'https://avatars.githubusercontent.com/u/1',
      bio: null,
      followers: 236000,
      following: 0,
      public_repos: 8,
      created_at: '2011-09-03T15:26:22Z',
    },
  })

  renderAt('/compare?user1=torvalds')

  expect(await screen.findByText('torvalds')).toBeInTheDocument()
  expect(await screen.findByText(/236,000/)).toBeInTheDocument()
})

test('Both params: resolved profile data appears in both columns', async () => {
  mockGitHub({
    torvalds: {
      login: 'torvalds',
      name: 'Linus Torvalds',
      avatar_url: 'https://avatars.githubusercontent.com/u/1',
      bio: null,
      followers: 236000,
      following: 0,
      public_repos: 8,
      created_at: '2011-09-03T15:26:22Z',
    },
    gaearon: {
      login: 'gaearon',
      name: 'Dan Abramov',
      avatar_url: 'https://avatars.githubusercontent.com/u/810438',
      bio: null,
      followers: 87000,
      following: 171,
      public_repos: 263,
      created_at: '2011-07-11T17:55:13Z',
    },
  })

  renderAt('/compare?user1=torvalds&user2=gaearon')

  expect(await screen.findByText('torvalds')).toBeInTheDocument()
  expect(await screen.findByText('gaearon')).toBeInTheDocument()
})

test('Full state: both columns render repos and language distribution strip', async () => {
  const mockRepos = [
    { name: 'linux', stargazers_count: 180000, forks_count: 50000, language: 'C', description: 'The kernel' },
  ]
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) => {
      if (url.includes('/repos')) {
        return Promise.resolve({ status: 200, ok: true, json: () => Promise.resolve(mockRepos) })
      }
      const profileMatch = url.match(/\/users\/([^/]+)$/)
      const profiles: Record<string, object> = {
        torvalds: { login: 'torvalds', name: 'Linus Torvalds', avatar_url: 'https://avatars.githubusercontent.com/u/1', bio: null, followers: 236000, following: 0, public_repos: 8, created_at: '2011-09-03T15:26:22Z' },
        gaearon: { login: 'gaearon', name: 'Dan Abramov', avatar_url: 'https://avatars.githubusercontent.com/u/810438', bio: null, followers: 87000, following: 171, public_repos: 263, created_at: '2011-07-11T17:55:13Z' },
      }
      if (profileMatch) {
        return Promise.resolve({ status: 200, ok: true, json: () => Promise.resolve(profiles[profileMatch[1]] ?? {}) })
      }
      return Promise.resolve({ status: 404, ok: false, json: () => Promise.resolve({}) })
    }),
  )

  renderAt('/compare?user1=torvalds&user2=gaearon')

  // both columns render repos
  expect(await screen.findAllByText('linux')).toHaveLength(2)
  // both columns render language strip
  const strips = await screen.findAllByTestId('language-strip')
  expect(strips).toHaveLength(2)
})

test('Full state pre-fills both inputs and shows two profile column areas', () => {
  renderAt('/compare?user1=torvalds&user2=gaearon')

  expect(screen.getByRole('textbox', { name: 'Username 1' })).toHaveValue('torvalds')
  expect(screen.getByRole('textbox', { name: 'Username 2' })).toHaveValue('gaearon')
  expect(screen.getByTestId('profile-column-1')).toBeInTheDocument()
  expect(screen.getByTestId('profile-column-2')).toBeInTheDocument()
  expect(screen.queryByText('Enter a second username to compare')).not.toBeInTheDocument()
})
