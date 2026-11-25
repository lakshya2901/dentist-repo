import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import { config } from './config.js';
import { initNav } from './sections/nav.js';
import { hasWebGL } from './three/device.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Above the fold: needed immediately.
initNav();

/** Run `loader()` (a dynamic import) when `selector` is near the viewport. Keeps first load lean. */
function lazy(selector, loader) {
  const el = document.querySelector(selector);
  if (!el) return;
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1));
  const run = () => idle(() => loader().then((m) => m.default?.() ?? Object.values(m)[0]()));
  if (!('IntersectionObserver' in window)) return run();
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        run();
      }
    },
    { rootMargin: '150px 0px' }
  );
  io.observe(el);
}

lazy('#services', () => import('./sections/services.js'));
lazy('#why', () => import('./sections/stats.js'));
lazy('#process', () => import('./sections/process.js'));
lazy('#testimonials', () => import('./sections/testimonials.js'));
lazy('#faq', () => import('./sections/faq.js'));
lazy('#booking', () => import('./sections/booking.js'));
lazy('#services', () => import('./sections/reveal.js'));

// 3D scene: loaded after first paint so it never blocks LCP.
function startScene() {
  if (!hasWebGL()) {
    document.documentElement.classList.add('no-webgl');
    return;
  }
  import('./three/scene.js')
    .then(({ initScene }) => initScene({ canvas: document.getElementById('scene-canvas'), config, reducedMotion: reduced }))
    .catch((err) => {
      console.warn('3D scene failed, using static fallback.', err);
      document.documentElement.classList.add('no-webgl');
    });
}
const idleStart = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
if (document.readyState === 'complete') idleStart(startScene);
else addEventListener('load', () => idleStart(startScene), { once: true });
