import { Link } from 'react-router-dom'
import type { Profile } from '@/lib/github'

type ProfileCardProps = {
  profile: Profile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
      {/* Avatar with accent-color ring */}
      <div
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          padding: '2.5px',
          background: 'linear-gradient(135deg, var(--col-accent), transparent 65%)',
          flexShrink: 0,
        }}
      >
        <img
          src={profile.avatarUrl}
          alt={profile.login}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px solid var(--surface)',
            display: 'block',
          }}
        />
      </div>

      {/* Profile info */}
      <div style={{ minWidth: 0, flex: 1 }}>
        {profile.name && (
          <p style={{
            fontSize: '17px',
            fontWeight: 700,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'var(--text)',
            margin: 0,
          }}>
            {profile.name}
          </p>
        )}
        <Link
          to={`/user/${profile.login}`}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: 'var(--col-accent)',
            marginTop: '5px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none',
            padding: '2px 8px',
            borderRadius: '999px',
            background: 'var(--col-accent-a)',
            border: '1px solid var(--col-accent-b)',
            transition: 'background 150ms, border-color 150ms',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'var(--col-accent-b)'
            el.style.borderColor = 'var(--col-accent)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'var(--col-accent-a)'
            el.style.borderColor = 'var(--col-accent-b)'
          }}
        >
          @{profile.login}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Link>
        {profile.bio && (
          <p style={{
            fontSize: '12px',
            fontStyle: 'italic',
            color: 'var(--sub)',
            lineHeight: 1.55,
            marginTop: '8px',
            margin: '8px 0 0',
          }}>
            {profile.bio}
          </p>
        )}
      </div>
    </div>
  )
}
