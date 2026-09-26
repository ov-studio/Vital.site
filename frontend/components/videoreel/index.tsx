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

function format_description(raw: string): string[] {
  if (!raw) return [];
  let t = raw
    .replace(/\r\n/g, '\n')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/https?:\/\/[^\s)]+/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const parts = t
    .split(/\n\n+/)
    .map((p) => p.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  return parts.slice(0, 4);
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
  const paras = format_description(video.description || video.tagline || '');

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
            {paras.length > 0 ? (
              <div className="vid-modal-desc">
                {paras.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}
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
