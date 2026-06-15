'use client';
import * as config_site from '@/configs/site';
import './index.css';

type BrandSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type BrandVariant = 'full' | 'logo-only' | 'wordmark-only';

interface BrandProps {
  size?: BrandSize;
  variant?: BrandVariant;
  className?: string;
  color?: string;
  href?: string;
}

export function Brand({
  size = 'md',
  variant = 'full',
  className = '',
  color,
  href,
}: BrandProps) {
  const colorStyle = color ? ({ '--brand-color': color } as React.CSSProperties) : undefined;

  const inner = (
    <>
      {variant !== 'wordmark-only' && (
        <div className="brand_logo-wrapper">
          <div className="brand_logo"/>
        </div>
      )}
      {variant !== 'logo-only' && (
        <span className="brand_wordmark">{config_site.info.name}</span>
      )}
    </>
  );

  return (
    <div
      className={`brand brand--${size} brand--${variant} ${className}`}
      style={colorStyle}
    >
      {href ? (<a href={href} className="brand_link">{inner}</a>) : inner}
    </div>
  );
}