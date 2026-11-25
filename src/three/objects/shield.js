import { ExtrudeGeometry, Mesh, Shape, ShaderMaterial, DoubleSide, NormalBlending, Color } from 'three';

/** Glowing "protection" shield: extruded outline with a fresnel rim-glow shader. */
export function createShield(colorHex) {
  const s = new Shape();
  s.moveTo(0, 1.55);
  s.bezierCurveTo(0.6, 1.35, 1.1, 1.3, 1.5, 1.35);
  s.lineTo(1.5, 0.25);
  s.bezierCurveTo(1.5, -0.7, 0.8, -1.3, 0, -1.75);
  s.bezierCurveTo(-0.8, -1.3, -1.5, -0.7, -1.5, 0.25);
  s.lineTo(-1.5, 1.35);
  s.bezierCurveTo(-1.1, 1.3, -0.6, 1.35, 0, 1.55);
  const geometry = new ExtrudeGeometry(s, { depth: 0.14, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 4, curveSegments: 28 });
  geometry.translate(0, 0, -0.07);

  const material = new ShaderMaterial({
    uniforms: { uColor: { value: new Color(colorHex) }, uOpacity: { value: 0 }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main() {
        vN = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vV = normalize(-mv.xyz); vP = position;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uOpacity; uniform float uTime;
      varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main() {
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        float sweep = 0.5 + 0.5 * sin(vP.y * 3.0 - uTime * 1.6);   // slow vertical shimmer
        float a = (f * 0.95 + 0.07 + sweep * 0.06) * uOpacity;
        gl_FragColor = vec4(uColor * (0.75 + 0.5 * f), a);
      }`,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    blending: NormalBlending, // normal (not additive) so it stays visible on light backgrounds
  });
  const mesh = new Mesh(geometry, material);
  mesh.visible = false;
  return {
    mesh,
    set(amount, t) {
      // Pop-in with slight overshoot
      const k = Math.min(1, Math.max(0, amount));
      const sc = 0.55 + 0.45 * k + Math.sin(k * Math.PI) * 0.08;
      mesh.scale.setScalar(sc * 1.02);
      material.uniforms.uOpacity.value = k;
      material.uniforms.uTime.value = t;
      mesh.visible = k > 0.01;
    },
    dispose() { geometry.dispose(); material.dispose(); },
  };
}
