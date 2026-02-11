import { Text } from '@react-three/drei';

interface PlanetLabelProps {
  text: string;
  position: [number, number, number];
}

/**
 * PlanetLabel Component
 *
 * Displays a category name floating above a planet in the galaxy.
 * Uses billboard effect to always face the camera for optimal readability.
 */
export default function PlanetLabel({ text, position }: PlanetLabelProps) {
  return (
    <Text
      position={position}
      fontSize={0.6}
      color="white"
      anchorX="center"
      anchorY="bottom"
      outlineWidth={0.05}
      outlineColor="black"
      billboard
    >
      {text}
    </Text>
  );
}
