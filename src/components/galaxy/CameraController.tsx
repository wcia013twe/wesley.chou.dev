import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { SkillCategory } from '@/data/skillsGalaxyData';

interface CameraControllerProps {
  viewMode: 'galaxy' | 'zoomed';
  selectedCategory: SkillCategory | null;
  orbitControlsRef: React.RefObject<OrbitControlsImpl>;
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}

/**
 * CameraController Component
 *
 * Handles smooth camera transitions between galaxy and zoomed views.
 * Must be placed inside Canvas to access Three.js context.
 *
 * Zoom In Sequence (1.2s):
 * 1. Disable OrbitControls
 * 2. Move camera to [planet.x, planet.y, planet.z + 8]
 * 3. Camera lookAt planet center
 * 4. Easing: ease-in-out
 *
 * Zoom Out Sequence:
 * - Reverse the sequence
 * - Re-enable OrbitControls when complete
 */
export default function CameraController({
  viewMode,
  selectedCategory,
  orbitControlsRef,
  onTransitionStart,
  onTransitionEnd,
}: CameraControllerProps) {
  const { camera } = useThree();
  const isTransitioningRef = useRef(false);

  // Initial camera position for galaxy view
  const initialCameraPosition = new THREE.Vector3(0, 5, 15);
  const initialCameraTarget = new THREE.Vector3(0, 0, 0);

  // Calculate target camera position for zoomed view
  const getZoomedCameraPosition = (category: SkillCategory): THREE.Vector3 => {
    return new THREE.Vector3(
      category.position[0],
      category.position[1],
      category.position[2] + 8
    );
  };

  const getZoomedCameraTarget = (category: SkillCategory): THREE.Vector3 => {
    return new THREE.Vector3(
      category.position[0],
      category.position[1],
      category.position[2]
    );
  };

  // Custom easing function: ease-in-out
  const easeInOut = (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  // Spring animation for camera position
  const [, cameraSpringApi] = useSpring(() => ({
    position: initialCameraPosition.toArray(),
    target: initialCameraTarget.toArray(),
    config: {
      duration: 1200,
      easing: easeInOut,
    },
    onChange: ({ value }) => {
      // Update camera position and lookAt during animation
      camera.position.set(value.position[0], value.position[1], value.position[2]);
      camera.lookAt(value.target[0], value.target[1], value.target[2]);
      camera.updateProjectionMatrix();
    },
    onStart: () => {
      if (!isTransitioningRef.current) {
        isTransitioningRef.current = true;
        onTransitionStart?.();
        // Disable OrbitControls during transition
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = false;
        }
      }
    },
    onRest: () => {
      if (isTransitioningRef.current) {
        isTransitioningRef.current = false;
        onTransitionEnd?.();
        // Re-enable OrbitControls only in galaxy view
        if (orbitControlsRef.current && viewMode === 'galaxy') {
          orbitControlsRef.current.enabled = true;
          // Update OrbitControls target
          orbitControlsRef.current.target.set(
            initialCameraTarget.x,
            initialCameraTarget.y,
            initialCameraTarget.z
          );
          orbitControlsRef.current.update();
        }
      }
    },
  }));

  // Effect: Trigger camera animation when viewMode or selectedCategory changes
  useEffect(() => {
    if (viewMode === 'zoomed' && selectedCategory) {
      // Zoom in to planet
      const targetPosition = getZoomedCameraPosition(selectedCategory);
      const targetLookAt = getZoomedCameraTarget(selectedCategory);

      cameraSpringApi.start({
        position: targetPosition.toArray(),
        target: targetLookAt.toArray(),
      });
    } else if (viewMode === 'galaxy') {
      // Zoom out to galaxy
      cameraSpringApi.start({
        position: initialCameraPosition.toArray(),
        target: initialCameraTarget.toArray(),
      });
    }
  }, [viewMode, selectedCategory, cameraSpringApi]);

  // This component doesn't render anything - it only controls the camera
  return null;
}
