import { useState } from 'react'
import { WelcomeModal } from './WelcomeModal'

const OCTOCAT_ICON = (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
)

type HeaderProps = {
  showShare: boolean
}

export function Header({ showShare }: HeaderProps) {
  const [copied, setCopied] = useState(false)

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '58px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(5,8,15,0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: 700, letterSpacing: '-0.3px' }}>
        <span style={{ color: 'var(--c1)', display: 'flex' }}>{OCTOCAT_ICON}</span>
        <span>
          <span style={{ color: 'var(--c1)' }}>git</span>
          <span style={{ color: 'var(--dim)', margin: '0 1px' }}>/</span>
          <span className="text-gradient">compare</span>
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {showShare && (
          <button
            onClick={handleShare}
            style={{
              background: copied ? 'var(--c2-a)' : 'none',
              border: `1px solid ${copied ? 'var(--c2)' : 'var(--border-2)'}`,
              color: copied ? 'var(--c2)' : 'var(--sub)',
              fontFamily: 'inherit',
              fontSize: '12px',
              fontWeight: 500,
              padding: '6px 13px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.18s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={e => {
              if (!copied) {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = 'var(--c1)'
                el.style.color = 'var(--c1)'
                el.style.background = 'var(--c1-a)'
              }
            }}
            onMouseLeave={e => {
              if (!copied) {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = 'var(--border-2)'
                el.style.color = 'var(--sub)'
                el.style.background = 'none'
              }
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            {copied ? 'Copied!' : 'Share'}
          </button>
        )}
        <WelcomeModal />
      </div>
    </header>
  )
}
