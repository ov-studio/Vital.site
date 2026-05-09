export type FeatureStatus = 'completed' | 'partial' | 'pending';

export interface SubFeature {
  label: string;
  status: FeatureStatus;
}

export interface RoadmapCard {
  id: string;
  label: string;
  desc: string;
  icon: string; // SVG path string
  items: SubFeature[];
}

export const Roadmap_Content: RoadmapCard[] = [
  {
    id: 'core',
    label: 'Core',
    desc: 'Foundation layer — cryptography, compression, hardware inspection, and runtime console.',
    icon: 'M10 2L2 6v8l8 4 8-4V6l-8-4zM10 4.5l5.5 2.75L10 10 4.5 7.25 10 4.5zM3.5 7.75L9.25 10.5V15l-5.75-2.875V7.75zM10.75 15v-4.5l5.75-2.875v4.625L10.75 15z',
    items: [
      { label: 'Cryptography (AES, RSA, hashing)', status: 'completed' },
      { label: 'Compression (zlib, lz4)', status: 'completed' },
      { label: 'Hardware inspection API', status: 'partial' },
      { label: 'Runtime console & REPL', status: 'completed' },
      { label: 'Config & environment loader', status: 'pending' },
    ],
  },
  {
    id: 'rendering',
    label: 'Rendering',
    desc: 'Full programmatic control over 2D canvas, textures, fonts, rendertargets, and embedded web content.',
    icon: 'M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 0v12h12V4H4zm2 3h8v2H6V7zm0 4h5v2H6v-2z',
    items: [
      { label: '2D Canvas API', status: 'completed' },
      { label: 'Texture streaming', status: 'completed' },
      { label: 'Custom font rendering', status: 'partial' },
      { label: 'Rendertargets & FBOs', status: 'partial' },
      { label: 'Embedded web content (CEF)', status: 'pending' },
    ],
  },
  {
    id: 'audio',
    label: 'Audio',
    desc: 'Real-time audio playback, spatial sound, DSP effects, and stream mixing at runtime.',
    icon: 'M9 3a1 1 0 00-1 1v3.586L4.707 11H2a1 1 0 00-1 1v4a1 1 0 001 1h2.707L8 20.414V4a1 1 0 011-1zM15 8a1 1 0 10-2 0 5 5 0 010 8 1 1 0 102 0 7 7 0 000-8zm2.071-2.071a1 1 0 10-1.414 1.414A7 7 0 0117.95 12a7 7 0 01-2.293 5.157 1 1 0 001.414 1.414A9 9 0 0020 12a9 9 0 00-2.929-6.571z',
    items: [
      { label: 'PCM / MP3 / OGG playback', status: 'completed' },
      { label: 'Spatial / 3D audio', status: 'partial' },
      { label: 'DSP effects chain', status: 'pending' },
      { label: 'Stream mixing & ducking', status: 'pending' },
      { label: 'Microphone input capture', status: 'pending' },
    ],
  },
  {
    id: 'models',
    label: 'Models',
    desc: 'Load, spawn, transform, animate, and morph 3D assets at runtime.',
    icon: 'M12 2l9 5v10l-9 5-9-5V7l9-5zm0 2.236L5 8.118v7.764l7 3.882 7-3.882V8.118L12 4.236zM12 7a5 5 0 110 10A5 5 0 0112 7zm0 2a3 3 0 100 6 3 3 0 000-6z',
    items: [
      { label: 'GLTF / GLB loader', status: 'completed' },
      { label: 'Runtime spawning & despawning', status: 'completed' },
      { label: 'Transform & hierarchy', status: 'completed' },
      { label: 'Skeletal animation', status: 'partial' },
      { label: 'Morph targets / blend shapes', status: 'pending' },
      { label: 'LOD system', status: 'pending' },
    ],
  },
  {
    id: 'threading',
    label: 'Threading',
    desc: 'Async/await, promises, heartbeats, and low-level thread pooling — modern concurrency without sacrificing control.',
    icon: 'M4 4h4v4H4V4zm8 0h4v4h-4V4zM4 12h4v4H4v-4zm8 0h4v4h-4v-4zM8 8h4v4H8V8z',
    items: [
      { label: 'Async / await primitives', status: 'completed' },
      { label: 'Promise API', status: 'completed' },
      { label: 'Heartbeat scheduler', status: 'completed' },
      { label: 'Thread pool (low-level)', status: 'partial' },
      { label: 'Shared memory channels', status: 'pending' },
    ],
  },
  {
    id: 'networking',
    label: 'Networking',
    desc: 'HTTP, high-performance transport, and precise task scheduling for time-sensitive execution.',
    icon: 'M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm10-8a8 8 0 100 16A8 8 0 0012 4zm-1 4h2v5h-2V8zm0 6h2v2h-2v-2z',
    items: [
      { label: 'HTTP / HTTPS client', status: 'completed' },
      { label: 'WebSocket support', status: 'completed' },
      { label: 'UDP transport layer', status: 'partial' },
      { label: 'Task scheduling & rate limiting', status: 'partial' },
      { label: 'P2P / relay system', status: 'pending' },
    ],
  },
  {
    id: 'sandboxing',
    label: 'Sandboxing',
    desc: 'Full Lua isolation with no access to host internals — safe, extensible, built for user scripting and plugins.',
    icon: 'M12 1L3 5v6c0 5.25 3.75 10.15 9 11.35C17.25 21.15 21 16.25 21 11V5l-9-4zm0 2.18l7 3.12V11c0 4.3-2.97 8.32-7 9.56C7.97 19.32 5 15.3 5 11V6.3l7-3.12zM11 7v6h2V7h-2zm0 8v2h2v-2h-2z',
    items: [
      { label: 'Lua VM isolation', status: 'completed' },
      { label: 'API surface whitelisting', status: 'completed' },
      { label: 'Plugin sandboxed loader', status: 'partial' },
      { label: 'Resource quota enforcement', status: 'pending' },
      { label: 'Hot-reload sandbox', status: 'pending' },
    ],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    desc: 'Native Discord Rich Presence and a pub/sub event system for clean decoupled module communication.',
    icon: 'M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm-8 3a3 3 0 110 6 3 3 0 010-6zm-6 9s1-3 6-3 6 3 6 3H6z',
    items: [
      { label: 'Discord Rich Presence', status: 'completed' },
      { label: 'Pub/sub event bus', status: 'completed' },
      { label: 'Steam API bridge', status: 'pending' },
      { label: 'Webhook dispatcher', status: 'partial' },
      { label: 'OAuth2 provider', status: 'pending' },
    ],
  },
];
