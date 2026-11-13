// Write an RGBA contact sheet for visual QA of the same renderer used by the UI.
import { writeFileSync } from 'node:fs';
import { landmarkShapes, landmarkPatterns } from './landmarks.mjs';
import { solids } from './model.mjs';
import { DepthPreview } from './preview.mjs';
const path = process.argv[2];
if (!path)
    throw new Error('Pass an output .rgba path.');
const tileW = 320, tileH = 200;
const width = tileW * landmarkPatterns.length, height = tileH * landmarkShapes.length;
const data = new Uint8Array(width * height * 4), renderer = new DepthPreview();
for (let row = 0; row < landmarkShapes.length; row++)
    for (let col = 0; col < landmarkPatterns.length; col++) {
        const o = { id: 'preview', name: 'Landmark', kind: 'landmark', shape: landmarkShapes[row], pattern: landmarkPatterns[col], color: '#437aff', pattern_color: '#ffffff', pattern_size_cm: 7, w: 30, d: 20, h: 40, x: 0, s: 0, y: 0, angle: 0 };
        const span = 40, x = -span * 1.4, s = -span * 2.2, y = span * .9, camera = { x, s, y, yaw: Math.atan2(-x, -s) * 180 / Math.PI, pitch: Math.atan2(y, Math.hypot(x, s)), fov: 40 };
        const image = renderer.render(solids({ objects: [o] }, { preview: true }), camera, tileW, tileH);
        for (let y = 0; y < tileH; y++)
            data.set(image.data.subarray(y * tileW * 4, (y + 1) * tileW * 4), ((row * tileH + y) * width + col * tileW) * 4);
    }
writeFileSync(path, data);
console.log(`RGBA ${width}×${height}: rows ${landmarkShapes.join("/")}; columns ${landmarkPatterns.join("/")}.`);
