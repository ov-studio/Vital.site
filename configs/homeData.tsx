import type { WhyItem, FooterCol } from './types';

export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Ethos', href: '#ethos' },
  { label: 'Documentations',    href: '/docs'     },
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
  {
    heading: 'Sandbox',
    links: [
      { label: 'Documentations', href: '/docs' },
      { label: 'Roadmap', href: '#' },
      { label: 'Changelog', href: '#' },
      { label: 'Contributing', href: '/docs/building' },
    ],
  },
  {
    heading: 'Resource',
    links: [
      { label: 'Vital.sandbox', href: 'https://github.com/ov-studio/Vital.sandbox' },
      { label: 'Vital.kit', href: 'https://github.com/ov-studio/Vital.kit' },
    ],
  },
  {
    heading: 'Social',
    links: [
      { label: 'Ko-fi', href: 'https://ko-fi.com/ovstudio' },
      { label: 'GitHub', href: 'https://github.com/ov-studio' },
      { label: 'Discord', href: 'http://discord.gg/sVCnxPW' }
    ],
  },
];