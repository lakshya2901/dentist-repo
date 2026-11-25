import { DirectionalLight, HemisphereLight, Group } from 'three';

/** Soft studio lighting: key (warm), fill (cool), rim (accent) + gentle ambient. */
export function createLights(rimColor) {
  const group = new Group();
  const key = new DirectionalLight(0xfff4e8, 2.4);
  key.position.set(3.5, 4, 5);
  const fill = new DirectionalLight(0xbfd8ff, 0.9);
  fill.position.set(-5, 1, 3);
  const rim = new DirectionalLight(rimColor, 2.6);
  rim.position.set(-2, 3, -5);
  const ambient = new HemisphereLight(0xffffff, 0x99aacc, 0.55);
  group.add(key, fill, rim, ambient);
  return group; // lights have no GPU resources to dispose
}
