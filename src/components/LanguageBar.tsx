import { calcLanguageDistribution } from '@/lib/languageDistribution'
import type { Repo } from '@/lib/github'

const LANG_COLORS: Record<string, string> = {
  JavaScript: '#F7DF1E', TypeScript: '#3178C6', Python:  '#3572A5',
  Rust:       '#DEA584', Go:         '#00ADD8', Java:    '#B07219',
  'C#':       '#178600', 'C++':      '#F34B7D', C:       '#8a8a8a',
  Ruby:       '#CC342D', PHP:        '#4F5D95', Swift:   '#F05138',
  Kotlin:     '#7F52FF', Dart:       '#00B4AB', CSS:     '#563D7C',
  HTML:       '#E34C26', Shell:      '#89E051', Vue:     '#41B883',
  Svelte:     '#FF3E00', Scala:      '#C22D40', R:       '#198CE7',
  Elixir:     '#6e4a7e', Haskell:    '#5e5086', Lua:     '#000080',
}
const FALLBACK_COLOR = '#6B7280'

function langColor(lang: string) {
  return LANG_COLORS[lang] ?? FALLBACK_COLOR
}

type LanguageBarProps = {
  repos: Repo[]
}

export function LanguageBar({ repos }: LanguageBarProps) {
  const shares = calcLanguageDistribution(repos)
  if (shares.length === 0) return null

  const top5 = shares.slice(0, 5)

  return (
    <div>
      <p style={{
        fontSize: '10px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
        color: 'var(--col-accent)',
        margin: '0 0 8px',
      }}>
        Languages
      </p>

      {/* Bar */}
      <div
        data-testid="language-strip"
        style={{
          height: '9px',
          borderRadius: '999px',
          overflow: 'hidden',
          display: 'flex',
          gap: '2px',
          marginBottom: '10px',
          background: 'var(--surface-3)',
        }}
      >
        {shares.map((share, i) => {
          const color = langColor(share.language)
          const isFirst = i === 0
          const isLast = i === shares.length - 1
          return (
            <div
              key={share.language}
              role="img"
              data-testid="language-segment"
              title={`${share.language} ${Math.round(share.proportion * 100)}%`}
              aria-label={`${share.language} ${Math.round(share.proportion * 100)}%`}
              style={{
                width: `${share.proportion * 100}%`,
                background: color,
                borderRadius: isFirst && isLast
                  ? '999px'
                  : isFirst
                  ? '999px 0 0 999px'
                  : isLast
                  ? '0 999px 999px 0'
                  : '0',
                transition: 'filter 200ms',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.filter = 'brightness(1.25)')}
              onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.filter = '')}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div
        data-testid="language-legend"
        style={{ display: 'flex', flexWrap: 'wrap', rowGap: '6px', columnGap: '14px' }}
      >
        {top5.map(share => (
          <span
            key={share.language}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--sub)' }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: langColor(share.language), flexShrink: 0 }} />
            <span>{share.language}</span>
            <span style={{ opacity: 0.55 }}>{Math.round(share.proportion * 100)}%</span>
          </span>
        ))}
      </div>
    </div>
  )
}
