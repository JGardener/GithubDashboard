import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const user1Param = searchParams.get('user1') ?? ''
  const user2Param = searchParams.get('user2') ?? ''

  const [input1, setInput1] = useState(user1Param)
  const [input2, setInput2] = useState(user2Param)

  function submit() {
    const trimmed1 = input1.trim()
    const trimmed2 = input2.trim()
    if (!trimmed1 && !trimmed2) return
    const params: Record<string, string> = {}
    if (trimmed1) params.user1 = trimmed1
    if (trimmed2) params.user2 = trimmed2
    setSearchParams(params)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') submit()
  }

  const hasUser1 = Boolean(user1Param)
  const hasUser2 = Boolean(user2Param)

  return (
    <main data-testid="compare-page">
      <div className="flex flex-col gap-4 p-4 md:flex-row">
        <div className="flex-1">
          <input
            type="text"
            aria-label="Username 1"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter GitHub username"
            className="w-full rounded border px-3 py-2"
          />
          {(hasUser1 || hasUser2) && (
            <div data-testid="profile-column-1" className="mt-4">
              {hasUser1 ? (
                <p>{user1Param}</p>
              ) : (
                <p>Enter a second username to compare</p>
              )}
            </div>
          )}
        </div>

        <div className="flex-1">
          <input
            type="text"
            aria-label="Username 2"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter GitHub username"
            className="w-full rounded border px-3 py-2"
          />
          {(hasUser1 || hasUser2) && (
            <div data-testid="profile-column-2" className="mt-4">
              {hasUser2 ? (
                <p>{user2Param}</p>
              ) : (
                <p>Enter a second username to compare</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
