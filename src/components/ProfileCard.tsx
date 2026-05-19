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
        <a
          href={`https://github.com/${profile.login}`}
          target="_blank"
          rel="noreferrer"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            color: 'var(--col-accent)',
            opacity: 0.85,
            marginTop: '3px',
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <span>@{profile.login}</span>
        </a>
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
