import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import GalaxyView from './GalaxyView';
import ZoomedView from './ZoomedView';
import ExitButton from './ExitButton';
import CameraController from './CameraController';
import ReducedMotionFallback from './ReducedMotionFallback';
import { skillsGalaxyData } from '@/data/skillsGalaxyData';
import { useMobile, useTouchDevice } from '@/hooks/useMobile';

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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Mobile and touch device detection
  const isMobile = useMobile();
  const isTouchDevice = useTouchDevice();

  // Keyboard navigation state
  const [focusedPlanetIndex, setFocusedPlanetIndex] = useState<number>(-1);
  const [focusedSkillIndex, setFocusedSkillIndex] = useState<number>(-1);

  // ARIA announcements for screen readers
  const [announcement, setAnnouncement] = useState<string>('');

  // Ref for OrbitControls to enable/disable during transitions
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);

  // Detect prefers-reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Get the selected category data
  const selectedCategory = selectedCategoryId
    ? skillsGalaxyData.find((cat) => cat.id === selectedCategoryId) ?? null
    : null;

  // Announce view mode changes to screen readers
  useEffect(() => {
    if (viewMode === 'zoomed' && selectedCategory) {
      const skillCount = selectedCategory.skills.length;
      setAnnouncement(
        `Entered ${selectedCategory.name} category, showing ${skillCount} skill${skillCount !== 1 ? 's' : ''}`
      );
    } else if (viewMode === 'galaxy') {
      const categoryCount = skillsGalaxyData.length;
      setAnnouncement(
        `Returned to galaxy view, showing ${categoryCount} categor${categoryCount !== 1 ? 'ies' : 'y'}`
      );
    }
  }, [viewMode, selectedCategory]);

  // Announce focused element changes to screen readers
  useEffect(() => {
    if (viewMode === 'galaxy' && focusedPlanetIndex >= 0 && focusedPlanetIndex < skillsGalaxyData.length) {
      const category = skillsGalaxyData[focusedPlanetIndex];
      setAnnouncement(`Focused on ${category.name} planet`);
    } else if (viewMode === 'zoomed' && selectedCategory && focusedSkillIndex >= 0 && focusedSkillIndex < selectedCategory.skills.length) {
      const skill = selectedCategory.skills[focusedSkillIndex];
      setAnnouncement(`Focused on ${skill.name} skill`);
    }
  }, [focusedPlanetIndex, focusedSkillIndex, viewMode, selectedCategory]);

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

  // Reset focus state when switching views
  useEffect(() => {
    if (viewMode === 'galaxy') {
      setFocusedSkillIndex(-1);
      setFocusedPlanetIndex(-1);
    } else if (viewMode === 'zoomed') {
      setFocusedPlanetIndex(-1);
      setFocusedSkillIndex(-1);
    }
  }, [viewMode]);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for navigation keys to avoid page scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', '+', '=', '-', '_'].includes(e.key)) {
        e.preventDefault();
      }

      if (viewMode === 'galaxy') {
        handleGalaxyViewKeyboard(e);
      } else if (viewMode === 'zoomed') {
        handleZoomedViewKeyboard(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, focusedPlanetIndex, focusedSkillIndex, selectedCategoryId]);

  // Galaxy view keyboard handlers
  const handleGalaxyViewKeyboard = (e: KeyboardEvent) => {
    const planetCount = skillsGalaxyData.length;

    switch (e.key) {
      case 'Tab':
        // Cycle through planets
        if (e.shiftKey) {
          // Reverse cycle
          setFocusedPlanetIndex((prev) => (prev <= 0 ? planetCount - 1 : prev - 1));
        } else {
          // Forward cycle
          setFocusedPlanetIndex((prev) => (prev + 1) % planetCount);
        }
        break;

      case 'Enter':
      case ' ':
        // Zoom into focused planet
        if (focusedPlanetIndex >= 0 && focusedPlanetIndex < planetCount) {
          const categoryId = skillsGalaxyData[focusedPlanetIndex].id;
          handlePlanetClick(categoryId);
        }
        break;

      case 'ArrowLeft':
        // Rotate camera left
        if (orbitControlsRef.current) {
          orbitControlsRef.current.rotateLeft(0.1);
        }
        break;

      case 'ArrowRight':
        // Rotate camera right
        if (orbitControlsRef.current) {
          orbitControlsRef.current.rotateLeft(-0.1);
        }
        break;

      case 'ArrowUp':
        // Rotate camera up
        if (orbitControlsRef.current) {
          orbitControlsRef.current.rotateUp(0.1);
        }
        break;

      case 'ArrowDown':
        // Rotate camera down
        if (orbitControlsRef.current) {
          orbitControlsRef.current.rotateUp(-0.1);
        }
        break;

      case '+':
      case '=':
        // Zoom in
        if (orbitControlsRef.current) {
          orbitControlsRef.current.dollyIn(1.1);
          orbitControlsRef.current.update();
        }
        break;

      case '-':
      case '_':
        // Zoom out
        if (orbitControlsRef.current) {
          orbitControlsRef.current.dollyOut(1.1);
          orbitControlsRef.current.update();
        }
        break;
    }
  };

  // Zoomed view keyboard handlers
  const handleZoomedViewKeyboard = (e: KeyboardEvent) => {
    if (!selectedCategory) return;

    const skillCount = selectedCategory.skills.length;

    switch (e.key) {
      case 'Tab':
        // Cycle through skill icons
        if (e.shiftKey) {
          // Reverse cycle
          setFocusedSkillIndex((prev) => (prev <= 0 ? skillCount - 1 : prev - 1));
        } else {
          // Forward cycle
          setFocusedSkillIndex((prev) => (prev + 1) % skillCount);
        }
        break;

      case 'Enter':
      case ' ':
        // Focus highlight (could trigger detail view in future)
        if (focusedSkillIndex >= 0 && focusedSkillIndex < skillCount) {
          // Currently just maintains focus, could expand functionality
          console.log('Focused skill:', selectedCategory.skills[focusedSkillIndex].name);
        }
        break;

      case 'Escape':
        // Return to galaxy view
        handleExit();
        break;

      case 'ArrowLeft':
        // Optional: Rotate orbital view left
        // Currently not implemented as the orbit auto-rotates
        break;

      case 'ArrowRight':
        // Optional: Rotate orbital view right
        // Currently not implemented as the orbit auto-rotates
        break;
    }
  };

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

  // Show loading spinner briefly
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-black to-purple-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  // If user prefers reduced motion, show accessible fallback
  if (prefersReducedMotion) {
    return <ReducedMotionFallback categories={skillsGalaxyData} />;
  }

  // Otherwise, show the full 3D experience
  return (
    <div className="relative h-full w-full">
      {/* ARIA live region for screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Semantic HTML structure for screen readers (visually hidden) */}
      <div className="sr-only">
        <h2>Skills Galaxy - {viewMode === 'galaxy' ? 'Category Overview' : selectedCategory?.name || ''}</h2>
        {viewMode === 'galaxy' ? (
          <>
            <p>Navigate through {skillsGalaxyData.length} skill categories using Tab key. Press Enter to zoom into a category.</p>
            <nav aria-label="Skill categories">
              <ul role="list">
                {skillsGalaxyData.map((category, index) => (
                  <li key={category.id} role="listitem">
                    {category.name} - {category.skills.length} skills
                    {focusedPlanetIndex === index && ' (focused)'}
                  </li>
                ))}
              </ul>
            </nav>
          </>
        ) : (
          selectedCategory && (
            <>
              <p>Viewing {selectedCategory.name} skills. Use Tab to navigate, Escape to return to galaxy view.</p>
              <nav aria-label={`${selectedCategory.name} skills`}>
                <ul role="list">
                  {selectedCategory.skills.map((skill, index) => (
                    <li key={index} role="listitem">
                      {skill.name}
                      {focusedSkillIndex === index && ' (focused)'}
                    </li>
                  ))}
                </ul>
              </nav>
            </>
          )
        )}
      </div>

      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 5, 15], fov: 75 }}
        className="h-full w-full"
        style={{ touchAction: 'none' }}
        dpr={isMobile ? 1 : window.devicePixelRatio}
        performance={{ min: 0.5 }}
        role="region"
        aria-label="3D interactive skills galaxy visualization"
        aria-describedby="galaxy-description"
      >
        {/* Background gradient (black → dark purple) */}
        <color attach="background" args={['#0a0015']} />

        {/* Lighting - reduced on mobile for performance */}
        <ambientLight intensity={isMobile ? 0.4 : 0.5} />
        <pointLight position={[10, 10, 10]} intensity={isMobile ? 0.7 : 1} />

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
          planetScales={planetScales}
          focusedPlanetId={focusedPlanetIndex >= 0 ? skillsGalaxyData[focusedPlanetIndex]?.id : null}
          isMobile={isMobile}
          isTouchDevice={isTouchDevice}
        />

        {/* Render ZoomedView when in zoomed mode */}
        {viewMode === 'zoomed' && selectedCategory && (
          <>
            <ZoomedView
              category={selectedCategory}
              focusedSkillIndex={focusedSkillIndex}
              isMobile={isMobile}
              isTouchDevice={isTouchDevice}
            />

            {/* Background click plane - large invisible mesh to catch clicks */}
            <mesh
              position={[0, 0, -20]}
              onClick={handleBackgroundClick}
            >
              <planeGeometry args={[100, 100]} />
              <meshBasicMaterial transparent opacity={0} />

              {/* Accessible label for background */}
              <Html position={[0, 0, 0]} center style={{ pointerEvents: 'none' }}>
                <div
                  role="button"
                  aria-label="Click background to return to galaxy view"
                  className="sr-only"
                  tabIndex={-1}
                >
                  Background
                </div>
              </Html>
            </mesh>
          </>
        )}
      </Canvas>

      {/* Hidden description for Canvas accessibility */}
      <p id="galaxy-description" className="sr-only">
        {viewMode === 'galaxy'
          ? 'An interactive 3D galaxy showing skill categories as planets. Click on a planet to explore its skills, or use keyboard navigation with Tab and Enter keys.'
          : `Zoomed view of ${selectedCategory?.name || ''} showing skills orbiting around the planet. Click the background or press Escape to return to galaxy view.`}
      </p>

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
