import { describe, test, expect } from 'vitest'
import { formatNum } from './formatNum'

describe('formatNum', () => {
  test('numbers under 1000 are returned as-is', () => {
    expect(formatNum(0)).toBe('0')
    expect(formatNum(8)).toBe('8')
    expect(formatNum(171)).toBe('171')
    expect(formatNum(999)).toBe('999')
  })

  test('exact thousands show no decimal', () => {
    expect(formatNum(1000)).toBe('1k')
    expect(formatNum(87000)).toBe('87k')
    expect(formatNum(236000)).toBe('236k')
  })

  test('non-round thousands show one decimal', () => {
    expect(formatNum(1200)).toBe('1.2k')
    expect(formatNum(1500)).toBe('1.5k')
  })
})
