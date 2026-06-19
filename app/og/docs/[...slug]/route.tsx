import * as lib_source from '@/lib/source';
import * as config_site from '@/configs/site';
import * as next_navigation from 'next/navigation';
import * as next_og from 'next/og';
import * as fumadocs_og from 'fumadocs-ui/og';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const page = lib_source.source.getPage(slug.slice(0, -1));
  if (!page) next_navigation.notFound();

  return new next_og.ImageResponse(
    <fumadocs_og.default title={page.data.title} description={page.data.description} site={config_site.info.name} />,
    {
      width: 1200,
      height: 630,
    }
  );
}

export function generateStaticParams() {
  return lib_source.source.getPages().map((page) => ({
    lang: page.locale,
    slug: lib_source.getPageImage(page).segments,
  }));
}