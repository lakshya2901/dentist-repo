import { Group, LatheGeometry, CylinderGeometry, Mesh, MeshPhysicalMaterial, SplineCurve, Vector2, Color } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Procedural tooth: a smooth lathe-turned crown with cusp bumps + two tapered, slightly bent roots.
 * Everything is built from geometry — swap in a GLTF later via objects/gltf.js.
 */

export function createCrownGeometry(radialSegments = 64) {
  // Profile (radius, height) from the top centre down to the neck. Spline-smoothed.
  const ctrl = [[0, 1.0], [0.42, 0.97], [0.78, 0.84], [0.98, 0.52], [1.0, 0.1], [0.92, -0.28], [0.74, -0.58], [0.5, -0.76], [0, -0.82]].map(([r, y]) => new Vector2(r, y));
  const pts = new SplineCurve(ctrl).getPoints(40);
  let g = new LatheGeometry(pts, radialSegments);
  g.deleteAttribute('uv');
  g.deleteAttribute('normal');
  g = mergeVertices(g); // weld the lathe seam so normals are smooth all around
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const ang = Math.atan2(z, x);
    const r = Math.hypot(x, z);
    // Four soft cusps on top, fading out toward the sides.
    const top = Math.max(0, y - 0.45) / 0.55;
    const bump = (Math.cos(2 * ang) * 0.5 + Math.cos(4 * ang) * 0.5 + 0.2) * 0.08 * top * Math.min(1, r * 2);
    p.setXYZ(i, x * 1.05, y + bump, z * 0.86);
  }
  g.computeVertexNormals();
  return g;
}

function createRootGeometry() {
  const g = new CylinderGeometry(0.3, 0.06, 1.35, 24, 12, true);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const t = (0.675 - p.getY(i)) / 1.35; // 0 at top, 1 at tip
    p.setX(i, p.getX(i) + t * t * 0.14);
  }
  g.computeVertexNormals();
  return g;
}

export function createEnamelMaterial(tint = '#fbfeff') {
  return new MeshPhysicalMaterial({
    color: new Color(tint),
    roughness: 0.2,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    sheen: 1,
    sheenColor: new Color('#8ff0e8'), // faint teal glow at grazing angles ≈ subsurface look
    sheenRoughness: 0.45,
    emissive: new Color('#2aa9a8'),
    emissiveIntensity: 0.035,
    envMapIntensity: 1.1,
  });
}

/** Full tooth (crown + roots). Returns a Group plus a dispose() helper. */
export function createTooth() {
  const group = new Group();
  const crownGeo = createCrownGeometry();
  const rootGeo = createRootGeometry();
  const enamel = createEnamelMaterial();
  const dentin = new MeshPhysicalMaterial({ color: '#f2e9d8', roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.3, side: 2 });

  group.add(new Mesh(crownGeo, enamel));
  for (const s of [-1, 1]) {
    const root = new Mesh(rootGeo, dentin);
    root.position.set(s * 0.42, -1.4, 0);
    root.rotation.z = s * 0.1;
    root.scale.x = s;
    group.add(root);
  }
  group.position.y = 0.45; // visually centre the whole tooth around the origin
  return { group, crownGeo, enamel, dispose: () => [crownGeo, rootGeo, enamel, dentin].forEach((d) => d.dispose()) };
}
