import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'motion/react';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import GalaxyView from './GalaxyView';
import ZoomedView from './ZoomedView';
import ExitButton from './ExitButton';
import CameraController from './CameraController';
import { skillsGalaxyData } from '@/data/skillsGalaxyData';

type ViewMode = 'galaxy' | 'zoomed';

/**
 * TechGalaxy Component
 *
 * Main orchestrator for the interactive skills galaxy experience.
 * Manages state transitions between galaxy overview and zoomed planet views.
 *
 * Features:
 * - Galaxy view: Navigate and select skill category planets
 * - Zoomed view: Detailed view of skills orbiting the selected planet
 * - Background click detection in zoomed mode to return to galaxy
 * - Exit button and hint text for user guidance
 * - Loading state during initialization
 */
export default function TechGalaxy() {
  const [viewMode, setViewMode] = useState<ViewMode>('galaxy');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Ref for OrbitControls to enable/disable during transitions
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);

  // Get the selected category data
  const selectedCategory = selectedCategoryId
    ? skillsGalaxyData.find((cat) => cat.id === selectedCategoryId) ?? null
    : null;

  // Handle loading state - show spinner briefly during initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Show hint text after 2s when in zoomed mode
  useEffect(() => {
    if (viewMode === 'zoomed') {
      const timer = setTimeout(() => {
        setShowHint(true);
      }, 2000);
      return () => {
        clearTimeout(timer);
        setShowHint(false);
      };
    } else {
      setShowHint(false);
    }
  }, [viewMode]);

  // Calculate planet opacities based on view mode and selected category
  const planetOpacities = useMemo(() => {
    const opacities = new Map<string, number>();

    if (viewMode === 'galaxy') {
      // All planets visible in galaxy view
      skillsGalaxyData.forEach((cat) => {
        opacities.set(cat.id, 1.0);
      });
    } else if (viewMode === 'zoomed' && selectedCategoryId) {
      // In zoomed view: only selected planet visible, others fade to 0
      skillsGalaxyData.forEach((cat) => {
        opacities.set(cat.id, cat.id === selectedCategoryId ? 1.0 : 0.0);
      });
    }

    return opacities;
  }, [viewMode, selectedCategoryId]);

  // Calculate planet scales based on view mode and selected category
  const planetScales = useMemo(() => {
    const scales = new Map<string, number>();

    if (viewMode === 'galaxy') {
      // All planets at normal scale in galaxy view
      skillsGalaxyData.forEach((cat) => {
        scales.set(cat.id, 1.0);
      });
    } else if (viewMode === 'zoomed' && selectedCategoryId) {
      // Selected planet scaled to 1.5x in zoomed view
      skillsGalaxyData.forEach((cat) => {
        scales.set(cat.id, cat.id === selectedCategoryId ? 1.5 : 1.0);
      });
    }

    return scales;
  }, [viewMode, selectedCategoryId]);

  // Handle planet click - transition to zoomed view
  const handlePlanetClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setViewMode('zoomed');
  };

  // Handle exit - return to galaxy view
  const handleExit = () => {
    setViewMode('galaxy');
    setSelectedCategoryId(null);
  };

  // Handle background click in zoomed mode
  const handleBackgroundClick = () => {
    if (viewMode === 'zoomed') {
      handleExit();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-black to-purple-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 5, 15], fov: 75 }}
        className="h-full w-full"
      >
        {/* Background gradient (black → dark purple) */}
        <color attach="background" args={['#0a0015']} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        {/* Camera controller for smooth transitions */}
        <CameraController
          viewMode={viewMode}
          selectedCategory={selectedCategory}
          orbitControlsRef={orbitControlsRef}
          onTransitionStart={() => setIsTransitioning(true)}
          onTransitionEnd={() => setIsTransitioning(false)}
        />

        {/* Always render GalaxyView for planets (with opacity control) */}
        <GalaxyView
          ref={orbitControlsRef}
          onPlanetClick={handlePlanetClick}
          planetOpacities={planetOpacities}
        />

        {/* Render ZoomedView when in zoomed mode */}
        {viewMode === 'zoomed' && selectedCategory && (
          <>
            <ZoomedView category={selectedCategory} />

            {/* Background click plane - large invisible mesh to catch clicks */}
            <mesh
              position={[0, 0, -20]}
              onClick={handleBackgroundClick}
            >
              <planeGeometry args={[100, 100]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
          </>
        )}
      </Canvas>

      {/* Exit button (visible only in zoomed mode) */}
      <ExitButton visible={viewMode === 'zoomed'} onClick={handleExit} />

      {/* Hint text (fade in after 2s in zoomed mode) */}
      <AnimatePresence>
        {showHint && viewMode === 'zoomed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 text-center text-sm text-white"
            style={{ fontSize: '0.9rem', opacity: 0.6 }}
          >
            Click anywhere to return
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
