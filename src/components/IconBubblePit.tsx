import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { Tooltip, TooltipTrigger, TooltipPanel } from "@/components/animate-ui/components/base/tooltip";
import { RiResetLeftFill } from "react-icons/ri";
type Bubble = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  popped: boolean;
  gravityOn: boolean;
  // hover behavior state
  ax: number; // anchor x
  ay: number; // anchor y
  phase: number; // oscillator phase
  fAmp: number; // acceleration amplitude (px/s^2)
  fSpeed: number; // phase speed (rad/s)
};

export interface IconBubblePitProps {
  items: React.ReactNode[];
  className?: string;
  height?: number; // px
  radius?: number; // px bubble radius
  gravity?: number; // px/s^2
  restitution?: number; // bounce energy [0..1]
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const IconBubblePit: React.FC<IconBubblePitProps> = ({
  items,
  className = "",
  height = 220,
  radius = 28,
  gravity = 1400, // tuned for ~60fps
  restitution = 0.55,
}) => {
  const getNodeLabel = (node: React.ReactNode): string => {
    if (React.isValidElement(node)) {
      const props: any = node.props || {};
      return (
        props.name ||
        props.title ||
        props["aria-label"] ||
        props.alt ||
        ""
      );
    }
    if (typeof node === "string") return node;
    return "";
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ width: 0, height });
  const bubblesRef = useRef<Bubble[]>([]);
  const [version, setVersion] = useState(0); // force re-render on pop/init
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const gravityActiveRef = useRef(false);

  // Measure container width
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const resize = () => {
      const rect = el.getBoundingClientRect();
      setBounds({ width: rect.width, height });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [height]);

  // Initialize bubbles whenever items change or bounds available
  useEffect(() => {
    if (!bounds.width || items.length === 0) return;
    const margin = radius + 6;
    const w = Math.max(bounds.width, margin * 2 + 1);

    const bubbles: Bubble[] = items.map((_, i) => ({
      id: i,
      x: clamp(Math.random() * (w - 2 * margin) + margin, margin, w - margin),
      y: clamp(Math.random() * (height - 2 * margin) + margin, margin, height - margin),
      vx: (Math.random() * 2 - 1) * 60,
      vy: (Math.random() * 2 - 1) * 60,
      r: radius,
      popped: false,
      gravityOn: false,
      ax: 0,
      ay: 0,
      phase: Math.random() * Math.PI * 2,
      fAmp: 28 + Math.random() * 18, // ~28-46 px/s^2
      fSpeed: 0.5 + Math.random() * 0.6, // ~0.5-1.1 rad/s
    }));
    // set anchors to initial positions
    for (const b of bubbles) {
      b.ax = b.x;
      b.ay = b.y;
    }
    bubblesRef.current = bubbles;
    gravityActiveRef.current = false;
    setVersion(v => v + 1);
  }, [items, bounds.width, height, radius]);

  // Physics loop
  useEffect(() => {
    const step = (ts: number) => {
      const last = lastTsRef.current ?? ts;
      const dt = Math.min((ts - last) / 1000, 1 / 20); // cap dt
      lastTsRef.current = ts;

      const bubbles = bubblesRef.current;
      const W = bounds.width;
      const H = bounds.height;

      // Hover tuning
      const SPRING = 0.08; // pull back to anchor
      for (const b of bubbles) {
        // Hover forces for non-popped bubbles
        if (!b.gravityOn) {
          // spring toward anchor
          b.vx += (b.ax - b.x) * SPRING * dt * 60; // scale up to feel responsive
          b.vy += (b.ay - b.y) * SPRING * dt * 60;
          // sinusoidal drift
          b.vx += Math.cos(b.phase) * b.fAmp * dt;
          b.vy += Math.sin(b.phase * 0.85) * b.fAmp * dt;
          b.phase += b.fSpeed * dt;
        } else {
          // Apply gravity only to popped ones (or those flagged)
          b.vy += gravity * dt;
        }
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // Wall collisions
        if (b.x - b.r < 0) {
          b.x = b.r;
          b.vx = -b.vx * restitution;
        } else if (b.x + b.r > W) {
          b.x = W - b.r;
          b.vx = -b.vx * restitution;
        }
        if (b.y - b.r < 0) {
          b.y = b.r;
          b.vy = -b.vy * restitution;
        } else if (b.y + b.r > H) {
          b.y = H - b.r;
          b.vy = -Math.abs(b.vy) * restitution; // bounce upward
        }

        // Mild damping to settle
        b.vx *= 0.995;
        b.vy *= 0.995;
      }

      // Simple pairwise collision resolution (position + velocity)
      // One pass is usually enough for small overlaps; increase iterations if needed
      const restitutionPair = Math.max(0.2, Math.min(0.98, restitution));
      const n = bubbles.length;
      for (let i = 0; i < n; i++) {
        const bi = bubbles[i];
        for (let j = i + 1; j < n; j++) {
          const bj = bubbles[j];
          const dx = bj.x - bi.x;
          const dy = bj.y - bi.y;
          const minDist = bi.r + bj.r;
          const distSq = dx * dx + dy * dy;
          if (distSq === 0) continue;
          if (distSq < minDist * minDist) {
            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;
            // Positional correction: split push-out based on (inverse) mass (use r^2 as mass proxy)
            const mi = Math.max(1, bi.r * bi.r);
            const mj = Math.max(1, bj.r * bj.r);
            const invSum = 1 / (mi + mj);
            const pushI = overlap * (mj * invSum);
            const pushJ = overlap * (mi * invSum);
            bi.x -= nx * pushI;
            bi.y -= ny * pushI;
            bj.x += nx * pushJ;
            bj.y += ny * pushJ;

            // Velocity response along collision normal (elastic-ish)
            const rvx = bj.vx - bi.vx;
            const rvy = bj.vy - bi.vy;
            const velAlongNormal = rvx * nx + rvy * ny;
            if (velAlongNormal < 0) {
              const jImpulse = (-(1 + restitutionPair) * velAlongNormal) / (1 / mi + 1 / mj);
              const ix = (jImpulse / mi) * nx;
              const iy = (jImpulse / mi) * ny;
              const jx = (jImpulse / mj) * nx;
              const jy = (jImpulse / mj) * ny;
              bi.vx -= ix;
              bi.vy -= iy;
              bj.vx += jx;
              bj.vy += jy;
            }
          }
        }
      }

      // Paint via CSS transform
      const el = containerRef.current;
      if (el) {
        for (let i = 0; i < bubbles.length; i++) {
          const b = bubbles[i];
          const node = el.querySelector<HTMLDivElement>(`[data-bubble-id="${b.id}"]`);
          if (!node) continue;
          node.style.transform = `translate(${b.x - b.r}px, ${b.y - b.r}px)`;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [bounds.width, bounds.height, gravity, restitution]);

  const onPop = (id: number) => {
    const b = bubblesRef.current.find(bb => bb.id === id);
    if (!b) return;
    if (!b.popped) {
      // First click: mark as popped and start falling
      b.popped = true;
      b.gravityOn = true;
      // Ensure a slight downward nudge so it starts moving
      if (Math.abs(b.vy) < 40) b.vy += 60;
      setVersion(v => v + 1);
    }
  };

  const resetAndScatter = useCallback(() => {
    const W = bounds.width;
    const H = bounds.height;
    const bubbles = bubblesRef.current;
    for (const b of bubbles) {
      b.popped = false;
      b.gravityOn = false;
      // Give a random outward kick
      const angle = Math.random() * Math.PI * 2;
      const speed = 220 + Math.random() * 220; // px/s
      b.vx = Math.cos(angle) * speed;
      b.vy = Math.sin(angle) * speed;
      // Keep inside bounds just in case
      b.x = clamp(b.x, b.r, Math.max(b.r, W - b.r));
      b.y = clamp(b.y, b.r, Math.max(b.r, H - b.r));
    }
    setVersion(v => v + 1);
  }, [bounds.width, bounds.height]);

  // Render all bubbles (popped stay visible with different style)
  const bubbles = bubblesRef.current;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height: bounds.height }}
      data-version={version}
    >
      {bubbles.map(b => {
        const label = getNodeLabel(items[b.id]);
        return (
          <Tooltip key={b.id} delay={0}>
            <TooltipTrigger
              data-bubble-id={b.id}
              onClick={() => onPop(b.id)}
              className="absolute will-change-transform cursor-pointer select-none flex items-center justify-center rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
              style={{
                width: b.r * 2,
                height: b.r * 2,
                transform: `translate(${b.x - b.r}px, ${b.y - b.r}px)`,
                background: b.popped
                  ? "linear-gradient(180deg, rgba(167,139,250,0.35), rgba(99,102,241,0.35))"
                  : "radial-gradient(120% 120% at 20% 15%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.65) 35%, rgba(255,255,255,0.15) 70%, rgba(255,255,255,0.0) 100%), linear-gradient(160deg, rgba(147,51,234,0.25), rgba(99,102,241,0.25))",
                border: b.popped ? "2px solid rgba(167,139,250,0.85)" : "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <div className="w-[70%] h-[70%] flex items-center justify-center">
                {items[b.id]}
              </div>
            </TooltipTrigger>
            <TooltipPanel side="top" sideOffset={0}>{label}</TooltipPanel>
          </Tooltip>
        );
      })}
      <button
        type="button"
        onClick={resetAndScatter}
        className="absolute z-10 bottom-0 right-0  rounded-md  text-primary text-lg shadow hover:opacity-90 transition"
        aria-label="Scatter and reset bubbles"
      >
        <RiResetLeftFill />
      </button>
    </div>
  );
};

export default IconBubblePit;
