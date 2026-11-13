import { writeFileSync, mkdirSync } from 'node:fs';
import { template, exportScene, object } from './model.mjs';
const storage = process.argv[2];
if (!storage)
    throw new Error('Provide a temporary storage directory.');
const dir = `${storage}/projects/editor/scene-configs`;
mkdirSync(dir, { recursive: true });
for (const kind of ['corridor', 'tee', 'empty'])
    writeFileSync(`${dir}/${kind}.config.json`, JSON.stringify(exportScene(template(kind))));
const p = template('empty');
p.camera.yaw = 45;
p.objects = [object('wall', { x: 20, s: 70, angle: 37, w: 100 }), object('arch', { x: 80, s: 120, angle: 60, w: 40, h: 35 })];
writeFileSync(`${dir}/rotated.config.json`, JSON.stringify(exportScene(p)));
for (const shape of ['sphere', 'cube', 'diamond', 'cylinder'])
    for (const pattern of ['solid', 'diamonds', 'spiral', 'checker', 'bands']) {
        const p = template('empty');
        p.objects = [object('landmark', { shape, pattern, color: '#437aff', pattern_color: '#ffffff', pattern_size_cm: 7, x: 10, s: 200, y: 30, w: 30, d: 20, h: 40, angle: 27 })];
        writeFileSync(`${dir}/landmark_${shape}_${pattern}.config.json`, JSON.stringify(exportScene(p)));
    }
for (const name of ['wheel_straight', 'wheel_loop', 'wheel_yaw']) {
    const p = template();
    p.navigation = { mode: 'wheel', device: 'wheel', axis: 'wheel', loop: name === 'wheel_loop', track_length_cm: 20, fade_frames: 0 };
    if (name === 'wheel_yaw')
        p.camera.yaw = 90;
    writeFileSync(`${dir}/${name}.config.json`, JSON.stringify(exportScene(p)));
}
