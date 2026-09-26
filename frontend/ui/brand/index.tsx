'use client';
import * as react from 'react';
import './index.css';

type BrandSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type BrandVariant = 'full' | 'logo-only' | 'wordmark-only';

interface BrandProps {
  name?:      string;
  size?:      BrandSize;
  variant?:   BrandVariant;
  className?: string;
  color?:     string;
  href?:      string;
  neon?:      boolean;
  flicker?:   boolean;
  rays?:      boolean;
}

/**
 * Brand mark and wordmark.
 */
export function Brand({
  name,
  size = 'md',
  variant = 'full',
  className = '',
  color,
  href,
  neon = false,
  flicker = false,
  rays = true,
}: BrandProps) {
  const color_style = color ? ({ '--brand-color': color } as React.CSSProperties) : undefined;
  const [glitch, setGlitch] = react.useState(false);
  const show_rays = neon && rays;

  react.useEffect(() => {
    if (!flicker) {
      setGlitch(false);
      return;
    }

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const rand = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const run = () => {
      if (cancelled) return;

      setGlitch(false);
      timer = setTimeout(() => {
        if (cancelled) return;

        setGlitch(true);
        timer = setTimeout(() => {
          if (cancelled) return;

          setGlitch(false);
          if (Math.random() < 0.55) {
            timer = setTimeout(() => {
              if (cancelled) return;

              setGlitch(true);
              timer = setTimeout(() => {
                if (cancelled) return;
                setGlitch(false);
                timer = setTimeout(run, rand(4000, 9000));
              }, rand(40, 90));
            }, rand(60, 160));
          }
          else timer = setTimeout(run, rand(4000, 9000));
        }, rand(80, 200));
      }, rand(3500, 7500));
    };

    timer = setTimeout(run, rand(2500, 4500));
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [flicker]);

  const logo = variant !== 'wordmark-only' && (
    <div className="brand_logo-wrapper">
      {show_rays && <span className="brand_rays" aria-hidden/>}
      {neon ? (
        <img
          src="/logo/logo.svg"
          alt=""
          className="brand_logo brand_logo--neon"
          draggable={false}
        />
      ) : (
        <div className="brand_logo"/>
      )}
    </div>
  );

  const wordmark = variant !== 'logo-only' && name && (
    <span className="brand_wordmark">{name}</span>
  );

  const inner = (
    <>
      {logo}
      {wordmark}
    </>
  );

  const cls = [
    'brand',
    `brand--${size}`,
    `brand--${variant}`,
    neon ? 'brand--neon' : '',
    show_rays ? 'brand--rays' : '',
    flicker ? 'brand--flicker' : '',
    flicker && glitch ? 'is-glitch' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} style={color_style}>
      {href ? (<a href={href} className="brand_link">{inner}</a>) : inner}
    </div>
  );
}
