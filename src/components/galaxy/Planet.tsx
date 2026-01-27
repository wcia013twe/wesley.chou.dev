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
}

/**
 * Planet Component
 *
 * Renders a skill category as a glowing planet in 3D space.
 * Features rotation animation and smooth hover effects using react-spring.
 */
export default function Planet({ category, isHovered, onHover, onClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Rotation animation (0.002 rad/frame on Y-axis)
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  // Hover animation using react-spring
  const { scale, emissiveIntensity } = useSpring({
    scale: isHovered ? 1.05 : 1.0,
    emissiveIntensity: isHovered ? 1.3 : 1.0,
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
        onPointerEnter={() => {
          document.body.style.cursor = 'pointer';
          onHover(category.id);
        }}
        onPointerLeave={() => {
          document.body.style.cursor = 'default';
          onHover(null);
        }}
        onClick={() => onClick(category.id)}
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
