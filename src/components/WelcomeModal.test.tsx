import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, test, expect } from 'vitest'
import { WelcomeModal } from './WelcomeModal'

const SEEN_KEY = 'gh-cmp-v1'

beforeEach(() => localStorage.clear())

describe('WelcomeModal', () => {
  test('appears automatically on first visit (no localStorage flag)', () => {
    render(<WelcomeModal />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  test('modal content covers what, how, and the rate-limit gotcha', () => {
    render(<WelcomeModal />)
    const dialog = screen.getByRole('dialog')

    expect(dialog.textContent).toMatch(/compare.*github/i)
    expect(dialog.textContent).toMatch(/enter.*username|username.*enter/i)
    expect(dialog.textContent).toMatch(/rate limit/i)
  })

  test('clicking re-open button shows the modal regardless of seen flag', async () => {
    const user = userEvent.setup()
    localStorage.setItem(SEEN_KEY, '1')
    render(<WelcomeModal />)

    await user.click(screen.getByRole('button', { name: /about this tool/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  test('re-open button is always visible even when modal is suppressed', () => {
    localStorage.setItem(SEEN_KEY, '1')
    render(<WelcomeModal />)

    expect(screen.getByRole('button', { name: /about this tool/i })).toBeInTheDocument()
  })

  test('clicking dismiss sets the localStorage seen flag', async () => {
    const user = userEvent.setup()
    render(<WelcomeModal />)

    await user.click(screen.getByRole('button', { name: /got it/i }))

    expect(localStorage.getItem(SEEN_KEY)).toBe('1')
  })

  test('clicking dismiss closes the dialog', async () => {
    const user = userEvent.setup()
    render(<WelcomeModal />)

    await user.click(screen.getByRole('button', { name: /got it/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('does not appear automatically on subsequent visits (flag present)', () => {
    localStorage.setItem(SEEN_KEY, '1')
    render(<WelcomeModal />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('closes when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(<WelcomeModal />)
    // modal is open by default (localStorage not set)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
