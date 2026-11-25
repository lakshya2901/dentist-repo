import { Group, Mesh } from 'three';
import { createCrownGeometry, createEnamelMaterial } from './tooth.js';

/** A smile arc of small teeth that pop in one after another from the centre outwards. */
export function createSmile(count = 9) {
  const group = new Group();
  const geometry = createCrownGeometry(32);
  const material = createEnamelMaterial('#b9dfe3'); // slightly cooler so small teeth read against a light page
  const teeth = [];
  const mid = (count - 1) / 2;
  for (let i = 0; i < count; i++) {
    const x = (i - mid) * 0.66;
    const y = 0.085 * x * x - 0.5; // parabola: ends higher than the middle = smile
    const m = new Mesh(geometry, material);
    const size = 0.3 - Math.abs(i - mid) * 0.018; // centre teeth are largest
    m.position.set(x, y, -Math.abs(x) * 0.12);
    m.rotation.z = Math.PI + Math.atan(0.17 * x) * 0.9; // point toward the gum line, follow curve
    m.rotation.y = -x * 0.08;
    m.userData = { size, delay: (Math.abs(i - mid) / mid) * 0.45 };
    m.scale.setScalar(0.0001);
    teeth.push(m);
    group.add(m);
  }
  group.visible = false;
  return {
    group,
    set(amount, t) {
      group.visible = amount > 0.01;
      for (const m of teeth) {
        const k = Math.min(1, Math.max(0, (amount - m.userData.delay) / 0.55));
        const e = 1 - Math.pow(1 - k, 3);
        const back = 1 + Math.sin(k * Math.PI) * 0.12; // little overshoot
        m.scale.setScalar(Math.max(0.0001, m.userData.size * e * back));
      }
      group.position.y = Math.sin(t * 0.8) * 0.05;
    },
    dispose() { geometry.dispose(); material.dispose(); },
  };
}
