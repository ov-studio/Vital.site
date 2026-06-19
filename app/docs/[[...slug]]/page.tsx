import * as lib_source from '@/lib/source';
import * as config_site from '@/configs/site';
import * as component_docai from '@/components/docai';
import * as component_badge from '@/components/badge';
import * as next from 'next';
import * as next_navigation from 'next/navigation';
import * as mdx_components from '@/mdx-components';
import * as fumadocs_mdx from 'fumadocs-ui/mdx';
import * as fumadocs_layout_notebook_page from 'fumadocs-ui/layouts/notebook/page';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = lib_source.source.getPage(params.slug);
  if (!page) next_navigation.notFound();

  const MDX = page.data.body;
  return (
    <fumadocs_layout_notebook_page.DocsPage breadcrumb={{ enabled: false }} toc={page.data.toc} full={page.data.full}>
      <div className="flex flex-col border-b">
        <div className="flex flex-row gap-2 items-center justify-between">
          <fumadocs_layout_notebook_page.DocsTitle className="text-2xl">{page.data.title}</fumadocs_layout_notebook_page.DocsTitle>
          <div className="inline-flex items-center gap-2 font-semibold">
            {page.data.badge && <component_badge.Badge type={page.data.badge}/>}
            <component_docai.DocAI
              md_url={`${page.url}.mdx`}
              git_url={`https://github.com/${config_site.info.git.site.user}/${config_site.info.git.site.repo}/blob/${config_site.info.git.site.branch}/content/docs/${page.path}`}
            />
          </div>
        </div>
        <fumadocs_layout_notebook_page.DocsDescription className="mt-4 mb-5 text-base">{page.data.description}</fumadocs_layout_notebook_page.DocsDescription>
      </div>
      <br/>
      <fumadocs_layout_notebook_page.DocsBody>
        <MDX
          components={mdx_components.getMDXComponents({
            a: fumadocs_mdx.createRelativeLink(lib_source.source, page),
          })}
        />
      </fumadocs_layout_notebook_page.DocsBody>
    </fumadocs_layout_notebook_page.DocsPage>
  );
}

export async function generateStaticParams() {
  return lib_source.source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<next.Metadata> {
  const params = await props.params;
  const page = lib_source.source.getPage(params.slug);
  if (!page) next_navigation.notFound();

  return {
    title: `${page.data.title}`,
    description: page.data.description,
    openGraph: {
      images: lib_source.getPageImage(page).url,
    },
  };
}
