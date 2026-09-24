import * as lib_api_url from '@/lib/api_url';
import * as next_og    from 'next/og';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const W = 1000;
const H = 300;

export async function GET(req: Request) {
  const frontend = lib_api_url.get_frontend_url();
  const url = new URL(req.url);
  let path = url.searchParams.get('path') ?? '/';
  if (!path.startsWith('/')) path = `/${path}`;
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);

  let host = 'vital-sandbox.com';
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
            'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
          }
        });
      }
    } 
    catch {}
  }

  const label = path === '/' ? host.toUpperCase() : `${host}${path}`.toUpperCase();
  const placeholder = `${frontend}/og/placeholder.png`;
  return new next_og.ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: '#0a0a0c',
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
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '18%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 48px',
          }}
        >
          <div
            style={{
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '0.14em',
              color: 'rgba(180, 190, 210, 0.75)',
              textTransform: 'uppercase',
              textAlign: 'center',
              whiteSpace: 'nowrap',
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
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
      }
    }
  );
}
