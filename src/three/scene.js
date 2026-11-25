import {
  WebGLRenderer, Scene, PerspectiveCamera, PMREMGenerator, Color, ACESFilmicToneMapping, SRGBColorSpace,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createLights } from './lights.js';
import { createParticles } from './particles.js';
import { createScrollCamera } from './scrollCamera.js';
import { createHeroObject } from './objects/index.js';
import { getTier } from './device.js';

gsap.registerPlugin(ScrollTrigger);

/** Quality presets. Lower tiers = fewer particles, lower pixel ratio, no antialiasing. */
const TIERS = {
  low: { maxDpr: 1, particles: 40, antialias: false },
  medium: { maxDpr: 1.5, particles: 120, antialias: true },
  high: { maxDpr: 2, particles: 260, antialias: true }, // never above 2
};

const THEMES = {
  dentist: {
    glow: '#19b6b0', rim: 0x7fe9e4, particle: '#19b6b0',
    iris: null,
  },
  eye: {
    glow: '#5ee1ff', rim: 0x7a8cff, particle: '#8fb4ff',
    iris: { inner: '#1b2f8a', mid: '#2f7bff', outer: '#79e0ff' },
    chartBg: '#111a55', chartInk: '#e4eaff',
  },
};

/**
 * Boots the 3D scene. Returns { dispose }.
 * Structure: renderer → scene { lights, particles, hero object } → camera driven by scrollCamera.
 */
export async function initScene({ canvas, config, reducedMotion }) {
  const specialty = config.specialty === 'eye' ? 'eye' : 'dentist';
  const theme = THEMES[specialty];

  // Probe the GPU on a throwaway canvas to choose a quality tier, then release that context.
  const probeGl = document.createElement('canvas').getContext('webgl2') || document.createElement('canvas').getContext('webgl');
  const tierName = getTier(probeGl);
  probeGl?.getExtension('WEBGL_lose_context')?.loseContext();
  if (tierName === 'none') throw new Error('Software WebGL renderer detected; using static fallback');
  const { maxDpr, particles: particleCount, antialias } = TIERS[tierName];

  const renderer = new WebGLRenderer({ canvas, antialias, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = specialty === 'eye' ? 1.05 : 1.0;
  renderer.outputColorSpace = SRGBColorSpace;
  let dpr = Math.min(window.devicePixelRatio || 1, maxDpr, 2);
  renderer.setPixelRatio(dpr);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 60);
  camera.position.z = 7;

  // Reflections come from a procedural studio "room" — no HDR download needed.
  const pmrem = new PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.add(createLights(theme.rim));

  const particles = createParticles({ count: particleCount, color: new Color(theme.particle), pixelRatio: dpr });
  scene.add(particles.object);

  const hero = await createHeroObject({ specialty, gltfUrl: config.scene.gltfUrl, tier: tierName, theme });
  scene.add(hero.group);
  (hero.extras || []).forEach((o) => scene.add(o));

  const isMobile = () => window.innerWidth < 820;
  const cam = createScrollCamera({ specialty, reduced: reducedMotion, isMobile });
  const stage = canvas.parentElement;

  /* ---------- sizing ---------- */
  const REF_Z = 7; // distance used to convert "fraction of screen" → world units
  function resize() {
    const w = stage.clientWidth || window.innerWidth;
    const h = stage.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    cam.refresh();
    if (paused) renderFrame(0); // keep a correct still frame while idle / reduced motion
  }

  /* ---------- pointer (−1…1, y up) ---------- */
  const pointer = { x: 0, y: 0 };
  const onPointer = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  if (!reducedMotion) window.addEventListener('pointermove', onPointer, { passive: true });

  /* ---------- render ---------- */
  let last = performance.now();
  const tick = () => { const n = performance.now(); const d = Math.min((n - last) / 1000, 0.05); last = n; return d; };
  let t = 0;
  let raf = 0;
  let paused = true;
  let slow = 0;

  function renderFrame(dt) {
    t += dt;
    const pose = cam.update(dt);
    const halfH = Math.tan((camera.fov * Math.PI) / 360) * REF_Z;
    const halfW = halfH * camera.aspect;
    hero.group.position.set(pose.x * halfW, pose.y * halfH, 0);
    hero.group.scale.setScalar(pose.s);
    camera.position.z = pose.camZ; // looks straight down −Z, so it can fly through the eye
    stage.style.opacity = pose.o.toFixed(3);
    hero.update({ t, dt, pose, pointer, reduced: reducedMotion });
    particles.update(t);
    renderer.render(scene, camera);
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    const dt = tick();
    renderFrame(dt);
    // Adaptive quality: if frames stay slow, step the pixel ratio down (min 1).
    slow = dt > 1 / 32 ? slow + 1 : Math.max(0, slow - 1);
    if (slow > 60 && dpr > 1) {
      dpr = Math.max(1, dpr - 0.25);
      renderer.setPixelRatio(dpr);
      particles.object.material.uniforms.uPx.value = dpr;
      resize();
      slow = 0;
    }
  }

  /** Animate only while the tab is visible AND a transparent (3D) section is on screen. */
  let tabVisible = !document.hidden;
  let sectionsVisible = true;
  function sync() {
    const shouldRun = tabVisible && sectionsVisible && !reducedMotion;
    if (shouldRun && paused) {
      paused = false;
      last = performance.now(); // discard the time spent paused
      raf = requestAnimationFrame(loop);
    } else if (!shouldRun && !paused) {
      paused = true;
      cancelAnimationFrame(raf);
    }
  }
  const onVis = () => { tabVisible = !document.hidden; sync(); };
  document.addEventListener('visibilitychange', onVis);

  const visible = new Set();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
    sectionsVisible = visible.size > 0;
    sync();
  });
  document.querySelectorAll('[data-3d]').forEach((el) => io.observe(el));

  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  resize();
  renderFrame(0); // first frame immediately (also the only frame for reduced motion)
  stage.classList.add('ready');
  sync();

  /* ---------- teardown ---------- */
  const onLost = (e) => { e.preventDefault(); dispose(); document.documentElement.classList.add('no-webgl'); };
  canvas.addEventListener('webglcontextlost', onLost);

  let disposed = false;
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    window.removeEventListener('pointermove', onPointer);
    canvas.removeEventListener('webglcontextlost', onLost);
    cam.dispose();
    hero.dispose();
    particles.dispose();
    envRT.dispose();
    pmrem.dispose();
    renderer.dispose();
  }
  addEventListener('pagehide', dispose, { once: true });
  if (import.meta.hot) import.meta.hot.dispose(dispose);
  return { dispose };
}
