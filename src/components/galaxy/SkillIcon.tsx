import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';
import { SkillIcon as SkillIconType } from '@/data/skillsGalaxyData.tsx';

interface SkillIconProps {
  skill: SkillIconType;
  position: [number, number, number];
  color: string;
  isFocused?: boolean;
  isMobile?: boolean;
  isTouchDevice?: boolean;
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
 * - Hover effects with scale animation (disabled on touch devices)
 * - Keyboard focus indicators with enhanced glow
 * - Tooltip showing skill name on hover or focus
 * - Larger hit areas on mobile for better touch targeting
 */
export default function SkillIcon({ skill, position, color, isFocused = false, isMobile = false, isTouchDevice = false }: SkillIconProps) {
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

  // Hover and focus animation using react-spring
  // Focus has stronger effect than hover for accessibility
  // Disable hover effect on touch devices
  const shouldShowHover = isHovered && !isTouchDevice;
  const springProps = useSpring({
    scale: isFocused ? 1.25 : (shouldShowHover ? 1.15 : 1.0),
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
      {/* Point light for glow effect - brighter when focused */}
      <pointLight
        color={color}
        intensity={isFocused ? 1.5 : (shouldShowHover ? 0.8 : 0.5)}
        distance={isFocused ? 4 : 3}
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
          role="img"
          aria-label={`${skill.name} skill icon`}
          tabIndex={isFocused ? 0 : -1}
          style={{
            // Larger hit area on mobile for easier touch targeting
            width: isMobile ? '80px' : '64px',
            height: isMobile ? '80px' : '64px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), rgba(0, 0, 0, 0.5))',
            border: isFocused ? `${isMobile ? 5 : 4}px solid ${color}` : `${isMobile ? 4 : 3}px solid ${color}`,
            boxShadow: isFocused
              ? `0 0 40px ${color}cc, 0 0 20px ${color}ff, inset 0 0 15px rgba(255, 255, 255, 0.2)`
              : `0 0 ${isMobile ? 24 : 20}px ${color}80, inset 0 0 10px rgba(255, 255, 255, 0.1)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: isFocused ? `2px solid ${color}` : 'none',
            outlineOffset: '2px',
            touchAction: 'none',
          }}
          onMouseEnter={isTouchDevice ? undefined : () => {
            setIsHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onMouseLeave={isTouchDevice ? undefined : () => {
            setIsHovered(false);
            document.body.style.cursor = 'default';
          }}
        >
          {/* Render the skill icon or placeholder */}
          <div
            style={{
              width: isMobile ? '56px' : '48px',
              height: isMobile ? '56px' : '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '28px' : '24px',
              fontWeight: 'bold',
              color: color,
            }}
            aria-hidden="true"
          >
            {skill.icon || skill.name.charAt(0).toUpperCase()}
          </div>

          {/* Tooltip - shown on hover or focus (or tap on mobile) */}
          {(shouldShowHover || isFocused) && (
            <div
              style={{
                position: 'absolute',
                bottom: isMobile ? '-40px' : '-35px',
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                background: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                padding: isMobile ? '8px 14px' : '6px 12px',
                borderRadius: '6px',
                fontSize: isMobile ? '16px' : '14px',
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
