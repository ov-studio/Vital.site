'use client';
import * as ui_iconbutton from '@/ui/iconbutton';
import * as ui_modal      from '@/ui/modal';
import * as lucide        from 'lucide-react';
import * as react         from 'react';
import './index.css';

export interface VideoReelItem {
  id:           string;
  title:        string;
  tagline?:     string;
  author?:      string;
  description?: string;
  youtube_id:   string;
}

export interface VideoReelProps {
  videos?:    VideoReelItem[];
  playlist?:  string;
  className?: string;
}

function yt_thumb(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function yt_embed(id: string) {
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&controls=0`;
}

function display_title(title: string): string {
  return title
    .replace(/^\s*Vital\.sandbox\s*[\|–—:-]+\s*/i, '')
    .trim() || title;
}

function filter_desc_blocks(blocks: DescBlock[]): DescBlock[] {
  const boilerplate = /^(glossary|socials)$/i;
  let skip_section = false;
  let keeping = false;
  const out: DescBlock[] = [];

  for (const b of blocks) {
    if (b.type === 'h') {
      const label = b.text
        .trim();

      if (boilerplate.test(label)) {
        skip_section = true;
        keeping = false;
        continue;
      }

      // First heading after Glossary/Socials → start keeping (Features, What Changed, …)
      if (skip_section) {
        skip_section = false;
        keeping = true;
        out.push(b);
        continue;
      }

      if (!keeping) {
        // Brand intro heading (### 📦 Vital.sandbox – …)
        if (/vital\.sandbox/i.test(b.text) || label.length > 48) continue;
        keeping = true;
        out.push(b);
        continue;
      }

      out.push(b);
      continue;
    }

    if (skip_section || !keeping) continue;
    out.push(b);
  }
  return out;
}

type DescBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'ul'; items: string[] };

function parse_yt_markdown(raw: string): DescBlock[] {
  if (!raw) return [];

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
      blocks.push({
        type: 'h',
        text: strip_md(heading[1])
          .replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\s]+/u, '')
          .trim() || strip_md(heading[1]),
      });
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
  const blocks = filter_desc_blocks(parse_yt_markdown(raw));
  if (!blocks.length) return null;
  return (
    <div className="ui-modal-desc">
      {blocks.map((b, i) => {
        if (b.type === 'h') {
          const label = b.text.replace(/:+\s*$/, '') + ':';
          return (
            <p key={i} className="ui-modal-desc-h">
              <strong>{label}</strong>
            </p>
          );
        }
        if (b.type === 'ul') {
          return (
            <ul key={i} >
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

  const desc = video.description || '';

  return (
    <ui_modal.Modal
      closing={closing}
      onClose={close}
      label={display_title(video.title)}
      maxWidth={880}
      media={
        <div className="video-reel-modal-player">
          <iframe
            src={yt_embed(video.youtube_id)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      }
    >
      <ui_modal.ModalHeader
        author={video.author || video.tagline || 'Video'}
        title={display_title(video.title)}
        titleClassName="ui-modal-name--wrap"
      />
      {desc ? (
        <ui_modal.ModalBody>
          <DescriptionBody raw={desc}/>
        </ui_modal.ModalBody>
      ) : null}
    </ui_modal.Modal>
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

  if (loading) return (<div className={`video-reel video-reel--loading${className ? ` ${className}` : ''}`} aria-busy="true"/>);
  if (!videos.length) return null;

  return (
    <>
      <div className={`video-reel${className ? ` ${className}` : ''}`}>
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
              <img src={yt_thumb(v.youtube_id)} alt="" loading="lazy"/>
              <span className="video-reel-play" aria-hidden>
                <lucide.Play size={18} strokeWidth={2} fill="currentColor"/>
              </span>
            </span>
          </button>
        ))}
        </div>
      </div>

      {active && (
        <VideoModal video={active} on_close={() => set_active(null)}/>
      )}
    </>
  );
}