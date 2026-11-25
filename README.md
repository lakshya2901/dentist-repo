# Clinic website — 3D, scroll-driven (Vite + Three.js + GSAP)

Single-page site for a dentist **or** eye specialist. All text and settings live in
[`src/config.js`](src/config.js); everything in `[SQUARE BRACKETS]` is a placeholder to replace.

## Run it

Requires Node 18+.

```bash
npm install
npm run dev        # http://localhost:5173 (reloads when you edit config.js)
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

## Edit content (`src/config.js`)

| What | Where |
| --- | --- |
| **Dentist or eye specialist** | `specialty: 'dentist'` or `'eye'` — switches copy, colour theme and 3D scene |
| Name, phone, WhatsApp, email, address, hours, social links, map | `clinic` |
| Doctor name, photo, qualifications, bio | `doctor` |
| Stats (marked "Placeholder figure") | `stats` |
| Reviews (marked "Placeholder review") | `testimonials` |
| Hero text, services, process steps, FAQ, SEO title/description | `content.dentist` / `content.eye` |
| Booking API endpoint | `booking.endpoint` |
| Footer disclaimer | `disclaimer` |

Other files you may want:
- **Colours / fonts / spacing:** CSS variables at the top of `src/styles/base.css` (one block per specialty).
- **Favicon / social image:** `public/favicon.svg`, `public/og-image.svg`. For best social previews replace the OG image with a 1200×630 PNG/JPG and update the path in `src/render.js`.
- **Doctor photo:** put an image in `public/` and set `doctor.photo: '/doctor.jpg'`.
- **Map:** paste a Google Maps *Embed a map* `src` URL into `clinic.mapEmbedUrl`.
- Don't publish credentials, statistics or reviews that aren't real and verified. The JSON-LD structured data is generated from the same config and deliberately contains no ratings or reviews.

### Connect the booking form
`src/sections/booking.js` → `sendBooking(data, endpoint)`. Until `booking.endpoint` is set it only logs to the
console (nothing is sent) and shows the success screen. Set the endpoint to any JSON API / Formspree URL,
or replace the function body to use EmailJS etc. (examples are in the comment). It must throw on failure so the
form shows its error message. A honeypot field guards against simple bots; add server-side validation too.

## How the 3D works

```
src/three/
  scene.js         renderer, quality tiers, render loop (pauses off-screen / hidden tab), disposal
  scrollCamera.js  KEYFRAMES: where the object / camera is at each section; damped for smooth scrubbing
  lights.js        key / fill / rim studio lights (+ procedural RoomEnvironment for reflections)
  particles.js     floating particles (animated in the vertex shader)
  device.js        WebGL detection + low/medium/high tier
  objects/         tooth, shield, smile (dentist) · eye, focusChart, lens (eye) · gltf.js · index.js
```

- Dentist: tooth → shield glow → smile arc. Eye: eye follows cursor → camera flies through the pupil → focus/blur chart → lens.
- To change the choreography edit `KEYFRAMES` in `scrollCamera.js` (position, scale, camera distance, morph amounts, canvas opacity per section).
- Quality: phones/weak GPUs get fewer particles and a lower pixel ratio (never above 2); sustained low frame rates step the pixel ratio down automatically. Software renderers skip 3D and show the static illustration (append `?force3d` to the URL to override while testing).
- `prefers-reduced-motion`: no scroll-driven camera, no auto-rotation, no pointer tracking; a single still frame is rendered.
- No WebGL (or context lost): a CSS/SVG illustration is shown instead. The canvas is `aria-hidden`; all content is real HTML.

## Replace the model with a GLTF/GLB

1. Put your model in `public/models/tooth.glb` (or any name).
2. In `src/config.js` set `scene: { gltfUrl: '/models/tooth.glb' }`.
3. `src/three/objects/gltf.js` auto-centres and scales the model and gives it the same pointer tilt/sway. Edit its `update()` to drive your own animations from `pose.a / pose.b / pose.c` (0–1 scroll-driven values). If loading fails it falls back to the procedural model.
4. Draco-compressed models need the decoder files (see the comment in `gltf.js`).

Any object that returns `{ group, update(ctx), dispose() }` can be used — see `objects/index.js`.

## Deploy

`npm run build` creates a static site in `dist/`.

- **Netlify:** New site from Git → build command `npm run build`, publish directory `dist` (or drag-drop `dist`).
- **Vercel:** Import the repo → framework preset *Vite* (build `npm run build`, output `dist`).

Afterwards set `clinic.siteUrl` in `config.js` to the real domain (used for canonical/Open Graph URLs) and rebuild.
