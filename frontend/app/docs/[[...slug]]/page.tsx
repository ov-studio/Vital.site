import * as lib_source       from '@/lib/source';
import * as mdx_components   from '@/mdx-components';
import * as fumadocs_page    from 'fumadocs-ui/page';
import * as next_navigation  from 'next/navigation';

type Params = { slug?: string[] };

export default async function Page({params}: {params: Promise<Params>;}) {
  const { slug } = await params;
  const page = lib_source.source.getPage(slug);
  if (!page) next_navigation.notFound();

  const MDXContent = page.data.body;
  return (
    <fumadocs_page.DocsPage toc={page.data.toc} full={page.data.full}>
      <fumadocs_page.DocsTitle>{page.data.title}</fumadocs_page.DocsTitle>
      <fumadocs_page.DocsDescription>{page.data.description}</fumadocs_page.DocsDescription>
      <fumadocs_page.DocsBody>
        <MDXContent components={mdx_components.getMDXComponents()}/>
      </fumadocs_page.DocsBody>
    </fumadocs_page.DocsPage>
  );
}

export function generateStaticParams() {
  return lib_source.source.generateParams();
}

export async function generateMetadata({ params }: { params: Promise<Params>;}) {
  const { slug } = await params;
  const page = lib_source.source.getPage(slug);
  if (!page) next_navigation.notFound();

  return {
    title: page.data.title,
    description: page.data.description
  };
}
