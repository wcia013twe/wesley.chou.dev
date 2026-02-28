'use client';
/**
 * ConstellationPreview — temporary dev tool.
 * Drop <ConstellationPreview /> anywhere to open a floating panel showing
 * every slot in CONSTELLATIONS with its SVG shape, star indices, and coordinates.
 *
 * Toggle with the "✦ CONST" button bottom-right.
 * Remove the component import when done.
 */

import { useState } from 'react';
import { CONSTELLATIONS } from './getConstellationLines.js';

// ── SVG renderer for one constellation ──────────────────────────────────────
function ConstellationSVG({
  def,
  size = 200,
  showIdx = true,
  showCoords = false,
}: {
  def: NonNullable<(typeof CONSTELLATIONS)[number]>;
  size?: number;
  showIdx?: boolean;
  showCoords?: boolean;
}) {
  const pad = 28;
  const inner = size - pad * 2;

  // Bounding box of X/Y (ignore Z)
  const xs = def.stars.map((s) => s[0]);
  const ys = def.stars.map((s) => s[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const sc    = Math.min(inner / spanX, inner / spanY);

  // Map star [x,y] → SVG pixel coords (Y flipped so +Y = up)
  const cx = (x: number) => pad + (x - minX) * sc + (inner - spanX * sc) / 2;
  const cy = (y: number) => size - pad - (y - minY) * sc - (inner - spanY * sc) / 2;

  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      {/* Lines */}
      {def.segments.map(([i, j], k) => (
        <line
          key={k}
          x1={cx(def.stars[i][0])} y1={cy(def.stars[i][1])}
          x2={cx(def.stars[j][0])} y2={cy(def.stars[j][1])}
          stroke="rgba(136,153,255,0.65)"
          strokeWidth={1.2}
        />
      ))}
      {/* Stars */}
      {def.stars.map((s, i) => (
        <g key={i}>
          {/* Glow */}
          <circle cx={cx(s[0])} cy={cy(s[1])} r={5} fill="rgba(180,200,255,0.10)" />
          <circle cx={cx(s[0])} cy={cy(s[1])} r={2.5} fill="white" />
          {showIdx && (
            <text
              x={cx(s[0]) + 5}
              y={cy(s[1]) - 5}
              fontSize={9}
              fill="rgba(160,200,255,0.9)"
              fontFamily="ui-monospace,monospace"
            >
              {i}
            </text>
          )}
          {showCoords && (
            <text
              x={cx(s[0]) + 5}
              y={cy(s[1]) + 4}
              fontSize={8}
              fill="rgba(120,180,200,0.7)"
              fontFamily="ui-monospace,monospace"
            >
              {s[0]},{s[1]}
            </text>
          )}
        </g>
      ))}
      {/* Draw-order label on each segment midpoint */}
      {def.segments.map(([i, j], k) => {
        const mx = (cx(def.stars[i][0]) + cx(def.stars[j][0])) / 2;
        const my = (cy(def.stars[i][1]) + cy(def.stars[j][1])) / 2;
        return (
          <text key={k} x={mx} y={my} fontSize={8} fill="rgba(255,200,100,0.55)"
            fontFamily="ui-monospace,monospace" textAnchor="middle">
            {k}
          </text>
        );
      })}
    </svg>
  );
}

// ── Main panel ───────────────────────────────────────────────────────────────
export default function ConstellationPreview() {
  const [open, setOpen]         = useState(false);
  const [showCoords, setCoords] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: 'fixed', bottom: 18, right: 18, zIndex: 9999,
          background: 'rgba(20,24,60,0.92)', border: '1px solid rgba(100,136,255,0.45)',
          color: 'rgba(180,200,255,0.9)', fontFamily: 'ui-monospace,monospace',
          fontSize: 11, letterSpacing: '0.12em', padding: '6px 12px',
          borderRadius: 8, cursor: 'pointer',
        }}
      >
        ✦ CONST
      </button>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(4,6,20,0.92)', backdropFilter: 'blur(6px)',
          overflowY: 'auto', padding: 24,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <span style={{ color: 'white', fontFamily: 'ui-monospace,monospace',
              fontSize: 13, letterSpacing: '0.15em' }}>
              CONSTELLATION EDITOR
            </span>
            <label style={{ color: 'rgba(160,200,255,0.8)', fontSize: 11,
              fontFamily: 'ui-monospace,monospace', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: 6 }}>
              <input type="checkbox" checked={showCoords}
                onChange={(e) => setCoords(e.target.checked)} />
              show coords
            </label>
            <span style={{ marginLeft: 'auto', color: 'rgba(120,160,255,0.5)',
              fontSize: 10, fontFamily: 'ui-monospace,monospace' }}>
              white = star · yellow = segment draw order · blue = index
            </span>
            <button onClick={() => setOpen(false)} style={{
              background: 'none', border: '1px solid rgba(255,100,100,0.4)',
              color: 'rgba(255,120,120,0.8)', borderRadius: 6, padding: '4px 10px',
              cursor: 'pointer', fontFamily: 'ui-monospace,monospace', fontSize: 11,
            }}>close</button>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {CONSTELLATIONS.map((def, idx) => (
              <div key={idx} style={{
                background: 'rgba(10,14,40,0.85)', border: '1px solid rgba(80,110,220,0.30)',
                borderRadius: 12, padding: 14, cursor: 'pointer',
                outline: expanded === idx ? '1px solid rgba(130,160,255,0.6)' : 'none',
              }}
                onClick={() => setExpanded(expanded === idx ? null : idx)}
              >
                {/* Slot header */}
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  marginBottom: 10, alignItems: 'baseline' }}>
                  <span style={{ color: 'rgba(200,215,255,0.9)', fontFamily: 'ui-monospace,monospace',
                    fontSize: 12, fontWeight: 700 }}>
                    [{idx}] {def ? def.name : '—'}
                  </span>
                  {def && (
                    <span style={{ color: 'rgba(130,160,255,0.6)', fontSize: 10,
                      fontFamily: 'ui-monospace,monospace' }}>
                      {def.stars.length}★ · {def.segments.length} seg
                    </span>
                  )}
                </div>

                {def ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'center',
                      background: 'rgba(6,8,28,0.6)', borderRadius: 8 }}>
                      <ConstellationSVG
                        def={def}
                        size={expanded === idx ? 320 : 200}
                        showCoords={showCoords}
                      />
                    </div>

                    {/* Star table when expanded */}
                    {expanded === idx && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ color: 'rgba(130,160,255,0.6)', fontSize: 9,
                          fontFamily: 'ui-monospace,monospace', letterSpacing: '0.15em',
                          marginBottom: 6 }}>STARS</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 3 }}>
                          {def.stars.map((s, si) => (
                            <div key={si} style={{ fontFamily: 'ui-monospace,monospace', fontSize: 10,
                              color: 'rgba(180,210,255,0.75)', background: 'rgba(20,30,80,0.4)',
                              borderRadius: 4, padding: '2px 6px' }}>
                              <span style={{ color: 'rgba(130,160,255,0.8)' }}>[{si}]</span> {s[0]},{s[1]},{s[2]}
                            </div>
                          ))}
                        </div>
                        <div style={{ color: 'rgba(130,160,255,0.6)', fontSize: 9,
                          fontFamily: 'ui-monospace,monospace', letterSpacing: '0.15em',
                          margin: '8px 0 4px' }}>SEGMENTS (draw order)</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                          {def.segments.map(([a, b], si) => (
                            <div key={si} style={{ fontFamily: 'ui-monospace,monospace', fontSize: 10,
                              color: 'rgba(255,210,120,0.75)', background: 'rgba(40,30,10,0.5)',
                              borderRadius: 4, padding: '2px 6px' }}>
                              {si}: [{a}→{b}]
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ height: 80, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'rgba(100,120,180,0.35)',
                    fontFamily: 'ui-monospace,monospace', fontSize: 11 }}>
                    null — skipped
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
