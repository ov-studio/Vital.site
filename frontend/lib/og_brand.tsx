import * as fs          from 'fs';
import * as path        from 'path';
import * as lib_api_url from '@/lib/api_url';

export const OG_SCALE = 2;
export const OG_W = 1000 * OG_SCALE;
export const OG_H = 350 * OG_SCALE;
export const OG_LOGO_H = 88 * OG_SCALE;
export const OG_GAP = 35 * OG_SCALE;
export const OG_TAG_SIZE = 15.2 * OG_SCALE;
export const OG_BLUE = '#7EA1E9';

const SECTION_SKIP = new Set([
  'api',
  'docs',
  'og',
]);

/** App route segments that get a brand OG image (excludes api/docs/og). */
export function site_og_sections(): string[] {
  const app_dir = path.join(process.cwd(), 'app');
  if (!fs.existsSync(app_dir)) return [];

  return fs
    .readdirSync(app_dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => !name.startsWith('_') && !name.startsWith('(') && !name.startsWith('['))
    .filter((name) => !SECTION_SKIP.has(name))
    .filter((name) => {
      const page = path.join(app_dir, name, 'page.tsx');
      const page_jsx = path.join(app_dir, name, 'page.jsx');
      return fs.existsSync(page) || fs.existsSync(page_jsx);
    })
    .sort();
}

/** Host for OG labels — derived from shared api_url (Vercel env / localhost). Optional OG_HOST override. */
export function og_host(): string {
  const override = process.env.OG_HOST?.trim();
  if (override) return override.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || lib_api_url.get_frontend_host();
  return lib_api_url.get_frontend_host();
}

/** Uppercase host for brand OG images. */
export function og_label_host(): string {
  return og_host().toUpperCase();
}

/** Uppercase path segment (e.g. `/NEWS`), or empty for site root. */
export function og_label_path(route_path: string): string {
  const p = route_path.startsWith('/') ? route_path : `/${route_path}`;
  if (p === '/') return '';
  return p.toUpperCase();
}

/** Full uppercase host + path label (legacy single-string form). */
export function og_label(route_path: string): string {
  const host = og_label_host();
  const p = og_label_path(route_path);
  return p ? `${host}${p}` : host;
}

function load_font_file(name: string): ArrayBuffer {
  const file = path.join(process.cwd(), 'public/font', name);
  const buf = fs.readFileSync(file);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

/** Rajdhani SemiBold (600) — path / default weight. */
export function load_og_font(): ArrayBuffer {
  return load_font_file('Rajdhani-SemiBold.ttf');
}

/** Rajdhani Bold (700) — host label weight. */
export function load_og_font_bold(): ArrayBuffer {
  return load_font_file('Rajdhani-Bold.ttf');
}

/** Load the OG background placeholder as a base64 data URI. */
export function load_og_placeholder_data_uri(): string {
  const file = path.join(process.cwd(), 'public/og/placeholder.png');
  const buf = fs.readFileSync(file);
  return `data:image/png;base64,${buf.toString('base64')}`;
}

/** Y position of the tagline, vertically centering logo + gap + text. */
export function og_tagline_top(): number {
  const group_h = OG_LOGO_H + OG_GAP + OG_TAG_SIZE;
  const group_top = (OG_H - group_h) / 2;
  return group_top + OG_LOGO_H + OG_GAP;
}

/** Bundle host/path label parts, fonts, placeholder, and dimensions for a brand OG route. */
export function brand_og_payload(route_path: string) {
  const host = og_label_host();
  const path = og_label_path(route_path);
  return {
    host,
    path,
    label: path ? `${host}${path}` : host,
    font: load_og_font(),
    fontBold: load_og_font_bold(),
    placeholder: load_og_placeholder_data_uri(),
    width: OG_W,
    height: OG_H,
  };
}

/** JSX markup for a brand Open Graph image (Satori / ImageResponse).
 *  Host stays brand blue + Bold (700); path (`/NEWS`, …) is white SemiBold (600).
 *  Both weights must be registered on the ImageResponse (see routes).
 */
export function BrandOgMarkup({
  host,
  path: pathPart = '',
  placeholderSrc,
}: {
  host:           string;
  path?:          string;
  placeholderSrc: string;
}) {
  const top = og_tagline_top();
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        backgroundColor: '#0C0F1A'
      }}
    >
      <img
        src={placeholderSrc}
        alt=""
        width={OG_W}
        height={OG_H}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 48px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            fontFamily: 'Rajdhani',
            fontSize: OG_TAG_SIZE,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            lineHeight: 1,
            maxWidth: '100%',
            overflow: 'hidden'
          }}
        >
          <span style={{ color: OG_BLUE, fontWeight: 700 }}>vital-sandbox.com</span>
          {pathPart ? (
            <span style={{ color: '#F7F7F7', fontWeight: 600 }}>{pathPart}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
