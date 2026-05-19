import { formatNum } from '@/lib/formatNum'
import { langColor } from '@/lib/langColors'
import type { Repo } from '@/lib/github'

type RepoCardProps = {
  repo: Repo
  ownerLogin: string
}

export function RepoCard({ repo, ownerLogin }: RepoCardProps) {
  const dotColor = langColor(repo.language ?? '')

  return (
    <div
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '12px 14px',
        transition: 'border-color 200ms, transform 200ms',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--col-accent)'
        el.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--border)'
        el.style.transform = 'translateY(0)'
      }}
    >
      <a
        href={`https://github.com/${ownerLogin}/${repo.name}`}
        target="_blank"
        rel="noreferrer"
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--text)',
          textDecoration: 'none',
          display: 'block',
          marginBottom: '5px',
        }}
      >
        {repo.name}
      </a>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: repo.description ? '6px' : 0 }}>
        <span aria-label={`${formatNum(repo.stars)} stars`} style={{ fontSize: '12px', color: 'var(--dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          {formatNum(repo.stars)}
        </span>
        <span aria-label={`${formatNum(repo.forks)} forks`} style={{ fontSize: '12px', color: 'var(--dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="6" y1="3" x2="6" y2="15"/>
            <circle cx="18" cy="6" r="3"/>
            <circle cx="6" cy="18" r="3"/>
            <path d="M18 9a9 9 0 01-9 9"/>
          </svg>
          {formatNum(repo.forks)}
        </span>
        {repo.language && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--sub)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
            {repo.language}
          </span>
        )}
      </div>

      {repo.description && (
        <p
          data-testid="repo-description"
          style={{
            fontSize: '12px',
            color: 'var(--dim)',
            lineHeight: 1.5,
            margin: 0,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          } as React.CSSProperties}
        >
          {repo.description}
        </p>
      )}
    </div>
  )
}
