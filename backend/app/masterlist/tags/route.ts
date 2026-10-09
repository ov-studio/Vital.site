import * as config_site   from '@/configs/site';
import * as lib_api_cache from '@/lib/api_cache';

export const runtime = 'nodejs';

const cached_GET = lib_api_cache.create_cached_route({
  label:          'MasterlistTags',
  fetch_fresh:    async () => ({ tags: config_site.info.masterlist.tags, max: config_site.info.masterlist.max_tags }),
  fallback_error: 'Failed to load masterlist tags'
});

export async function GET() {
  return cached_GET();
}
