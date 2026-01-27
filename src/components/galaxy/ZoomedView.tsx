import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { SkillCategory } from '@/data/skillsGalaxyData';
import SkillIcon from './SkillIcon';
import LeadershipNebula from './LeadershipNebula';

interface ZoomedViewProps {
  category: SkillCategory;
  focusedSkillIndex?: number;
}

/**
 * ZoomedView Component
 *
 * Displays skill icons orbiting around the selected category planet.
 * The planet itself is rendered by GalaxyView with animated scale.
 *
 * Features:
 * - Skill icons in orbital rings (2-3 rings at radii 4, 6, 8)
 * - Continuous rotation animation (0.005 rad/frame per ring)
 * - Positioned relative to category planet position
 *
 * Orbital layout algorithm:
 * - Distributes skills evenly across rings, filling inner rings first
 * - Calculates angle step: 2π / icons per ring
 * - Position: [radius * cos(angle + rotation), 0, radius * sin(angle + rotation)]
 */
export default function ZoomedView({ category }: ZoomedViewProps) {
  const orbitRef = useRef<Group>(null);

  // Continuous rotation animation for orbital rings
  useFrame(() => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += 0.005;
    }
  });

  // Leadership category uses LeadershipNebula in zoomed view
  if (category.id === 'leadership') {
    return (
      <LeadershipNebula
        category={category}
        isHovered={false}
        onHover={() => {}}
        onClick={() => {}}
        disableHover={true}
        isZoomedView={true}
      />
    );
  }

  // Distribute skills across orbital rings
  const { ringAssignments, radii } = distributeSkillsInRings(category.skills.length);

  // Calculate positions for all skill icons
  const skillPositions = calculateSkillPositions(category.skills, ringAssignments, radii);

  return (
    <group position={category.position}>
      {/* Orbiting skill icons */}
      <group ref={orbitRef}>
        {category.skills.map((skill, index) => (
          <SkillIcon
            key={`${skill.name}-${index}`}
            skill={skill}
            position={skillPositions[index]}
            color={category.color}
          />
        ))}
      </group>
    </group>
  );
}

/**
 * Distributes skills across 2-3 orbital rings at radii 4, 6, 8
 * Fills inner rings first for balanced distribution
 */
function distributeSkillsInRings(totalSkills: number): {
  ringAssignments: number[];
  radii: number[];
} {
  const radii = [4, 6, 8];
  const ringAssignments: number[] = [];

  if (totalSkills <= 6) {
    // Use only inner ring for small counts
    ringAssignments.push(totalSkills);
    return { ringAssignments, radii: [radii[0]] };
  } else if (totalSkills <= 12) {
    // Use two rings
    const perRing = Math.ceil(totalSkills / 2);
    ringAssignments.push(perRing);
    ringAssignments.push(totalSkills - perRing);
    return { ringAssignments, radii: radii.slice(0, 2) };
  } else {
    // Use all three rings
    const perRing = Math.ceil(totalSkills / 3);
    ringAssignments.push(perRing);
    ringAssignments.push(perRing);
    ringAssignments.push(totalSkills - perRing * 2);
    return { ringAssignments, radii };
  }
}

/**
 * Calculates 3D positions for all skills based on ring assignments
 * Position formula: [radius * cos(angle + rotation), y, radius * sin(angle + rotation)]
 */
function calculateSkillPositions(
  skills: any[],
  ringAssignments: number[],
  radii: number[]
): [number, number, number][] {
  const positions: [number, number, number][] = [];
  let skillIndex = 0;

  ringAssignments.forEach((count, ringIndex) => {
    const radius = radii[ringIndex];
    const angleStep = (2 * Math.PI) / count;

    for (let i = 0; i < count && skillIndex < skills.length; i++) {
      const angle = i * angleStep;
      const x = radius * Math.cos(angle);
      const y = 0; // Planar orbits
      const z = radius * Math.sin(angle);
      positions.push([x, y, z]);
      skillIndex++;
    }
  });

  return positions;
}
