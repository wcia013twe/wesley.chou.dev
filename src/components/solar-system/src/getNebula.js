import * as THREE from "three";

// Generate a soft radial gradient texture procedurally (rad-grad.png is not in public/)
function createRadialGradientTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0,   "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.4)");
  gradient.addColorStop(1,   "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

const gradientTexture = createRadialGradientTexture();

function getSprite({ color, opacity, pos, size }) {
  const spriteMat = new THREE.SpriteMaterial({
    color,
    map: gradientTexture,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  spriteMat.color.offsetHSL(0, 0, Math.random() * 0.2 - 0.1);
  const sprite = new THREE.Sprite(spriteMat);
  sprite.position.set(pos.x, -pos.y, pos.z);
  size += Math.random() - 0.5;
  sprite.scale.set(size, size, size);
  sprite.material.rotation = 0;
  return sprite;
}

function getNebula({
  hue = 0.0,
  numSprites = 10,
  opacity = 1,
  radius = 1,
  sat = 0.5,
  size = 1,
  z = 0,
}) {
  const layerGroup = new THREE.Group();
  for (let i = 0; i < numSprites; i += 1) {
    let angle = (i / numSprites) * Math.PI * 2;
    const pos = new THREE.Vector3(
      Math.cos(angle) * Math.random() * radius,
      Math.sin(angle) * Math.random() * radius,
      z + Math.random()
    );
    const length = new THREE.Vector3(pos.x, pos.y, 0).length();
    // const hue = 0.0; // (0.9 - (radius - length) / radius) * 1;

    let color = new THREE.Color().setHSL(hue, 1, sat);
    const sprite = getSprite({ color, opacity, pos, size });
    layerGroup.add(sprite);
  }
  return layerGroup;
}
export default getNebula;