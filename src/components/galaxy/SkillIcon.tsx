import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';
import { SkillIcon as SkillIconType } from '@/data/skillsGalaxyData';

interface SkillIconProps {
  skill: SkillIconType;
  position: [number, number, number];
  color: string;
}

/**
 * SkillIcon Component
 *
 * Displays an individual technology icon orbiting around a planet in the zoomed view.
 * Uses Html from @react-three/drei to render React icon components in 3D space.
 *
 * Features:
 * - Circular background with gradient and category-colored border
 * - Floating animation using sine wave bob
 * - Hover effects with scale animation
 * - Tooltip showing skill name on hover
 */
export default function SkillIcon({ skill, position, color }: SkillIconProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Floating animation with sine wave bob
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      // Sine wave bob: amplitude 0.2, frequency 0.001 (converted to rad/s)
      groupRef.current.position.y = position[1] + Math.sin(time * 0.001 * 2 * Math.PI) * 0.2;
    }
  });

  // Hover animation using react-spring
  const springProps = useSpring({
    scale: isHovered ? 1.15 : 1.0,
    config: {
      tension: 300,
      friction: 25,
    },
  });

  return (
    <animated.group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      scale={springProps.scale}
    >
      {/* Point light for glow effect */}
      <pointLight
        color={color}
        intensity={isHovered ? 0.8 : 0.5}
        distance={3}
        decay={2}
      />

      {/* Html component to render React icon in 3D space */}
      <Html
        transform
        center
        distanceFactor={1.5}
        style={{
          pointerEvents: 'auto',
          userSelect: 'none',
        }}
      >
        <div
          className="skill-icon-container"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), rgba(0, 0, 0, 0.5))',
            border: `3px solid ${color}`,
            boxShadow: `0 0 20px ${color}80, inset 0 0 10px rgba(255, 255, 255, 0.1)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={() => {
            setIsHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            document.body.style.cursor = 'default';
          }}
        >
          {/* Render the skill icon */}
          <div
            style={{
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {skill.icon}
          </div>

          {/* Tooltip - shown on hover */}
          {isHovered && (
            <div
              style={{
                position: 'absolute',
                bottom: '-35px',
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                background: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                border: `1px solid ${color}`,
                boxShadow: `0 0 10px ${color}60`,
                pointerEvents: 'none',
                zIndex: 1000,
              }}
            >
              {skill.name}
            </div>
          )}
        </div>
      </Html>
    </animated.group>
  );
}
