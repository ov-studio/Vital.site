import * as lib_api_url from '@/lib/api_url';
import * as next_og from 'next/og';
import * as config_brand from '@/configs/brand';

/**
 * Homepage Open Graph image.
 *
 * Logo is a pre-baked WebP produced by frontend/scripts/bake-brand.mjs
 * and served from the frontend public CDN path (/cdn/brand/...).
 * No runtime SVG parsing or colour replacement needed.
 *
 * Font is still fetched live (small, cached by the edge).
 * Design tokens live in shared/configs/brand.ts.
 */

export async function GET() {
  const frontend_url = lib_api_url.get_frontend_url();
  const { colors, tagline, og } = config_brand;

  const [logoBuf, rajdhani] = await Promise.all([
    fetch(`${frontend_url}${og.logoPath}`).then(r => {
      if (!r.ok) throw new Error(`Failed to fetch baked logo: ${r.status} ${og.logoPath}`);
      return r.arrayBuffer();
    }),
    fetch(`${frontend_url}${og.fontPath}`).then(r => r.arrayBuffer()),
  ]);

  // Satori accepts data: URLs cleanly; this also works offline / in local dev
  const logosrc = `data:image/webp;base64,${Buffer.from(logoBuf).toString('base64')}`;

  return new next_og.ImageResponse(
    (
      <div
        style={{
          background: colors.bg,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* subtle grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(${colors.rule} 1px, transparent 1px), linear-gradient(90deg, ${colors.rule} 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            opacity: 0.8,
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <img src={logosrc} width={og.logoWidth} />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '25px',
              marginTop: '49px',
              fontSize: '1.0rem',
              fontFamily: `${og.fontFamily}, sans-serif`,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {tagline.map((part, i) => (
              <span
                key={i}
                style={{
                  color: part.color,
                  fontWeight: 'weight' in part ? part.weight : 600,
                }}
              >
                {part.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: og.width,
      height: og.height,
      fonts: [
        {
          name: og.fontFamily,
          data: rajdhani,
          weight: og.fontWeight,
          style: 'normal',
        },
      ],
      headers: {
        'Cache-Control': og.cacheControl,
      },
    }
  );
}
