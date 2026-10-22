// Shared WebGL support check.
//
// Every 3D layer on the site (ogl particles, raw three.js scenes, the
// react-three-fiber canvas) assumes a WebGL context can be created. When it
// cannot (no GPU, hardware acceleration off, hardened/embedded browsers),
// renderer construction throws and React Router's error boundary replaces
// the whole page. Components check this first and simply skip their 3D
// layer when WebGL is unavailable, leaving the rest of the page intact.

let cached: boolean | null = null;

export function isWebGLAvailable(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext(
        "experimental-webgl",
      )) as WebGLRenderingContext | null;
    cached = !!gl;
    if (gl) {
      // Release the probe context so it does not count against the
      // browser's live WebGL context limit.
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    cached = false;
  }
  return cached;
}
