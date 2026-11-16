'use client';
import * as ui_modal      from '@/ui/modal';
import * as lib_api_url   from '@/lib/api_url';
import * as lucide        from 'lucide-react';
import * as react         from 'react';
import './index.css';

export interface VideoReelItem {
  id:           string;
  title:        string;
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

function VideoModal({
  videos,
  index,
  on_index,
  on_close,
}: {
  videos:   VideoReelItem[];
  index:    number;
  on_index: (i: number) => void;
  on_close: () => void;
}) {
  const [closing, set_closing] = react.useState(false);
  const total = videos.length;
  const video = videos[index];

  const close = react.useCallback(() => {
    set_closing(true);
    window.setTimeout(on_close, 220);
  }, [on_close]);

  const step = react.useCallback(
    (dir: number) => on_index((index + dir + total) % total),
    [index, total, on_index]
  );

  react.useEffect(() => {
    if (total < 2) return;
    function on_key(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')  step(-1);
      if (e.key === 'ArrowRight') step(1);
    }
    window.addEventListener('keydown', on_key);
    return () => window.removeEventListener('keydown', on_key);
  }, [step, total]);

  return (
    <ui_modal.Modal
      closing={closing}
      onClose={close}
      label={display_title(video.title)}
      maxWidth={1800}
      frameClassName="vr-frame"
      media={
        <div className="video-reel-modal-player">
          <iframe
            key={video.youtube_id}
            src={yt_embed(video.youtube_id)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      }
    />
  );
}

export function VideoReel({
  videos: videos_prop,
  playlist,
  className = '',
}: VideoReelProps) {
  const [videos, set_videos] = react.useState<VideoReelItem[]>(videos_prop ?? []);
  const [active, set_active] = react.useState<number | null>(null);
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
    fetch(lib_api_url.get_api_url(`/youtube/playlist?list=${encodeURIComponent(playlist)}`))
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data?.videos) ? data.videos : [];
        set_videos(
          list.map((v: VideoReelItem) => ({
            id: v.id || v.youtube_id,
            youtube_id: v.youtube_id,
            title: v.title,
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
        {videos.map((v, i) => (
          <button
            key={v.id}
            type="button"
            className="video-reel-card"
            role="listitem"
            onClick={() => set_active(i)}
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

      {active !== null && videos[active] && (
        <VideoModal
          videos={videos}
          index={active}
          on_index={set_active}
          on_close={() => set_active(null)}
        />
      )}
    </>
  );
}