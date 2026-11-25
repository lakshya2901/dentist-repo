import { Group, Mesh, SphereGeometry, MeshPhysicalMaterial, MeshStandardMaterial, MeshBasicMaterial, CanvasTexture, SRGBColorSpace } from 'three';

const R = 1.4; // sclera radius

/** Procedural iris: radial fibres, collarette ring and dark limbal edge drawn on a canvas. */
function makeIrisTexture(base, size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const m = size / 2;
  const grad = g.createRadialGradient(m, m, size * 0.05, m, m, m);
  grad.addColorStop(0, base.inner);
  grad.addColorStop(0.55, base.mid);
  grad.addColorStop(1, base.outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  // radial fibres
  for (let i = 0; i < 260; i++) {
    const a = Math.random() * Math.PI * 2;
    const r0 = size * (0.08 + Math.random() * 0.12);
    const r1 = size * (0.28 + Math.random() * 0.22);
    g.strokeStyle = `rgba(${Math.random() < 0.5 ? '255,255,255' : '0,10,40'},${0.05 + Math.random() * 0.16})`;
    g.lineWidth = 0.6 + Math.random() * 2.2;
    g.beginPath();
    g.moveTo(m + Math.cos(a) * r0, m + Math.sin(a) * r0);
    g.lineTo(m + Math.cos(a + (Math.random() - 0.5) * 0.06) * r1, m + Math.sin(a + (Math.random() - 0.5) * 0.06) * r1);
    g.stroke();
  }
  // collarette ring + limbal darkening
  g.strokeStyle = 'rgba(255,230,180,0.28)';
  g.lineWidth = 5;
  g.beginPath();
  g.arc(m, m, size * 0.2, 0, Math.PI * 2);
  g.stroke();
  const limb = g.createRadialGradient(m, m, size * 0.38, m, m, m);
  limb.addColorStop(0, 'rgba(0,0,0,0)');
  limb.addColorStop(1, 'rgba(0,5,25,0.85)');
  g.fillStyle = limb;
  g.fillRect(0, 0, size, size);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Spherical cap facing +Z (sphere poles are along Y, so rotate the pole to Z). */
function cap(radius, angle, segs) {
  const g = new SphereGeometry(radius, segs, Math.max(8, segs >> 1), 0, Math.PI * 2, 0, angle);
  g.rotateX(Math.PI / 2);
  return g;
}

/**
 * Eye. Pose parameters (see scrollCamera.js):
 *   a = dive (0 outside → 1 camera passed through the pupil)
 *   c = lens morph (eye shrinks away as the lens object takes over)
 * The whole eyeball rotates to look at the cursor; the iris/pupil are fixed to it, so they follow.
 */
export function createEyeObject({ tier, theme }) {
  const segs = tier === 'low' ? 40 : 64;
  const group = new Group();
  const ball = new Group(); // rotates to look at the pointer
  group.add(ball);

  const scleraMat = new MeshPhysicalMaterial({ color: '#f6f2ef', roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.25, envMapIntensity: 0.8 });
  const sclera = new Mesh(new SphereGeometry(R, segs, segs >> 1), scleraMat);

  const irisRadius = 0.66;
  const irisGeo = cap(R * 1.002, Math.asin(irisRadius / R), segs);
  // Planar-from-front UVs so the radial texture maps onto the cap.
  const pa = irisGeo.attributes.position;
  const ua = irisGeo.attributes.uv;
  for (let i = 0; i < pa.count; i++) ua.setXY(i, 0.5 + pa.getX(i) / (2 * irisRadius), 0.5 + pa.getY(i) / (2 * irisRadius));
  const irisTex = makeIrisTexture(theme.iris);
  const irisMat = new MeshStandardMaterial({ map: irisTex, roughness: 0.45, metalness: 0 });
  const iris = new Mesh(irisGeo, irisMat);

  const pupilGeo = cap(R * 1.006, Math.asin(0.27 / R), 32);
  const pupilMat = new MeshBasicMaterial({ color: '#02030a' });
  const pupil = new Mesh(pupilGeo, pupilMat);

  const corneaGeo = cap(R * 1.07, 0.78, segs);
  const corneaMat = new MeshPhysicalMaterial({
    color: '#ffffff', roughness: 0, metalness: 0, transparent: true, opacity: 0.14, clearcoat: 1, clearcoatRoughness: 0,
    envMapIntensity: 2.2, depthWrite: false,
  });
  const cornea = new Mesh(corneaGeo, corneaMat);

  ball.add(sclera, iris, pupil, cornea);

  const look = { x: 0, y: 0 };
  return {
    group,
    update({ t, dt, pose, pointer, reduced }) {
      const k = 1 - Math.exp(-dt * 6);
      look.y += (pointer.x * 0.6 - look.y) * k; // yaw toward cursor
      look.x += (-pointer.y * 0.45 - look.x) * k; // pitch toward cursor
      ball.rotation.set(look.x, look.y, 0);

      // Pupil: gentle breathing + dilates as the camera dives in.
      const breathe = reduced ? 0 : Math.sin(t * 0.9) * 0.08;
      const dilate = 1 + breathe + pose.a * 0.9;
      pupil.scale.set(dilate, dilate, 1);

      const s = Math.max(0.0001, 1 - pose.c);
      ball.scale.setScalar(s);
      group.visible = s > 0.01;
    },
    dispose() {
      [sclera.geometry, irisGeo, pupilGeo, corneaGeo, scleraMat, irisMat, pupilMat, corneaMat, irisTex].forEach((d) => d.dispose());
    },
  };
}
