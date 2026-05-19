import { useState, useEffect, useRef, useCallback } from 'react'

const SEEN_KEY = 'gh-cmp-v1'

const OCTOCAT = (
  <svg width="26" height="26" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
)

export function WelcomeModal() {
  const [open, setOpen] = useState(() => !localStorage.getItem(SEEN_KEY))
  const gotItRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const dismiss = useCallback(() => {
    localStorage.setItem(SEEN_KEY, '1')
    setOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => {
        gotItRef.current?.focus()
      })

      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
          dismiss()
        }
      }

      document.addEventListener('keydown', handleKeyDown)

      return () => {
        cancelAnimationFrame(raf)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [open, dismiss])

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-label="About this tool"
        style={{
          background: 'none',
          border: '1px solid var(--border-2)',
          color: 'var(--sub)',
          fontFamily: 'inherit',
          fontSize: '12px',
          fontWeight: 500,
          padding: '10px 13px',
          minHeight: '44px',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'border-color 0.18s, color 0.18s, background 0.18s',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.borderColor = 'var(--c1)'
          el.style.color = 'var(--c1)'
          el.style.background = 'var(--c1-a)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.borderColor = 'var(--border-2)'
          el.style.color = 'var(--sub)'
          el.style.background = 'none'
        }}
      >
        About
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(10px)',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) dismiss() }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            style={{
              maxWidth: '460px',
              width: '100%',
              margin: '0 20px',
              background: 'var(--surface)',
              border: '1px solid var(--border-2)',
              borderRadius: 'var(--r-lg)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(129,140,248,0.12)',
              animation: 'modal-in 280ms cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            {/* Header section */}
            <div
              style={{
                background: 'linear-gradient(135deg, var(--c1-a) 0%, var(--c2-a) 100%)',
                borderBottom: '1px solid var(--border)',
                padding: '28px 28px 22px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, var(--c1), var(--c2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  boxShadow: '0 8px 28px var(--c1-glow)',
                }}
              >
                {OCTOCAT}
              </div>
              <h2
                id="modal-title"
                style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px', color: 'var(--text)' }}
              >
                GitHub Compare
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--sub)' }}>
                Developer profile showdowns, side by side
              </p>
            </div>

            {/* Body */}
            <div style={{ padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {[
                { color: 'var(--c1)', text: 'Compare any two GitHub developers side-by-side.' },
                { color: 'var(--c2)', text: 'Enter two usernames, press Enter, and get a shareable URL.' },
                { color: 'var(--win)', text: 'Uses the public GitHub API — heavy use may hit rate limits.' },
              ].map(({ color, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: color,
                      flexShrink: 0,
                      marginTop: '5px',
                    }}
                  />
                  <span style={{ fontSize: '13.5px', color: 'var(--sub)', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding: '0 28px 24px' }}>
              <button
                ref={gotItRef}
                onClick={dismiss}
                onKeyDown={e => {
                  if (e.key === 'Tab') {
                    e.preventDefault()
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(90deg, var(--c1), var(--c2))',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 700,
                  borderRadius: '9px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'opacity 0.18s, transform 0.18s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.opacity = '0.88'
                  el.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.opacity = '1'
                  el.style.transform = 'translateY(0)'
                }}
              >
                Got it — let's go
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
