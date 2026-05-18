import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

function renderAt(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <MemoryRouter initialEntries={[path]}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

test('compare route renders the compare page', () => {
  renderAt('/compare')
  expect(screen.getByTestId('compare-page')).toBeInTheDocument()
})

test('root route redirects to compare', () => {
  renderAt('/')
  expect(screen.getByTestId('compare-page')).toBeInTheDocument()
})
