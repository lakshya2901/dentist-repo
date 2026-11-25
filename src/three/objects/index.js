import { createDentistObject } from './dentist.js';
import { createEyeSceneObject } from './eyeScene.js';

/**
 * Picks the hero object. Returns { group, update(ctx), dispose(), extras? }.
 * To use your own model, set scene.gltfUrl in config.js (see gltf.js).
 */
export async function createHeroObject({ specialty, gltfUrl, tier, theme }) {
  if (gltfUrl) {
    try {
      const { createGltfObject } = await import('./gltf.js');
      return await createGltfObject({ url: gltfUrl });
    } catch (err) {
      console.warn('GLTF failed to load, using the procedural model instead.', err);
    }
  }
  return specialty === 'eye' ? createEyeSceneObject({ tier, theme }) : createDentistObject({ tier, theme });
}
