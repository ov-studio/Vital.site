import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND = path.resolve(__dirname, '..');
const OUT_DIR = path.join(FRONTEND, 'public/cdn/wallpaper');

const TILE_W = 3440;
const TILE_H = 1440;
const BRAND = 'hsl(220, 95%, 76%)';
const DEFAULT_GAP = 100;
const DEFAULT_SIZE = 60;
const SEEDS = {
  0: ['rocket', 'code-xml', 'terminal', 'zap', 'box', 'layers', 'cpu'], // Dev / tech / home hero
  1: ['rocket', 'gamepad-2', 'wand', 'puzzle', 'ghost', 'coffee', 'flame', 'cuboid', 'joystick', 'orbit', 'cat'], // Fun / playful / creative
  2: ['heart', 'star', 'flower-2', 'sun', 'leaf', 'feather', 'gem', 'gift', 'rainbow', 'clover', 'party-popper'], // Nature / celebration / warm
  3: ['heart', 'star', 'users', 'coffee', 'cat', 'bird', 'flower-2', 'party-popper', 'thumbs-up', 'message-circle', 'handshake'], // Social / positive / community vibe
  4: ['book-open', 'lightbulb', 'graduation-cap', 'notebook-pen', 'search', 'brain', 'highlighter', 'bookmark', 'file-text', 'library', 'pen-tool', 'scroll'], // Docs / knowledge / learning
  5: ['vault', 'lock', 'key-round', 'shield', 'fingerprint', 'eye-off', 'database', 'hard-drive', 'folder-lock', 'key', 'lock-keyhole', 'shield-check'], // Vault / security / private
  6: ['map', 'flag', 'milestone', 'target', 'route', 'calendar', 'trending-up', 'compass', 'goal', 'rocket', 'check-circle', 'arrow-up-right'], // Roadmap / progress / goals
  7: ['users', 'message-circle', 'heart', 'handshake', 'thumbs-up', 'share-2', 'user-plus', 'messages-square', 'globe', 'at-sign', 'mail', 'bell'], // Community / social / notifications
  8: ['settings', 'sliders-horizontal', 'wrench', 'cog', 'toggle-left', 'palette', 'monitor', 'layout', 'panels-top-left', 'brush', 'ruler', 'gauge'], // Settings / customization / UI
  9: ['search', 'scan', 'filter', 'list', 'hash', 'code', 'terminal', 'braces', 'file-code', 'binary', 'cpu', 'network'], // Search / API / code / developer tools
  10: ['map', 'flag', 'milestone', 'target', 'compass', 'route', 'calendar', 'circle-check', 'clock', 'rocket', 'trending-up', 'map-pin'], // Navigation / journey / progress (alt)
  11: ['scale', 'file-text', 'scroll-text', 'book-open', 'gavel', 'shield', 'lock', 'badge-check', 'eye', 'landmark', 'file-check', 'book-marked'], // Legal / TOS / compliance
  12: ['package', 'archive', 'box', 'folder-open', 'layers', 'database', 'key-round', 'lock', 'package-open', 'boxes', 'cuboid', 'library'], // Packages / storage / modules
};

function hash(i, j, seed) {
  let n = (i + seed * 97) * 374761393 + (j + seed * 13) * 668265263;
  n = (n ^ (n >> 13)) * 1274126177
  return ((n ^ (n >> 16)) >>> 0) / 4294967295;
}

function findIconsDir() {
  if (process.env.LUCIDE_ICONS_DIR) return process.env.LUCIDE_ICONS_DIR;
  const candidates = [
    path.join(FRONTEND, 'node_modules/lucide-react/dist/esm/icons'),
    path.join(FRONTEND, 'node_modules/lucide/dist/esm/icons'),
    path.join(FRONTEND, '../node_modules/lucide-react/dist/esm/icons'),
    path.join(FRONTEND, '../node_modules/lucide/dist/esm/icons'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  console.error(`[bake-wallpaper] lucide-react not found under node_modules. cd frontend && npm install`);
  process.exit(1);
}

function loadIconNodes(iconsDir, name) {
  for (const ext of ['.js', '.mjs']) {
    const file = path.join(iconsDir, `${name}${ext}`);
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, 'utf8');

    let m = src.match(/const\s+__iconNode\s*=\s*(\[[\s\S]*?\]);/);
    if (m) {
      try { return vm.runInNewContext(`(${m[1]})`); } 
      catch (e) {
        console.warn(`  [parse fail] ${name}`, e.message);
        return null;
      }
    }

    m = src.match(/const\s+\w+\s*=\s*(\[[\s\S]*?\]);\s*\n\s*export/);
    if (m) {
      try { return vm.runInNewContext(`(${m[1]})`); } 
      catch (e) {
        console.warn(`  [parse fail] ${name}`, e.message);
        return null;
      }
    }
  }
  console.warn(`  [skip missing] ${name}`);
  return null;
}

function nodesToInnerSvg(nodes, size) {
  const scale = size / 24;
  const parts = [];
  for (const node of nodes) {
    const [tag, attrs = {}] = node;
    const a = { ...attrs };
    delete a.key;
    a.fill = 'none';
    a.stroke = BRAND;
    a['stroke-width'] = '1.2';
    a['stroke-linecap'] = 'round';
    a['stroke-linejoin'] = 'round';
    const attrStr = Object.entries(a)
      .map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`)
      .join(' ');
    parts.push(`<${tag} ${attrStr}/>`);
  }
  return `<g transform="scale(${scale})">${parts.join('')}</g>`;
}

function buildScatter(seed, iconCount, gap, size) {
  const spots = [];
  const cols = Math.ceil(TILE_W / gap) + 3;
  const rows = Math.ceil(TILE_H / gap) + 3;

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      if (hash(col, row, seed + 99) < 0.12) continue;
      const x = col * gap + hash(col, row, seed) * gap;
      const y = row * gap + hash(col + 3, row + 5, seed) * gap;
      const rot = hash(col + 7, row + 11, seed) * 360;
      const s = size * (0.55 + hash(col + 13, row + 17, seed) * 0.7);
      const a = 0.45 + hash(col + 19, row + 23, seed) * 0.55;
      const iconIndex = Math.floor(hash(col + 29, row + 31, seed) * iconCount) % iconCount;
      spots.push({ x, y, rot, s, a, iconIndex });
    }
  }

  const gap2 = gap * 1.35;
  const cols2 = Math.ceil(TILE_W / gap2) + 2;
  const rows2 = Math.ceil(TILE_H / gap2) + 2;
  for (let row = -1; row < rows2; row++) {
    for (let col = -1; col < cols2; col++) {
      if (hash(col, row, seed + 50) > 0.4) continue;
      const x = col * gap2 + hash(col, row, seed + 3) * gap2;
      const y = row * gap2 + hash(col + 2, row + 4, seed + 3) * gap2;
      const rot = hash(col + 6, row + 8, seed + 3) * 360;
      const s = size * (0.35 + hash(col + 10, row + 12, seed + 3) * 0.4);
      const a = 0.3 + hash(col + 14, row + 16, seed + 3) * 0.4;
      const iconIndex = Math.floor(hash(col + 18, row + 20, seed + 3) * iconCount) % iconCount;
      spots.push({ x, y, rot, s, a, iconIndex });
    }
  }
  return spots;
}

async function rasterize(svgBuf, seed) {
  const sharp = (await import('sharp')).default;
  const webpPath = path.join(OUT_DIR, `seed-${seed}.webp`);
  await sharp(svgBuf, { density: 72 })
    .resize(TILE_W, TILE_H)
    .webp({ quality: 82, alphaQuality: 90, effort: 4 })
    .toFile(webpPath);
  return { webpKb: (fs.statSync(webpPath).size / 1024).toFixed(0) };
}

function bakeSeed(iconsDir, seed, names) {
  const loaded = [];
  for (const name of names) {
    const nodes = loadIconNodes(iconsDir, name);
    if (nodes) loaded.push({ name, nodes });
  }
  if (!loaded.length) throw new Error(`No icons for seed ${seed}`);

  const spots = buildScatter(seed, loaded.length, DEFAULT_GAP, DEFAULT_SIZE);
  const groups = [];
  for (const spot of spots) {
    const icon = loaded[spot.iconIndex % loaded.length];
    const inner = nodesToInnerSvg(icon.nodes, spot.s);
    const half = spot.s / 2;
    groups.push(
      `<g opacity="${spot.a.toFixed(3)}" transform="translate(${spot.x.toFixed(1)} ${spot.y.toFixed(1)}) rotate(${spot.rot.toFixed(1)}) translate(${(-half).toFixed(1)} ${(-half).toFixed(1)})">${inner}</g>`,
    );
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}" viewBox="0 0 ${TILE_W} ${TILE_H}" fill="none">
<!-- seed=${seed} ${TILE_W}x${TILE_H} -->
${groups.join('\n')}
</svg>
`;
  return { svg, spots: spots.length };
}

async function bakeOne(iconsDir, seed, names) {
  const { svg, spots } = bakeSeed(iconsDir, seed, names);
  const { webpKb } = await rasterize(Buffer.from(svg), seed);
  console.log(`  seed-${seed}.webp  (${webpKb} KB, ${spots} marks)`);
  return `seed-${seed}.webp`;
}

async function main() {
  const t0 = Date.now();
  const iconsDir = findIconsDir();
  console.log(`[bake-wallpaper] ${TILE_W}×${TILE_H} → WebP only (parallel)`);
  console.log(`[bake-wallpaper] icons: ${iconsDir}`);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  try { await import('sharp'); } 
  catch {
    console.error(`[bake-wallpaper] sharp is required. cd frontend && npm i -D sharp && node scripts/bake-wallpaper.mjs`);
    process.exit(1);
  }

  const entries = Object.entries(SEEDS);
  const files = await Promise.all(
    entries.map(([s, names]) => bakeOne(iconsDir, Number(s), names)),
  );
  files.sort();

  fs.writeFileSync(
    path.join(OUT_DIR, 'manifest.json'),
    JSON.stringify({
      version: 4,
      width: TILE_W,
      height: TILE_H,
      format: 'webp',
      generated: new Date().toISOString(),
      files,
      base: '/cdn/wallpaper',
    }, null, 2),
  );
  console.log(`[bake-wallpaper] done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
