import { getPageImage, source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { DocAI } from '@/components/docai';
import { Badge } from '@/components/badge';

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

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <div className="flex flex-col border-b">
        <div className="flex flex-row gap-2 items-center justify-between">
          <DocsTitle className="text-2xl">{page.data.title}</DocsTitle>
          <div className="inline-flex items-center gap-2 font-semibold">
            {page.data.badge && <Badge type={page.data.badge} />}
            <DocAI
              markdownUrl={`${page.url}.mdx`}
              githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
            />
          </div>
        </div>
        <DocsDescription className="mt-4 mb-5 text-base">{page.data.description}</DocsDescription>
      </div>
      <br />
      <DocsBody>
        <MDX
          components={getMDXComponents({
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
