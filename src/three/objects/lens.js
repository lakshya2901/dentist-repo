import { Group, Mesh, SphereGeometry, TorusGeometry, MeshPhysicalMaterial, Color } from 'three';

/** Intraocular-lens-style object (cataract / LASIK section): biconvex glassy disc with a haptic ring. */
export function createLens({ tier, theme }) {
  const group = new Group();
  const glass = new MeshPhysicalMaterial({
    color: new Color('#d6f6ff'), roughness: 0.03, metalness: 0, clearcoat: 1, clearcoatRoughness: 0,
    envMapIntensity: 2,
    ...(tier === 'high'
      ? { transmission: 1, thickness: 0.8, ior: 1.45 } // real refraction on capable GPUs
      : { transparent: true, opacity: 0.45 }), // cheap look-alike elsewhere
  });
  const geo = new SphereGeometry(1.35, 64, 40);
  const body = new Mesh(geo, glass);
  body.scale.set(1, 1, 0.32); // squashed sphere = biconvex lens
  const ringGeo = new TorusGeometry(1.36, 0.05, 16, 96);
  const ringMat = new MeshPhysicalMaterial({ color: theme.glow, roughness: 0.2, metalness: 0.4, clearcoat: 1, emissive: theme.glow, emissiveIntensity: 0.25 });
  const ring = new Mesh(ringGeo, ringMat);
  group.add(body, ring);
  group.visible = false;
  return {
    group,
    update({ t, dt, pose, pointer, reduced }) {
      const k = pose.c;
      group.visible = k > 0.01;
      group.scale.setScalar(Math.max(0.0001, k));
      group.rotation.set(-pointer.y * 0.25 + 0.2, (reduced ? 0.4 : Math.sin(t * 0.5) * 0.6) + pointer.x * 0.4, 0);
    },
    dispose() { geo.dispose(); ringGeo.dispose(); glass.dispose(); ringMat.dispose(); },
  };
}
