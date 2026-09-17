import * as lib_api_url from '@/lib/api_url';
import * as next_og from 'next/og';

const bg    = 'hsl(250, 25%, 2%)';
const rule  = 'hsl(220, 18%, 9%)';
const muted = 'hsl(220, 10%, 55%)';
const faint = 'hsl(220, 10%, 22%)';
const white = 'hsl(0, 0%, 97%)';

export async function GET() {
  const frontend_url = lib_api_url.get_frontend_url();

  const [logoBuf, rajdhani] = await Promise.all([
    fetch(`${frontend_url}/cdn/brand/logo-neon.webp`).then(r => {
      if (!r.ok) throw new Error(`Failed to fetch baked logo: ${r.status}`);
      return r.arrayBuffer();
    }),
    fetch(`${frontend_url}/font/Rajdhani-Bold.ttf`).then(r => r.arrayBuffer()),
  ]);

  const logosrc = `data:image/webp;base64,${Buffer.from(logoBuf).toString('base64')}`;

  return new next_og.ImageResponse(
    (
      <div style={{
        background: bg,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {/* subtle grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${rule} 1px, transparent 1px), linear-gradient(90deg, ${rule} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          opacity: 0.8,
          display: 'flex',
        }}/>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}>
          {/* neon logo – already has padding, so we can use a slightly larger display size */}
          <img src={logosrc} width={180} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '25px',
            marginTop: '40px',
            fontSize: '1.0rem',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            <span style={{ color: muted }}>Script It</span>
            <span style={{ color: faint, fontWeight: 300 }}>—</span>
            <span style={{ color: white }}>Ship It</span>
            <span style={{ color: faint, fontWeight: 300 }}>—</span>
            <span style={{ color: muted }}>Limitless</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1000,
      height: 300,
      fonts: [{ name: 'Rajdhani', data: rajdhani, weight: 700, style: 'normal' }],
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
      }
    }
  );
}
