import * as lib_source from '@/lib/source';
import * as fumadocs_search_server from 'fumadocs-core/search/server';

export const { GET } = fumadocs_search_server.createFromSource(lib_source.source, {
    // https://docs.orama.com/docs/orama-js/supported-languages
    language: 'english',
});
