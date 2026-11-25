import { Group, Box3, Vector3 } from 'three';

/**
 * Drop-in replacement for the procedural hero: loads a .glb/.gltf and exposes the same
 * interface ({ group, update, dispose }) as dentist.js / eyeScene.js.
 *
 * Enable it by setting scene.gltfUrl in config.js (file goes in /public, e.g. '/models/tooth.glb').
 * The loader is imported dynamically, so it adds nothing to the bundle unless used.
 *
 * You can drive your own morphs from `pose` ({ a, b, c } = 0..1 scroll-driven values),
 * e.g. play an AnimationMixer clip at pose.a, or fade materials with pose.b.
 */
export async function createGltfObject({ url }) {
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  const loader = new GLTFLoader();
  // Draco-compressed models: also `import { DRACOLoader }` from three/examples/jsm/loaders/DRACOLoader.js,
  // call new DRACOLoader().setDecoderPath('/draco/') (copy the decoder files into /public/draco) and
  // loader.setDRACOLoader(draco).
  const gltf = await loader.loadAsync(url);

  // Normalise size/centre so any model fits the hero framing.
  const model = gltf.scene;
  const box = new Box3().setFromObject(model);
  const size = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());
  model.position.sub(center);
  const wrapper = new Group();
  wrapper.add(model);
  wrapper.scale.setScalar(3 / Math.max(size.x, size.y, size.z));
  const group = new Group();
  group.add(wrapper);

  return {
    group,
    update({ t, dt, pose, pointer, reduced }) {
      group.rotation.y += ((reduced ? 0 : Math.sin(t * 0.45) * 0.5) + pointer.x * 0.4 - group.rotation.y) * (1 - Math.exp(-dt * 4));
      group.rotation.x += (-pointer.y * 0.25 - group.rotation.x) * (1 - Math.exp(-dt * 4));
    },
    dispose() {
      model.traverse((o) => {
        if (!o.isMesh) return;
        o.geometry.dispose();
        for (const m of [].concat(o.material)) {
          for (const v of Object.values(m)) v?.isTexture && v.dispose();
          m.dispose();
        }
      });
    },
  };
}
