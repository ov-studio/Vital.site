import * as lib_source from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const { GET } = createFromSource(lib_source.source, {
    // https://docs.orama.com/docs/orama-js/supported-languages
    language: 'english',
});
