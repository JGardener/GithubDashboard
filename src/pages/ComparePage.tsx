import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import { fetchProfile, fetchRepos, RateLimitError, NotFoundError } from '@/lib/github'
import { ProfileColumn } from '@/components/ProfileColumn'

export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const user1Param = searchParams.get('user1') ?? ''
  const user2Param = searchParams.get('user2') ?? ''

  const [input1, setInput1] = useState(user1Param)
  const [input2, setInput2] = useState(user2Param)

  const [profile1Query, repos1Query, profile2Query, repos2Query] = useQueries({
    queries: [
      { queryKey: ['profile', 'user1', user1Param], queryFn: () => fetchProfile(user1Param), enabled: Boolean(user1Param) },
      { queryKey: ['repos', 'user1', user1Param], queryFn: () => fetchRepos(user1Param), enabled: Boolean(user1Param) },
      { queryKey: ['profile', 'user2', user2Param], queryFn: () => fetchProfile(user2Param), enabled: Boolean(user2Param) },
      { queryKey: ['repos', 'user2', user2Param], queryFn: () => fetchRepos(user2Param), enabled: Boolean(user2Param) },
    ],
  })

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

  const user1NotFound = [profile1Query.error, repos1Query.error].some((e) => e instanceof NotFoundError)
  const user2NotFound = [profile2Query.error, repos2Query.error].some((e) => e instanceof NotFoundError)

  const rateLimitError = [profile1Query, repos1Query, profile2Query, repos2Query]
    .map((q) => q.error)
    .find((e): e is RateLimitError => e instanceof RateLimitError)

  function formatResetTime(date: Date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <main data-testid="compare-page">
      {rateLimitError && (
        <p role="alert" className="bg-destructive/10 border-destructive border p-3 text-sm">
          GitHub rate limit reached. Resets at {formatResetTime(rateLimitError.resetAt)}.
        </p>
      )}
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
                user1NotFound ? (
                  <p>Username not found.</p>
                ) : profile1Query.data && repos1Query.data ? (
                  <ProfileColumn
                    profile={profile1Query.data}
                    repos={repos1Query.data}
                    compareWith={profile2Query.data ?? undefined}
                  />
                ) : (
                  <p role="status" aria-label="Loading">Loading…</p>
                )
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
                user2NotFound ? (
                  <p>Username not found.</p>
                ) : profile2Query.data && repos2Query.data ? (
                  <ProfileColumn
                    profile={profile2Query.data}
                    repos={repos2Query.data}
                    compareWith={profile1Query.data ?? undefined}
                  />
                ) : (
                  <p role="status" aria-label="Loading">Loading…</p>
                )
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
