import * as fs   from 'node:fs';
import * as path from 'node:path';

const SLIDES_DIR = 'slides';
const IMAGE_EXT  = /\.(png)$/i;

/**
 * Lists every image inside `public/slides/` as a public URL.
 * Server-only: runs at build time (static export) / on the server in dev,
 * so dropping a new PNG into the folder is all that's needed.
 * Files are sorted naturally (1.png, 2.png, ... 10.png).
 */
export function get_hero_slides(): string[] {
  const dir = path.join(process.cwd(), 'public', SLIDES_DIR);

  try {
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/${SLIDES_DIR}/${f}`);
  } catch {
    return [];
  }
}
