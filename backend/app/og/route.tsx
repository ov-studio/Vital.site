import * as lib_api_url from '@/lib/api_url';
import * as next_og     from 'next/og';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const W = 1000;
const H = 300;
const LOGO_H = 88;
const GAP = 35;
const TAG_SIZE = 15.2;
const BLUE = '#87aefb';

async function load_rajdhani(): Promise<ArrayBuffer> {
  const css = await fetch(
    'https://fonts.googleapis.com/css2?family=Rajdhani:wght@600&display=swap',
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)'
      }
    }
  ).then((r) => r.text());

  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]truetype['"]\)/) || css.match(/src:\s*url\(([^)]+\.ttf[^)]*)\)/);
  const font_url = match?.[1];
  const fallback = 'https://cdn.jsdelivr.net/fontsource/fonts/rajdhani@latest/latin-600-normal.ttf';
  const res = await fetch(font_url || fallback);
  if (!res.ok) {
    const res2 = await fetch(fallback);
    if (!res2.ok) throw new Error(`Rajdhani TTF fetch failed (${res2.status})`);
    return res2.arrayBuffer();
  }
  return res.arrayBuffer();
}

export async function GET(req: Request) {
  const frontend = lib_api_url.get_frontend_url();
  const url = new URL(req.url);
  let path = url.searchParams.get('path') ?? '/';
  if (!path.startsWith('/')) path = `/${path}`;
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);

  let host = '';
  try { host = new URL(frontend).hostname.replace(/^www\./, ''); } 
  catch {}

  if (path === '/') {
    try {
      const res = await fetch(`${frontend}/og/default.png`, { cache: 'force-cache' });
      if (res.ok) {
        const buf = await res.arrayBuffer();
        return new NextResponse(buf, {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control':
              'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        });
      }
    } 
    catch {}
  }

  const label = path === '/' ? host.toUpperCase() : `${host}${path}`.toUpperCase();
  const placeholder = `${frontend}/og/placeholder.png`;
  const rajdhani = await load_rajdhani();
  const tagline_top = H / 2 + LOGO_H / 2 + GAP;
  return new next_og.ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0b0a0f'
        }}
      >
        <img
          src={placeholder}
          alt=""
          width={W}
          height={H}
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
            top: tagline_top,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              display: 'flex',
              fontFamily: 'Rajdhani',
              fontSize: TAG_SIZE,
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: BLUE,
              textTransform: 'uppercase',
              lineHeight: 1
            }}
          >
            {label}
          </div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: [
        {
          name: 'Rajdhani',
          data: rajdhani,
          style: 'normal',
          weight: 600
        }
      ],
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
      }
    }
  );
}
