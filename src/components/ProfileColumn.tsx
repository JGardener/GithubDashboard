import type { Profile, Repo } from '@/lib/github'

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

export function ProfileColumn({ profile, repos: _repos, compareWith }: ProfileColumnProps) {
  const w = compareWith

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
    </div>
  )
}
