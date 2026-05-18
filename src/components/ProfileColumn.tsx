import type { Profile, Repo } from '@/lib/github'
import { calcLanguageDistribution } from '@/lib/languageDistribution'

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

type ProfileColumnProps = {
  profile: Profile
  repos: Repo[]
  compareWith?: Profile
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date(iso),
  )
}

function isWinner(own: number, other: number | undefined) {
  return other !== undefined && own > other
}

export function ProfileColumn({ profile, repos, compareWith }: ProfileColumnProps) {
  const w = compareWith
  const langShares = calcLanguageDistribution(repos)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <img
          src={profile.avatarUrl}
          alt={profile.login}
          className="h-16 w-16 rounded-full"
        />
        <div>
          {profile.name && <p className="font-semibold">{profile.name}</p>}
          <a
            href={`https://github.com/${profile.login}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground"
          >
            {profile.login}
          </a>
        </div>
      </div>

      {profile.bio && <p className="text-sm">{profile.bio}</p>}

      <dl className="space-y-1 text-sm">
        <div className="flex justify-between">
          <dt>Followers</dt>
          <dd
            data-winner={isWinner(profile.followers, w?.followers) ? 'true' : undefined}
            className={isWinner(profile.followers, w?.followers) ? 'font-bold' : undefined}
          >
            {profile.followers.toLocaleString()} followers
          </dd>
        </div>

        <div className="flex justify-between">
          <dt>Following</dt>
          <dd
            data-winner={isWinner(profile.following, w?.following) ? 'true' : undefined}
            className={isWinner(profile.following, w?.following) ? 'font-bold' : undefined}
          >
            {profile.following} following
          </dd>
        </div>

        <div className="flex justify-between">
          <dt>Repos</dt>
          <dd
            data-winner={isWinner(profile.publicRepos, w?.publicRepos) ? 'true' : undefined}
            className={isWinner(profile.publicRepos, w?.publicRepos) ? 'font-bold' : undefined}
          >
            {profile.publicRepos} repos
          </dd>
        </div>

        <div className="flex justify-between">
          <dt>Member since</dt>
          <dd>{formatDate(profile.createdAt)}</dd>
        </div>
      </dl>

      {langShares.length > 0 && (
        <div>
          <div data-testid="language-strip" className="flex h-3 w-full overflow-hidden rounded">
            {langShares.map((share, i) => (
              <div
                key={share.language}
                data-testid="language-segment"
                style={{ width: `${share.proportion * 100}%`, backgroundColor: COLORS[i % COLORS.length] }}
              />
            ))}
          </div>
          <div data-testid="language-legend" className="mt-1 flex flex-wrap gap-2 text-xs">
            {langShares.map((share, i) => (
              <span key={share.language} className="flex items-center gap-1">
                <span
                  className="inline-block h-2 w-2 rounded-sm"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                {share.language}
              </span>
            ))}
          </div>
        </div>
      )}

      <ul className="space-y-2 text-sm">
        {[...repos].sort((a, b) => b.stars - a.stars).slice(0, 5).map((repo) => (
          <li key={repo.name} className="rounded border p-2">
            <a
              href={`https://github.com/${profile.login}/${repo.name}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium hover:underline"
            >
              {repo.name}
            </a>
            <div className="mt-1 flex gap-3 text-muted-foreground">
              <span>{repo.stars.toLocaleString()} stars</span>
              <span>{repo.forks.toLocaleString()} forks</span>
              {repo.language && <span>{repo.language}</span>}
            </div>
            {repo.description && <p className="mt-1 text-muted-foreground">{repo.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
