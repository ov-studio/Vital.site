import * as Icons from 'lucide-react';
import { site } from '@/configs/site';

export const Features_Content = [
  { id: 'core', label: 'Core', angle: 0, desc: 'Cryptography, compression, hardware inspection, and a full runtime console — the foundation everything runs on.', items: ['Crypto', 'Shrinker', 'Stack', 'Inspect', 'Console'] },
  { id: 'rendering', label: 'Rendering', angle: 51, desc: 'Full programmatic control over 2D canvas, textures, fonts, rendertargets, and embedded web content.', items: ['Canvas', 'Rendertarget', 'Texture', 'Font', 'Webview'] },
  { id: 'models', label: 'Models', angle: 102, desc: 'Load, spawn, transform, animate, and morph 3D assets at runtime — built for advanced customization systems.', items: ['Load / Unload', 'Instantiation', 'Transform', 'Animation', 'Blend Shapes', 'Visibility'] },
  { id: 'threading', label: 'Threading', angle: 180, desc: 'Async/await, promises, heartbeats, and low-level thread pooling — modern concurrency without sacrificing control.', items: ['Async / Await', 'Promises', 'Heartbeats', 'Threader'] },
  { id: 'networking', label: 'Networking', angle: 231, desc: 'HTTP, high-performance transport, and precise task scheduling for time-sensitive execution.', items: ['HTTP', 'Robust Transport', 'Scheduling'] },
  { id: 'sandbox', label: 'Sandboxing', angle: 282, desc: 'Full Lua isolation with no access to host internals — safe, extensible, built for user scripting and plugins.', items: ['Lua Isolation', 'User Scripting', 'Plugin Systems'] },
  { id: 'integrations', label: 'Integrations', angle: 333, desc: 'Native Discord Rich Presence and a pub/sub event system for clean decoupled module communication.', items: ['Discord SDK', 'Event System'] },
];

export const Ethos_Content = [
  { title: 'Open Source', desc: 'Fully open-source, no licensing fees, no royalties, no strings attached. What you build belongs to you — completely and unconditionally.', icon: <Icons.Star {...site.lucide} /> },
  { title: 'Zero Monetization Limits', desc: 'No platform cuts, no revenue gates, no forced monetization systems. Ship free, charge what you want, keep everything.', icon: <Icons.BadgeCheck {...site.lucide} /> },
  { title: 'No Bloat', desc: 'Lean by design. No unnecessary abstractions, no forced frameworks. Nothing stands between your scripts and the engine.', icon: <Icons.Puzzle {...site.lucide} /> },
  { title: 'Full Runtime Scripting', desc: 'Script everything at runtime — rendering, networking, threading, models, GFX — one unified Lua API, top to bottom.', icon: <Icons.Terminal {...site.lucide} /> },
  { title: 'Modding & Plugin Ready', desc: 'Built for user scripting, modding, and plugin systems from day one. Full sandboxed Lua isolation — safe, powerful, extensible.', icon: <Icons.Cable {...site.lucide} /> },
  { title: 'Performance First', desc: 'Built on Godot, engineered in C++17 with a Lua scripting layer that runs 10–50x faster than GDScript — no interpreter bottlenecks, maximum throughput at every layer.', icon: <Icons.CircleGauge {...site.lucide} /> },
];