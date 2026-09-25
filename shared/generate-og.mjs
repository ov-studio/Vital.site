/**
 * Pre-generate static Open Graph PNGs into frontend/public/og/.
 *
 * Uses Studio layout (1000×300 @ 2× = 2000×600), local Rajdhani-SemiBold,
 * and placeholder.png as the base. Run after changing placeholder or host:
 *
 *   node shared/generate-og.mjs
 *
 * Env:
 *   OG_HOST=vital-sandbox.com   (default)
 */
import { ImageResponse } from '../backend/node_modules/next/og.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'frontend/public/og');
const FONT_PATH = join(ROOT, 'frontend/public/font/Rajdhani-SemiBold.ttf');
const PLACEHOLDER_PATH = join(ROOT, 'frontend/public/og/placeholder.png');

const HOST = (process.env.OG_HOST || 'vital-sandbox.com').replace(/^www\./, '');

const SCALE = 2;
const W = 1000 * SCALE;
const H = 300 * SCALE;
const LOGO_H = 88 * SCALE;
const GAP = 35 * SCALE;
const TAG_SIZE = 15.2 * SCALE;
const BLUE = '#87aefb';

/** path → output filename (home uses existing default.png) */
const ROUTES = [
  { path: '/roadmap',    file: 'roadmap.png' },
  { path: '/vault',      file: 'vault.png' },
  { path: '/studio',     file: 'studio.png' },
  { path: '/workspace',  file: 'workspace.png' },
  { path: '/tos',        file: 'tos.png' },
  { path: '/benchmarks', file: 'benchmarks.png' },
];

function label_for(path) {
  if (!path || path === '/') return HOST.toUpperCase();
  return `${HOST}${path}`.toUpperCase();
}

async function render(label, font, placeholderDataUri) {
  const group_h = LOGO_H + GAP + TAG_SIZE;
  const group_top = (H - group_h) / 2;
  const tagline_top = group_top + LOGO_H + GAP;

  const res = new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0b0a0f',
        },
        children: [
          {
            type: 'img',
            props: {
              src: placeholderDataUri,
              width: W,
              height: H,
              style: {
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: 0,
                right: 0,
                top: tagline_top,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontFamily: 'Rajdhani',
                    fontSize: TAG_SIZE,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: BLUE,
                    textTransform: 'uppercase',
                    lineHeight: 1,
                  },
                  children: label,
                },
              },
            },
          },
        ],
      },
    },
    {
      width: W,
      height: H,
      fonts: [{ name: 'Rajdhani', data: font, weight: 600, style: 'normal' }],
    }
  );

  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  if (!existsSync(FONT_PATH)) throw new Error(`Missing font: ${FONT_PATH}`);
  if (!existsSync(PLACEHOLDER_PATH)) throw new Error(`Missing placeholder: ${PLACEHOLDER_PATH}`);

  const font = readFileSync(FONT_PATH);
  const placeholderDataUri = `data:image/png;base64,${readFileSync(PLACEHOLDER_PATH).toString('base64')}`;

  console.log(`[og] host=${HOST} size=${W}x${H}`);

  for (const { path, file } of ROUTES) {
    const label = label_for(path);
    const buf = await render(label, font, placeholderDataUri);
    const out = join(OUT_DIR, file);
    writeFileSync(out, buf);
    console.log(`[og] wrote ${file} (${label}) ${buf.length} bytes`);
  }

  console.log('[og] done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
