/**
 * Bakes brand logo variants.
 *
 * logo-blue / logo-white → transparent (sharp)
 * logo-neon              → real CSS neon filter via Playwright
 *                          rendered on --bg4 so the glow is visible
 *
 * One-time setup:
 *   npm i -D playwright sharp
 *   npx playwright install chromium
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND = path.resolve(__dirname, '..');
const OUT_DIR  = path.join(FRONTEND, 'public', 'cdn', 'brand');
const LOGO_SVG = path.join(FRONTEND, 'public', 'logo.svg');

const OUT_W = 1000;
const OUT_H = 750;
const MARK_W = 560; // leave room for the outer glow

async function getSharp() {
  try {
    return (await import('sharp')).default;
  } catch {
    console.error('[bake-brand] sharp required → npm i -D sharp');
    process.exit(1);
  }
}

function tintSvg(svgText, fill) {
  return svgText.replace(
    /\.cls-1\s*\{\s*fill:\s*#fff;\s*\}/g,
    `.cls-1 { fill: ${fill}; }`
  );
}

async function bakeSolid(sharp, svgText, name) {
  const mark = await sharp(Buffer.from(svgText), { density: 600 })
    .resize(MARK_W, Math.round(MARK_W * 0.726), {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const padded = await sharp({
    create: {
      width: OUT_W,
      height: OUT_H,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: mark, gravity: 'centre' }])
    .png()
    .toBuffer();

  await sharp(padded).webp({ quality: 95 }).toFile(path.join(OUT_DIR, `${name}.webp`));
  await sharp(padded).png().toFile(path.join(OUT_DIR, `${name}.png`));
}

async function bakeNeonWithPlaywright() {
  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    console.warn('[bake-brand] playwright not installed');
    console.warn('  npm i -D playwright && npx playwright install chromium');
    return false;
  }

  const { chromium } = playwright;

  // Exact values from shared/app/theme.css + Brand neon filter
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  :root {
    --bg4: hsl(252, 20%, 4.5%);
    --blue: hsl(220, 95%, 76%);
    --brand-neon-core: hsl(220, 100%, 85%);
    --brand-neon-mid: hsl(220, 95%, 70%);
    --brand-neon-glow: hsla(220, 95%, 65%, 0.55);
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: ${OUT_W}px;
    height: ${OUT_H}px;
    background: var(--bg4);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .logo {
    width: ${MARK_W}px;
    height: auto;
    /* exact filter from .brand_logo--neon */
    filter:
      brightness(0) saturate(100%)
      invert(72%) sepia(48%) saturate(1200%) hue-rotate(190deg) brightness(105%) contrast(105%)
      drop-shadow(0 0 0.5px var(--blue))
      drop-shadow(0 0 1px var(--brand-neon-core))
      drop-shadow(0 0 8px var(--brand-neon-mid))
      drop-shadow(0 0 48px var(--brand-neon-glow));
  }
</style>
</head>
<body>
  <img class="logo" src="/logo.svg" alt="" />
</body>
</html>`;

  const server = createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }
    const filePath = path.join(FRONTEND, 'public', decodeURIComponent(req.url || ''));
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const mime = { '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
    res.writeHead(404);
    res.end();
  });

  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: OUT_W, height: OUT_H },
    deviceScaleFactor: 2,
  });

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  const screenshot = await page.screenshot({
    type: 'png',
    omitBackground: false, // keep the --bg4 so glow is visible
  });

  await browser.close();
  server.close();

  const sharp = await getSharp();

  await sharp(screenshot)
    .resize(OUT_W, OUT_H)
    .webp({ quality: 95 })
    .toFile(path.join(OUT_DIR, 'logo-neon.webp'));

  await sharp(screenshot)
    .resize(OUT_W, OUT_H)
    .png()
    .toFile(path.join(OUT_DIR, 'logo-neon.png'));

  return true;
}

async function main() {
  const t0 = Date.now();
  const sharp = await getSharp();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  if (!fs.existsSync(LOGO_SVG)) {
    console.error('[bake-brand] missing public/logo.svg');
    process.exit(1);
  }

  const raw = fs.readFileSync(LOGO_SVG, 'utf8');

  for (const [name, fill] of [
    ['logo-blue', 'hsl(220, 95%, 76%)'],
    ['logo-white', '#ffffff'],
  ]) {
    await bakeSolid(sharp, tintSvg(raw, fill), name);
    console.log(`  ${name}.webp / .png`);
  }

  const ok = await bakeNeonWithPlaywright();
  if (ok) {
    console.log('  logo-neon.webp / .png  (real CSS neon on --bg4)');
  } else {
    await bakeSolid(sharp, tintSvg(raw, 'hsl(220, 95%, 76%)'), 'logo-neon');
    console.log('  logo-neon.webp / .png  (fallback)');
  }

  fs.writeFileSync(
    path.join(OUT_DIR, 'manifest.json'),
    JSON.stringify({
      version: 10,
      generated: new Date().toISOString(),
      base: '/cdn/brand',
      canvas: { width: OUT_W, height: OUT_H },
      bg: 'hsl(252, 20%, 4.5%)', // --bg4
      files: [
        'logo-blue.webp', 'logo-blue.png',
        'logo-white.webp', 'logo-white.png',
        'logo-neon.webp', 'logo-neon.png',
      ],
    }, null, 2) + '\n'
  );

  console.log(`[bake-brand] done in ${((Date.now() - t0) / 1000).toFixed(2)}s`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
