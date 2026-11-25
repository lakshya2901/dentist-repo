import { Group } from 'three';
import { createEyeObject } from './eye.js';
import { createFocusChart } from './focusChart.js';
import { createLens } from './lens.js';

/**
 * Eye specialist hero: eye → camera dives through the pupil → focus/blur chart → lens.
 * Pose: a = dive, b = focus sharpness, c = lens morph.
 */
export function createEyeSceneObject({ tier, theme }) {
  const group = new Group();
  const eye = createEyeObject({ tier, theme });
  const lens = createLens({ tier, theme });
  const chart = createFocusChart(theme);
  group.add(eye.group, lens.group);
  // The chart lives in world space (not affected by the hero pose offset); scene.js adds it to the scene.
  return {
    group,
    extras: [chart.mesh],
    update(ctx) {
      eye.update(ctx);
      lens.update(ctx);
      const { a, b } = ctx.pose;
      const vis = Math.min(1, Math.max(0, (a - 0.7) / 0.3)); // appears as we pass through the pupil
      chart.set(vis * (1 - ctx.pose.c), b);
    },
    dispose() { eye.dispose(); lens.dispose(); chart.dispose(); },
  };
}
