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

const WallpaperIcon = react.memo(function WallpaperIcon({
  Icon,
  x,
  y,
  size: s,
  rotate,
  opacity: a,
}: Omit<Cell, 'key'>) {
  return (
    <span
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
      <Icon size={s} strokeWidth={1.4} absoluteStrokeWidth={false}/>
    </span>
  );
});

export function IconWallpaper({
  icons,
  seed = 0,
  size = 40,
  gap = 148,
  opacity = 0.12
}: IconWallpaperProps) {
  const wrapRef = react.useRef<HTMLDivElement>(null);
  const [cells, setCells] = react.useState<Cell[]>([]);
  const rebuildTimer = react.useRef<ReturnType<typeof setTimeout> | null>(null);

  const rebuild = react.useCallback(() => {
    const el = wrapRef.current;
    if (!el || icons.length === 0) return;

    const w = el.clientWidth;
    const h = el.clientHeight;
    if (w < 1 || h < 1) return;

    // Cap density so we never spawn hundreds of SVGs on large screens
    const cols = Math.min(Math.ceil(w / gap) + 2, 18);
    const rows = Math.min(Math.ceil(h / gap) + 2, 14);
    const next: Cell[] = [];

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const r = hash(col, row, seed);
        const Icon = icons[Math.floor(r * icons.length)];
        const ox = (hash(col + 7, row + 3, seed) - 0.5) * 40;
        const oy = (hash(col + 11, row + 5, seed) - 0.5) * 40;
        const rot = (hash(col + 13, row + 17, seed) - 0.5) * 36;
        const a = opacity * (0.6 + hash(col + 19, row + 23, seed) * 0.75);
        const s = size * (0.85 + hash(col + 29, row + 31, seed) * 0.4);
        const x = col * gap + gap / 2 + ox;
        const y = row * gap + gap / 2 + oy + (col % 2 === 0 ? gap * 0.32 : 0);

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

  const scheduleRebuild = react.useCallback(() => {
    if (rebuildTimer.current) clearTimeout(rebuildTimer.current);
    rebuildTimer.current = setTimeout(rebuild, 80);
  }, [rebuild]);

  react.useEffect(() => {
    rebuild();
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(scheduleRebuild);
    ro.observe(el.parentElement || el);
    window.addEventListener('resize', scheduleRebuild, { passive: true });
    const t1 = setTimeout(rebuild, 120);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', scheduleRebuild);
      clearTimeout(t1);
      if (rebuildTimer.current) clearTimeout(rebuildTimer.current);
    };
  }, [rebuild, scheduleRebuild]);

  return (
    <div className="icon-wallpaper" ref={wrapRef} aria-hidden="true">
      {cells.map(({ key, ...rest }) => (
        <WallpaperIcon key={key} {...rest}/>
      ))}
    </div>
  );
}
