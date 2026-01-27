import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { SkillCategory } from '@/data/skillsGalaxyData';

export interface CameraTransitionState {
  isTransitioning: boolean;
  planetOpacities: Map<string, number>;
  planetScale: number;
}

interface UseCameraTransitionProps {
  viewMode: 'galaxy' | 'zoomed';
  selectedCategory: SkillCategory | null;
  orbitControlsRef: React.RefObject<OrbitControlsImpl>;
  allCategories: SkillCategory[];
}

/**
 * useCameraTransition Hook
 *
 * Handles smooth camera transitions between galaxy and zoomed views.
 *
 * Zoom In Sequence (1.2s):
 * 1. Disable OrbitControls
 * 2. Fade out non-target planets (opacity 1 → 0, 0.4s)
 * 3. Move camera to [planet.x, planet.y, planet.z + 8]
 * 4. Camera lookAt planet center
 * 5. Scale target planet 1.0 → 1.5
 * 6. Show skill icons with fade in
 *
 * Zoom Out Sequence:
 * - Reverse the sequence
 * - Re-enable OrbitControls when complete
 */
export function useCameraTransition({
  viewMode,
  selectedCategory,
  orbitControlsRef,
  allCategories,
}: UseCameraTransitionProps): CameraTransitionState {
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

  // Calculate planet opacities based on view mode and selected category
  const calculateOpacities = (): Map<string, number> => {
    const opacities = new Map<string, number>();

    if (viewMode === 'galaxy' || !selectedCategory) {
      // All planets visible in galaxy view
      allCategories.forEach((cat) => {
        opacities.set(cat.id, 1.0);
      });
    } else {
      // Only selected planet visible in zoomed view
      allCategories.forEach((cat) => {
        opacities.set(cat.id, cat.id === selectedCategory.id ? 1.0 : 0.0);
      });
    }

    return opacities;
  };

  // Spring animation for camera position
  const [cameraSpring, cameraSpringApi] = useSpring(() => ({
    position: initialCameraPosition.toArray(),
    target: initialCameraTarget.toArray(),
    config: {
      duration: 1200,
      easing: (t: number) => {
        // Ease-in-out
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      },
    },
    onChange: ({ value }) => {
      // Update camera position and lookAt during animation
      camera.position.set(value.position[0], value.position[1], value.position[2]);
      camera.lookAt(value.target[0], value.target[1], value.target[2]);
      camera.updateProjectionMatrix();
    },
    onStart: () => {
      isTransitioningRef.current = true;
      // Disable OrbitControls during transition
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = false;
      }
    },
    onRest: () => {
      isTransitioningRef.current = false;
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
    },
  }));

  // Spring animation for planet opacities
  const [opacitySpring] = useSpring(() => ({
    progress: viewMode === 'galaxy' ? 0 : 1,
    config: {
      duration: 400,
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

  // Calculate current planet opacities
  const planetOpacities = calculateOpacities();

  // Planet scale for zoomed view (1.0 in galaxy, 1.5 in zoomed)
  const planetScale = viewMode === 'zoomed' ? 1.5 : 1.0;

  return {
    isTransitioning: isTransitioningRef.current,
    planetOpacities,
    planetScale,
  };
}
