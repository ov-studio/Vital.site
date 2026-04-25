import type { FeatureItem, WhyItem, FooterCol } from './types';

export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Ethos', href: '#ethos' },
  { label: 'Docs',    href: '/docs'     },
];

export const HERO_STATS = [
  { value: 'C++17',       label: 'Engine Core'   },
  { value: 'Lua',         label: 'Scripting'     },
  { value: '100+',        label: 'API Functions' },
  { value: 'Open Source', label: 'No Royalties'  },
];

export const FEATURE_GROUPS: { group: string; items: FeatureItem[] }[] = [
  {
    group: 'Rendering',
    items: [
      { n: '01', title: 'Canvas',              desc: 'Draw shapes, images, text, and polygons on the canvas each frame.',             icon: <><rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></> },
      { n: '02', title: 'RenderTarget',        desc: 'Create and bind off-screen surfaces, sampled as textures at runtime.',          icon: <><rect x="1" y="3" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M11 6l4-2v6l-4-2" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></> },
      { n: '03', title: 'Texture',             desc: 'Load, unload, and control texture samplers at runtime.',                        icon: <><rect x="3" y="3" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/></> },
      { n: '04', title: 'Font & Text',         desc: 'Load fonts and render text with full size and color control.',                  icon: <><path d="M3 12V5l4-2 4 2v7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6 12V9h4v3" stroke="currentColor" strokeWidth="1.2"/></> },
      { n: '05', title: 'Webview',             desc: 'Render embedded web content inside your sandbox window.',                       icon: <><rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7h6M5 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></> },
      { n: '06', title: 'GFX Post-Processing', desc: 'Fog, LUTs, depth curves, and color grading — scriptable per frame.',           icon: <path d="M2 10L5 4l3 6 2-3 2 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/> },
    ],
  },
  {
    group: 'Threading & Async',
    items: [
      { n: '07', title: 'Async / Await', desc: 'Non-blocking async execution with clean control flow.',                               icon: <><path d="M8 2v4l3 2-3 2v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 5l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></> },
      { n: '08', title: 'Promises',      desc: 'Deferred values with chaining, resolution, and try/catch support.',                   icon: <><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></> },
      { n: '09', title: 'Heartbeats',    desc: 'Recurring callbacks at defined intervals for loops and polling.',                     icon: <><path d="M8 3a5 5 0 100 10A5 5 0 008 3z" stroke="currentColor" strokeWidth="1.2"/><path d="M8 6v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></> },
      { n: '10', title: 'Threader',      desc: 'Low-level thread management, pooling, and lifecycle control.', wide: true,           icon: <path d="M2 4h4v4H2zM10 4h4v4h-4zM6 10h4v4H6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/> },
    ],
  },
  {
    group: 'Models',
    items: [
      { n: '11', title: 'Load & Unload',        desc: 'Load and unload named model assets at runtime, no restarts.',                 icon: <path d="M8 2l5 3v6l-5 3-5-3V5l5-3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/> },
      { n: '12', title: 'Instantiation',        desc: 'Spawn and destroy independent instances from a shared asset.',                icon: <><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/></> },
      { n: '13', title: 'Transform',            desc: 'Per-instance position, rotation, and scale at runtime.',                      icon: <><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/></> },
      { n: '14', title: 'Animation',            desc: 'Per-instance animation with speed, loop, pause, and resume.',                 icon: <><path d="M3 13V6l5-3 5 3v7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></> },
      { n: '15', title: 'Blend Shapes',         desc: 'Per-component blend shapes for expressions and body morphs.',                 icon: <><circle cx="8" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M4 13c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></> },
      { n: '16', title: 'Component Visibility', desc: 'Per-component mesh visibility for clothing and equipment systems.',           icon: <><path d="M4 4h8v8H4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4 7h8M7 4v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></> },
    ],
  },
  {
    group: 'Core & Integrations',
    items: [
      { n: '17', title: 'Crypto',          desc: 'Primitives for hashing, encryption, and payload security.',                        icon: <><rect x="3" y="3" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M6 8l1.5 1.5L10 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></> },
      { n: '18', title: 'Shrinker',        desc: 'Compress assets and data to reduce memory and transfer overhead.',                 icon: <><path d="M4 12l2-8h4l2 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.5 8.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></> },
      { n: '19', title: 'REST Networking', desc: 'Native HTTP GET and POST with full header support.',                               icon: <><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/></> },
      { n: '20', title: 'Discord SDK',     desc: 'Native Rich Presence and Discord API integration.',                               icon: <><path d="M3 8a5 5 0 0010 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8 3v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M5 5l3-2 3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></> },
      { n: '21', title: 'Event System',    desc: 'Pub/sub events for decoupled inter-module communication.',                        icon: <><circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M6 8h2m2-2.5L8 8l2 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></> },
      { n: '22', title: 'Console',         desc: 'Runtime console for commands, debug, info, and error output.',                    icon: <><rect x="2" y="4" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5 8h2M5 10.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M5 4V3M11 4V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></> },
    ],
  },
];

export const API_TABS = [
  { id: 'canvas', n: '01', name: 'Canvas',     sig: 'draw_rectangle · draw_text · draw_circle', file: 'server/hud.lua'   },
  { id: 'net',    n: '02', name: 'Networking', sig: 'rest.get · rest.post',                      file: 'server/fetch.lua' },
  { id: 'gfx',   n: '03', name: 'GFX',        sig: 'fog · depth · LUTs · adjustment',           file: 'server/gfx.lua'   },
  { id: 'async',  n: '04', name: 'Async',      sig: 'thread · promise · try/catch',              file: 'server/async.lua' },
];

export const WHY_ITEMS: WhyItem[] = [
  { title: 'Open Source',              desc: 'Fully open-source, no licensing fees, no royalties, no strings attached. What you build belongs to you — completely and unconditionally.',     icon: <path d="M10 2l2.4 5 5.6.8-4 4 .9 5.5L10 14.5l-4.9 2.8.9-5.5-4-4 5.6-.8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/> },
  { title: 'Zero Monetization Limits', desc: 'No platform cuts, no revenue gates, no forced monetization systems. Ship free, charge what you want, keep everything.',                        icon: <><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></> },
  { title: 'No Bloat',                 desc: 'Lean by design. No unnecessary abstractions, no forced frameworks. Nothing stands between your scripts and the engine.',                        icon: <><path d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.4"/></> },
  { title: 'Full Runtime Scripting',   desc: 'Script everything at runtime — rendering, networking, threading, models, GFX — one unified Lua API, top to bottom.',                          icon: <><path d="M4 4h12v8H4zM8 16h4M10 12v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></> },
  { title: 'Modding & Plugin Ready',   desc: 'Built for user scripting, modding, and plugin systems from day one. Full sandboxed Lua isolation — safe, powerful, extensible.',               icon: <><path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" stroke="currentColor" strokeWidth="1.4"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></> },
  { title: 'Performance First',        desc: 'Built on Godot, engineered in C++17. No overhead, no interpreter bottlenecks — maximum throughput at every layer.',                            icon: <path d="M5 10h10M10 5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/> },
];

export const FOOTER_COLS: FooterCol[] = [
  { heading: 'Product',   links: [{ label: 'Features', href: '#' }, { label: 'API Reference', href: '#' }, { label: 'Changelog', href: '#' }, { label: 'Roadmap', href: '#' }] },
  { heading: 'Resources', links: [{ label: 'Documentation', href: '/docs' }, { label: 'Examples', href: '#' }, { label: 'Lua Guide', href: '#' }, { label: 'C++ SDK', href: 'https://github.com/ov-studio/Vital.sandbox' }] },
  { heading: 'Community', links: [{ label: 'GitHub', href: 'https://github.com/ov-studio' }, { label: 'Discord', href: 'http://discord.gg/sVCnxPW' }, { label: 'Ko-fi', href: 'https://ko-fi.com/ovstudio' }, { label: 'Contributing', href: '/docs/building' }] },
];
