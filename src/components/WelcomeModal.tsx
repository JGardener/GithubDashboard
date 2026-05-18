import { useState } from 'react'

const SEEN_KEY = 'gh-compare-welcome-seen'

export function WelcomeModal() {
  const [open, setOpen] = useState(() => !localStorage.getItem(SEEN_KEY))

  function dismiss() {
    localStorage.setItem(SEEN_KEY, '1')
    setOpen(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="About this tool">About</button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Welcome" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Welcome</h2>
            <ul className="mb-4 space-y-2 text-sm">
              <li>Compare any two GitHub developers side-by-side.</li>
              <li>Enter two GitHub usernames, press Enter, and get a shareable URL.</li>
              <li>Uses the public GitHub API — heavy use may hit rate limits.</li>
            </ul>
            <button onClick={dismiss} className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground">Got it</button>
          </div>
        </div>
      )}
    </>
  )
}
