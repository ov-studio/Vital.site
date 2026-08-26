'use client';
import * as react from 'react';
import type { LucideIcon } from 'lucide-react';
import './index.css';

export interface IconWallpaperProps {
  icons:    LucideIcon[];
  seed?:    number;
  size?:    number;
  gap?:     number;
  opacity?: number;
}

function hash(i: number, j: number, seed: number) {
  let n = (i + seed * 97) * 374761393 + (j + seed * 13) * 668265263;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) >>> 0) / 4294967295;
}

type Cell = {
  key: string;
  Icon: LucideIcon;
  x: number;
  y: number;
  size: number;
  rotate: number;
  opacity: number;
};

export function IconWallpaper({
  icons,
  seed = 0,
  size = 28,
  gap = 108,
  opacity = 0.11,
}: IconWallpaperProps) {
  const wrapRef = react.useRef<HTMLDivElement>(null);
  const [cells, setCells] = react.useState<Cell[]>([]);

  const rebuild = react.useCallback(() => {
    const el = wrapRef.current;
    if (!el || icons.length === 0) return;

    const w = el.clientWidth;
    const h = el.clientHeight;
    if (w < 1 || h < 1) return;

    const cols = Math.ceil(w / gap) + 2;
    const rows = Math.ceil(h / gap) + 2;
    const next: Cell[] = [];

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const r = hash(col, row, seed);
        const Icon = icons[Math.floor(r * icons.length)];
        const ox = (hash(col + 7, row + 3, seed) - 0.5) * 36;
        const oy = (hash(col + 11, row + 5, seed) - 0.5) * 36;
        const rot = (hash(col + 13, row + 17, seed) - 0.5) * 40; // degrees
        const a = opacity * (0.65 + hash(col + 19, row + 23, seed) * 0.7);
        const s = size * (0.8 + hash(col + 29, row + 31, seed) * 0.45);
        const x = col * gap + gap / 2 + ox;
        const y = row * gap + gap / 2 + oy + (col % 2 === 0 ? gap * 0.38 : 0);

        next.push({
          key: `${col}:${row}`,
          Icon,
          x,
          y,
          size: s,
          rotate: rot,
          opacity: a,
        });
      }
    }

    setCells(next);
  }, [icons, seed, size, gap, opacity]);

  react.useEffect(() => {
    rebuild();
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => rebuild());
    ro.observe(el.parentElement || el);
    window.addEventListener('resize', rebuild);

    const t1 = setTimeout(rebuild, 100);
    const t2 = setTimeout(rebuild, 400);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', rebuild);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [rebuild]);

  return (
    <div className="icon-wallpaper" ref={wrapRef} aria-hidden="true">
      {cells.map(({ key, Icon, x, y, size: s, rotate, opacity: a }) => (
        <span
          key={key}
          className="icon-wallpaper-item"
          style={{
            left: x,
            top: y,
            width: s,
            height: s,
            opacity: a,
            transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
          }}
        >
          <Icon size={s} strokeWidth={1.5}/>
        </span>
      ))}
    </div>
  );
}
