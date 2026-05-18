import type { Profile, Repo } from '@/lib/github'

type ProfileColumnProps = {
  profile: Profile
  repos: Repo[]
}

export function ProfileColumn({ profile }: ProfileColumnProps) {
  return (
    <div>
      <img src={profile.avatarUrl} alt={profile.login} className="h-16 w-16 rounded-full" />
      <h2 className="font-semibold">{profile.login}</h2>
      <p>{profile.followers} followers</p>
    </div>
  )
}
