import { Group } from 'three';
import { createTooth } from './tooth.js';
import { createShield } from './shield.js';
import { createSmile } from './smile.js';

/**
 * Dentist hero. Pose parameters (see scrollCamera.js):
 *   a = shield amount (0..1)   b = smile-arc amount (0..1)
 * Sequence on scroll: clean tooth → shield glow → smile arc of teeth.
 */
export function createDentistObject({ theme }) {
  const group = new Group();
  const rig = new Group(); // tilt/sway happens here
  group.add(rig);
  rig.scale.setScalar(0.72); // overall size of the dentist set within the hero framing

  const tooth = createTooth();
  const shield = createShield(theme.glow);
  const smile = createSmile(9);
  rig.add(tooth.group, shield.mesh, smile.group);
  smile.group.scale.setScalar(0.85);

  const tilt = { x: 0, y: 0 };
  return {
    group,
    update({ t, dt, pose, pointer, reduced }) {
      // Parallax tilt toward the pointer (damped), plus a slow sway instead of free spin
      // so the shield and smile always face the viewer.
      const sway = reduced ? 0 : Math.sin(t * 0.45) * 0.55 * (1 - pose.b * 0.8);
      const k = 1 - Math.exp(-dt * 4);
      tilt.x += (pointer.y * 0.28 - tilt.x) * k;
      tilt.y += (pointer.x * 0.45 - tilt.y) * k;
      rig.rotation.set(-tilt.x, tilt.y + sway, 0);
      rig.position.y = reduced ? 0 : Math.sin(t * 0.9) * 0.08;

      const toothScale = 1 - pose.b; // the single tooth gives way to the smile
      tooth.group.scale.setScalar(Math.max(0.0001, toothScale));
      tooth.group.visible = toothScale > 0.01;
      shield.set(pose.a, t);
      smile.set(pose.b, t);
    },
    dispose() { tooth.dispose(); shield.dispose(); smile.dispose(); },
  };
}
