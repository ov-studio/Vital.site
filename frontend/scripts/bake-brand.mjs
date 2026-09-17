import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND = path.resolve(__dirname, '..');
const LOGO_SVG = path.join(FRONTEND, 'public', 'logo.svg');
const OUT_DIR  = path.join(FRONTEND, 'public', 'cdn', 'brand');

// High-res canvas (includes breathing room for neon glow)
const OUT_W = 1000;
const OUT_H = 750;

// Size of the actual logo mark inside the canvas
// (leaves ~15% padding on each side so glow never clips)
const LOGO_W = 700;
const LOGO_H = 510;

const VARIANTS = [
  { name: 'logo-blue',  fill: 'hsl(220, 95%, 76%)' },
  { name: 'logo-white', fill: '#ffffff' },
];

async function getSharp() {
  try {
    return (await import('sharp')).default;
  } catch {
    console.error(`[bake-brand] sharp is required.\n  cd frontend && npm i -D sharp && node scripts/bake-brand.mjs`);
    process.exit(1);
  }
}

function tintSvg(svgText, fill) {
  return svgText.replace(
    /\.cls-1\s*\{\s*fill:\s*#fff;\s*\}/g,
    `.cls-1 { fill: ${fill}; }`
  );
}

/**
 * Turn an SVG string into a transparent PNG buffer of the logo mark
 * centred on a larger canvas (padding for glow).
 */
async function svgToPaddedPng(sharp, svgText) {
  // 1. Rasterise the SVG mark itself at high density
  const markBuf = await sharp(Buffer.from(svgText), { density: 600 })
    .resize(LOGO_W, LOGO_H, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  // 2. Place it in the centre of the transparent output canvas
  return sharp({
    create: {
      width: OUT_W,
      height: OUT_H,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: markBuf, gravity: 'centre' }])
    .png()
    .toBuffer();
}

async function writeWebp(sharp, pngBuffer, outPath) {
  await sharp(pngBuffer)
    .webp({ quality: 95, effort: 4, alphaQuality: 100 })
    .toFile(outPath);
  return (fs.statSync(outPath).size / 1024).toFixed(1);
}

async function bakeSolid(sharp, svgText, outPath) {
  const png = await svgToPaddedPng(sharp, svgText);
  return writeWebp(sharp, png, outPath);
}

async function bakeNeon(sharp, blueSvgText, outPath) {
  // Base padded logo (PNG)
  const basePng = await svgToPaddedPng(sharp, blueSvgText);

  // Glow layers — radii scaled up for the larger canvas
  const glowWide = await sharp(basePng)
    .blur(48)
    .modulate({ brightness: 1.2 })
    .png()
    .toBuffer();

  const glowMid = await sharp(basePng)
    .blur(16)
    .modulate({ brightness: 1.3 })
    .png()
    .toBuffer();

  const glowCore = await sharp(basePng)
    .blur(4)
    .modulate({ brightness: 1.45 })
    .png()
    .toBuffer();

  // Composite on transparent canvas
  const finalPng = await sharp({
    create: {
      width: OUT_W,
      height: OUT_H,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: glowWide, blend: 'screen' },
      { input: glowMid,  blend: 'screen' },
      { input: glowCore, blend: 'screen' },
      { input: basePng,  blend: 'over' },
    ])
    .png()
    .toBuffer();

  return writeWebp(sharp, finalPng, outPath);
}

async function main() {
  const t0 = Date.now();
  const sharp = await getSharp();

  if (!fs.existsSync(LOGO_SVG)) {
    console.error(`[bake-brand] missing source: ${LOGO_SVG}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(LOGO_SVG, 'utf8');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = [];
  let blueSvg = null;

  // Solid variants
  for (const v of VARIANTS) {
    const tinted = tintSvg(raw, v.fill);
    if (v.name === 'logo-blue') blueSvg = tinted;

    const outPath = path.join(OUT_DIR, `${v.name}.webp`);
    const kb = await bakeSolid(sharp, tinted, outPath);
    console.log(`  ${v.name}.webp  (${kb} KB, ${OUT_W}×${OUT_H})`);
    files.push(`${v.name}.webp`);
  }

  // Neon
  {
    const outPath = path.join(OUT_DIR, 'logo-neon.webp');
    const kb = await bakeNeon(sharp, blueSvg, outPath);
    console.log(`  logo-neon.webp  (${kb} KB, ${OUT_W}×${OUT_H})`);
    files.push('logo-neon.webp');
  }

  // Manifest
  const manifest = {
    version: 5,
    generated: new Date().toISOString(),
    source: '/logo.svg',
    base: '/cdn/brand',
    canvas: { width: OUT_W, height: OUT_H },
    mark:   { width: LOGO_W, height: LOGO_H },
    files,
  };
  fs.writeFileSync(
    path.join(OUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n'
  );

  console.log(`[bake-brand] done in ${((Date.now() - t0) / 1000).toFixed(2)}s → public/cdn/brand/`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
