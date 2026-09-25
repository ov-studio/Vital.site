import * as fs   from 'fs';
import * as path from 'path';

/** Studio canvas 1000×300 @ 2× export */
export const OG_SCALE = 2;
export const OG_W = 1000 * OG_SCALE;
export const OG_H = 300 * OG_SCALE;
export const OG_LOGO_H = 88 * OG_SCALE;
export const OG_GAP = 35 * OG_SCALE;
export const OG_TAG_SIZE = 15.2 * OG_SCALE;
/** var(--blue) */
export const OG_BLUE = '#87aefb';

const DEFAULT_HOST = 'vital-sandbox.com';

export function og_host(): string {
  const env =
    process.env.OG_HOST ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    '';
  if (!env) return DEFAULT_HOST;
  return env.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || DEFAULT_HOST;
}

export function og_label(route_path: string): string {
  const host = og_host();
  const p = route_path.startsWith('/') ? route_path : `/${route_path}`;
  if (p === '/') return host.toUpperCase();
  return `${host}${p}`.toUpperCase();
}

export function load_og_font(): ArrayBuffer {
  const file = path.join(process.cwd(), 'public/font/Rajdhani-SemiBold.ttf');
  const buf = fs.readFileSync(file);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

export function load_og_placeholder_data_uri(): string {
  const file = path.join(process.cwd(), 'public/og/placeholder.png');
  const buf = fs.readFileSync(file);
  return `data:image/png;base64,${buf.toString('base64')}`;
}

/** Tagline Y position — studio centers logo + gap + tagline as a group. */
export function og_tagline_top(): number {
  const group_h = OG_LOGO_H + OG_GAP + OG_TAG_SIZE;
  const group_top = (OG_H - group_h) / 2;
  return group_top + OG_LOGO_H + OG_GAP;
}

/**
 * Brand-style OG markup (placeholder base + route tagline only).
 * Used by docs SSG route; same geometry as Studio / static site OG.
 */
export function BrandOgMarkup({ label, placeholderSrc }: { label: string; placeholderSrc: string }) {
  const top = og_tagline_top();
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        backgroundColor: '#0b0a0f',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
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
          objectFit: 'cover',
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
          padding: '0 48px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'Rajdhani',
            fontSize: OG_TAG_SIZE,
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: OG_BLUE,
            textTransform: 'uppercase',
            lineHeight: 1,
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

/** Build brand-style ImageResponse options + element props for a site path. */
export function brand_og_payload(route_path: string) {
  const label = og_label(route_path);
  const font = load_og_font();
  const placeholder = load_og_placeholder_data_uri();
  return {
    label,
    font,
    placeholder,
    width: OG_W,
    height: OG_H,
  };
}
