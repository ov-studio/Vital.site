import * as lib_source             from '@/lib/source';
import * as fumadocs_search_server from 'fumadocs-core/search/server';

export const revalidate = false;

const { staticGET } = fumadocs_search_server.createFromSource(lib_source.source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
  buildIndex(page) {
    return {
      id: page.url,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      structuredData: {
        headings: page.data.structuredData.headings,
        contents: [],
      },
    };
  }
});

export { staticGET as GET };
