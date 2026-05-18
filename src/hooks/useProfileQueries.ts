import { useQuery } from '@tanstack/react-query'
import { fetchProfile, fetchRepos } from '@/lib/github'

export function useProfile(username: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchProfile(username),
    enabled: Boolean(username),
  })
}

export function useProfileRepos(username: string) {
  return useQuery({
    queryKey: ['repos', username],
    queryFn: () => fetchRepos(username),
    enabled: Boolean(username),
  })
}
