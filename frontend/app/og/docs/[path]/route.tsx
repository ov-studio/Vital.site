import * as lib_source      from '@/lib/source';
import * as lib_og_brand    from '@/lib/og_brand';
import * as next_navigation from 'next/navigation';

export const revalidate = false;
export const dynamicParams = false;
export const runtime = 'nodejs';

const SEP = '--';

function slugs_from_path(path: string): string[] {
  if (!path || path === '_') return [];
  return path.split(SEP).filter(Boolean);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string }> }
) {
  const { path } = await params;
  const page = lib_source.source.getPage(slugs_from_path(path));
  if (!page) next_navigation.notFound();

  const route_path = page.url.startsWith('/') ? page.url : `/${page.url}`;
  return lib_og_brand.brand_og_image(route_path);
}

export function generateStaticParams() {
  return lib_source.source.getPages().map((page) => ({
    path: page.slugs.length ? page.slugs.join(SEP) : '_'
  }));
}
