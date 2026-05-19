type RateLimitBannerProps = {
  resetAt: Date
  onDismiss: () => void
}

function formatResetTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function RateLimitBanner({ resetAt, onDismiss }: RateLimitBannerProps) {
  return (
    <div
      role="alert"
      style={{
        background: 'rgba(248,113,113,0.09)',
        borderBottom: '1px solid rgba(248,113,113,0.25)',
        color: 'var(--err)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '9px 24px',
        fontSize: '13px',
        fontWeight: 500,
      }}
    >
      <span>⚠ GitHub rate limit reached. Resets at {formatResetTime(resetAt)}.</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--err)',
          cursor: 'pointer',
          fontSize: '15px',
          opacity: 0.6,
          transition: 'opacity 0.15s',
          lineHeight: 1,
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.6')}
      >
        ✕
      </button>
    </div>
  )
}
