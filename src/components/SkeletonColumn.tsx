function SkeletonBox({ height, width = '100%', style }: { height: string; width?: string; style?: React.CSSProperties }) {
  return (
    <div
      className="shimmer"
      style={{ height, width, borderRadius: '6px', ...style }}
    />
  )
}

export function SkeletonColumn() {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Profile skeleton */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <SkeletonBox height="58px" width="58px" style={{ borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
          <SkeletonBox height="18px" width="55%" />
          <SkeletonBox height="13px" width="38%" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {[0, 1, 2, 3].map(i => (
          <SkeletonBox key={i} height="30px" />
        ))}
      </div>

      {/* Language bar skeleton */}
      <SkeletonBox height="9px" style={{ borderRadius: '999px' }} />

      {/* Repo skeletons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {[0, 1, 2].map(i => (
          <SkeletonBox key={i} height="58px" style={{ borderRadius: '8px' }} />
        ))}
      </div>
    </div>
  )
}
