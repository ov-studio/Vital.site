import * as Icons from 'lucide-react';
import * as config_site from '@/configs/site';

export const Features = [
  {
    id: 'sandbox',
    label: 'Sandbox',
    angle: 0,
    desc: 'Runtime backbone of client and server — resource lifecycle, isolated Lua environments, asset streaming, cross-resource exports.'
  },
  {
    id: 'core',
    label: 'Core',
    angle: 51,
    desc: 'Full programmatic control of every scene entity and surface — model, webview, canvas, font, texture, svg, rendertarget.'
  },
  {
    id: 'utility',
    label: 'Utility',
    angle: 102,
    desc: 'All primitives a runtime script needs — crypto, timer, thread, promise, http, file, shrinker, event.'
  },
  {
    id: 'graphics',
    label: 'Graphics',
    angle: 180,
    desc: 'Full visual pipeline control from Lua — post-processing, global illumination, lighting rigs, runtime shaders, decals, GPU particles.'
  },
  {
    id: 'physics',
    label: 'Physics',
    angle: 231,
    desc: 'Full Godot physics surface from Lua — raycasts, shapecasts, rigid body forces, collision queries, navmesh pathfinding, RVO2 avoidance.'
  },
  {
    id: 'audio',
    label: 'Audio',
    angle: 282,
    desc: 'Complete audio control from Lua — stereo and positional 3D playback, bus routing, effect chains, multi-format streaming.'
  },
  {
    id: 'network',
    label: 'Network',
    angle: 333,
    desc: 'Full multiplayer stack — ENet UDP transport, high-level replication, WebSocket, VoIP.'
  }
];

export const Ethos = [
  {
    title: 'Open Source',
    desc: 'No licensing fees, no royalties, no strings. What you build belongs to you — completely and unconditionally.',
    icon: <Icons.Star {...config_site.info.lucide}/>
  },
  {
    title: 'Zero Monetization Limits',
    desc: 'No platform cuts, no revenue gates, no forced systems. Ship free or charge — keep everything either way.',
    icon: <Icons.BadgeCheck {...config_site.info.lucide}/>
  },
  {
    title: 'Full Runtime Scripting',
    desc: 'Models, physics, graphics, networking, audio — one unified Lua API controlling every layer of the engine at runtime.',
    icon: <Icons.Terminal {...config_site.info.lucide}/>
  },
  {
    title: 'Isolated Lua Sandbox',
    desc: 'Per-resource Lua environments with zero access to host internals. Safe for user scripting, modding, and untrusted plugins.',
    icon: <Icons.Puzzle {...config_site.info.lucide}/>
  },
  {
    title: 'Multiplayer Native',
    desc: 'ENet transport, Godot MultiplayerAPI, entity replication, and a Lua-level network event system — multiplayer is a first-class citizen, not an afterthought.',
    icon: <Icons.Cable {...config_site.info.lucide}/>
  },
  {
    title: 'Performance First',
    desc: 'C++17 core with a Lua scripting layer running 10–50× faster than GDScript. No interpreter bottlenecks, no bloat — maximum throughput at every layer.',
    icon: <Icons.CircleGauge {...config_site.info.lucide}/>
  }
];