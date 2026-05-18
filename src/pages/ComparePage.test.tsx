import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ComparePage } from './ComparePage'

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

test('Full state pre-fills both inputs and shows two profile column areas', () => {
  renderAt('/compare?user1=torvalds&user2=gaearon')

  expect(screen.getByRole('textbox', { name: 'Username 1' })).toHaveValue('torvalds')
  expect(screen.getByRole('textbox', { name: 'Username 2' })).toHaveValue('gaearon')
  expect(screen.getByTestId('profile-column-1')).toBeInTheDocument()
  expect(screen.getByTestId('profile-column-2')).toBeInTheDocument()
  expect(screen.queryByText('Enter a second username to compare')).not.toBeInTheDocument()
})
