import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, afterEach } from 'vitest'
import { UserPage } from './UserPage'

const MOCK_PROFILE = {
  login: 'torvalds',
  name: 'Linus Torvalds',
  avatar_url: 'https://avatars.githubusercontent.com/u/1',
  bio: 'Creator of Linux',
  followers: 236000,
  following: 0,
  public_repos: 8,
  created_at: '2011-09-03T15:26:22Z',
}

const MOCK_REPOS = [
  { name: 'linux',    stargazers_count: 180000, forks_count: 50000, language: 'C',      description: 'The kernel',     updated_at: '2024-03-01T00:00:00Z' },
  { name: 'subsurface', stargazers_count: 2300, forks_count: 600,   language: 'C++',    description: 'Dive log',       updated_at: '2024-01-01T00:00:00Z' },
  { name: 'uemacs',  stargazers_count: 700,     forks_count: 150,   language: 'C',      description: 'Micro emacs',    updated_at: '2023-06-01T00:00:00Z' },
]

function mockGitHub(profile: object, repos: object[]) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) => {
      if (url.includes('/repos')) {
        return Promise.resolve({ status: 200, ok: true, json: () => Promise.resolve(repos), headers: { get: () => null } })
      }
      return Promise.resolve({ status: 200, ok: true, json: () => Promise.resolve(profile), headers: { get: () => null } })
    }),
  )
}

afterEach(() => vi.unstubAllGlobals())

function renderAt(path: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <MemoryRouter initialEntries={[path]}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/user/:username" element={<UserPage />} />
          <Route path="/compare" element={<div data-testid="compare-page" />} />
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

test('renders profile name and login after data loads', async () => {
  mockGitHub(MOCK_PROFILE, MOCK_REPOS)
  renderAt('/user/torvalds')
  expect(await screen.findByText('Linus Torvalds')).toBeInTheDocument()
  expect(await screen.findByText('@torvalds')).toBeInTheDocument()
})

test('renders all repos after data loads', async () => {
  mockGitHub(MOCK_PROFILE, MOCK_REPOS)
  renderAt('/user/torvalds')
  expect(await screen.findByText('linux')).toBeInTheDocument()
  expect(await screen.findByText('subsurface')).toBeInTheDocument()
  expect(await screen.findByText('uemacs')).toBeInTheDocument()
})

test('sort by Forks reorders the repo list', async () => {
  const user = userEvent.setup()
  mockGitHub(MOCK_PROFILE, MOCK_REPOS)
  renderAt('/user/torvalds')

  await screen.findByText('linux')
  await user.click(screen.getByRole('button', { name: /forks/i }))

  const items = screen.getAllByRole('listitem')
  expect(items[0]).toHaveTextContent('linux')
  expect(items[1]).toHaveTextContent('subsurface')
})

test('sort by Recently updated reorders the repo list', async () => {
  const user = userEvent.setup()
  mockGitHub(MOCK_PROFILE, MOCK_REPOS)
  renderAt('/user/torvalds')

  await screen.findByText('linux')
  await user.click(screen.getByRole('button', { name: /recently updated/i }))

  const items = screen.getAllByRole('listitem')
  expect(items[0]).toHaveTextContent('linux')
  expect(items[2]).toHaveTextContent('uemacs')
})

test('language filter narrows repo list to selected language', async () => {
  const user = userEvent.setup()
  mockGitHub(MOCK_PROFILE, MOCK_REPOS)
  renderAt('/user/torvalds')

  await screen.findByText('linux')
  await user.selectOptions(screen.getByRole('combobox', { name: /filter by language/i }), 'C++')

  expect(screen.queryByText('linux')).not.toBeInTheDocument()
  expect(screen.getByText('subsurface')).toBeInTheDocument()
})

test('Compare with... link points to /compare?user1=torvalds', async () => {
  mockGitHub(MOCK_PROFILE, MOCK_REPOS)
  renderAt('/user/torvalds')

  const link = await screen.findByRole('link', { name: /compare with/i })
  expect(link).toHaveAttribute('href', '/compare?user1=torvalds')
})

test('404 response renders not-found message', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      status: 404,
      ok: false,
      json: () => Promise.resolve({}),
      headers: { get: () => null },
    }),
  )
  renderAt('/user/ghost')
  expect(await screen.findByText(/not found/i)).toBeInTheDocument()
})

test('403 response renders rate-limit banner', async () => {
  const resetUnix = 1700000000
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      status: 403,
      ok: false,
      json: () => Promise.resolve({}),
      headers: { get: (key: string) => (key === 'X-RateLimit-Reset' ? String(resetUnix) : null) },
    }),
  )
  renderAt('/user/torvalds')
  expect(await screen.findByRole('alert')).toBeInTheDocument()
})

test('language bar is rendered from all repos', async () => {
  mockGitHub(MOCK_PROFILE, MOCK_REPOS)
  renderAt('/user/torvalds')
  await screen.findByText('linux')
  expect(screen.getByTestId('language-strip')).toBeInTheDocument()
})

test('empty filter result shows no-match message', async () => {
  const user = userEvent.setup()
  mockGitHub(MOCK_PROFILE, [
    { name: 'linux', stargazers_count: 1, forks_count: 0, language: 'C', description: null, updated_at: '2024-01-01T00:00:00Z' },
  ])
  renderAt('/user/torvalds')

  await screen.findByText('linux')
  await user.selectOptions(screen.getByRole('combobox', { name: /filter by language/i }), 'C')
  await user.selectOptions(screen.getByRole('combobox', { name: /filter by language/i }), '')

  expect(screen.getByText('linux')).toBeInTheDocument()
})
