import type { Repo } from '@/lib/github'
import { RepoCard } from './RepoCard'

type ReposListProps = {
  repos: Repo[]
  ownerLogin: string
}

export function ReposList({ repos, ownerLogin }: ReposListProps) {
  const top5 = [...repos].sort((a, b) => b.stars - a.stars).slice(0, 5)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <p style={{
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.2px',
          color: 'var(--col-accent)',
          margin: 0,
        }}>
          Top Repos
        </p>
        <span style={{
          fontSize: '10px',
          background: 'var(--col-accent-a)',
          color: 'var(--col-accent)',
          padding: '2px 8px',
          borderRadius: '999px',
          fontWeight: 600,
        }}>
          {top5.length}
        </span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {top5.map(repo => (
          <li key={repo.name}>
            <RepoCard repo={repo} ownerLogin={ownerLogin} />
          </li>
        ))}
      </ul>
    </div>
  )
}
