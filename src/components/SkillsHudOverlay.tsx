import { useEffect, useState } from 'react';

const MONO  = 'ui-monospace, SFMono-Regular, monospace';
const GLOW  = '0 0 8px rgba(34,211,238,0.65), 0 0 16px rgba(34,211,238,0.22)';
const GLOW2 = '0 0 5px rgba(34,211,238,0.45)';

// ── Static waveform polyline points ──────────────────────────────────────────
const WAVE_PTS = '0,13 8,10 16,14 24,4 32,9 40,15 48,3 56,11 64,7 72,14 80,5 88,12 96,16 104,6 112,11 120,3 128,13 136,8 144,5 152,12 160,7 168,13';

// ── Hex log helpers ───────────────────────────────────────────────────────────
const MODULES = [
  'NEURAL_CORE', 'REACT.v18', 'WEBGL.CTX', 'SHADER.FRAG', 'BLOOM.PASS',
  'CSS2D.OBJ',  'GLTF.PARSE', 'DRACO.DEC', 'MOTION.LIB', 'ROUTER.SYS',
  'THREE.CORE', 'LANG.CHAIN', 'SUPABASE.DB', 'FASTAPI.SRV', 'FIBER.CTX',
];
function randHex() {
  return '0x' + Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
}
function randLog(): string {
  const r = Math.random();
  if (r < 0.45) return `${randHex()} ··· OK`;
  if (r < 0.70) return `MODULE: ${MODULES[Math.floor(Math.random() * MODULES.length)]}`;
  if (r < 0.85) return `LOAD ${randHex()} ··· DONE`;
  return `${randHex()} ··· RETRY`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SkillsHudOverlay() {
  const [xyz, setXyz]       = useState({ x: 124.7281, y: -39.4492, z: 58.1837 });
  const [log, setLog]       = useState<string[]>(() => Array.from({ length: 5 }, randLog));
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const coordT  = setInterval(() => {
      setXyz(c => ({
        x: c.x + (Math.random() - 0.5) * 0.35,
        y: c.y + (Math.random() - 0.5) * 0.28,
        z: c.z + (Math.random() - 0.5) * 0.22,
      }));
    }, 220);
    const logT    = setInterval(() => setLog(p => [...p.slice(-4), randLog()]), 1800);
    const uptimeT = setInterval(() => setUptime(t => t + 1), 1000);
    return () => { clearInterval(coordT); clearInterval(logT); clearInterval(uptimeT); };
  }, []);

  const fmtCoord = (v: number) =>
    `${v >= 0 ? '+' : '-'}${Math.abs(v).toFixed(4).padStart(8, '0')}`;

  const fmtUptime = (s: number) => {
    const h  = String(Math.floor(s / 3600)).padStart(2, '0');
    const m  = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${ss}`;
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      style={{ zIndex: 2 }}
    >

      {/* ── Hierarchical grid with centred vignette mask ─────────────────── */}
      {/*
          Layer order (bottom → top):
            1. Minor grid  — 20 px cells, 0.5 px, 5 % opacity
            2. Major grid  — 100 px cells, 1 px, 12 % opacity
            3. Intersection dots — 3 px dots at every major-grid intersection
          Vignette mask: transparent at centre (inner ~45 %), opaque at edges
      */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          /* Large centre vignette — grid visible only in the outermost ~25 % band */
          maskImage:        'radial-gradient(ellipse at 50% 50%, transparent 65%, black 88%)',
          WebkitMaskImage:  'radial-gradient(ellipse at 50% 50%, transparent 65%, black 88%)',
        }}
      >
        <defs>
          {/* ① Minor sub-grid: 20 px (= 100 / 5), ultra-thin, very faint */}
          <pattern id="hud-minor" width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1="20" y1="0"  x2="0"  y2="0"  stroke="rgba(0,255,255,0.05)" strokeWidth="0.5" />
            <line x1="0"  y1="0"  x2="0"  y2="20" stroke="rgba(0,255,255,0.05)" strokeWidth="0.5" />
          </pattern>

          {/* ② Major grid: 100 px, 1 px, 12 % cyan */}
          <pattern id="hud-major" width="100" height="100" patternUnits="userSpaceOnUse">
            <line x1="100" y1="0"   x2="0"   y2="0"   stroke="rgba(0,255,255,0.12)" strokeWidth="1" />
            <line x1="0"   y1="0"   x2="0"   y2="100" stroke="rgba(0,255,255,0.12)" strokeWidth="1" />
          </pattern>

          {/*
            ③ Intersection dots at every 100 px major-grid point.
            Placing r=1.5 circles at all four corners of the tile:
            when four adjacent tiles meet at an intersection each
            contributes one quadrant, forming a complete ~3 px dot.
          */}
          <pattern id="hud-dots" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="0"   cy="0"   r="1.5" fill="rgba(0,255,255,0.38)" />
            <circle cx="100" cy="0"   r="1.5" fill="rgba(0,255,255,0.38)" />
            <circle cx="0"   cy="100" r="1.5" fill="rgba(0,255,255,0.38)" />
            <circle cx="100" cy="100" r="1.5" fill="rgba(0,255,255,0.38)" />
          </pattern>
        </defs>

        {/* Render layers in order */}
        <rect width="100%" height="100%" fill="url(#hud-minor)" />
        <rect width="100%" height="100%" fill="url(#hud-major)" />
        <rect width="100%" height="100%" fill="url(#hud-dots)"  />
      </svg>

      {/* ── Top-right: XYZ coordinates + status ─────────────────────────── */}
      <div style={{ position: 'absolute', top: 20, right: 20, fontFamily: MONO, textAlign: 'right' }}>
        {(['X', 'Y', 'Z'] as const).map((axis, i) => (
          <div
            key={axis}
            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 6, marginBottom: 3 }}
          >
            <span style={{ fontSize: '9px', color: 'rgba(34,211,238,0.42)', letterSpacing: '0.12em' }}>
              {axis}:
            </span>
            <span style={{
              fontSize: '11px', letterSpacing: '0.10em',
              color: 'rgba(34,211,238,0.80)', textShadow: GLOW2,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {fmtCoord([xyz.x, xyz.y, xyz.z][i])}
            </span>
          </div>
        ))}

        {/* Divider */}
        <div style={{ height: '0.5px', background: 'rgba(34,211,238,0.20)', margin: '7px 0' }} />

        <div style={{ fontSize: '9px', letterSpacing: '0.16em', color: 'rgba(34,211,238,0.65)', textShadow: GLOW2 }}>
          STATUS: NOMINAL
        </div>
        <div style={{ fontSize: '8px', letterSpacing: '0.12em', color: 'rgba(34,211,238,0.35)', marginTop: 3 }}>
          UPTIME: {fmtUptime(uptime)}
        </div>
      </div>

      {/* ── Bottom-left: scrolling hex log ───────────────────────────────── */}
      <div style={{ position: 'absolute', bottom: 20, left: 20, fontFamily: MONO }}>
        {log.map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: '9px', letterSpacing: '0.10em', marginBottom: 3,
              color: i === log.length - 1 ? 'rgba(34,211,238,0.70)' : 'rgba(34,211,238,0.32)',
              textShadow: i === log.length - 1 ? GLOW2 : 'none',
            }}
          >
            <span style={{ color: 'rgba(34,211,238,0.28)', marginRight: 6 }}>{'>'}</span>
            {line}
          </div>
        ))}
      </div>

      {/* ── Bottom-right: version + waveform ─────────────────────────────── */}
      <div style={{ position: 'absolute', bottom: 20, right: 20, fontFamily: MONO, textAlign: 'right' }}>
        {/* Waveform */}
        <svg
          width="170" height="18"
          style={{ display: 'block', marginLeft: 'auto', filter: 'drop-shadow(0 0 4px rgba(34,211,238,0.50))' }}
        >
          <polyline
            points={WAVE_PTS}
            fill="none"
            stroke="rgba(34,211,238,0.62)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>

        {/* Divider */}
        <div style={{ height: '0.5px', background: 'rgba(34,211,238,0.20)', margin: '5px 0' }} />

        <div style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(34,211,238,0.72)', textShadow: GLOW }}>
          v.2.0.4
        </div>
        <div style={{ fontSize: '8px', letterSpacing: '0.14em', color: 'rgba(34,211,238,0.35)', marginTop: 3 }}>
          BUILD · 20250228
        </div>
      </div>

    </div>
  );
}
