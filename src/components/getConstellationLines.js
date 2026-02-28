import * as THREE from "three";

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// One constellation per career entry (8 total).
// Coordinates are in local space; they get offset by `position` at construction time.
// Stars spread ±12 X, ±8 Y, ±8 Z from entry center.
// Segments are ordered for aesthetic draw-in: hub-and-spoke first, outer edges last.
// 5 constellations cycle across career entries via definitionIndex % 5.
// With 8 entries: 0→Big Dipper, 1→Orion, 2→Cassiopeia, 3→Cygnus, 4→Scorpius, 0→Big Dipper, 1→Orion, 2→Cassiopeia
export const CONSTELLATIONS = [
  // 0: "Big Dipper" — bowl then handle sweep (scale: 1.2 → slightly larger than others)
  {
    name: "Big Dipper",
    scale: 1.2,
    stars: [
      [5, 3.5, 0], // 0 Dubhe (top-right after flip)
      [4, 2, 0], // 1 Merak (bottom-right)
      [1.5, 2.5, 0], // 2 Phecda (bottom-left)
      [1.5, 4, 0], // 3 Megrez (top-left)
      [-1, 5, 0], // 4 Alioth (handle start – inverted)
      [-2, 6.5, 0], // 5 Mizar
      [-4, 7, 0], // 6 Alkaid
    ],
    segments: [
      // Bowl – trapezoid
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],

      // Handle – inverted downward
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  null, // 1 Null
  // 2: "Orion" — belt first for instant recognition
  // Optimized Orion for a vertically-inclined silhouette
  {
    name: "Orion",
    scale: 1.2,
    stars: [
      [-0.5, 8.5, 0], // 0: Meissa (Head)
      [-2.5, 6.5, 0], // 1: Betelgeuse (L Shoulder)
      [2.5, 7.0, 0], // 2: Bellatrix (R Shoulder)
      [-1.2, 1.0, 0], // 3: Alnitak (Belt L)
      [0, 1.4, 0], // 4: Alnilam (Belt C)
      [1.2, 1.6, 0], // 5: Mintaka (Belt R)
      [-2.5, -5.0, 0], // 6: Saiph (L Foot)
      [3.5, -4.5, 0], // 7: Rigel (R Foot)
      [5, 10.5, 0], //  8: Bow Top
      [6.5, 10.0, 0], //  9: Bow Mid-Top
      [7.0, 8.0, 0], // 10: Bow Mid
      [6.8, 5, 0], // 11: Bow Mid-Bottom
      [6.0, 4.5, 0], // 12: Bow Bottom

      // --- The Raised Club ---
      [-4.5, 9.0, 0], // 13: Club Base (above L Shoulder)
      [-5.5, 11.5, 0], // 14: Club Mid
      [-4, 14.5, 0], // 15: Club Tip
      [-2.5, 14.5, 0], // 16: Club Tip
      [-4, 12, 0], // 17: Club Tip
    ],
    segments: [
      // 1. The Belt (The central anchor)
      [3, 4],
      [4, 5],

      // 2. The Torso (Connecting the anchor to the shoulders)
      [1, 3],
      [2, 5],

      // 3. The Head (Completing the upper body)
      [0, 1],
      [0, 2],

      // 4. The Legs (Downward growth)
      [3, 6],
      [5, 7],
      [6, 7],

      // 5. The Raised Club (Left-side action)
      [1, 13],
      [13, 14],
      [14, 15],
      [14, 17],
      [16, 17],

      // 6. The Bow (Right-side defense)
      [2, 10],
      [10, 9],
      [9, 8],
      [10, 11],
      [11, 12],
    ],
  },
  null, // 2 NULL
  // 3: "Cassiopeia" — compact W zigzag
  {
    name: "Cassiopeia",
    stars: [
      [-4, 4, 0], // 0
      [-2, 2, 0], // 1
      [0, 2.5, 0], // 2 peak
      [2, -0, 0], // 3
      [4, 2, 0], // 4
    ],
    segments: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  null, // 4: null
  // 5: "Cygnus" — spine first, then wings
  {
    name: "Cygnus",
    stars: [
      [0.5, 5.0, 0], // 0: Deneb (Tail/Top)
      [0.0, 1.5, 0], // 1: Sadr (The Hub/Center)
      [0.4, -4.0, 0], // 2: Albireo (The Head/Bottom - long neck)

      // --- Left Wing (Curving back) ---
      [-3.5, 0.5, 0], // 3: L Wing Elbow (Gienah)
      [-6.0, 1.5, 0], // 4: L Wing Tip

      // --- Right Wing (Curving back) ---
      [4, 1.5, 0], // 5: R Wing Elbow (Delta Cygni)
      [5.5, 2.7, 0], // 6: R Wing Tip
      [6.5, 3, 0], // 7
      [7.8, 3.2, 0], //8

      [0, -8.0, 0], // 9: Albireo (The Head/Bottom - long neck)
    ],
    segments: [
      // 1. The Primary Axis (The "Northern Cross" Spine)
      [0, 1], // Deneb (Tail) to Sadr (Hub)
      [1, 2], // Sadr to Neck Mid-point
      [2, 9], // Neck Mid-point to Albireo (The Head) - Complete the line!

      // 2. The Left Wing (Expansion from the Hub)
      [1, 3], // Sadr to L-Wing Elbow
      [3, 4], // L-Wing Elbow to Tip

      // 3. The Right Wing (Expansion from the Hub)
      [1, 5], // Sadr to R-Wing Elbow
      [5, 6], // R-Wing Elbow to Inner Tip
      [6, 7], // Inner Tip to Mid Tip
      [7, 8], // Mid Tip to Far Tip
    ],
  },
  // null, // 6: null
  // 7: "Scorpius" — organic sweep with hooked tail
  {
    name: "Scorpius",
    stars: [
      // --- The Head / Claws (Fan out Up and Right) ---
      [1.5, 4.5, 0], // 0: Top Claw (Acrab)
      [2.5, 3.5, 0], // 1: Middle Claw
      [2.5, 2.0, 0], // 2: Bottom Claw
      [0.0, 2.0, 0], // 3: Antares (The Heart - Anchor)

      // --- The Spine (Curve Down and Left) ---
      [-1.0, 0.5, 0], // 4: Upper body
      [-2.0, -2.0, 0], // 5: Mid body
      [-2.5, -4.5, 0], // 6: Lower body (The deep curve)

      // --- The Stinger (Hook back Right and Up) ---
      [-3.0, -6.5, 0], // 7: Tail base
      [-6, -7.0, 0], // 8: Shaula (The curve bottom)
      [-8, -5.5, 0], // 9: Lesath (The Stinger point)
      [-7.5, -4.5, 0], // 9: Lesath (The Stinger point)
      [-6.5, -3, 0], // 9: Lesath (The Stinger point)
    ],
    segments: [
      // Fan out the head from Antares
      [3, 0],
      [3, 1],
      [3, 2],

      // Connect the spine in a smooth path
      [3, 4],
      [4, 5],
      [5, 6],

      // The "J" hook that brings the stinger back up
      [6, 7],
      [7, 8],
      [8, 9],
      [9, 10],
      [10, 11],
    ],
  },
];

/**
 * Creates a constellation (line segments + star points) anchored at `position`.
 *
 * @param {object} opts
 * @param {THREE.Vector3} opts.position       World-space anchor for this entry.
 * @param {number}        opts.definitionIndex Index into CONSTELLATIONS array.
 * @param {THREE.Texture} opts.circleTexture   Shared circle sprite texture.
 * @param {boolean}       opts.isPro           true = professional (blue), false = academic (teal).
 * @returns {{ group: THREE.Group, starsPoints: THREE.Points,
 *             revealTo(p: number): void, setHighlight(a: boolean): void,
 *             dispose(): void }}
 */
export function getConstellationLines({
  position,
  definitionIndex,
  circleTexture,
  isPro,
  scale = 1.0,
}) {
  const def = CONSTELLATIONS[definitionIndex % CONSTELLATIONS.length];
  if (!def) return null;
  const color = isPro ? 0x8899ff : 0x55ccee;
  const { stars, segments } = def;
  const effectiveScale = scale * (def.scale ?? 1);

  // ── Geometry ────────────────────────────────────────────────────────────────
  // Expand segments into a flat vertex array in draw-sequence order so that
  // BufferGeometry.drawRange drives a natural sequential line reveal.
  // `effectiveScale` combines the call-site scale with any per-definition scale.
  const linePositions = new Float32Array(segments.length * 6); // 2 verts × 3 comps per segment
  for (let k = 0; k < segments.length; k++) {
    const [i, j] = segments[k];
    const a = stars[i];
    const b = stars[j];
    linePositions[k * 6 + 0] = position.x + a[0] * effectiveScale;
    linePositions[k * 6 + 1] = position.y + a[1] * effectiveScale;
    linePositions[k * 6 + 2] = position.z + a[2] * effectiveScale;
    linePositions[k * 6 + 3] = position.x + b[0] * effectiveScale;
    linePositions[k * 6 + 4] = position.y + b[1] * effectiveScale;
    linePositions[k * 6 + 5] = position.z + b[2] * effectiveScale;
  }

  const starPositions = new Float32Array(stars.length * 3);
  for (let k = 0; k < stars.length; k++) {
    starPositions[k * 3 + 0] = position.x + stars[k][0] * effectiveScale;
    starPositions[k * 3 + 1] = position.y + stars[k][1] * effectiveScale;
    starPositions[k * 3 + 2] = position.z + stars[k][2] * effectiveScale;
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  lineGeo.setDrawRange(0, 0); // hidden at start

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

  // ── Materials ───────────────────────────────────────────────────────────────
  const lineMat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.18,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    map: circleTexture,
  });

  // ── Meshes ──────────────────────────────────────────────────────────────────
  const lineSegs = new THREE.LineSegments(lineGeo, lineMat);
  const starsPoints = new THREE.Points(starGeo, starMat);

  const group = new THREE.Group();
  group.add(lineSegs);
  group.add(starsPoints);

  // ── State ───────────────────────────────────────────────────────────────────
  let currentBaseOpacity = 0;
  const totalVerts = linePositions.length / 3; // segments.length * 2

  // ── Public API ──────────────────────────────────────────────────────────────
  function revealTo(progress) {
    const eased = easeInOutCubic(Math.min(1, progress));
    lineGeo.setDrawRange(0, Math.floor(eased * totalVerts));
    currentBaseOpacity = Math.min(progress * 3, 1) * 0.7;
    lineMat.opacity = currentBaseOpacity;
    starMat.opacity = Math.min(progress * 4, 1) * 0.9;
  }

  function setPeek() {
    lineGeo.setDrawRange(0, totalVerts);
    currentBaseOpacity = 0.12;
    lineMat.opacity = 0.12;
    starMat.opacity = 0.18;
  }

  function hide() {
    currentBaseOpacity = 0;
    lineMat.opacity = 0;
    starMat.opacity = 0;
  }

  function setHighlight(active) {
    lineMat.color.set(active ? 0xffffff : color);
    lineMat.opacity = active ? 0.7 : currentBaseOpacity;
    starMat.size = active ? 0.28 : 0.18;
  }

  function dispose() {
    lineGeo.dispose();
    starGeo.dispose();
    lineMat.dispose();
    starMat.dispose();
  }

  return { group, starsPoints, revealTo, setPeek, hide, setHighlight, dispose };
}
