import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import { fetchProfile, fetchUserRepos, RateLimitError, NotFoundError } from '@/lib/github'
import type { Repo } from '@/lib/github'
import { ProfileCard } from '@/components/ProfileCard'
import { StatsSection } from '@/components/StatsSection'
import { LanguageBar } from '@/components/LanguageBar'
import { RepoCard } from '@/components/RepoCard'
import { RateLimitBanner } from '@/components/RateLimitBanner'
import { Header } from '@/components/Header'

type SortKey = 'stars' | 'forks' | 'updated'

function sortRepos(repos: Repo[], by: SortKey): Repo[] {
  return [...repos].sort((a, b) => {
    if (by === 'stars') return b.stars - a.stars
    if (by === 'forks') return b.forks - a.forks
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
}

export function UserPage() {
  const { username = '' } = useParams<{ username: string }>()
  const [sort, setSort] = useState<SortKey>('stars')
  const [langFilter, setLangFilter] = useState('')
  const [rateBannerDismissed, setRateBannerDismissed] = useState(false)

  const [profileQuery, reposQuery] = useQueries({
    queries: [
      { queryKey: ['profile', 'user', username], queryFn: () => fetchProfile(username), enabled: Boolean(username) },
      { queryKey: ['userRepos', username],        queryFn: () => fetchUserRepos(username), enabled: Boolean(username) },
    ],
  })

  const notFound = [profileQuery.error, reposQuery.error].some(e => e instanceof NotFoundError)
  const rateLimitError = [profileQuery.error, reposQuery.error]
    .find((e): e is RateLimitError => e instanceof RateLimitError)

  const languages = useMemo(() => {
    if (!reposQuery.data) return []
    const seen = new Set<string>()
    reposQuery.data.forEach(r => { if (r.language) seen.add(r.language) })
    return Array.from(seen).sort()
  }, [reposQuery.data])

  const displayedRepos = useMemo(() => {
    if (!reposQuery.data) return []
    const filtered = langFilter
      ? reposQuery.data.filter(r => r.language === langFilter)
      : reposQuery.data
    return sortRepos(filtered, sort)
  }, [reposQuery.data, sort, langFilter])

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'stars',   label: 'Stars' },
    { key: 'forks',   label: 'Forks' },
    { key: 'updated', label: 'Recently updated' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header showShare={false} />

      {rateLimitError && !rateBannerDismissed && (
        <RateLimitBanner resetAt={rateLimitError.resetAt} onDismiss={() => setRateBannerDismissed(true)} />
      )}

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>
        {/* Back link */}
        <Link
          to="/compare"
          style={{ fontSize: '13px', color: 'var(--sub)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Compare
        </Link>

        {notFound && (
          <p style={{ color: 'var(--err)', fontSize: '14px' }}>User not found</p>
        )}

        {!notFound && (
          <>
            {/* Profile header */}
            {profileQuery.data ? (
              <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <ProfileCard profile={profileQuery.data} />
                  <Link
                    to={`/compare?user1=${profileQuery.data.login}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: 500,
                      border: '1px solid var(--border-2)',
                      borderRadius: '6px',
                      color: 'var(--sub)',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                    Compare with...
                  </Link>
                </div>
                <StatsSection profile={profileQuery.data} />
              </div>
            ) : (
              !notFound && <p style={{ color: 'var(--dim)', fontSize: '13px' }}>Loading profile…</p>
            )}

            {/* Language bar */}
            {reposQuery.data && reposQuery.data.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <LanguageBar repos={reposQuery.data} />
              </div>
            )}

            {/* Repo controls */}
            {reposQuery.data && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  {/* Sort */}
                  <div
                    role="group"
                    aria-label="Sort repositories"
                    style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '7px', overflow: 'hidden' }}
                  >
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setSort(opt.key)}
                        aria-pressed={sort === opt.key}
                        style={{
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: sort === opt.key ? 600 : 400,
                          background: sort === opt.key ? 'var(--surface-2)' : 'none',
                          color: sort === opt.key ? 'var(--text)' : 'var(--sub)',
                          border: 'none',
                          borderRight: '1px solid var(--border)',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Language filter */}
                  <select
                    aria-label="Filter by language"
                    value={langFilter}
                    onChange={e => setLangFilter(e.target.value)}
                    style={{
                      padding: '6px 10px',
                      fontSize: '12px',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '7px',
                      color: 'var(--sub)',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">All languages</option>
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                {/* Repo count */}
                <p style={{ fontSize: '12px', color: 'var(--dim)', margin: '0 0 10px' }}>
                  {displayedRepos.length} {displayedRepos.length === 1 ? 'repo' : 'repos'}
                  {langFilter && ` in ${langFilter}`}
                </p>

                {/* Repo list */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {displayedRepos.map(repo => (
                    <li key={repo.name}>
                      <RepoCard repo={repo} ownerLogin={username} />
                    </li>
                  ))}
                </ul>

                {displayedRepos.length === 0 && (
                  <p style={{ fontSize: '13px', color: 'var(--dim)', textAlign: 'center', padding: '32px 0' }}>
                    No repos match this filter.
                  </p>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
