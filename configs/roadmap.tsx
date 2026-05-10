export type FeatureStatus = 'completed' | 'partial' | 'pending';

export interface RoadmapItem {
  label: string;
  status: FeatureStatus;
}

export interface RoadmapCard {
  id: string;
  label: string;
  desc: string;
  icon: string;
  priority?: string;
  items: RoadmapItem[];
}

export interface RoadmapSection {
  name: string;
  cards: RoadmapCard[];
}

type CardInput = Omit<RoadmapCard, 'id'>;
type SectionInput = { name: string; cards: CardInput[] };

function toId(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function build(sections: SectionInput[]): RoadmapSection[] {
  return sections.map(s => ({
    name: s.name,
    cards: s.cards.map(c => ({ ...c, id: toId(c.label) })),
  }));
}

const ICON = {
  cpu: 'M9 3H7a2 2 0 00-2 2v2M9 3h6M9 3v2m6-2h2a2 2 0 012 2v2m-4-4v2M3 9v6m18-6v6M9 21H7a2 2 0 01-2-2v-2m4 4h6m-6 0v-2m6 2h2a2 2 0 002-2v-2m-4 4v-2M9 9h6v6H9z',
  audio: 'M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z',
  input: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  physics: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  scene: 'M3 7a2 2 0 012-2h4l2 3h8a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z',
  render: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  gfx: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 12h16',
  model: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  network: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
  ui: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  light: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  camera: 'M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z',
  shader: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  tween: 'M13 10V3L4 14h7v7l9-11h-7z',
  particles: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  display: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  perf: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  nav: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  decal: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14',
  db: 'M4 7a2 2 0 012-2h12a2 2 0 012 2v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7zm0 6a2 2 0 012-2h12a2 2 0 012 2v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1zm0 6a2 2 0 012-2h12a2 2 0 012 2v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1z',
  discord: 'M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z',
  event: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  string: 'M4 6h16M4 12h16M4 18h7',
  table: 'M3 10h18M3 14h18M10 3v18',
  crypto: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  file: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  promise: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  thread: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  timer: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  shrinker: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
  svg: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  rendertgt: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  inspect: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
};

export const Roadmap_Section: RoadmapSection[] = build([

  // ── SANDBOX RUNTIME ────────────────────────────────────────────────────────
  {
    name: 'Runtime',
    cards: [
      {
        label: 'Thread',
        desc: 'Low-level thread management, pooling, and lifecycle control from Lua',
        icon: ICON.thread,
        items: [
          { label: 'Thread.create', status: 'completed' },
          { label: 'Thread.destroy', status: 'completed' },
          { label: 'Thread.sleep', status: 'completed' },
          { label: 'Thread pool management', status: 'completed' },
          { label: 'Thread lifecycle hooks', status: 'completed' },
        ],
      },
      {
        label: 'Timer',
        desc: 'Precise one-shot and repeating timers with pause, resume, and destroy support',
        icon: ICON.timer,
        items: [
          { label: 'Timer.create (one-shot)', status: 'completed' },
          { label: 'Timer.create (repeating)', status: 'completed' },
          { label: 'Timer.pause / resume', status: 'completed' },
          { label: 'Timer.destroy', status: 'completed' },
          { label: 'Timer.getElapsed', status: 'completed' },
        ],
      },
      {
        label: 'Promise',
        desc: 'Deferred values with full chaining, resolution, rejection, and async/await support',
        icon: ICON.promise,
        items: [
          { label: 'Promise.new', status: 'completed' },
          { label: 'Promise:andThen / catch / finally', status: 'completed' },
          { label: 'Promise.all / race', status: 'completed' },
          { label: 'async / await sugar', status: 'completed' },
          { label: 'Promise cancellation', status: 'completed' },
        ],
      },
      {
        label: 'File I/O',
        desc: 'Read, write, and manage files on disk from within Lua scripts',
        icon: ICON.file,
        items: [
          { label: 'File.read', status: 'completed' },
          { label: 'File.write', status: 'completed' },
          { label: 'File.append', status: 'completed' },
          { label: 'File.exists / delete', status: 'completed' },
          { label: 'Directory listing', status: 'completed' },
        ],
      },
      {
        label: 'HTTP Client',
        desc: 'Full async HTTP layer for communicating with external REST APIs and asset servers',
        icon: ICON.network,
        items: [
          { label: 'HTTP.get / post / put / delete', status: 'completed' },
          { label: 'Custom headers', status: 'completed' },
          { label: 'JSON body serialization', status: 'completed' },
          { label: 'Response streaming', status: 'completed' },
          { label: 'Timeout & retry config', status: 'completed' },
        ],
      },
      {
        label: 'Crypto',
        desc: 'Cryptographic primitives for hashing, signing, and securing sensitive payloads',
        icon: ICON.crypto,
        items: [
          { label: 'SHA-256 / SHA-512 hashing', status: 'completed' },
          { label: 'MD5 hashing', status: 'completed' },
          { label: 'Base64 encode / decode', status: 'completed' },
          { label: 'HMAC signing', status: 'completed' },
          { label: 'Random token generation', status: 'completed' },
        ],
      },
      {
        label: 'Shrinker',
        desc: 'Asset and data compression / decompression to reduce memory footprint and transfer overhead',
        icon: ICON.shrinker,
        items: [
          { label: 'String minification', status: 'completed' },
          { label: 'Lua source shrinker', status: 'completed' },
          { label: 'Data compression (zlib)', status: 'completed' },
          { label: 'Decompression', status: 'completed' },
        ],
      },
      {
        label: 'Console',
        desc: 'Built-in runtime console for commands, debug output, and structured logging',
        icon: ICON.display,
        items: [
          { label: 'engine.print / warn / error', status: 'completed' },
          { label: 'Log levels (info / warn / error)', status: 'completed' },
          { label: 'Inspect (table pretty-print)', status: 'completed' },
          { label: 'Runtime command execution', status: 'completed' },
        ],
      },
    ],
  },

  // ── UTILITIES ─────────────────────────────────────────────────────────────
  {
    name: 'Utility',
    cards: [
      {
        label: 'String',
        desc: 'Extended string manipulation utilities beyond the Lua standard library',
        icon: ICON.string,
        items: [
          { label: 'string.split / trim / pad', status: 'completed' },
          { label: 'string.startsWith / endsWith', status: 'completed' },
          { label: 'string.contains / replace', status: 'completed' },
          { label: 'string.format extensions', status: 'completed' },
          { label: 'UTF-8 aware operations', status: 'partial' },
        ],
      },
      {
        label: 'Table',
        desc: 'Extended table and array utilities for deep operations, sorting, and serialization',
        icon: ICON.table,
        items: [
          { label: 'table.deepCopy / deepMerge', status: 'completed' },
          { label: 'table.contains / indexOf', status: 'completed' },
          { label: 'table.filter / map / reduce', status: 'completed' },
          { label: 'table.serialize / deserialize', status: 'completed' },
          { label: 'table.keys / values / count', status: 'completed' },
        ],
      },
      {
        label: 'Inspect',
        desc: 'Hardware inspection, device fingerprinting, and runtime environment queries',
        icon: ICON.inspect,
        items: [
          { label: 'CPU info (cores, arch)', status: 'completed' },
          { label: 'OS platform detection', status: 'completed' },
          { label: 'Memory usage query', status: 'completed' },
          { label: 'Device fingerprint generation', status: 'completed' },
        ],
      },
      {
        label: 'Event System',
        desc: 'Publish / subscribe event bus for decoupled, reactive module communication',
        icon: ICON.event,
        items: [
          { label: 'event.on / off', status: 'completed' },
          { label: 'event.emit', status: 'completed' },
          { label: 'event.once (auto-unsubscribe)', status: 'completed' },
          { label: 'Heartbeat (recurring tick)', status: 'completed' },
          { label: 'Priority-ordered listeners', status: 'partial' },
        ],
      },
    ],
  },

  // ── ENGINE BRIDGE ─────────────────────────────────────────────────────────
  {
    name: 'Engine Bridge',
    cards: [
      {
        label: 'Engine Core',
        desc: 'Top-level engine singleton access: quit, pause, version, and main loop control',
        icon: ICON.cpu,
        items: [
          { label: 'Engine.get_version_info', status: 'completed' },
          { label: 'Engine.quit', status: 'partial' },
          { label: 'Engine.set_time_scale', status: 'pending' },
          { label: 'Engine.get_frames_per_second', status: 'pending' },
          { label: 'Engine.is_editor_hint', status: 'pending' },
        ],
      },
      {
        label: 'Scene & Node Tree',
        desc: 'SceneTree access, scene switching, additive loading, node queries, and groups',
        icon: ICON.scene,
        priority: 'Must have',
        items: [
          { label: 'SceneTree singleton access', status: 'partial' },
          { label: 'change_scene_to_file', status: 'pending' },
          { label: 'Additive scene load / unload', status: 'pending' },
          { label: 'get_node / find_child', status: 'pending' },
          { label: 'Node groups (add / remove / call)', status: 'pending' },
          { label: 'SceneTree.paused', status: 'pending' },
          { label: 'Node signals (connect / disconnect)', status: 'pending' },
        ],
      },
      {
        label: 'Resource System',
        desc: 'Runtime resource loading, caching, and unloading via ResourceLoader',
        icon: ICON.file,
        items: [
          { label: 'ResourceLoader.load (blocking)', status: 'partial' },
          { label: 'ResourceLoader.load_threaded_request', status: 'pending' },
          { label: 'ResourceLoader.load_threaded_get', status: 'pending' },
          { label: 'Resource caching control', status: 'pending' },
          { label: 'Custom resource types', status: 'pending' },
        ],
      },
      {
        label: 'Performance Monitor',
        desc: 'Read FPS, draw calls, memory, physics step time, and object counts from Lua',
        icon: ICON.perf,
        items: [
          { label: 'Performance.get (FPS / frame time)', status: 'pending' },
          { label: 'Draw calls & vertices', status: 'pending' },
          { label: 'Static / dynamic memory', status: 'pending' },
          { label: 'Physics step time', status: 'pending' },
          { label: 'Object / node count', status: 'pending' },
        ],
      },
    ],
  },

  // ── DATABASE ──────────────────────────────────────────────────────────────
  {
    name: 'Database',
    cards: [
      {
        label: 'Database',
        desc: 'Embedded database interface for persistent structured data storage and retrieval',
        icon: ICON.db,
        items: [
          { label: 'db.connect / disconnect', status: 'completed' },
          { label: 'db.exec (raw query)', status: 'completed' },
          { label: 'Prepared statements', status: 'completed' },
          { label: 'Transaction support', status: 'completed' },
        ],
      },
      {
        label: 'Database Query',
        desc: 'Fluent query builder API — select, insert, update, delete, and filtering',
        icon: ICON.db,
        items: [
          { label: 'query.select / from / where', status: 'completed' },
          { label: 'query.insert / update / delete', status: 'completed' },
          { label: 'query.orderBy / limit / offset', status: 'completed' },
          { label: 'query.join (inner / left)', status: 'completed' },
          { label: 'Async query execution', status: 'completed' },
        ],
      },
    ],
  },

  // ── UI ────────────────────────────────────────────────────────────────────
  {
    name: 'UI',
    cards: [
      {
        label: 'Webview',
        desc: 'HTML/CSS/JS renderer bridged into a SubViewport with bidirectional Lua ↔ JS messaging',
        icon: ICON.ui,
        items: [
          { label: 'SubViewport bridge', status: 'completed' },
          { label: 'HTML / CSS rendering', status: 'completed' },
          { label: 'JS ↔ Lua messaging', status: 'completed' },
          { label: 'loadURL / loadHTML', status: 'completed' },
          { label: 'executeScript from Lua', status: 'completed' },
        ],
      },
      {
        label: 'Canvas',
        desc: '2D drawing API — shapes, images, gradients, and text composited into viewports each frame',
        icon: ICON.render,
        items: [
          { label: '2D Canvas API (draw_rect / circle / line)', status: 'completed' },
          { label: 'Image blitting', status: 'completed' },
          { label: 'Text rendering on canvas', status: 'completed' },
          { label: 'Gradient fills', status: 'partial' },
          { label: 'Clipping regions', status: 'pending' },
        ],
      },
      {
        label: 'Font',
        desc: 'Runtime font loading and text metrics for canvas-level text rendering',
        icon: ICON.render,
        items: [
          { label: 'Format: TTF', status: 'completed' },
          { label: 'Format: OTF', status: 'completed' },
          { label: 'Font size / style variants', status: 'completed' },
          { label: 'Text metrics (width / height)', status: 'partial' },
          { label: 'Bitmap font support', status: 'pending' },
        ],
      },
      {
        label: 'Texture',
        desc: 'Runtime image texture loading, unloading, and sampler configuration',
        icon: ICON.render,
        items: [
          { label: 'Format: JPG', status: 'completed' },
          { label: 'Format: PNG', status: 'completed' },
          { label: 'Format: WEBP', status: 'completed' },
          { label: 'Format: SVG', status: 'completed' },
          { label: 'Format: KTX / DDS (compressed)', status: 'pending' },
          { label: 'Texture unload / cache eviction', status: 'partial' },
        ],
      },
      {
        label: 'SVG',
        desc: 'Vector SVG asset loading and rendering into canvas or viewport surfaces',
        icon: ICON.svg,
        items: [
          { label: 'SVG load from file / string', status: 'completed' },
          { label: 'Render to texture', status: 'completed' },
          { label: 'Resize / scale on render', status: 'completed' },
        ],
      },
      {
        label: 'Rendertarget',
        desc: 'Off-screen render surfaces — create, bind, and sample as textures in the scene',
        icon: ICON.rendertgt,
        items: [
          { label: 'SubViewport creation / destruction', status: 'completed' },
          { label: 'Render-to-texture binding', status: 'completed' },
          { label: 'Viewport texture sampling', status: 'completed' },
          { label: 'MSAA on rendertarget', status: 'pending' },
        ],
      },
      {
        label: 'Screenshot Capture',
        desc: 'Grab the current viewport frame as a raw image or save directly to disk',
        icon: ICON.render,
        items: [
          { label: 'Viewport.get_texture snapshot', status: 'pending' },
          { label: 'Save to PNG / JPG', status: 'pending' },
          { label: 'Region capture (partial frame)', status: 'pending' },
        ],
      },
    ],
  },

  // ── RENDERING ─────────────────────────────────────────────────────────────
  {
    name: 'Rendering',
    cards: [
      {
        label: 'GFX',
        desc: 'Post-process and global illumination effects — SSAO, SSIL, SSR, SDFGI, fog, volumetric, adjustment',
        icon: ICON.gfx,
        items: [
          { label: 'Adjustment (brightness / contrast / saturation)', status: 'completed' },
          { label: 'Emissive glow', status: 'completed' },
          { label: 'SSR (Screen-Space Reflections)', status: 'completed' },
          { label: 'SSIL (Screen-Space Indirect Lighting)', status: 'completed' },
          { label: 'SDFGI (Signed Distance Field GI)', status: 'completed' },
          { label: 'SSAO (Screen-Space Ambient Occlusion)', status: 'completed' },
          { label: 'Fog (height & depth)', status: 'completed' },
          { label: 'Volumetric Fog', status: 'completed' },
        ],
      },
      {
        label: 'Lighting',
        desc: 'Create and configure DirectionalLight, OmniLight, and SpotLight — color, energy, shadows, and range from Lua',
        icon: ICON.light,
        items: [
          { label: 'DirectionalLight3D (create / config)', status: 'pending' },
          { label: 'OmniLight3D (create / config)', status: 'pending' },
          { label: 'SpotLight3D (create / config)', status: 'pending' },
          { label: 'Shadow mode & bias control', status: 'pending' },
          { label: 'Light bake mode', status: 'pending' },
        ],
      },
      {
        label: 'Environment',
        desc: 'World environment overrides — sky, ambient light, tonemap, and background from Lua',
        icon: ICON.light,
        items: [
          { label: 'WorldEnvironment access', status: 'pending' },
          { label: 'Sky / panorama background', status: 'pending' },
          { label: 'Ambient light color & energy', status: 'pending' },
          { label: 'Tonemap mode (ACES / Filmic)', status: 'pending' },
          { label: 'Exposure & white balance', status: 'pending' },
        ],
      },
      {
        label: 'Shader Uniforms',
        desc: 'Set ShaderMaterial parameters and texture uniforms at runtime from Lua',
        icon: ICON.shader,
        items: [
          { label: 'ShaderMaterial.set_shader_parameter', status: 'pending' },
          { label: 'Texture uniform binding', status: 'pending' },
          { label: 'Float / vec2 / vec3 / color uniforms', status: 'pending' },
          { label: 'Per-instance uniform override', status: 'pending' },
        ],
      },
      {
        label: 'Decals',
        desc: 'Project textures onto surfaces at runtime — bullet holes, footprints, and damage overlays',
        icon: ICON.decal,
        items: [
          { label: 'Decal node creation / placement', status: 'pending' },
          { label: 'Texture assignment per channel', status: 'pending' },
          { label: 'Size, fade distance, modulate', status: 'pending' },
        ],
      },
      {
        label: 'GPU Particles',
        desc: 'GPUParticles3D control — emission, restart, and process material parameters from Lua',
        icon: ICON.particles,
        items: [
          { label: 'GPUParticles3D node access', status: 'pending' },
          { label: 'Emit / restart / one-shot', status: 'pending' },
          { label: 'Amount, lifetime, speed scale', status: 'pending' },
          { label: 'Process material param overrides', status: 'pending' },
          { label: 'Trail & sub-emitters', status: 'pending' },
        ],
      },
    ],
  },

  // ── 3D WORLD ──────────────────────────────────────────────────────────────
  {
    name: '3D',
    cards: [
      {
        label: 'Model',
        desc: 'Load, instantiate, transform, animate, and manage 3D model assets at runtime',
        icon: ICON.model,
        items: [
          { label: 'Format: GLB / GLTF', status: 'completed' },
          { label: 'Load / unload by name', status: 'completed' },
          { label: 'Instantiate / destroy instances', status: 'completed' },
          { label: 'Transform (position / rotation / scale)', status: 'completed' },
          { label: 'Animation player (play / stop / seek)', status: 'completed' },
          { label: 'Blend shapes (morph targets)', status: 'completed' },
          { label: 'Component / mesh visibility', status: 'completed' },
          { label: 'Material override per component', status: 'completed' },
          { label: 'Skeleton & bone transforms', status: 'pending' },
          { label: 'LOD (Level of Detail) control', status: 'pending' },
        ],
      },
      {
        label: 'Camera 3D',
        desc: 'FOV, near/far clip, projection mode, and per-camera environment override from Lua',
        icon: ICON.camera,
        items: [
          { label: 'Camera3D transform (position / rotation)', status: 'pending' },
          { label: 'FOV / orthographic size', status: 'pending' },
          { label: 'Near / far clip plane', status: 'pending' },
          { label: 'Projection mode (perspective / ortho)', status: 'pending' },
          { label: 'set_current (make active)', status: 'pending' },
          { label: 'Per-camera environment override', status: 'pending' },
          { label: 'Frustum culling mask', status: 'pending' },
        ],
      },
      {
        label: 'Tween',
        desc: 'Interpolate any node property smoothly with easing functions, chaining, and parallel playback',
        icon: ICON.tween,
        priority: 'Must have',
        items: [
          { label: 'Tween.tween_property', status: 'pending' },
          { label: 'Tween.tween_callback', status: 'pending' },
          { label: 'Tween.tween_interval', status: 'pending' },
          { label: 'Easing & transition types', status: 'pending' },
          { label: 'Sequence / parallel / chained', status: 'pending' },
          { label: 'Pause / resume / kill', status: 'pending' },
        ],
      },
      {
        label: 'MeshInstance & Primitives',
        desc: 'Create primitive meshes (box, sphere, capsule, cylinder) and control MeshInstance3D from Lua',
        icon: ICON.model,
        items: [
          { label: 'BoxMesh / SphereMesh / CapsuleMesh', status: 'pending' },
          { label: 'CylinderMesh / PlaneMesh', status: 'pending' },
          { label: 'MeshInstance3D creation', status: 'pending' },
          { label: 'Surface material assignment', status: 'pending' },
        ],
      },
    ],
  },

  // ── PHYSICS ───────────────────────────────────────────────────────────────
  {
    name: 'Physics',
    cards: [
      {
        label: 'Physics 3D',
        desc: 'Raycast, shapecast, apply forces and impulses to rigid bodies, and query collision layers from Lua',
        icon: ICON.physics,
        priority: 'Must have',
        items: [
          { label: 'PhysicsServer3D singleton access', status: 'pending' },
          { label: 'RigidBody3D — apply_force / impulse', status: 'pending' },
          { label: 'RigidBody3D — linear / angular velocity', status: 'pending' },
          { label: 'Raycast (intersect_ray)', status: 'pending' },
          { label: 'Shapecast (intersect_shape)', status: 'pending' },
          { label: 'Collision layer / mask queries', status: 'pending' },
          { label: 'PhysicsDirectBodyState3D access', status: 'pending' },
          { label: 'StaticBody3D / CharacterBody3D', status: 'pending' },
        ],
      },
      {
        label: 'Navigation',
        desc: 'Agent pathfinding, steering avoidance, and navmesh queries — essential for NPC and AI movement',
        icon: ICON.nav,
        priority: 'Must have',
        items: [
          { label: 'NavigationServer3D singleton access', status: 'pending' },
          { label: 'NavigationAgent3D (target / velocity)', status: 'pending' },
          { label: 'get_simple_path (point-to-point)', status: 'pending' },
          { label: 'Navmesh region queries', status: 'pending' },
          { label: 'Avoidance (RVO2)', status: 'pending' },
          { label: 'Navigation layers', status: 'pending' },
        ],
      },
    ],
  },

  // ── INPUT ─────────────────────────────────────────────────────────────────
  {
    name: 'Input',
    cards: [
      {
        label: 'Input',
        desc: 'Key state, mouse position and buttons, scroll delta, gamepad axes, and action map from Lua',
        icon: ICON.input,
        priority: 'Must have',
        items: [
          { label: 'Input singleton access', status: 'pending' },
          { label: 'is_key_pressed / just_pressed / just_released', status: 'pending' },
          { label: 'Mouse position & relative motion', status: 'pending' },
          { label: 'Mouse button state & scroll delta', status: 'pending' },
          { label: 'Mouse capture / visibility mode', status: 'pending' },
          { label: 'Gamepad / joystick axis & buttons', status: 'pending' },
          { label: 'InputMap action queries', status: 'pending' },
          { label: 'InputEvent pass-through (process_event)', status: 'pending' },
        ],
      },
    ],
  },

  // ── AUDIO ─────────────────────────────────────────────────────────────────
  {
    name: 'Audio',
    cards: [
      {
        label: 'Audio',
        desc: 'Play, stop, pause, and seek streams. Flat 2D audio and 3D positional sound with attenuation from Lua',
        icon: ICON.audio,
        priority: 'Must have',
        items: [
          { label: 'AudioStreamPlayer (2D flat)', status: 'pending' },
          { label: 'AudioStreamPlayer3D (positional)', status: 'pending' },
          { label: 'Play / stop / pause / seek', status: 'pending' },
          { label: 'Volume (linear & dB) control', status: 'pending' },
          { label: 'Pitch scale control', status: 'pending' },
          { label: 'Attenuation model & max distance', status: 'pending' },
          { label: 'AudioServer bus routing', status: 'pending' },
          { label: 'Bus effects (Reverb / EQ / Limiter)', status: 'pending' },
          { label: 'AudioStream format: OGG / WAV / MP3', status: 'pending' },
        ],
      },
    ],
  },

  // ── NETWORKING ────────────────────────────────────────────────────────────
  {
    name: 'Networking',
    cards: [
      {
        label: 'ENet Transport',
        desc: 'High-performance UDP peer — reliable, sequenced, and unreliable channels for multiplayer',
        icon: ICON.network,
        items: [
          { label: 'ENet peer connect / disconnect', status: 'completed' },
          { label: 'Reliable channel send / receive', status: 'completed' },
          { label: 'Unreliable / sequenced channels', status: 'completed' },
          { label: 'Bandwidth limiting', status: 'completed' },
          { label: 'Ping & round-trip time', status: 'partial' },
        ],
      },
      {
        label: 'WebSocket',
        desc: 'Full-duplex WebSocket client and server for real-time browser and service communication',
        icon: ICON.network,
        items: [
          { label: 'WebSocketPeer.connect_to_url', status: 'pending' },
          { label: 'send / receive (text & binary)', status: 'pending' },
          { label: 'WebSocketServer (listen / accept)', status: 'pending' },
          { label: 'TLS / WSS support', status: 'pending' },
        ],
      },
      {
        label: 'Multiplayer API',
        desc: 'High-level multiplayer with RPC, spawning, and state synchronization from Lua',
        icon: ICON.network,
        items: [
          { label: 'MultiplayerAPI setup', status: 'pending' },
          { label: 'RPC (reliable / unreliable)', status: 'pending' },
          { label: 'MultiplayerSpawner', status: 'pending' },
          { label: 'MultiplayerSynchronizer', status: 'pending' },
          { label: 'Authority / peer ID management', status: 'pending' },
        ],
      },
    ],
  },

  // ── INTEGRATIONS ──────────────────────────────────────────────────────────
  {
    name: 'Integrations',
    cards: [
      {
        label: 'Discord SDK',
        desc: 'Native Discord Rich Presence — dynamic state, player count, images, and invite links',
        icon: ICON.discord,
        items: [
          { label: 'Rich Presence state & details', status: 'completed' },
          { label: 'Large / small image keys', status: 'completed' },
          { label: 'Player count placeholders', status: 'completed' },
          { label: 'Discord invite link integration', status: 'completed' },
          { label: 'Dynamic updates at runtime', status: 'completed' },
        ],
      },
    ],
  },

  // ── SYSTEM ────────────────────────────────────────────────────────────────
  {
    name: 'System',
    cards: [
      {
        label: 'Display & Window',
        desc: 'DisplayServer — resolution, fullscreen, borderless, DPI, clipboard, and cursor from Lua',
        icon: ICON.display,
        items: [
          { label: 'window_get / set_size', status: 'pending' },
          { label: 'Fullscreen / borderless / maximized', status: 'pending' },
          { label: 'Window title & icon', status: 'pending' },
          { label: 'Clipboard get / set', status: 'pending' },
          { label: 'Cursor mode (visible / hidden / captured)', status: 'pending' },
          { label: 'DPI / scale factor query', status: 'pending' },
          { label: 'Multi-monitor screen info', status: 'pending' },
        ],
      },
    ],
  },

]);