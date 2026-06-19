import * as lib_source from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const scan = lib_source.source.getPages().map(lib_source.getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'));
}
