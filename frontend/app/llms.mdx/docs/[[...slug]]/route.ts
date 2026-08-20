import * as lib_source      from '@/lib/source';
import * as next_navigation from 'next/navigation';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>) {
  const { slug } = await params;
  const page = lib_source.source.getPage(slug);
  if (!page) next_navigation.notFound();

  return new Response(await lib_source.getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
    }
  });
}

export function generateStaticParams() {
  return lib_source.source.generateParams();
}
