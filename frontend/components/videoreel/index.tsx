'use client';
import * as ui_iconbutton from '@/ui/iconbutton';
import * as lucide        from 'lucide-react';
import * as react         from 'react';
import * as react_dom     from 'react-dom';
import './index.css';

export interface VideoReelItem {
  id: string;
  title: string;
  tagline?: string;
  author?: string;
  description?: string;
  youtube_id: string;
}

export interface VideoReelProps {
  videos?: VideoReelItem[];
  playlist?: string;
  className?: string;
}

function yt_thumb(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function yt_embed(id: string) {
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
}

type DescBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'ul'; items: string[] };

/** Minimal YouTube-description markdown → blocks (headings, lists, paragraphs). */
function parse_yt_markdown(raw: string): DescBlock[] {
  if (!raw) return [];

  // Prefer real newlines; if flattened, recover from ### markers and "- " bullets
  let text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if ((text.match(/\n/g) || []).length < 2) {
    text = text
      .replace(/\s*(#{1,6}\s*)/g, '\n\n$1')
      .replace(/\s+-\s+/g, '\n- ');
  }

  const lines = text.split('\n');
  const blocks: DescBlock[] = [];
  let list: string[] = [];
  let para: string[] = [];

  const flush_list = () => {
    if (list.length) {
      blocks.push({ type: 'ul', items: [...list] });
      list = [];
    }
  };
  const flush_para = () => {
    if (para.length) {
      blocks.push({ type: 'p', text: para.join(' ').trim() });
      para = [];
    }
  };

  const strip_md = (s: string) =>
    s
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$1 ($2)')
      .trim();

  for (let line of lines) {
    line = line.replace(/\s+$/g, '');
    const t = line.trim();
    if (!t) {
      flush_list();
      flush_para();
      continue;
    }

    const heading = t.match(/^#{1,6}\s+(.*)$/);
    if (heading) {
      flush_list();
      flush_para();
      blocks.push({ type: 'h', text: strip_md(heading[1]) });
      continue;
    }

    const bullet = t.match(/^[-*•]\s+(.*)$/);
    if (bullet) {
      flush_para();
      list.push(strip_md(bullet[1]));
      continue;
    }

    flush_list();
    para.push(strip_md(t));
  }

  flush_list();
  flush_para();
  return blocks;
}

function linkify(text: string): react.ReactNode[] {
  const nodes: react.ReactNode[] = [];
  const re = /(https?:\/\/[^\s<]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const href = m[1].replace(/[.,);]+$/g, '');
    const trail = m[1].slice(href.length);
    nodes.push(
      <a key={key++} href={href} target="_blank" rel="noopener noreferrer">
        {href}
      </a>
    );
    if (trail) nodes.push(trail);
    last = m.index + m[1].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function DescriptionBody({ raw }: { raw: string }) {
  const blocks = parse_yt_markdown(raw);
  if (!blocks.length) return null;
  return (
    <div className="vid-modal-desc">
      {blocks.map((b, i) => {
        if (b.type === 'h') {
          return (
            <h4 key={i} className="vid-modal-desc-h">
              {linkify(b.text)}
            </h4>
          );
        }
        if (b.type === 'ul') {
          return (
            <ul key={i} className="vid-modal-desc-ul">
              {b.items.map((item, j) => (
                <li key={j}>{linkify(item)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{linkify(b.text)}</p>;
      })}
    </div>
  );
}

function VideoModal({
  video,
  on_close,
}: {
  video: VideoReelItem;
  on_close: () => void;
}) {
  const [closing, set_closing] = react.useState(false);

  const close = react.useCallback(() => {
    set_closing(true);
    window.setTimeout(on_close, 220);
  }, [on_close]);

  react.useEffect(() => {
    function on_key(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', on_key);
    return () => window.removeEventListener('keydown', on_key);
  }, [close]);

  react.useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, []);

  if (typeof document === 'undefined') return null;

  const subtitle = video.author || video.tagline || '';
  const desc = video.description || '';

  return react_dom.createPortal(
    <div
      className={`vid-modal-overlay${closing ? ' closing' : ''}`}
      onClick={close}
      role="presentation"
    >
      <div
        className={`vid-modal-frame${closing ? ' closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={video.title}
      >
        <div className="vid-modal">
          <div className="vid-modal-controls">
            <ui_iconbutton.IconButton
              className="vid-modal-close"
              icon={lucide.X}
              iconProps={{ size: 14, strokeWidth: 2.5 }}
              onClick={close}
            />
          </div>

          <div className="vid-modal-player">
            <iframe
              src={yt_embed(video.youtube_id)}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className="vid-modal-body">
            <div className="vid-modal-eyebrow">
              {subtitle || 'Video'}
            </div>
            <h3 className="vid-modal-name">{video.title}</h3>
            {desc ? <DescriptionBody raw={desc} /> : null}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function VideoReel({
  videos: videos_prop,
  playlist,
  className = '',
}: VideoReelProps) {
  const [videos, set_videos] = react.useState<VideoReelItem[]>(videos_prop ?? []);
  const [active, set_active] = react.useState<VideoReelItem | null>(null);
  const [loading, set_loading] = react.useState(Boolean(playlist && !videos_prop?.length));

  react.useEffect(() => {
    if (videos_prop?.length) {
      set_videos(videos_prop);
      set_loading(false);
      return;
    }
    if (!playlist) return;

    let cancelled = false;
    set_loading(true);

    fetch(`/api/youtube/playlist?list=${encodeURIComponent(playlist)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data?.videos) ? data.videos : [];
        set_videos(
          list.map((v: VideoReelItem) => ({
            id: v.id || v.youtube_id,
            youtube_id: v.youtube_id,
            title: v.title,
            author: v.author,
            description: v.description,
            tagline: v.author || v.description,
          }))
        );
      })
      .catch(() => {
        if (!cancelled) set_videos([]);
      })
      .finally(() => {
        if (!cancelled) set_loading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [playlist, videos_prop]);

  if (loading) {
    return (
      <div className={`video-reel video-reel--loading${className ? ` ${className}` : ''}`} aria-busy="true" />
    );
  }

  if (!videos.length) return null;

  return (
    <>
      <div className={`video-reel${className ? ` ${className}` : ''}`} >
        <div className="video-reel-track" role="list">
        {videos.map((v) => (
          <button
            key={v.id}
            type="button"
            className="video-reel-card"
            role="listitem"
            onClick={() => set_active(v)}
          >
            <span className="video-reel-thumb">
              <img src={yt_thumb(v.youtube_id)} alt="" loading="lazy" />
              <span className="video-reel-play" aria-hidden>
                <lucide.Play size={18} strokeWidth={2} fill="currentColor" />
              </span>
            </span>
            <span className="video-reel-meta">
              <span className="video-reel-title">{v.title}</span>
              {(v.author || v.tagline) ? (
                <span className="video-reel-tagline">{v.author || v.tagline}</span>
              ) : null}
            </span>
          </button>
        ))}
        </div>
      </div>

      {active && (
        <VideoModal video={active} on_close={() => set_active(null)} />
      )}
    </>
  );
}
