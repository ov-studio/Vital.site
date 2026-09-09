import * as config_site from '@/configs/site';
import * as lucide      from 'lucide-react';

export const Features = [
  {
    id:    'sandbox',
    label: 'Sandbox',
    angle: 0,
    desc:  'Runtime backbone of client and server — per-resource Lua sandboxes, resource lifecycle, asset streaming, and cross-resource exports.'
  },
  {
    id:    'core',
    label: 'Core',
    angle: 51,
    desc:  'Full programmatic control of every scene entity — model, webview, canvas, font, image, svg, rendertarget, shader, and database.'
  },
  {
    id:    'utility',
    label: 'Utility',
    angle: 102,
    desc:  'All primitives a runtime script needs — math, table, crypto, timer, thread, promise, http, file, and events.'
  },
  {
    id:    'graphics',
    label: 'Graphics',
    angle: 180,
    desc:  'Full visual pipeline control from Lua — sky, global illumination (SDFGI), SSAO/SSR/SSIL, glow, volumetric fog, and runtime shaders.'
  },
  {
    id:    'physics',
    label: 'Physics',
    angle: 231,
    desc:  'Full Godot physics from Lua — rigid, static, character, animatable and vehicle bodies, raycasts, shapecasts, and trigger areas.'
  },
  {
    id:    'audio',
    label: 'Audio',
    angle: 282,
    desc:  'Complete audio control from Lua — 3D playback, per-voice effect chains, looping, and multi-format streaming.'
  },
  {
    id:    'network',
    label: 'Network',
    angle: 333,
    desc:  'Full multiplayer stack — ENet UDP transport, custom packet-batched replication, and automatic physics body sync.'
  }
];

export const Ethos = [
  {
    title: 'Open Source',
    desc:  'No licensing fees, no royalties, no strings attached. Every line of code is yours to inspect, fork, and build on. What you create belongs to you — completely and unconditionally.',
    icon:  <lucide.Star {...config_site.info.lucide}/>
  },
  {
    title: 'Zero Monetization Limits',
    desc:  'No platform cuts, no revenue gates, no forced subscription tiers. Ship free or charge what you want — every dollar goes to you, with no conditions attached.',
    icon:  <lucide.BadgeCheck {...config_site.info.lucide}/>
  },
  {
    title: 'Full Runtime Scripting',
    desc:  'Core, utility, graphics, physics, audio, network — one unified Lua API controlling every layer of the engine at runtime. No recompile cycles, no editor lock-in.',
    icon:  <lucide.Terminal {...config_site.info.lucide}/>
  },
  {
    title: 'Isolated Lua Sandbox',
    desc:  'Per-resource Lua environments with zero access to host internals. Safe for user scripting, modding, and untrusted plugins — each resource runs fully contained.',
    icon:  <lucide.Puzzle {...config_site.info.lucide}/>
  },
  {
    title: 'Multiplayer Native',
    desc:  'ENet transport, a custom packet-batched replication layer with built-in physics body sync, and Lua-level network events built in from the ground up.',
    icon:  <lucide.Cable {...config_site.info.lucide}/>
  },
  {
    title: 'Performance First',
    desc:  'C++17 core with a Lua scripting layer built for speed — direct engine bindings, no interpreter overhead, with throughput continuously tracked against GDScript.',
    icon:  <lucide.CircleGauge {...config_site.info.lucide}/>
  }
];