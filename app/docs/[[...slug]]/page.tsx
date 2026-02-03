import { getPageImage, source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  console.log('Page data:', page.data);
  console.log('Badge:', page.data.badge);

  const MDX = page.data.body;
  const gitConfig = {
    user: 'ov-studio',
    repo: 'Vital.site',
    branch: 'main'
  };

  // Badge styles configuration
  const badgeStyles: Record<string, string> = {
    Shared: 'bg-red-500 text-white',
    Client: 'bg-blue-500 text-white',
    Server: 'bg-purple-500 text-white',
    Deprecated: 'bg-gray-500 text-white',
  };

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <div className="flex flex-col border-b">
        <div className="flex flex-row gap-2 items-center justify-between">
          <DocsTitle className="text-2xl">{page.data.title}</DocsTitle>
          <div className="inline-flex items-center gap-2 font-semibold">
            {page.data.badge && (
              <span className={`rounded-md px-2 py-1 text-xs ${badgeStyles[page.data.badge] || 'bg-gray-500 text-white'}`}>
                {page.data.badge}
              </span>
            )}
            <ViewOptions
              markdownUrl={`${page.url}.mdx`}
              githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
            />
          </div>
        </div>
        <DocsDescription className="mt-4 mb-5 text-base">{page.data.description}</DocsDescription>
      </div>
      <br/>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
