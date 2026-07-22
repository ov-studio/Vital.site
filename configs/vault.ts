export type VaultTag = 'gamemode' | 'utility' | 'ui' | 'physics' | 'audio' | 'networking' | 'tools';

export interface VaultResource {
  id: string;
  name: string;
  tagline: string;
  description: string;
  author: string;
  author_url?: string;
  version: string;
  tags: VaultTag[];
  banner?: string;           // URL or undefined for placeholder
  download_url: string;
  source_url?: string;
  updated: string;           // ISO date string
  downloads?: number;
  featured?: boolean;
}

export const Vault: VaultResource[] = [
  {
    id: 'monitor',
    name: 'Monitor',
    tagline: 'Real-time performance overlay for Vital.sandbox servers',
    description: 'Displays live server metrics including player count, memory usage, tick rate, and active resource count directly in the client HUD. Lightweight, configurable, and built for always-on use.',
    author: 'ov-studio',
    author_url: 'https://github.com/ov-studio',
    version: '1.0.0',
    tags: ['utility', 'ui'],
    download_url: '#',
    source_url: 'https://github.com/ov-studio',
    banner: 'https://plus.unsplash.com/premium_photo-1737182592549-0c83f93e2903?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    updated: '2026-07-01',
    downloads: 0,
    featured: true,
  },
  {
    id: 'monitor2',
    name: 'Monitor2',
    tagline: 'Real-time performance overlay for Vital.sandbox servers',
    description: 'Displays live server metrics including player count, memory usage, tick rate, and active resource count directly in the client HUD. Lightweight, configurable, and built for always-on use.',
    author: 'ov-studio',
    author_url: 'https://github.com/ov-studio',
    version: '1.0.0',
    tags: ['utility', 'ui'],
    download_url: '#',
    source_url: 'https://github.com/ov-studio',
    banner: 'https://wallpaperaccess.com/full/840326.jpg',
    updated: '2026-07-01',
    downloads: 0,
    featured: true,
  },
  {
    id: 'monitor3',
    name: 'Monitor3',
    tagline: 'Real-time performance overlay for Vital.sandbox servers',
    description: 'Displays live server metrics including player count, memory usage, tick rate, and active resource count directly in the client HUD. Lightweight, configurable, and built for always-on use.',
    author: 'ov-studio',
    author_url: 'https://github.com/ov-studio',
    version: '1.0.0',
    tags: ['utility', 'ui'],
    download_url: '#',
    source_url: 'https://github.com/ov-studio',
    banner: 'https://plus.unsplash.com/premium_photo-1737182592549-0c83f93e2903?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    updated: '2026-07-01',
    downloads: 0,
    featured: true,
  },
  {
    id: 'monitor4',
    name: 'Monitor4',
    tagline: 'Real-time performance overlay for Vital.sandbox servers',
    description: 'Displays live server metrics including player count, memory usage, tick rate, and active resource count directly in the client HUD. Lightweight, configurable, and built for always-on use.',
    author: 'ov-studio',
    author_url: 'https://github.com/ov-studio',
    version: '1.0.0',
    tags: ['utility', 'ui'],
    download_url: '#',
    source_url: 'https://github.com/ov-studio',
    banner: 'https://wallpaperaccess.com/full/840326.jpg',
    updated: '2026-07-01',
    downloads: 0,
    featured: true,
  },


  {
    id: 'monitor11',
    name: 'Monitor',
    tagline: 'Real-time performance overlay for Vital.sandbox servers',
    description: 'Displays live server metrics including player count, memory usage, tick rate, and active resource count directly in the client HUD. Lightweight, configurable, and built for always-on use.',
    author: 'ov-studio',
    author_url: 'https://github.com/ov-studio',
    version: '1.0.0',
    tags: ['utility', 'ui'],
    download_url: '#',
    source_url: 'https://github.com/ov-studio',
    banner: 'https://plus.unsplash.com/premium_photo-1737182592549-0c83f93e2903?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    updated: '2026-07-01',
    downloads: 0,
    featured: true,
  },
  {
    id: 'monitor21',
    name: 'Monitor2',
    tagline: 'Real-time performance overlay for Vital.sandbox servers',
    description: 'Displays live server metrics including player count, memory usage, tick rate, and active resource count directly in the client HUD. Lightweight, configurable, and built for always-on use.',
    author: 'ov-studio',
    author_url: 'https://github.com/ov-studio',
    version: '1.0.0',
    tags: ['utility', 'ui'],
    download_url: '#',
    source_url: 'https://github.com/ov-studio',
    banner: 'https://wallpaperaccess.com/full/840326.jpg',
    updated: '2026-07-01',
    downloads: 0,
    featured: true,
  },
  {
    id: 'monitor31',
    name: 'Monitor3',
    tagline: 'Real-time performance overlay for Vital.sandbox servers',
    description: 'Displays live server metrics including player count, memory usage, tick rate, and active resource count directly in the client HUD. Lightweight, configurable, and built for always-on use.',
    author: 'ov-studio',
    author_url: 'https://github.com/ov-studio',
    version: '1.0.0',
    tags: ['utility', 'ui'],
    download_url: '#',
    source_url: 'https://github.com/ov-studio',
    banner: 'https://plus.unsplash.com/premium_photo-1737182592549-0c83f93e2903?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    updated: '2026-07-01',
    downloads: 0,
    featured: true,
  },
  {
    id: 'monitor41',
    name: 'Monitor4',
    tagline: 'Real-time performance overlay for Vital.sandbox servers',
    description: 'Displays live server metrics including player count, memory usage, tick rate, and active resource count directly in the client HUD. Lightweight, configurable, and built for always-on use.',
    author: 'ov-studio',
    author_url: 'https://github.com/ov-studio',
    version: '1.0.0',
    tags: ['utility', 'ui'],
    download_url: '#',
    source_url: 'https://github.com/ov-studio',
    banner: 'https://wallpaperaccess.com/full/840326.jpg',
    updated: '2026-07-01',
    downloads: 0,
    featured: true,
  },
];