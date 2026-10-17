import * as lib_og_brand    from '@/lib/og_brand';
import * as next_navigation from 'next/navigation';

export const revalidate = false;
export const dynamicParams = false;
export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  const allowed = new Set(lib_og_brand.site_og_sections());
  if (!allowed.has(section)) next_navigation.notFound();

  return lib_og_brand.brand_og_image(`/${section}`);
}

export function generateStaticParams() {
  return lib_og_brand.site_og_sections().map((section) => ({ section }));
}
