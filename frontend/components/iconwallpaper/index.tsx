'use client';
import type { LucideIcon } from 'lucide-react';
import './index.css';

export interface IconWallpaperProps {
  icons?: LucideIcon[];
  seed?: number;
  size?: number;
  gap?: number;
  opacity?: number;
  vignette?: boolean;
  src?: string;
}

export function IconWallpaper({
  seed = 0,
  opacity = 0.09,
  vignette = true,
  src,
}: IconWallpaperProps) {
  const url = src ?? `/cdn/iconwallpaper/seed-${seed}.svg`;
  return (
    <div
      className={`icon-wallpaper${vignette ? ' icon-wallpaper--vignette' : ''}`}
      style={{ backgroundImage: `url(${url})`, opacity }}
      aria-hidden="true"
    />
  );
}
