import { ProfileColumn } from './ProfileColumn'
import { SkeletonColumn } from './SkeletonColumn'
import type { Profile, Repo } from '@/lib/github'

type ColState =
  | { status: 'empty' }
  | { status: 'loading' }
  | { status: 'notFound' }
  | { status: 'error' }
  | { status: 'loaded'; profile: Profile; repos: Repo[]; compareWith?: Profile }

type UserColumnProps = {
  side: 'left' | 'right'
  inputValue: string
  onInputChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  colState: ColState
  'data-testid'?: string
}

const COL_VARS: Record<'left' | 'right', React.CSSProperties> = {
  left: {
    '--col-accent':      '#818CF8',
    '--col-accent-a':    'rgba(129,140,248,0.12)',
    '--col-accent-b':    'rgba(129,140,248,0.22)',
    '--col-accent-glow': 'rgba(129,140,248,0.35)',
  } as React.CSSProperties,
  right: {
    '--col-accent':      '#34D399',
    '--col-accent-a':    'rgba(52,211,153,0.12)',
    '--col-accent-b':    'rgba(52,211,153,0.22)',
    '--col-accent-glow': 'rgba(52,211,153,0.35)',
  } as React.CSSProperties,
}

export function UserColumn({
  side,
  inputValue,
  onInputChange,
  onKeyDown,
  colState,
  'data-testid': testId,
}: UserColumnProps) {
  const arrow = side === 'left' ? '⟵' : '⟶'

  return (
    <div
      data-testid={testId}
      style={{
        ...COL_VARS[side],
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Accent bar */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--col-accent), transparent)' }} />

      {/* Input wrapper */}
      <div style={{ padding: '14px', borderBottom: '1px solid var(--border)' }}>
        <InputRow
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          isLoading={colState.status === 'loading'}
          side={side}
        />
      </div>

      {/* Content */}
      {colState.status === 'empty' && (
        <div style={{ textAlign: 'center', padding: '52px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px', opacity: 0.18 }}>{arrow}</span>
          <p style={{ fontSize: '13px', color: 'var(--dim)', lineHeight: 1.5, margin: 0 }}>
            Enter a GitHub username above<br />to start comparing
          </p>
        </div>
      )}

      {colState.status === 'loading' && <SkeletonColumn />}

      {colState.status === 'notFound' && (
        <div style={{ padding: '36px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--err)', margin: 0 }}>User not found</p>
        </div>
      )}

      {colState.status === 'error' && (
        <div style={{ padding: '36px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--err)', margin: 0 }}>Something went wrong</p>
        </div>
      )}

      {colState.status === 'loaded' && (
        <ProfileColumn
          profile={colState.profile}
          repos={colState.repos}
          compareWith={colState.compareWith}
        />
      )}
    </div>
  )
}

type InputRowProps = {
  value: string
  onChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  isLoading: boolean
  side: 'left' | 'right'
}

function InputRow({ value, onChange, onKeyDown, isLoading, side }: InputRowProps) {
  const ariaLabel = side === 'left' ? 'Username 1' : 'Username 2'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'var(--surface-3)',
        border: '1.5px solid var(--border)',
        borderRadius: '8px',
        padding: '0 14px',
        transition: 'border-color 200ms, box-shadow 200ms',
      }}
      onFocusCapture={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--col-accent)'
        el.style.boxShadow = '0 0 0 3px var(--col-accent-a)'
      }}
      onBlurCapture={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--border)'
        el.style.boxShadow = ''
      }}
    >
      {isLoading ? (
        <span
          role="status"
          aria-label="Loading"
          style={{
            color: 'var(--col-accent)',
            display: 'flex',
            flexShrink: 0,
            animation: 'loading 0.9s linear infinite',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="15"/>
          </svg>
        </span>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--dim)" strokeWidth="2" style={{ flexShrink: 0 }} aria-hidden="true">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      )}
      <input
        type="text"
        aria-label={ariaLabel}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="GitHub username"
        style={{
          flex: 1,
          background: 'none',
          border: 'none',
          outline: 'none',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '13px',
          color: 'var(--text)',
          padding: '10px 0',
        }}
      />
    </div>
  )
}
