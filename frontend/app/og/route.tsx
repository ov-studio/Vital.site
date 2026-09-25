import * as lib_og_brand from '@/lib/og_brand';
import * as next_og      from 'next/og';

export const revalidate = false;
export const runtime = 'nodejs';

export async function GET() {
  const { label, font, placeholder, width, height } = lib_og_brand.brand_og_payload('/');
  return new next_og.ImageResponse(
    <lib_og_brand.BrandOgMarkup label={label} placeholderSrc={placeholder} />,
    {
      width,
      height,
      fonts: [{ name: 'Rajdhani', data: font, weight: 600, style: 'normal' }]
    }
  );
}
