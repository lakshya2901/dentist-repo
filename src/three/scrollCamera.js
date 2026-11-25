import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

/**
 * Scroll → 3D "pose". Edit KEYFRAMES to choreograph the scene.
 *
 * Each keyframe belongs to a page section (by id) and is reached when that section's top
 * crosses the middle of the screen; between two sections the values are eased.
 *
 *   x, y   position as a fraction of the visible half-width / half-height (−1 … 1)
 *   s      object scale            camZ  camera distance (can go negative to fly *through* the eye)
 *   a,b,c  morph amounts the hero object interprets (see objects/dentist.js, objects/eyeScene.js)
 *   o      canvas opacity (lower it where text needs to stay easy to read)
 */
export const KEYFRAMES = {
  // Dentist: clean tooth → shield → smile arc
  dentist: [
    ['hero',         { x: 0.5,  y: 0,    s: 1,    camZ: 7,   a: 0, b: 0, c: 0, o: 1 }],
    ['services',     { x: -0.6, y: 0,    s: 0.9,  camZ: 7.5, a: 1, b: 0, c: 0, o: 0.95 }],
    ['why',          { x: 0.6,  y: 0.05, s: 0.85, camZ: 7.5, a: 1, b: 0, c: 0, o: 0.5 }],
    ['about',        { x: 0,    y: 0,    s: 1,    camZ: 8,   a: 0, b: 1, c: 0, o: 0.5 }],
    ['process',      { x: 0.2,  y: 0.62, s: 1.1,  camZ: 8,   a: 0, b: 1, c: 0, o: 0.95 }],
    ['testimonials', { x: 0.1,  y: 0.62, s: 1.1,  camZ: 8,   a: 0, b: 1, c: 0, o: 0.95 }],
  ],
  // Eye: whole eye → camera dives through the pupil → focus/blur demo → lens
  eye: [
    ['hero',         { x: 0.5,  y: 0, s: 1,   camZ: 7,    a: 0, b: 0, c: 0, o: 1 }],
    ['services',     { x: -0.6, y: 0, s: 0.8, camZ: 7.5,  a: 0, b: 0, c: 0, o: 0.95 }],
    ['why',          { x: 0.6,  y: 0, s: 0.9, camZ: 7,    a: 0, b: 0, c: 0, o: 0.55 }],
    ['about',        { x: 0,    y: 0, s: 1,   camZ: -2.4, a: 1, b: 0, c: 0, o: 0.3 }],
    ['process',      { x: 0,    y: 0, s: 1,   camZ: -2.4, a: 1, b: 1, c: 0, o: 0.4 }],
    ['testimonials', { x: 0.6,  y: 0.5, s: 0.75, camZ: 8,  a: 0, b: 1, c: 1, o: 0.9 }],
  ],
};

const FIELDS = ['x', 'y', 's', 'camZ', 'a', 'b', 'c', 'o'];
const ease = gsap.parseEase('power2.inOut');

/**
 * Creates the pose controller. `pose` always holds the current (damped) values, so the camera
 * glides to wherever scrolling asks it to be — this is the "scrub with easing".
 */
export function createScrollCamera({ specialty, reduced, isMobile }) {
  const frames = KEYFRAMES[specialty];
  const pose = { ...frames[0][1] };
  const target = { ...frames[0][1] };
  let offsets = [];
  let trigger;

  const apply = (p) => {
    // Phones: centre horizontally, sit in the upper half, and shrink so text stays readable.
    if (isMobile()) {
      p.x = 0;
      p.y += 0.4 * (1 - Math.min(1, p.a));
      p.s *= 0.62;
      p.o *= 0.8;
    }
    return p;
  };

  function measure() {
    const half = window.innerHeight / 2;
    offsets = frames.map(([id], i) => {
      const el = document.getElementById(id);
      return i === 0 || !el ? 0 : el.getBoundingClientRect().top + window.scrollY - half;
    });
  }

  function computeTarget() {
    const y = window.scrollY;
    let i = offsets.length - 1;
    while (i > 0 && y < offsets[i]) i--;
    const a = frames[i][1];
    if (i === offsets.length - 1) return Object.assign(target, a);
    const b = frames[i + 1][1];
    const span = Math.max(1, offsets[i + 1] - offsets[i]);
    const t = ease(Math.min(1, Math.max(0, (y - offsets[i]) / span)));
    for (const f of FIELDS) target[f] = a[f] + (b[f] - a[f]) * t;
    return target;
  }

  if (!reduced) {
    // ScrollTrigger gives us robust refresh handling (resize, fonts, images) + a scroll callback.
    trigger = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: computeTarget, onRefresh: () => { measure(); computeTarget(); } });
    measure();
    computeTarget();
    // Start exactly where the page is (e.g. after reload mid-page) without a long glide.
    Object.assign(pose, target);
  }

  return {
    pose,
    /** Move `pose` toward the scroll target. Returns the pose with mobile adjustments applied. */
    update(dt) {
      const k = reduced ? 1 : 1 - Math.exp(-dt * 4.5);
      for (const f of FIELDS) pose[f] += (target[f] - pose[f]) * k;
      return apply({ ...pose });
    },
    refresh: () => { if (!reduced) { measure(); computeTarget(); } },
    dispose() { trigger?.kill(); },
  };
}
