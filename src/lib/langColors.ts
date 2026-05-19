export const LANG_COLORS: Record<string, string> = {
  JavaScript: '#F7DF1E', TypeScript: '#3178C6', Python:  '#3572A5',
  Rust:       '#DEA584', Go:         '#00ADD8', Java:    '#B07219',
  'C#':       '#178600', 'C++':      '#F34B7D', C:       '#8a8a8a',
  Ruby:       '#CC342D', PHP:        '#4F5D95', Swift:   '#F05138',
  Kotlin:     '#7F52FF', Dart:       '#00B4AB', CSS:     '#563D7C',
  HTML:       '#E34C26', Shell:      '#89E051', Vue:     '#41B883',
  Svelte:     '#FF3E00', Scala:      '#C22D40', R:       '#198CE7',
  Elixir:     '#6e4a7e', Haskell:    '#5e5086', Lua:     '#000080',
}

export const FALLBACK_LANG_COLOR = '#6B7280'

export function langColor(lang: string): string {
  return LANG_COLORS[lang] ?? FALLBACK_LANG_COLOR
}
