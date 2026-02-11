import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ParticleField Component
 *
 * A background particle system using React Three Fiber for the Projects page.
 * Renders 50-100 particles (desktop) or 25 (mobile) with slow drift animation.
 * Mix of white (60%) and purple (40%) particles with scroll response.
 *
 * @param scrollY - Current scroll position to make particles respond to scroll
 */

interface ParticleFieldProps {
  scrollY?: number;
}

/**
 * Particles Component (Internal)
 * Handles particle rendering and animation logic
 */
function Particles({ scrollY = 0 }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const velocitiesRef = useRef<Float32Array | null>(null);

  // Detect reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Detect mobile device for particle count reduction
  const isMobile = useMemo(() => {
    return window.innerWidth < 768;
  }, []);

  // Generate particle positions, colors, and velocities
  const { positions, colors, sizes } = useMemo(() => {
    const count = isMobile ? 25 : 100;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random position across viewport space
      positions[i * 3] = (Math.random() - 0.5) * 50;     // x: -25 to 25
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50; // y: -25 to 25
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30; // z: -15 to 15

      // 60% white, 40% purple
      const isWhite = Math.random() < 0.6;
      if (isWhite) {
        colors[i * 3] = 1.0;     // R
        colors[i * 3 + 1] = 1.0; // G
        colors[i * 3 + 2] = 1.0; // B
      } else {
        // Purple: #9333ea -> RGB(147, 51, 234) normalized
        colors[i * 3] = 147 / 255;     // R
        colors[i * 3 + 1] = 51 / 255;  // G
        colors[i * 3 + 2] = 234 / 255; // B
      }

      // Random size between 1-2px
      sizes[i] = 1 + Math.random();

      // Random drift velocity (slow movement)
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;     // x velocity
      velocities[i * 3 + 1] = 0.01 + Math.random() * 0.02;  // y velocity (slightly upward)
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01; // z velocity
    }

    velocitiesRef.current = velocities;
    return { positions, colors, sizes };
  }, [isMobile]);

  // Pause rendering when page is hidden (performance optimization)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (pointsRef.current) {
        pointsRef.current.visible = !document.hidden;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Particle drift animation with scroll response
  useFrame(() => {
    if (!pointsRef.current || prefersReducedMotion || !velocitiesRef.current) return;

    const geometry = pointsRef.current.geometry;
    const positionAttr = geometry.attributes.position as THREE.BufferAttribute;
    const velocities = velocitiesRef.current;

    // Apply drift and scroll effects
    for (let i = 0; i < positions.length / 3; i++) {
      const idx = i * 3;

      // Apply base drift velocity
      positionAttr.array[idx] += velocities[idx];         // x
      positionAttr.array[idx + 1] += velocities[idx + 1]; // y
      positionAttr.array[idx + 2] += velocities[idx + 2]; // z

      // Wrapping: particles that exit viewport respawn on opposite side
      if (positionAttr.array[idx] > 25) positionAttr.array[idx] = -25;
      if (positionAttr.array[idx] < -25) positionAttr.array[idx] = 25;
      if (positionAttr.array[idx + 1] > 25) positionAttr.array[idx + 1] = -25;
      if (positionAttr.array[idx + 1] < -25) positionAttr.array[idx + 1] = 25;
      if (positionAttr.array[idx + 2] > 15) positionAttr.array[idx + 2] = -15;
      if (positionAttr.array[idx + 2] < -15) positionAttr.array[idx + 2] = 15;
    }

    positionAttr.needsUpdate = true;
  });

  // React to scroll changes (subtle upward drift at 0.2x scroll velocity)
  useEffect(() => {
    if (!pointsRef.current || prefersReducedMotion) return;

    const geometry = pointsRef.current.geometry;
    const positionAttr = geometry.attributes.position as THREE.BufferAttribute;

    // Apply small upward offset based on scroll
    for (let i = 0; i < positions.length / 3; i++) {
      positionAttr.array[i * 3 + 1] -= scrollY * 0.0002; // Subtle scroll response
    }

    positionAttr.needsUpdate = true;
  }, [scrollY, positions.length, prefersReducedMotion]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.4}
        vertexColors={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * ParticleField Component (Main Export)
 * Renders the Three.js canvas with particles in the background
 */
export default function ParticleField({ scrollY = 0 }: ParticleFieldProps) {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        dpr={[1, 2]} // Adaptive pixel ratio for performance
      >
        <Particles scrollY={scrollY} />
      </Canvas>
    </div>
  );
}
