import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

test('shadcn Button renders without error', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
})
