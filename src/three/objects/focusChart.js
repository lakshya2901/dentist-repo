import { Mesh, PlaneGeometry, ShaderMaterial, CanvasTexture, SRGBColorSpace } from 'three';

/**
 * "Vision correction" demo: a big eye-chart style panel behind the eyeball.
 * A small blur shader sharpens as `sharp` goes 0 → 1 (blurry → corrected).
 * The panel is only visible once the camera has dived through the eye.
 */
export function createFocusChart(theme) {
  const W = 1024, H = 640;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = theme.chartBg;
  g.fillRect(0, 0, W, H);
  g.fillStyle = theme.chartInk;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const rows = [['E', 300], ['F P', 190], ['T O Z', 120], ['L P E D', 76], ['P E C F D', 50]];
  let y = 100;
  for (const [txt, size] of rows) {
    g.font = `700 ${size}px "Manrope", Arial, sans-serif`;
    g.fillText(txt, W / 2, y + size * 0.1);
    y += size * 0.78 + 28;
  }
  const map = new CanvasTexture(c);
  map.colorSpace = SRGBColorSpace;

  const material = new ShaderMaterial({
    uniforms: { uMap: { value: map }, uBlur: { value: 1 }, uOpacity: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap; uniform float uBlur; uniform float uOpacity; varying vec2 vUv;
      void main() {
        // 24-tap golden-angle spiral blur; radius shrinks to 0 when in focus.
        vec4 acc = texture2D(uMap, vUv); float w = 1.0;
        float rad = uBlur * 0.03;
        for (int i = 1; i < 24; i++) {
          float fi = float(i);
          float a = fi * 2.399963;
          float r = sqrt(fi / 24.0) * rad;
          acc += texture2D(uMap, vUv + vec2(cos(a), sin(a * 1.0)) * vec2(r * 0.625, r));
          w += 1.0;
        }
        vec4 col = acc / w;
        #include <colorspace_fragment>
        gl_FragColor = vec4(col.rgb, uOpacity);
      }`,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new Mesh(new PlaneGeometry(9.6, 6), material);
  mesh.position.z = -7;
  mesh.visible = false;
  return {
    mesh,
    set(opacity, sharp) {
      material.uniforms.uOpacity.value = opacity;
      material.uniforms.uBlur.value = 1 - sharp;
      mesh.visible = opacity > 0.01;
    },
    dispose() { mesh.geometry.dispose(); material.dispose(); map.dispose(); },
  };
}
