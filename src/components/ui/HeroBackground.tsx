export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Faint red grid */}
      <div className="red-grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />

      {/* Drifting red light orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      {/* Glitch scanbar overlays */}
      <div className="hero-glitch-bar hero-glitch-bar-1" />
      <div className="hero-glitch-bar hero-glitch-bar-2" />
    </div>
  );
}
