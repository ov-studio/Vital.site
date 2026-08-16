import * as lib_source from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const lines: string[] = [];
  lines.push('# Documentation');
  lines.push('');
  for (const page of lib_source.source.getPages()) {
    lines.push(`- [${page.data.title}](${page.url}): ${page.data.description}`);
  }
  
  return new Response(lines.join('\n'), { 
    headers:  {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
    }
  });
}
