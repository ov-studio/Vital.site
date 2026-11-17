'use client';
import * as config_home from '@/configs/home';
import * as react       from 'react';
import './index.css';

const INTERVAL_MS = 5000;
const VISIBLE     = 4;

type Feature = (typeof config_home.Features)[number];

interface ShowcaseProps {
  items:      readonly Feature[];
  active:     number;
  onSelect:   (index: number) => void;
}

export function Showcase({ items, active, onSelect }: ShowcaseProps) {
  const total = items.length;

  const [paused, setPaused]   = react.useState(false);
  const [reduced, setReduced] = react.useState(false);

  react.useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const advance = () => onSelect((active + 1) % total);

  return (
    <div
      className={`deck${paused ? ' is-paused' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="deck-stack">
        {items.map((s, i) => {
          const d     = (i - active + total) % total;
          const front = d === 0;
          return (
            <button
              key={s.label}
              type="button"
              aria-label={s.label}
              className={`dcard${front ? ' is-front' : ''}${d >= VISIBLE ? ' is-hidden' : ''}`}
              style={{
                '--d': Math.min(d, VISIBLE - 1),
                zIndex: total - d,
                backgroundImage: `url(${s.showcase.image}), linear-gradient(160deg, hsl(220, 40%, 15%), hsl(250, 21%, 7%))`
              } as React.CSSProperties}
              onClick={() => onSelect(front ? (active + 1) % total : i)}
            >
              <span className="dcard-tag">
                {s.label}
              </span>
              <span className="dcard-body">
                <span className="dcard-title">{s.showcase.title}</span>
                <span className="dcard-desc">{s.showcase.desc}</span>
              </span>
              {front && !reduced && (
                <span
                  key={active}
                  className="dcard-bar"
                  style={{ animationDuration: `${INTERVAL_MS}ms` }}
                  onAnimationEnd={advance}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
