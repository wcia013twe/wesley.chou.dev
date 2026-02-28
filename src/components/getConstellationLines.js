import * as THREE from 'three';

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// One constellation per career entry (8 total).
// Coordinates are in local space; they get offset by `position` at construction time.
// Stars spread ±12 X, ±8 Y, ±8 Z from entry center.
// Segments are ordered for aesthetic draw-in: hub-and-spoke first, outer edges last.
const CONSTELLATIONS = [
  // 0: Professional — "Navigator" (compass rose)
  {
    name: 'Navigator',
    stars: [
      [  0,  0,  0 ], // 0: center hub
      [  0,  7, -2 ], // 1: north
      [  8,  2,  1 ], // 2: east
      [  4, -5,  3 ], // 3: south-east
      [ -5, -5, -1 ], // 4: south-west
      [ -8,  3,  2 ], // 5: west
      [  3,  6,  4 ], // 6: north-east
    ],
    segments: [[0,1],[0,2],[0,5],[0,4],[0,3],[1,6],[6,2],[2,3],[4,5]],
  },
  // 1: Professional — "Sigma" (lightning career path)
  {
    name: 'Sigma',
    stars: [
      [ -6,  6,  0 ], // 0: top-left
      [  6,  6, -2 ], // 1: top-right
      [  0,  2,  1 ], // 2: mid
      [ -6, -2,  3 ], // 3: mid-left
      [  6, -6, -1 ], // 4: bottom-right
      [  0, -6,  2 ], // 5: bottom-mid
      [ -4,  0, -2 ], // 6: mid-left accent
    ],
    segments: [[0,1],[1,2],[2,3],[3,4],[4,5],[0,6],[6,3]],
  },
  // 2: Professional — "Delta" (launch triangle)
  {
    name: 'Delta',
    stars: [
      [  0,  7,  0 ], // 0: apex
      [ -8, -4,  2 ], // 1: base-left
      [  8, -4, -2 ], // 2: base-right
      [  0, -1,  1 ], // 3: centroid
      [ -4,  2,  3 ], // 4: left mid
      [  4,  2, -1 ], // 5: right mid
    ],
    segments: [[0,3],[3,1],[3,2],[0,4],[0,5],[1,4],[2,5],[4,5]],
  },
  // 3: Academic — "Libra" (scales of balance)
  {
    name: 'Libra',
    stars: [
      [  0,  5,  0 ], // 0: top center
      [ -7,  1,  2 ], // 1: left arm
      [  7,  1, -1 ], // 2: right arm
      [ -9, -3,  1 ], // 3: left plate outer
      [ -5, -3,  3 ], // 4: left plate inner
      [  5, -3, -2 ], // 5: right plate inner
      [  9, -3,  0 ], // 6: right plate outer
      [  0,  0,  1 ], // 7: fulcrum
    ],
    segments: [[7,0],[7,1],[7,2],[1,3],[1,4],[2,5],[2,6],[3,4],[5,6]],
  },
  // 4: Academic — "Vega" (radiant star cluster)
  {
    name: 'Vega',
    stars: [
      [  0,  0,  0 ], // 0: center
      [  5,  5, -2 ], // 1: NE
      [  7, -3,  1 ], // 2: SE
      [  0, -7,  3 ], // 3: S
      [ -7, -3, -2 ], // 4: SW
      [ -5,  5,  1 ], // 5: NW
      [  0,  8, -1 ], // 6: N
    ],
    segments: [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,6],[6,5],[1,2],[4,5]],
  },
  // 5: Academic — "Meridian" (astrolabe cross)
  {
    name: 'Meridian',
    stars: [
      [  0,  0,  0 ], // 0: center
      [  0,  7, -2 ], // 1: up
      [  0, -7,  2 ], // 2: down
      [ -8,  0,  1 ], // 3: left
      [  8,  0, -1 ], // 4: right
      [ -5,  5, -3 ], // 5: upper-left
      [  5,  5,  3 ], // 6: upper-right
    ],
    segments: [[0,1],[0,2],[0,3],[0,4],[1,5],[1,6],[5,3],[6,4]],
  },
  // 6: Academic — "Phoenix" (rising wings)
  {
    name: 'Phoenix',
    stars: [
      [  0, -5,  0 ], // 0: base
      [  0,  2,  1 ], // 1: body mid
      [ -9,  5, -2 ], // 2: left wing tip
      [ -4,  3,  2 ], // 3: left wing mid
      [  9,  5,  3 ], // 4: right wing tip
      [  4,  3, -1 ], // 5: right wing mid
      [  0,  8, -2 ], // 6: head
    ],
    segments: [[0,1],[1,3],[3,2],[1,5],[5,4],[1,6],[2,3],[4,5]],
  },
  // 7: Academic — "Polaris" (fixed north star)
  {
    name: 'Polaris',
    stars: [
      [  0,  0,  0 ], // 0: center
      [  0,  7, -2 ], // 1: top (north)
      [  6,  3,  1 ], // 2: NE
      [ 10,  0, -1 ], // 3: E
      [  6, -4,  2 ], // 4: SE
      [ -6, -4, -2 ], // 5: SW
      [-10,  0,  1 ], // 6: W
      [ -6,  3,  3 ], // 7: NW
      [  3, -6, -3 ], // 8: S
    ],
    segments: [[0,1],[0,2],[0,6],[0,3],[0,5],[0,4],[1,7],[7,6],[2,3],[4,8],[8,5]],
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
    lineMat.opacity = 0;
    starMat.opacity = 0;
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
