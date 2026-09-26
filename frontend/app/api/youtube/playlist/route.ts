import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const revalidate = 3600;

type PlaylistVideo = {
  id: string;
  youtube_id: string;
  title: string;
  author: string;
  description: string;
};

function decode_xml(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function tag(entry: string, name: string): string {
  const re = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i');
  const m = entry.match(re);
  return m ? decode_xml(m[1]) : '';
}

function parse_feed(xml: string): PlaylistVideo[] {
  const entries = xml.split(/<entry[\s>]/i).slice(1);
  const out: PlaylistVideo[] = [];

  for (const raw of entries) {
    const entry = raw.split(/<\/entry>/i)[0] ?? raw;
    const youtube_id =
      tag(entry, 'yt:videoId') ||
      (entry.match(/\/videos\/([a-zA-Z0-9_-]{6,})/) || [])[1] ||
      '';
    if (!youtube_id) continue;

    const title = tag(entry, 'title') || 'Untitled';
    const author = tag(entry, 'name') || '';
    const description =
      tag(entry, 'media:description') ||
      tag(entry, 'summary') ||
      tag(entry, 'content') ||
      '';

    out.push({
      id: youtube_id,
      youtube_id,
      title,
      author,
      description: description.replace(/\s+/g, ' ').trim(),
    });
  }

  return out;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const list = (url.searchParams.get('list') || '').trim();

  if (!list || !/^[\w-]+$/.test(list)) {
    return NextResponse.json({ error: 'Invalid playlist id' }, { status: 400 });
  }

  try {
    const feed = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(list)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; VitalSite/1.0)',
          Accept: 'application/atom+xml,application/xml,text/xml,*/*',
        },
        next: { revalidate: 3600 },
      }
    );

    if (!feed.ok) {
      return NextResponse.json(
        { error: `YouTube feed ${feed.status}` },
        { status: 502 }
      );
    }

    const xml = await feed.text();
    const videos = parse_feed(xml);

    return NextResponse.json(
      { list, videos },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err) {
    console.error('[youtube/playlist]', err);
    return NextResponse.json({ error: 'Failed to load playlist' }, { status: 500 });
  }
}
