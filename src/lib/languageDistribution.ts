import type { Repo } from './github'

export type LanguageShare = {
  language: string
  proportion: number
}

export function calcLanguageDistribution(repos: Repo[]): LanguageShare[] {
  const counts = new Map<string, number>()

  for (const repo of repos) {
    if (repo.language === null) continue
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1)
  }

  const total = Array.from(counts.values()).reduce((sum, n) => sum + n, 0)
  if (total === 0) return []

  return Array.from(counts.entries())
    .map(([language, count]) => ({ language, proportion: count / total }))
    .sort((a, b) => b.proportion - a.proportion)
}
