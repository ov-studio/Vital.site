import * as Icons from 'lucide-react';
import { site } from '@/configs/site';

export const Features_Content = [
  {
    id: 'sandbox',
    label: 'Sandbox',
    angle: 0,
    desc: 'Resource lifecycle, isolated Lua environments, asset streaming, cross-resource exports — runtime backbone of server and client.'
  },
  {
    id: 'core',
    label: 'Core',
    angle: 51,
    desc: 'Models, webviews, canvas, fonts, textures, svgs, rendertargets — programmatic control of every scene entity and surface.'
  },
  {
    id: 'utility',
    label: 'Utility',
    angle: 102,
    desc: 'Crypto, timers, threads, promises, http, file, shrinker, event bus — all primitives a runtime script needs.'
  },
  {
    id: 'graphics',
    label: 'Graphics',
    angle: 180,
    desc: 'Post-processing, global illumination, lighting rigs, runtime shaders, decals, GPU particles — full visual pipeline control from Lua.'
  },
  {
    id: 'physics',
    label: 'Physics',
    angle: 231,
    desc: 'Raycasts, shapecasts, rigid body forces, collision queries, navmesh pathfinding, RVO2 avoidance — full Godot physics surface from Lua.'
  },
  {
    id: 'audio',
    label: 'Audio',
    angle: 282,
    desc: 'Stereo and positional 3D playback, bus routing, effect chains, multi-format streaming — complete audio control from Lua.'
  },
  {
    id: 'network',
    label: 'Network',
    angle: 333,
    desc: 'ENet UDP transport, high-level multiplayer replication, WebSocket, Lua network events, VoIP — the full multiplayer stack.'
  }
];

export const Ethos_Content = [
  {
    title: 'Open Source',
    desc: 'No licensing fees, no royalties, no strings. What you build belongs to you — completely and unconditionally.',
    icon: <Icons.Star {...site.lucide}/>
  },
  {
    title: 'Zero Monetization Limits',
    desc: 'No platform cuts, no revenue gates, no forced systems. Ship free or charge — keep everything either way.',
    icon: <Icons.BadgeCheck {...site.lucide}/>
  },
  {
    title: 'Full Runtime Scripting',
    desc: 'Models, physics, graphics, networking, audio — one unified Lua API controlling every layer of the engine at runtime.',
    icon: <Icons.Terminal {...site.lucide}/>
  },
  {
    title: 'Isolated Lua Sandbox',
    desc: 'Per-resource Lua environments with zero access to host internals. Safe for user scripting, modding, and untrusted plugins.',
    icon: <Icons.Puzzle {...site.lucide}/>
  },
  {
    title: 'Multiplayer Native',
    desc: 'ENet transport, Godot MultiplayerAPI, entity replication, and a Lua-level network event system — multiplayer is a first-class citizen, not an afterthought.',
    icon: <Icons.Cable {...site.lucide}/>
  },
  {
    title: 'Performance First',
    desc: 'C++17 core with a Lua scripting layer running 10–50× faster than GDScript. No interpreter bottlenecks, no bloat — maximum throughput at every layer.',
    icon: <Icons.CircleGauge {...site.lucide}/>
  }
];