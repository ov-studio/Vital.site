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

const BRAND = '#94b2fc'; 

function hash(i: number, j: number, seed: number) {
  let n = (i + seed * 97) * 374761393 + (j + seed * 13) * 668265263;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) >>> 0) / 4294967295;
}

/** Shared cache: solid brand-colored icon bitmaps (transparent bg). */
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
    host.style.cssText =
      'position:fixed;left:-99999px;top:0;width:64px;height:64px;overflow:hidden;pointer-events:none;opacity:0;';
    document.body.appendChild(host);

    let root: Root | null = null;
    let settled = false;

    const cleanup = () => {
      try { root?.unmount(); } catch { /* */ }
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
          strokeWidth: 1.4,
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

export function IconWallpaper({
  icons,
  seed = 0,
  size = 36,
  gap = 100,
  opacity = 0.08,
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
    const glyphPx = Math.max(32, Math.round(size * dpr));

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

    const cols = Math.ceil(w / gap) + 2;
    const rows = Math.ceil(h / gap) + 2;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const r = hash(col, row, seed);
        const img = bitmaps[Math.floor(r * bitmaps.length) % bitmaps.length];
        if (!img || !img.complete || img.naturalWidth < 1) continue;

        const ox = (hash(col + 7, row + 3, seed) - 0.5) * 40;
        const oy = (hash(col + 11, row + 5, seed) - 0.5) * 40;
        const rot = ((hash(col + 13, row + 17, seed) - 0.5) * 36 * Math.PI) / 180;
        const a = 0.55 + hash(col + 19, row + 23, seed) * 0.45;
        const s = size * (0.85 + hash(col + 29, row + 31, seed) * 0.4);
        const x = col * gap + gap / 2 + ox;
        const y = row * gap + gap / 2 + oy + (col % 2 === 0 ? gap * 0.32 : 0);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.globalAlpha = a;
        ctx.drawImage(img, -s / 2, -s / 2, s, s);
        ctx.restore();
      }
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
    const t1 = setTimeout(() => void paint(), 150);
    const t2 = setTimeout(() => void paint(), 500);

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
