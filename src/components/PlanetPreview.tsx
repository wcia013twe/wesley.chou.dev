// @ts-nocheck
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getFresnelMat } from './solar-system/src/getFresnelMat.js';

interface PlanetPreviewProps {
  img: string;
  rings?: boolean;
  glowColor?: string;
  /** Controls how large the planet renders. Matches categoryPlanets.previewScale. Default 2.2 */
  scale?: number;
}

/**
 * Self-contained Three.js planet renderer.
 * Fills its parent container with a slowly-spinning planet,
 * transparent background so the panel bg shows through.
 */
export default function PlanetPreview({ img, rings = false, glowColor = '#ffffff', scale = 2.2 }: PlanetPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1); // solid black
    container.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    // Camera distance is derived from scale so it always stays outside the planet surface.
    // rings need extra room because the ring geometry inherits planet scale and extends to 1.85x.
    // The constant gap (2.0 / 5.5) controls how close to the surface the camera sits —
    // smaller gap = more immersive; larger gap = planet looks smaller/more distant.
    const camDist = scale + (rings ? 5.5 : 2.0);
    const camera = new THREE.PerspectiveCamera(52, w / h, 0.1, 200);
    // Y offset scales with distance to preserve the "looking up at dome" angle
    camera.position.set(0, -camDist * 0.14, camDist);
    camera.lookAt(0, camDist * 0.28, 0);

    // ── Planet group (tilt + spin) ─────────────────────────────────────────────
    const group = new THREE.Group();
    group.rotation.z = 0.18; // slight axial tilt
    scene.add(group);

    const geo = new THREE.IcosahedronGeometry(1, 8);
    const map = new THREE.TextureLoader().load(`/textures/${img}`);
    const mat = new THREE.MeshStandardMaterial({ map });
    const planet = new THREE.Mesh(geo, mat);
    planet.scale.setScalar(scale);
    group.add(planet);

    // Fresnel rim glow
    const rimMat = getFresnelMat({ rimHex: 0xffffff, facingHex: 0x000000 });
    const rimMesh = new THREE.Mesh(geo, rimMat);
    rimMesh.scale.setScalar(1.015);
    planet.add(rimMesh);

    // Saturn rings
    if (rings) {
      const ringGeo = new THREE.RingGeometry(1.35, 1.85, 64);
      // Remap UVs so the texture wraps radially (prevents squish)
      const pos = ringGeo.attributes.position;
      const uv = ringGeo.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const r = Math.sqrt(x * x + y * y);
        uv.setXY(i, (r - 1.35) / (1.85 - 1.35), 0);
      }
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc2a97a,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI * 0.42;
      planet.add(ring);
    }

    // ── Lighting ──────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    // Key light (sun-side)
    const key = new THREE.DirectionalLight(0xffeedd, 1.8);
    key.position.set(4, 2, 5);
    scene.add(key);

    // Cool fill (night side)
    const fill = new THREE.DirectionalLight(0x3366ff, 0.4);
    fill.position.set(-3, -1, -3);
    scene.add(fill);

    // ── Animation loop ────────────────────────────────────────────────────────
    let animId: number;
    function animate() {
      animId = requestAnimationFrame(animate);
      planet.rotation.y += 0.003;
      renderer.render(scene, camera);
    }
    animate();

    // ── Resize — watch container directly (handles Framer Motion height animations) ──
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      ro.disconnect();
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [img, rings, scale]);

  return <div ref={containerRef} className="w-full h-full" />;
}
