import { describe, test, expect } from 'vitest'
import { calcLanguageDistribution } from './languageDistribution'
import type { Repo } from './github'

function repo(language: string | null): Repo {
  return { name: 'r', stars: 0, forks: 0, language, description: null }
}

describe('calcLanguageDistribution', () => {
  test('mixed languages return correct proportions sorted descending', () => {
    const repos = [
      repo('TypeScript'),
      repo('TypeScript'),
      repo('JavaScript'),
      repo('TypeScript'),
    ]

    const result = calcLanguageDistribution(repos)

    expect(result).toEqual([
      { language: 'TypeScript', proportion: 0.75 },
      { language: 'JavaScript', proportion: 0.25 },
    ])
  })

  test('null-language repos are excluded and do not affect proportions', () => {
    const repos = [repo('TypeScript'), repo(null), repo('JavaScript')]

    const result = calcLanguageDistribution(repos)

    expect(result).toEqual([
      { language: 'TypeScript', proportion: 0.5 },
      { language: 'JavaScript', proportion: 0.5 },
    ])
    expect(result.every((s) => s.language !== null)).toBe(true)
  })

  test('all repos share one language returns a single entry with proportion 1', () => {
    const repos = [repo('Go'), repo('Go'), repo('Go')]

    const result = calcLanguageDistribution(repos)

    expect(result).toEqual([{ language: 'Go', proportion: 1 }])
  })
})
