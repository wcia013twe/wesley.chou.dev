import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';
import { SkillCategory } from '@/data/skillsGalaxyData';

interface PlanetProps {
  category: SkillCategory;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  disableHover?: boolean;
}

/**
 * Planet Component
 *
 * Renders a skill category as a glowing planet in 3D space.
 * Features rotation animation and smooth hover effects using react-spring.
 */
export default function Planet({ category, isHovered, onHover, onClick, disableHover = false }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Rotation animation (0.002 rad/frame on Y-axis, or slower if hover disabled)
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += disableHover ? 0.001 : 0.002;
    }
  });

  // Hover animation using react-spring (disabled if disableHover is true)
  const { scale, emissiveIntensity } = useSpring({
    scale: (isHovered && !disableHover) ? 1.05 : 1.0,
    emissiveIntensity: (isHovered && !disableHover) ? 1.3 : 1.0,
    config: {
      tension: 280,
      friction: 60,
    },
  });

  return (
    <group position={category.position}>
      <animated.mesh
        ref={meshRef}
        scale={scale}
        onPointerEnter={disableHover ? undefined : () => {
          document.body.style.cursor = 'pointer';
          onHover(category.id);
        }}
        onPointerLeave={disableHover ? undefined : () => {
          document.body.style.cursor = 'default';
          onHover(null);
        }}
        onClick={disableHover ? undefined : () => onClick(category.id)}
      >
        <sphereGeometry args={[category.radius, 32, 32]} />
        <animated.meshStandardMaterial
          color={category.color}
          emissive={category.color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.5}
          roughness={0.3}
        />
      </animated.mesh>

      {/* Point light for glow effect */}
      <pointLight
        color={category.color}
        intensity={2}
        distance={category.radius * 3}
        decay={2}
      />
    </group>
  );
}
