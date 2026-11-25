import { BufferGeometry, Float32BufferAttribute, Points, ShaderMaterial, CanvasTexture, NormalBlending } from 'three';

/**
 * Floating dust/bokeh particles. Motion runs entirely in the vertex shader
 * (no per-frame JS work), so even a few hundred points are very cheap.
 */
export function createParticles({ count, color, pixelRatio }) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    pos.set([(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8 - 1], i * 3);
    seed.set([0.2 + Math.random() * 0.8, Math.random()], i * 2);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geometry.setAttribute('aSeed', new Float32BufferAttribute(seed, 2));

  // Soft round sprite
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const map = new CanvasTexture(c);

  const material = new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uMap: { value: map }, uColor: { value: color }, uPx: { value: pixelRatio } },
    vertexShader: /* glsl */ `
      attribute vec2 aSeed;
      uniform float uTime; uniform float uPx;
      varying float vA;
      void main() {
        vec3 p = position;
        p.y = mod(p.y + 5.0 + uTime * 0.12 * aSeed.x, 10.0) - 5.0;   // rise & wrap
        p.x += sin(uTime * 0.3 + aSeed.y * 6.283) * 0.25;             // sway
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (14.0 + aSeed.y * 22.0) * uPx / -mv.z * 3.0;
        vA = 0.25 + 0.45 * aSeed.x;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap; uniform vec3 uColor; varying float vA;
      void main() { gl_FragColor = vec4(uColor, texture2D(uMap, gl_PointCoord).a * vA); }`,
    transparent: true,
    depthWrite: false,
    blending: NormalBlending,
  });
  const points = new Points(geometry, material);
  points.frustumCulled = false;
  return {
    object: points,
    update: (t) => (material.uniforms.uTime.value = t),
    dispose() {
      geometry.dispose();
      map.dispose();
      material.dispose();
    },
  };
}
