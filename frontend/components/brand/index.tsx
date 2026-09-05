'use client';
import * as config_site from '@/configs/site';
import './index.css';

type BrandSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type BrandVariant = 'full' | 'logo-only' | 'wordmark-only';

interface BrandProps {
  size?:      BrandSize;
  variant?:   BrandVariant;
  className?: string;
  color?:     string;
  href?:      string;
  neon?:      boolean;
}

export function Brand({
  size = 'md',
  variant = 'full',
  className = '',
  color,
  href,
  neon = false,
}: BrandProps) {
  const color_style = color ? ({ '--brand-color': color } as React.CSSProperties) : undefined;

  const logo = variant !== 'wordmark-only' && (
    <div className="brand_logo-wrapper">
      {neon ? (
        <img
          src="/logo.svg"
          alt=""
          className="brand_logo brand_logo--neon"
          draggable={false}
        />
      ) : (
        <div className="brand_logo"/>
      )}
    </div>
  );

  const wordmark = variant !== 'logo-only' && (
    <span className="brand_wordmark">{config_site.info.name}</span>
  );

  const inner = (
    <>
      {logo}
      {wordmark}
    </>
  );

  return (
    <div
      className={`brand brand--${size} brand--${variant}${neon ? ' brand--neon' : ''} ${className}`.trim()}
      style={color_style}
    >
      {href ? (<a href={href} className="brand_link">{inner}</a>) : inner}
    </div>
  );
}
