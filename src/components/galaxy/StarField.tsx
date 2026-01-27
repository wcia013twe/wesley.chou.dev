import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * StarField Component
 *
 * Renders a background star field using Three.js Points geometry.
 * Creates 1500 particles positioned randomly in a sphere with subtle twinkling animation.
 * Respects user's reduced-motion preferences.
 */
export default function StarField() {
  const pointsRef = useRef<THREE.Points>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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

  // Generate star positions and attributes
  const { positions, opacities, twinkleSpeed, twinkleOffset } = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const opacities = new Float32Array(count);
    const twinkleSpeed = new Float32Array(count);
    const twinkleOffset = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Generate random position in a sphere (radius ~50 units)
      const radius = 30 + Math.random() * 20; // Range: 30-50 units
      const theta = Math.random() * Math.PI * 2; // Azimuthal angle
      const phi = Math.acos(2 * Math.random() - 1); // Polar angle (uniform distribution)

      // Convert spherical to Cartesian coordinates
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);     // x
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
      positions[i * 3 + 2] = radius * Math.cos(phi);                   // z

      // Random initial opacity (0.3 to 1.0)
      opacities[i] = 0.3 + Math.random() * 0.7;

      // Random twinkling speed (each star has different frequency)
      twinkleSpeed[i] = 0.5 + Math.random() * 1.5;

      // Random phase offset so stars don't twinkle in sync
      twinkleOffset[i] = Math.random() * Math.PI * 2;
    }

    return { positions, opacities, twinkleSpeed, twinkleOffset };
  }, []);

  // Twinkling animation using useFrame
  useFrame((state) => {
    if (!pointsRef.current || prefersReducedMotion) return;

    const material = pointsRef.current.material as THREE.PointsMaterial;
    const geometry = pointsRef.current.geometry;
    const opacityAttr = geometry.attributes.opacity as THREE.BufferAttribute;

    if (!opacityAttr) return;

    const time = state.clock.getElapsedTime();

    // Update each star's opacity based on its individual twinkling parameters
    for (let i = 0; i < opacities.length; i++) {
      const baseOpacity = opacities[i];
      const speed = twinkleSpeed[i];
      const offset = twinkleOffset[i];

      // Subtle sine wave oscillation for twinkling effect
      const twinkle = Math.sin(time * speed + offset) * 0.15; // ±0.15 opacity variation
      const newOpacity = Math.max(0.2, Math.min(1.0, baseOpacity + twinkle));

      opacityAttr.array[i] = newOpacity;
    }

    opacityAttr.needsUpdate = true;
  });

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
          attach="attributes-opacity"
          count={opacities.length}
          array={opacities}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation={true}
        color="#ffffff"
        transparent={true}
        opacity={1}
        vertexColors={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        onBeforeCompile={(shader) => {
          // Custom shader to use per-vertex opacity attribute
          shader.vertexShader = shader.vertexShader.replace(
            'void main() {',
            `
            attribute float opacity;
            varying float vOpacity;
            void main() {
              vOpacity = opacity;
            `
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            'void main() {',
            `
            varying float vOpacity;
            void main() {
            `
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            'vec4( outgoingLight, diffuseColor.a )',
            'vec4( outgoingLight, diffuseColor.a * vOpacity )'
          );
        }}
      />
    </points>
  );
}
