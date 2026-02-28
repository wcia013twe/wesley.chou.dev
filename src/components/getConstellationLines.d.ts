export type ConstellationDef = {
  name: string;
  scale?: number;
  stars: [number, number, number][];
  segments: [number, number][];
};

export const CONSTELLATIONS: (ConstellationDef | null)[];

import * as THREE from 'three';

export function getConstellationLines(opts: {
  position: THREE.Vector3;
  definitionIndex: number;
  circleTexture: THREE.Texture;
  isPro: boolean;
  scale?: number;
}): {
  group: THREE.Group;
  starsPoints: THREE.Points;
  revealTo(p: number): void;
  setPeek(): void;
  hide(): void;
  setHighlight(active: boolean): void;
  dispose(): void;
} | null;
