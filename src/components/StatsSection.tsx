import type { Profile } from '@/lib/github'
import { formatNum } from '@/lib/formatNum'

type StatsSectionProps = {
  profile: Profile
  compareWith?: Profile
}

function isWinner(own: number, other: number | undefined) {
  return other !== undefined && own > other
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(iso))
}

export function StatsSection({ profile, compareWith }: StatsSectionProps) {
  const w = compareWith

  const rows: { label: string; testId: string; value: string; rawValue?: string; win: boolean }[] = [
    { label: 'Followers',    testId: 'stat-followers-value',    value: formatNum(profile.followers),   rawValue: profile.followers.toLocaleString(),   win: isWinner(profile.followers, w?.followers) },
    { label: 'Following',    testId: 'stat-following-value',    value: formatNum(profile.following),   rawValue: profile.following.toLocaleString(),   win: isWinner(profile.following, w?.following) },
    { label: 'Repos',        testId: 'stat-repos-value',        value: formatNum(profile.publicRepos), rawValue: profile.publicRepos.toLocaleString(), win: isWinner(profile.publicRepos, w?.publicRepos) },
    { label: 'Member since', testId: 'stat-member-since-value', value: formatDate(profile.createdAt),                                                  win: false },
  ]

  return (
    <div>
      <p style={{
        fontSize: '10px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
        color: 'var(--col-accent)',
        marginBottom: '8px',
        margin: '0 0 8px',
      }}>
        Stats
      </p>
      <dl style={{ display: 'flex', flexDirection: 'column', gap: '2px', margin: 0 }}>
        {rows.map(({ label, testId, value, rawValue, win }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '7px 10px',
              borderRadius: '7px',
              background: win ? 'var(--win-a)' : 'transparent',
              transition: 'background 150ms',
            }}
            onMouseEnter={e => { if (!win) (e.currentTarget as HTMLDivElement).style.background = 'var(--surface-2)' }}
            onMouseLeave={e => { if (!win) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
          >
            <dt style={{ fontSize: '13px', color: 'var(--sub)' }}>{label}</dt>
            <dd
              data-testid={testId}
              data-winner={win ? 'true' : undefined}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                color: win ? 'var(--win)' : 'var(--text)',
                margin: 0,
              }}
            >
              {value}
              {rawValue && (
                <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
                  {rawValue}
                </span>
              )}
              {win && <span style={{ fontSize: '8px', opacity: 0.7, marginLeft: '3px' }}>▲</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
