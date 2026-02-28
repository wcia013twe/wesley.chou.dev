import * as THREE from 'three';

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// One constellation per career entry (8 total).
// Coordinates are in local space; they get offset by `position` at construction time.
// Stars spread ±12 X, ±8 Y, ±8 Z from entry center.
// Segments are ordered for aesthetic draw-in: hub-and-spoke first, outer edges last.
// 5 constellations cycle across career entries via definitionIndex % 5.
// With 8 entries: 0→Big Dipper, 1→Orion, 2→Cassiopeia, 3→Cygnus, 4→Scorpius, 0→Big Dipper, 1→Orion, 2→Cassiopeia
const CONSTELLATIONS = [
  // 0: "Big Dipper" — bowl then handle sweep (scale: 1.2 → slightly larger than others)
  {
    name: 'Big Dipper',
    scale: 1.2,
    stars: [
      [ -6,  4,  0 ], // 0 Dubhe
      [ -4,  2,  0 ], // 1 Merak
      [ -2,  2,  0 ], // 2 Phecda
      [  0,  3,  0 ], // 3 Megrez
      [  2,  5,  0 ], // 4 Alioth
      [  4,  6,  0 ], // 5 Mizar
      [  6,  7,  0 ], // 6 Alkaid
    ],
    segments: [
      [0,1],[1,2],[2,3],   // bowl
      [3,4],[4,5],[5,6],   // handle
    ],
  },
  // 1: "Orion" — belt first for instant recognition
  {
    name: 'Orion',
    stars: [
      [ -4,  6,  0 ], // 0 Betelgeuse
      [  4,  6,  0 ], // 1 Bellatrix
      [ -2,  2,  0 ], // 2 Alnitak
      [  0,  2,  0 ], // 3 Alnilam
      [  2,  2,  0 ], // 4 Mintaka
      [  3, -4,  0 ], // 5 Rigel
      [ -3, -4,  0 ], // 6 Saiph
    ],
    segments: [
      [2,3],[3,4],   // belt first
      [0,2],[1,4],   // shoulders
      [2,6],[4,5],   // legs
    ],
  },
  // 2: "Cassiopeia" — compact W zigzag
  {
    name: 'Cassiopeia',
    stars: [
      [ -5,  4,  0 ], // 0
      [ -2,  2,  0 ], // 1
      [  0,  5,  0 ], // 2 peak
      [  2,  2,  0 ], // 3
      [  5,  4,  0 ], // 4
    ],
    segments: [
      [0,1],[1,2],[2,3],[3,4],
    ],
  },
  // 3: "Cygnus" — spine first, then wings
  {
    name: 'Cygnus',
    stars: [
      [  0,  6,  0 ], // 0 Deneb
      [  0,  2,  0 ], // 1 Sadr (hub)
      [  0, -4,  0 ], // 2 Albireo
      [ -4,  2,  0 ], // 3 left wing
      [  4,  2,  0 ], // 4 right wing
    ],
    segments: [
      [0,1],[1,2],   // spine first
      [1,3],[1,4],   // wings
    ],
  },
  // 4: "Scorpius" — organic sweep, left to right
  {
    name: 'Scorpius',
    stars: [
      [ -6,  3,  0 ], // 0
      [ -4,  2,  0 ], // 1
      [ -2,  1,  0 ], // 2
      [  0,  0,  0 ], // 3
      [  2, -2,  0 ], // 4
      [  4, -3,  0 ], // 5
      [  6, -2,  0 ], // 6
    ],
    segments: [
      [0,1],[1,2],[2,3],
      [3,4],[4,5],[5,6],
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
export function getConstellationLines({ position, definitionIndex, circleTexture, isPro, scale = 1.0 }) {
  const def   = CONSTELLATIONS[definitionIndex % CONSTELLATIONS.length];
  const color = isPro ? 0x8899ff : 0x55ccee;
  const { stars, segments } = def;

  // ── Geometry ────────────────────────────────────────────────────────────────
  // Expand segments into a flat vertex array in draw-sequence order so that
  // BufferGeometry.drawRange drives a natural sequential line reveal.
  // `scale` shrinks the whole pattern without touching the definition data.
  const linePositions = new Float32Array(segments.length * 6); // 2 verts × 3 comps per segment
  for (let k = 0; k < segments.length; k++) {
    const [i, j] = segments[k];
    const a = stars[i];
    const b = stars[j];
    linePositions[k * 6 + 0] = position.x + a[0] * scale;
    linePositions[k * 6 + 1] = position.y + a[1] * scale;
    linePositions[k * 6 + 2] = position.z + a[2] * scale;
    linePositions[k * 6 + 3] = position.x + b[0] * scale;
    linePositions[k * 6 + 4] = position.y + b[1] * scale;
    linePositions[k * 6 + 5] = position.z + b[2] * scale;
  }

  const starPositions = new Float32Array(stars.length * 3);
  for (let k = 0; k < stars.length; k++) {
    starPositions[k * 3 + 0] = position.x + stars[k][0] * scale;
    starPositions[k * 3 + 1] = position.y + stars[k][1] * scale;
    starPositions[k * 3 + 2] = position.z + stars[k][2] * scale;
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeo.setDrawRange(0, 0); // hidden at start

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

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
  const lineSegs   = new THREE.LineSegments(lineGeo, lineMat);
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
    currentBaseOpacity = Math.min(progress * 3, 1) * 0.70;
    lineMat.opacity    = currentBaseOpacity;
    starMat.opacity    = Math.min(progress * 4, 1) * 0.90;
  }

  function setPeek() {
    lineGeo.setDrawRange(0, totalVerts);
    currentBaseOpacity = 0.12;
    lineMat.opacity    = 0.12;
    starMat.opacity    = 0.18;
  }

  function hide() {
    currentBaseOpacity = 0;
    lineMat.opacity    = 0;
    starMat.opacity    = 0;
  }

  function setHighlight(active) {
    lineMat.color.set(active ? 0xffffff : color);
    lineMat.opacity = active ? 0.70 : currentBaseOpacity;
    starMat.size    = active ? 0.28 : 0.18;
  }

  function dispose() {
    lineGeo.dispose();
    starGeo.dispose();
    lineMat.dispose();
    starMat.dispose();
  }

  return { group, starsPoints, revealTo, setPeek, hide, setHighlight, dispose };
}
