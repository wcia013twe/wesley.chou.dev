/**
 * Detects if WebGL is supported in the current browser.
 *
 * @returns true if WebGL is supported, false otherwise
 */
export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}
