import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import { fetchProfile, fetchRepos, RateLimitError, NotFoundError } from '@/lib/github'
import { UserColumn } from '@/components/UserColumn'
import { Header } from '@/components/Header'
import { RateLimitBanner } from '@/components/RateLimitBanner'

export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Read ?a= with legacy fallback to ?user1=
  const aParam = searchParams.get('a') ?? searchParams.get('user1') ?? ''
  const bParam = searchParams.get('b') ?? searchParams.get('user2') ?? ''

  const [input1, setInput1] = useState(aParam)
  const [input2, setInput2] = useState(bParam)
  const [rateBannerDismissed, setRateBannerDismissed] = useState(false)

  const [profile1Query, repos1Query, profile2Query, repos2Query] = useQueries({
    queries: [
      { queryKey: ['profile', 'a', aParam], queryFn: () => fetchProfile(aParam), enabled: Boolean(aParam) },
      { queryKey: ['repos',   'a', aParam], queryFn: () => fetchRepos(aParam),   enabled: Boolean(aParam) },
      { queryKey: ['profile', 'b', bParam], queryFn: () => fetchProfile(bParam), enabled: Boolean(bParam) },
      { queryKey: ['repos',   'b', bParam], queryFn: () => fetchRepos(bParam),   enabled: Boolean(bParam) },
    ],
  })

  function submit() {
    const t1 = input1.trim()
    const t2 = input2.trim()
    if (!t1 && !t2) return
    const params: Record<string, string> = {}
    if (t1) params.a = t1
    if (t2) params.b = t2
    setSearchParams(params)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') submit()
  }

  const user1NotFound = [profile1Query.error, repos1Query.error].some(e => e instanceof NotFoundError)
  const user2NotFound = [profile2Query.error, repos2Query.error].some(e => e instanceof NotFoundError)
  const user1OtherError = !user1NotFound && Boolean(aParam) && [profile1Query.error, repos1Query.error].some(Boolean)
  const user2OtherError = !user2NotFound && Boolean(bParam) && [profile2Query.error, repos2Query.error].some(Boolean)

  const rateLimitError = [profile1Query, repos1Query, profile2Query, repos2Query]
    .map(q => q.error)
    .find((e): e is RateLimitError => e instanceof RateLimitError)

  function col1State() {
    if (!aParam) return { status: 'empty' as const }
    if (user1NotFound) return { status: 'notFound' as const }
    if (user1OtherError) return { status: 'error' as const }
    if (profile1Query.data && repos1Query.data)
      return { status: 'loaded' as const, profile: profile1Query.data, repos: repos1Query.data, compareWith: profile2Query.data ?? undefined }
    return { status: 'loading' as const }
  }

  function col2State() {
    if (!bParam) return { status: 'empty' as const }
    if (user2NotFound) return { status: 'notFound' as const }
    if (user2OtherError) return { status: 'error' as const }
    if (profile2Query.data && repos2Query.data)
      return { status: 'loaded' as const, profile: profile2Query.data, repos: repos2Query.data, compareWith: profile1Query.data ?? undefined }
    return { status: 'loading' as const }
  }

  const bothLoaded = col1State().status === 'loaded' && col2State().status === 'loaded'

  return (
    <div data-testid="compare-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header showShare={bothLoaded} />

      {rateLimitError && !rateBannerDismissed && (
        <RateLimitBanner resetAt={rateLimitError.resetAt} onDismiss={() => setRateBannerDismissed(true)} />
      )}

      <main className="compare-grid">
        <UserColumn
          side="left"
          inputValue={input1}
          onInputChange={setInput1}
          onKeyDown={handleKeyDown}
          colState={col1State()}
          data-testid="profile-column-1"
        />

        <div className="vs-divider" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '72px' }}>
          <div style={{ position: 'relative', width: '38px', height: '38px' }}>
            <div style={{ position: 'absolute', inset: '-1.5px', borderRadius: '50%', background: 'conic-gradient(from 180deg, var(--c1), var(--c2), var(--c1))', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, letterSpacing: '1.5px', color: 'var(--sub)' }}>
              VS
            </div>
          </div>
          <div style={{ width: '1px', height: '160px', background: 'linear-gradient(to bottom, var(--c1-b), transparent)', marginTop: '14px' }} />
        </div>

        <UserColumn
          side="right"
          inputValue={input2}
          onInputChange={setInput2}
          onKeyDown={handleKeyDown}
          colState={col2State()}
          data-testid="profile-column-2"
        />
      </main>
    </div>
  )
}
