import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';
import { SkillCategory } from '@/data/skillsGalaxyData.tsx';

interface LeadershipNebulaProps {
  category: SkillCategory;
  isHovered: boolean;
  isFocused?: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  disableHover?: boolean;
  opacity?: number;
  planetScale?: number;
  isZoomedView?: boolean;
  focusedSkillIndex?: number;
  isMobile?: boolean;
  isTouchDevice?: boolean;
}

/**
 * LeadershipNebula Component
 *
 * Renders the leadership category as a particle cloud/nebula with pink/magenta aesthetic.
 * In galaxy view: displays 650 particles (400 on mobile) forming a nebula cloud with Perlin-like noise drift.
 * In zoomed view: displays skill names as 3D floating text labels with hover effects.
 * Optimized for mobile performance and touch devices.
 */
export default function LeadershipNebula({
  category,
  isHovered,
  isFocused = false,
  onHover,
  onClick,
  disableHover = false,
  opacity = 1.0,
  planetScale = 1.0,
  isZoomedView = false,
  focusedSkillIndex = -1,
  isMobile = false,
  isTouchDevice = false,
}: LeadershipNebulaProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Generate particle positions (650 particles, 400 on mobile for performance)
  const particleCount = isMobile ? 400 : 650;
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const baseColor = new THREE.Color(category.color); // #ec4899
    const accentColor = new THREE.Color('#db2777'); // Darker pink/magenta

    for (let i = 0; i < particleCount; i++) {
      // Random sphere distribution with some clustering toward center
      const radius = category.radius * (0.3 + Math.random() * 0.7);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Gradient between base and accent colors
      const mixFactor = Math.random();
      const particleColor = baseColor.clone().lerp(accentColor, mixFactor);
      colors[i * 3] = particleColor.r;
      colors[i * 3 + 1] = particleColor.g;
      colors[i * 3 + 2] = particleColor.b;
    }

    return { positions, colors };
  }, [category.radius, category.color, particleCount]);

  // Perlin-like noise drift animation using multiple sin/cos frequencies
  useFrame(({ clock }) => {
    if (pointsRef.current && !isZoomedView) {
      const time = clock.getElapsedTime() * 0.1; // Slow drift
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const originalPositions = particles.positions;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = originalPositions[i3];
        const y = originalPositions[i3 + 1];
        const z = originalPositions[i3 + 2];

        // Multi-frequency noise simulation
        const noiseX = Math.sin(time + x * 0.5) * 0.02 + Math.cos(time * 1.3 + y * 0.3) * 0.015;
        const noiseY = Math.sin(time * 1.1 + y * 0.5) * 0.02 + Math.cos(time * 0.9 + z * 0.3) * 0.015;
        const noiseZ = Math.sin(time * 0.9 + z * 0.5) * 0.02 + Math.cos(time * 1.2 + x * 0.3) * 0.015;

        positions[i3] = x + noiseX;
        positions[i3 + 1] = y + noiseY;
        positions[i3 + 2] = z + noiseZ;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Slow rotation for the entire nebula
    if (groupRef.current && !isZoomedView) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  // Hover and focus animation using react-spring
  // Focus has stronger effect than hover for accessibility
  // Disable hover effect on touch devices
  const shouldDisableHover = disableHover || isTouchDevice;
  const { hoverIntensity } = useSpring({
    hoverIntensity: isFocused ? 2.2 : ((isHovered && !shouldDisableHover) ? 1.5 : 1.0),
    config: {
      tension: 280,
      friction: 60,
    },
  });

  // Scale animation
  const scale = useSpring({
    scale: planetScale,
    config: {
      tension: 280,
      friction: 60,
    },
  });

  // In zoomed view, render 3D text labels instead of particles
  if (isZoomedView) {
    return (
      <group position={category.position}>
        {category.skills.map((skill, index) => (
          <FloatingSkillText
            key={`${skill.name}-${index}`}
            text={skill.name}
            position={getRandomSpherePosition(category.radius, index)}
            color={category.color}
            isFocused={focusedSkillIndex === index}
          />
        ))}
      </group>
    );
  }

  // Galaxy view: render particle nebula
  return (
    <group position={category.position}>
      <animated.group ref={groupRef} scale={scale.scale}>
        <points
          ref={pointsRef}
          onPointerEnter={shouldDisableHover ? undefined : () => {
            document.body.style.cursor = 'pointer';
            onHover(category.id);
          }}
          onPointerLeave={shouldDisableHover ? undefined : () => {
            document.body.style.cursor = 'default';
            onHover(null);
          }}
          onClick={shouldDisableHover ? undefined : () => onClick(category.id)}
        >
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={particles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={particleCount}
              array={particles.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <animated.pointsMaterial
            size={0.05 * planetScale * (isMobile ? 0.8 : 1)}
            vertexColors
            transparent
            opacity={opacity}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Central glow point light */}
        <animated.pointLight
          color={category.color}
          intensity={hoverIntensity.to((i) => i * 3)}
          distance={category.radius * 3}
          decay={2}
        />
      </animated.group>
    </group>
  );
}

/**
 * FloatingSkillText Component
 *
 * Displays a single skill as 3D floating text with hover and focus effects.
 * Text lights up (emissive glow) and moves forward on z-axis when hovered or focused.
 */
function FloatingSkillText({
  text,
  position,
  color,
  isFocused = false,
}: {
  text: string;
  position: [number, number, number];
  color: string;
  isFocused?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const textRef = useRef<THREE.Mesh>(null);

  // Slow floating animation
  useFrame(({ clock }) => {
    if (textRef.current) {
      const time = clock.getElapsedTime();
      textRef.current.position.y = position[1] + Math.sin(time * 0.5 + position[0]) * 0.1;
      textRef.current.rotation.y += 0.002;
    }
  });

  // Hover and focus animation - focus has stronger effect
  const { scale, emissiveIntensity, positionZ } = useSpring({
    scale: isFocused ? 1.3 : (isHovered ? 1.1 : 1.0),
    emissiveIntensity: isFocused ? 1.2 : (isHovered ? 0.8 : 0.2),
    positionZ: isFocused ? position[2] + 0.8 : (isHovered ? position[2] + 0.5 : position[2]),
    config: {
      tension: 280,
      friction: 60,
    },
  });

  return (
    <animated.group
      position-x={position[0]}
      position-y={position[1]}
      position-z={positionZ}
      scale={scale}
      onPointerEnter={() => {
        document.body.style.cursor = 'pointer';
        setIsHovered(true);
      }}
      onPointerLeave={() => {
        document.body.style.cursor = 'default';
        setIsHovered(false);
      }}
    >
      <Text
        ref={textRef}
        fontSize={0.35}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        textAlign="center"
      >
        {text}
        <animated.meshStandardMaterial
          color="white"
          emissive={color}
          emissiveIntensity={emissiveIntensity}
        />
      </Text>
    </animated.group>
  );
}

/**
 * Generates random positions distributed in a sphere around the center.
 * Uses deterministic randomness based on index for consistent positioning.
 */
function getRandomSpherePosition(radius: number, index: number): [number, number, number] {
  // Use index-based seed for deterministic random
  const seed = index * 1000;
  const theta = ((seed * 9301 + 49297) % 233280) / 233280 * Math.PI * 2;
  const phi = Math.acos(2 * (((seed * 7901 + 12345) % 233280) / 233280) - 1);
  const r = radius * 1.5 * (0.6 + (((seed * 5501 + 67890) % 233280) / 233280) * 0.4);

  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ];
}
