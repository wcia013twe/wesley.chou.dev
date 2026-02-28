import * as THREE from 'three';

function createRadialGradientTexture() {
  const canvas = document.createElement('canvas');
  canvas.width  = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0,   'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.4)');
  gradient.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

const sharedTexture = createRadialGradientTexture();

/**
 * Returns a Group of soft radial-gradient sprites in a given hue,
 * positioned similarly to the existing nebula layers so they blend
 * as a faint colour wash over the blue background.
 */
function getAurora({
  hue       = 0.35,
  numSprites = 8,
  opacity   = 0.04,
  radius    = 45,
  size      = 90,
  z         = -100,
  sat       = 0.70,
} = {}) {
  const group = new THREE.Group();

  for (let i = 0; i < numSprites; i++) {
    const angle = (i / numSprites) * Math.PI * 2;
    const pos = new THREE.Vector3(
      Math.cos(angle) * Math.random() * radius,
      Math.sin(angle) * Math.random() * radius,
      z + Math.random() * 2
    );

    const color = new THREE.Color().setHSL(hue, sat, 0.5);
    const mat = new THREE.SpriteMaterial({
      color,
      map:         sharedTexture,
      transparent: true,
      opacity,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });
    mat.color.offsetHSL(0, 0, Math.random() * 0.15 - 0.075);

    const sprite = new THREE.Sprite(mat);
    sprite.position.set(pos.x, -pos.y, pos.z);
    const s = size + (Math.random() - 0.5) * 20;
    sprite.scale.set(s, s, s);

    group.add(sprite);
  }

  return group;
}

export default getAurora;
