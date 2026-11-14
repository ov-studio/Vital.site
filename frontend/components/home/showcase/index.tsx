'use client';
import * as config_home from '@/configs/home';
import * as react       from 'react';
import './index.css';

const INTERVAL_MS = 5000;
const VISIBLE     = 4;

interface ShowcaseProps {
  selectedId: string;
  onSelect:   (id: string) => void;
}

export function Showcase({ selectedId, onSelect }: ShowcaseProps) {
  const items = config_home.Showcases;
  const total = items.length;
  const found = items.findIndex((s) => s.id === selectedId);
  const active = found < 0 ? 0 : found;

  const [paused, setPaused]   = react.useState(false);
  const [reduced, setReduced] = react.useState(false);

  react.useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  react.useEffect(() => {
    if (paused || reduced) return;
    const t = setTimeout(() => onSelect(items[(active + 1) % total].id), INTERVAL_MS);
    return () => clearTimeout(t);
  }, [active, paused, reduced, total, items, onSelect]);

  return (
    <div
      className="deck"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="deck-stack">
        {items.map((s, i) => {
          const d     = (i - active + total) % total;
          const front = d === 0;
          return (
            <button
              key={s.id}
              type="button"
              aria-label={s.title}
              className={`dcard${front ? ' is-front' : ''}${d >= VISIBLE ? ' is-hidden' : ''}`}
              style={{
                '--d': Math.min(d, VISIBLE - 1),
                zIndex: total - d,
                backgroundImage: `url(${s.image}), linear-gradient(160deg, hsl(220, 40%, 15%), hsl(250, 21%, 7%))`
              } as React.CSSProperties}
              onClick={() => onSelect(front ? items[(active + 1) % total].id : s.id)}
            >
              <span className="dcard-tag">
                {s.title}
              </span>
              <span className="dcard-body">
                <span className="dcard-title">{s.title}</span>
                <span className="dcard-desc">{s.desc}</span>
              </span>
              {front && !paused && !reduced && (
                <span key={active} className="dcard-bar" style={{ animationDuration: `${INTERVAL_MS}ms` }}/>
              )}
            </button>
          );
        })}
      </div>

      <div className="deck-dots">
        {items.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={s.title}
            className={`deck-dot${active === i ? ' is-active' : ''}`}
            onClick={() => onSelect(s.id)}
          />
        ))}
      </div>
    </div>
  );
}
