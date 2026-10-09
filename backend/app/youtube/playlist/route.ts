import * as config_site from '@/configs/site';

export const dynamic = 'force-dynamic';

type PlaylistVideo = {
  id:          string;
  youtube_id:  string;
  title:       string;
  author:      string;
  description: string;
};

interface CacheEntry {
  data:       { list: string; videos: PlaylistVideo[] };
  fetched_at: number;
}

const cache = new Map<string, CacheEntry>();

const TTL_MS  = config_site.info.api.cache_ttl_ms;
const TTL_S   = Math.floor(TTL_MS / 1000);
const SWR_S   = TTL_S * config_site.info.api.cache_swr_multiplier;
const STALE_S = Math.floor(TTL_S / config_site.info.api.cache_stale_divisor);

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
      description: description.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim(),
    });
  }
  return out;
}

async function fetch_fresh(list: string): Promise<{ list: string; videos: PlaylistVideo[] }> {
  const feed = await fetch(
    `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(list)}`,
    {
      cache:   'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VitalSite/1.0)',
        'Accept':     'application/atom+xml,application/xml,text/xml,*/*'
      }
    }
  );
  if (!feed.ok) throw new Error(`YouTube feed ${feed.status}`);

  const xml = await feed.text();
  return { list, videos: parse_feed(xml) };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const list = (url.searchParams.get('list') || '').trim();
  if (!list || !/^[\w-]+$/.test(list)) return Response.json({ error: 'Invalid playlist id' }, { status: 400 });

  const now = Date.now();
  const cached = cache.get(list);
  if (cached && now - cached.fetched_at < TTL_MS) return Response.json(cached.data, {
    headers: { 'Cache-Control': `public, s-maxage=${TTL_S}, stale-while-revalidate=${SWR_S}`, 'X-Playlist-Cache': 'HIT' }
  });

  try {
    const data = await fetch_fresh(list);
    cache.set(list, { data, fetched_at: now });
    return Response.json(data, {
      headers: { 'Cache-Control': `public, s-maxage=${TTL_S}, stale-while-revalidate=${SWR_S}`, 'X-Playlist-Cache': 'MISS' }
    });
  }
  catch (err) {
    if (cached) {
      console.error('[youtube/playlist] fetch failed, serving stale cache:', err);
      return Response.json(cached.data, {
        headers: { 'Cache-Control': `public, s-maxage=${STALE_S}`, 'X-Playlist-Cache': 'STALE' }
      });
    }

    console.error('[youtube/playlist] fetch failed, no cache available:', err);
    return Response.json({ error: 'Failed to load playlist' }, { status: 502 });
  }
}
