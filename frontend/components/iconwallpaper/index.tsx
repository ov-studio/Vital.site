'use client';
import * as react from 'react';
import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { LucideIcon } from 'lucide-react';
import './index.css';

export interface IconWallpaperProps {
  icons:     LucideIcon[];
  seed?:     number;
  size?:     number;
  gap?:      number;
  opacity?:  number;
  vignette?: boolean;
}

const BRAND = 'hsl(220, 95%, 76%)';

function hash(i: number, j: number, seed: number) {
  let n = (i + seed * 97) * 374761393 + (j + seed * 13) * 668265263;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) >>> 0) / 4294967295;
}

const iconBitmapCache = new Map<string, Promise<HTMLImageElement>>();

function iconKey(Icon: LucideIcon, px: number) {
  const name =
    (Icon as unknown as { displayName?: string }).displayName ||
    (Icon as unknown as { name?: string }).name ||
    'icon';
  return `${name}:${px}`;
}

function rasterizeIcon(Icon: LucideIcon, px: number): Promise<HTMLImageElement> {
  const key = iconKey(Icon, px);
  const cached = iconBitmapCache.get(key);
  if (cached) return cached;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const host = document.createElement('div');
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:fixed;left:-99999px;top:0;width:64px;height:64px;overflow:hidden;pointer-events:none;opacity:0;';
    document.body.appendChild(host);

    let root: Root | null = null;
    let settled = false;

    const cleanup = () => {
      try { root?.unmount(); } catch { }
      host.remove();
    };

    const finish = (img: HTMLImageElement) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(img);
    };

    const fail = (err: unknown) => {
      if (settled) return;
      settled = true;
      cleanup();
      iconBitmapCache.delete(key);
      reject(err);
    };

    try {
      root = createRoot(host);
      root.render(
        createElement(Icon, {
          size: px,
          color: BRAND,
          strokeWidth: 1,
          absoluteStrokeWidth: false,
        }),
      );
    } catch (e) {
      fail(e);
      return;
    }

    let attempts = 0;
    const trySerialize = () => {
      attempts++;
      const svg = host.querySelector('svg');
      if (!svg) {
        if (attempts < 30) {
          requestAnimationFrame(trySerialize);
          return;
        }
        fail(new Error('icon svg missing'));
        return;
      }

      try {
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', String(px));
        svg.setAttribute('height', String(px));
        svg.setAttribute('stroke', BRAND);
        svg.setAttribute('color', BRAND);
        svg.querySelectorAll('[stroke]').forEach((n) => {
          if (n.getAttribute('stroke') !== 'none') n.setAttribute('stroke', BRAND);
        });
        svg.querySelectorAll('[fill]').forEach((n) => {
          const f = n.getAttribute('fill');
          if (f && f !== 'none' && f !== 'transparent') n.setAttribute('fill', BRAND);
        });

        const xml = new XMLSerializer().serializeToString(svg);
        const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => finish(img);
        img.onerror = () => fail(new Error('icon image load failed'));
        img.src = url;
      } catch (e) {
        fail(e);
      }
    };

    requestAnimationFrame(trySerialize);
  });

  iconBitmapCache.set(key, promise);
  return promise;
}

type Spot = {
  x: number;
  y: number;
  rot: number;
  s: number;
  a: number;
  iconIndex: number;
};

function buildScatter(
  w: number,
  h: number,
  gap: number,
  size: number,
  seed: number,
  iconCount: number,
): Spot[] {
  const spots: Spot[] = [];
  const cols = Math.ceil(w / gap) + 3;
  const rows = Math.ceil(h / gap) + 3;

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      if (hash(col, row, seed + 99) < 0.12) continue;
      const x = col * gap + hash(col, row, seed) * gap;
      const y = row * gap + hash(col + 3, row + 5, seed) * gap;
      const rot = hash(col + 7, row + 11, seed) * Math.PI * 2;
      const s = size * (0.55 + hash(col + 13, row + 17, seed) * 0.7);
      const a = 0.45 + hash(col + 19, row + 23, seed) * 0.55;
      const iconIndex = Math.floor(hash(col + 29, row + 31, seed) * iconCount) % iconCount;
      spots.push({ x, y, rot, s, a, iconIndex });
    }
  }

  const gap2 = gap * 1.35;
  const cols2 = Math.ceil(w / gap2) + 2;
  const rows2 = Math.ceil(h / gap2) + 2;
  for (let row = -1; row < rows2; row++) {
    for (let col = -1; col < cols2; col++) {
      if (hash(col, row, seed + 50) > 0.4) continue;
      const x = col * gap2 + hash(col, row, seed + 3) * gap2;
      const y = row * gap2 + hash(col + 2, row + 4, seed + 3) * gap2;
      const rot = hash(col + 6, row + 8, seed + 3) * Math.PI * 2;
      const s = size * (0.35 + hash(col + 10, row + 12, seed + 3) * 0.4);
      const a = 0.3 + hash(col + 14, row + 16, seed + 3) * 0.4;
      const iconIndex =
        Math.floor(hash(col + 18, row + 20, seed + 3) * iconCount) % iconCount;
      spots.push({ x, y, rot, s, a, iconIndex });
    }
  }
  return spots;
}

export function IconWallpaper({
  icons,
  seed = 0,
  size = 60,
  gap = 100,
  opacity = 0.1,
  vignette = true,
}: IconWallpaperProps) {
  const wrapRef = react.useRef<HTMLDivElement>(null);
  const canvasRef = react.useRef<HTMLCanvasElement>(null);
  const rebuildTimer = react.useRef<ReturnType<typeof setTimeout> | null>(null);
  const genRef = react.useRef(0);

  const paint = react.useCallback(async () => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || icons.length === 0) return;

    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (w < 2 || h < 2) return;

    const gen = ++genRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const glyphPx = Math.max(32, Math.round(size * dpr * 1.15));

    let bitmaps: HTMLImageElement[];
    try {
      bitmaps = await Promise.all(icons.map((Icon) => rasterizeIcon(Icon, glyphPx)));
    } catch (e) {
      console.warn('[IconWallpaper] rasterize failed', e);
      return;
    }
    if (gen !== genRef.current) return;

    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const spots = buildScatter(w, h, gap, size, seed, bitmaps.length);
    for (const spot of spots) {
      const img = bitmaps[spot.iconIndex];
      if (!img || !img.complete || img.naturalWidth < 1) continue;

      ctx.save();
      ctx.translate(spot.x, spot.y);
      ctx.rotate(spot.rot);
      ctx.globalAlpha = spot.a;
      ctx.drawImage(img, -spot.s / 2, -spot.s / 2, spot.s, spot.s);
      ctx.restore();
    }
  }, [icons, seed, size, gap]);

  const schedulePaint = react.useCallback(() => {
    if (rebuildTimer.current) clearTimeout(rebuildTimer.current);
    rebuildTimer.current = setTimeout(() => {
      void paint();
    }, 60);
  }, [paint]);

  react.useEffect(() => {
    void paint();
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(schedulePaint);
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);
    window.addEventListener('resize', schedulePaint, { passive: true });
    const t1 = setTimeout(() => void paint(), 100);
    const t2 = setTimeout(() => void paint(), 400);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', schedulePaint);
      clearTimeout(t1);
      clearTimeout(t2);
      if (rebuildTimer.current) clearTimeout(rebuildTimer.current);
      genRef.current++;
    };
  }, [paint, schedulePaint]);

  return (
    <div
      className={`icon-wallpaper${vignette ? ' icon-wallpaper--vignette' : ''}`}
      ref={wrapRef}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="icon-wallpaper-canvas"
        style={{ opacity }}
      />
    </div>
  );
}
