import { useState, forwardRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import StarField from './StarField';
import Planet from './Planet';
import PlanetLabel from './PlanetLabel';
import { skillsGalaxyData } from '@/data/skillsGalaxyData';

interface GalaxyViewProps {
  onPlanetClick: (categoryId: string) => void;
  planetOpacities?: Map<string, number>;
  planetScales?: Map<string, number>;
}

/**
 * GalaxyView Component
 *
 * Orchestrates the galaxy view by rendering all planets with labels,
 * the star background, and camera controls.
 * Manages hover state for interactive planet effects.
 */
const GalaxyView = forwardRef<OrbitControlsImpl, GalaxyViewProps>(
  ({ onPlanetClick, planetOpacities, planetScales }, ref) => {
    const [hoveredPlanetId, setHoveredPlanetId] = useState<string | null>(null);

  return (
    <>
      {/* Star background */}
      <StarField />

      {/* Render all planets */}
      {skillsGalaxyData.map((category) => (
        <Planet
          key={category.id}
          category={category}
          isHovered={hoveredPlanetId === category.id}
          onHover={setHoveredPlanetId}
          onClick={onPlanetClick}
          opacity={planetOpacities?.get(category.id) ?? 1.0}
          planetScale={planetScales?.get(category.id) ?? 1.0}
        />
      ))}

      {/* Render planet labels */}
      {skillsGalaxyData.map((category) => {
        // Calculate label position (above the planet)
        const labelPosition: [number, number, number] = [
          category.position[0],
          category.position[1] + category.radius + 1.5, // Position above planet
          category.position[2],
        ];

        return (
          <PlanetLabel
            key={`label-${category.id}`}
            text={category.name}
            position={labelPosition}
          />
        );
      })}

      {/* Camera controls */}
      <OrbitControls
        ref={ref}
        enableZoom={true}
        enablePan={false}
        maxDistance={30}
        minDistance={10}
        enableDamping={true}
      />
    </>
  );
});

GalaxyView.displayName = 'GalaxyView';

export default GalaxyView;
