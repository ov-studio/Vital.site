'use client';
import * as config_home   from '@/configs/home';
import * as ui_iconbutton from '@/ui/iconbutton';
import * as lucide        from 'lucide-react';
import * as react         from 'react';
import * as react_dom     from 'react-dom';

function yt_thumb(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function yt_embed(id: string) {
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
}

function VideoModal({
  video,
  on_close,
}: {
  video: config_home.HomeVideo;
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
            <div className="vid-modal-eyebrow">Video</div>
            <h3 className="vid-modal-name">{video.title}</h3>
            <p className="vid-modal-tagline">{video.tagline}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function HeroVideos() {
  const [active, set_active] = react.useState<config_home.HomeVideo | null>(null);

  return (
    <>
      <div className="hero-videos" role="list">
        {config_home.Videos.map((v) => (
          <button
            key={v.id}
            type="button"
            className="hero-vid-card"
            role="listitem"
            onClick={() => set_active(v)}
          >
            <span className="hero-vid-thumb">
              <img src={yt_thumb(v.youtube_id)} alt="" loading="lazy" />
              <span className="hero-vid-play" aria-hidden>
                <lucide.Play size={18} strokeWidth={2} fill="currentColor" />
              </span>
            </span>
            <span className="hero-vid-meta">
              <span className="hero-vid-title">{v.title}</span>
              <span className="hero-vid-tagline">{v.tagline}</span>
            </span>
          </button>
        ))}
      </div>

      {active && (
        <VideoModal video={active} on_close={() => set_active(null)} />
      )}
    </>
  );
}
