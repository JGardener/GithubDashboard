import type { Profile, Repo } from '@/lib/github'
import { ProfileCard } from './ProfileCard'
import { StatsSection } from './StatsSection'
import { LanguageBar } from './LanguageBar'
import { ReposList } from './ReposList'

type ProfileColumnProps = {
  profile: Profile
  repos: Repo[]
  compareWith?: Profile
}

export function ProfileColumn({ profile, repos, compareWith }: ProfileColumnProps) {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <ProfileCard profile={profile} />
      <StatsSection profile={profile} compareWith={compareWith} />
      <LanguageBar repos={repos} />
      <ReposList repos={repos} ownerLogin={profile.login} />
    </div>
  )
}
