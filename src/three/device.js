/** WebGL detection and a rough performance tier ('none' | 'low' | 'medium' | 'high'); 'none' = software GL, use the static fallback. */

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    gl?.getExtension('WEBGL_lose_context')?.loseContext(); // free the probe context immediately
    return !!(window.WebGLRenderingContext && gl);
  } catch {
    return false;
  }
}

/**
 * Heuristic: weak CPU/RAM, coarse pointer (phones/tablets) or software/old-mobile GPUs → lower quality.
 * Tweak the numbers in TIERS (scene.js) rather than here.
 */
export function getTier(gl) {
  const mem = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const coarse = matchMedia('(pointer: coarse)').matches;
  let gpu = '';
  try {
    const ext = gl?.getExtension('WEBGL_debug_renderer_info');
    if (ext) gpu = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
  } catch { /* ignore */ }
  // Software rasterisers (SwiftShader, llvmpipe…) can't run a 3D hero smoothly: skip 3D entirely.
  // Add ?force3d to the URL to override while testing.
  if (/swiftshader|llvmpipe|software/i.test(gpu) && !location.search.includes('force3d')) return 'none';
  const weakGpu = /mali-4|mali-t|adreno \(tm\) [2-4]\d\d|powervr/i.test(gpu);
  if (weakGpu || mem <= 2 || cores <= 2) return 'low';
  if (coarse || mem <= 4 || cores <= 4) return 'medium';
  return 'high';
}
