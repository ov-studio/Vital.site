export type FeatureStatus = 'completed' | 'partial' | 'pending';

export interface RoadmapItem {
  label: string;
  status: FeatureStatus;
}

export interface RoadmapCard {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
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

// Shared stroke props for outline style
const s = { stroke: 'currentColor', strokeWidth: '1.4', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };

const ICON = {
  // ── Sandbox ────────────────────────────────────────────────────────────────
  engineCore: <><rect x="3" y="3" width="14" height="14" rx="2" {...s} /><path d="M7 10h6M10 7v6" {...s} /></>,
  sceneTree: <><path d="M3 4h4v4H3zM13 4h4v4h-4zM8 13h4v4H8z" {...s} /><path d="M5 8v2h8V8M10 13v-2" {...s} /></>,
  resource: <><path d="M4 4h7l5 5v9a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" {...s} /><path d="M11 4v5h5M7 12l3 3 3-3" {...s} /></>,
  console: <><rect x="2" y="4" width="16" height="12" rx="2" {...s} /><path d="M5 9l3 3-3 3M11 15h4" {...s} /></>,
  perfMonitor: <><path d="M2 14l4-6 4 4 3-4 3 3" {...s} /><path d="M2 17h16" {...s} /></>,
  database: <><ellipse cx="10" cy="6" rx="7" ry="2.5" {...s} /><path d="M3 6v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M3 10v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-4" {...s} /></>,
  dbQuery: <><ellipse cx="10" cy="5" rx="6" ry="2" {...s} /><path d="M4 5v3c0 1.1 2.7 2 6 2s6-.9 6-2V5M4 8v3c0 1.1 2.7 2 6 2" {...s} /><path d="M13 14l2 2 4-4" {...s} /></>,

  // ── Utility ────────────────────────────────────────────────────────────────
  inspect: <><circle cx="10" cy="9" r="5" {...s} /><path d="M10 6v3l2 2" {...s} /><path d="M13.5 13.5L17 17" {...s} /></>,
  timer: <><circle cx="10" cy="11" r="7" {...s} /><path d="M10 7v4l3 2" {...s} /><path d="M7 2h6" {...s} /></>,
  promise: <><circle cx="10" cy="10" r="7" {...s} /><path d="M7 10l2 2 4-4" {...s} /></>,
  thread: <><path d="M4 5h12M4 10h12M4 15h12" {...s} /><circle cx="16" cy="5" r="1.5" {...s} /><circle cx="4" cy="10" r="1.5" {...s} /><circle cx="16" cy="15" r="1.5" {...s} /></>,
  fileIO: <><path d="M4 4h7l5 5v9a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" {...s} /><path d="M11 4v5h5M7 13h6M7 16h4" {...s} /></>,
  http: <><circle cx="10" cy="10" r="7" {...s} /><path d="M3 10h14M10 3c-2 2-3 4.5-3 7s1 5 3 7M10 3c2 2 3 4.5 3 7s-1 5-3 7" {...s} /></>,
  crypto: <><rect x="5" y="10" width="10" height="8" rx="1" {...s} /><path d="M7 10V7a3 3 0 016 0v3" {...s} /><circle cx="10" cy="14" r="1" fill="currentColor" stroke="none" /></>,
  shrinker: <><rect x="3" y="3" width="7" height="7" rx="1" {...s} /><rect x="10" y="10" width="7" height="7" rx="1" {...s} /><path d="M10 6h4v4M6 10v4H10" {...s} /></>,
  event: <><path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.9 4.9l2.1 2.1M13 13l2.1 2.1M15.1 4.9l-2.1 2.1M7 13l-2.1 2.1" {...s} /><circle cx="10" cy="10" r="3" {...s} /></>,
  input: <><rect x="2" y="6" width="16" height="10" rx="2" {...s} /><path d="M6 10v2M9 10v2M12 10v2M15 10v2M6 14h8" {...s} /></>,

  // ── UI ─────────────────────────────────────────────────────────────────────
  mainMenu: <><rect x="3" y="3" width="14" height="14" rx="2" {...s} /><path d="M7 8h6M7 11h6M7 14h4" {...s} /></>,
  gameBrowser: <><rect x="2" y="4" width="16" height="12" rx="2" {...s} /><path d="M2 8h16M6 12h8M6 15h5" {...s} /><circle cx="5" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="8" cy="6" r="1" fill="currentColor" stroke="none" /></>,
  displayWindow: <><rect x="2" y="3" width="16" height="13" rx="2" {...s} /><path d="M2 7h16M6 19h8M10 16v3" {...s} /></>,
  webview: <><rect x="2" y="3" width="16" height="13" rx="2" {...s} /><path d="M2 7h16M6 11l2 2-2 2M10 15h4" {...s} /></>,
  canvas: <><rect x="3" y="3" width="14" height="14" rx="2" {...s} /><path d="M6 14l3-5 3 3 2-3 3 5" {...s} /><circle cx="7" cy="7" r="1.5" {...s} /></>,
  font: <><path d="M4 16L8 4l4 12M5.5 12h5" {...s} /><path d="M14 8v8M14 8a2 2 0 012-2h0a2 2 0 012 2v0a2 2 0 01-2 2h-2" {...s} /><path d="M14 12h2a2 2 0 012 2v0a2 2 0 01-2 2h-2" {...s} /></>,
  texture: <><rect x="3" y="3" width="14" height="14" rx="2" {...s} /><path d="M3 13l4-4 3 3 3-3 4 4" {...s} /><circle cx="8" cy="8" r="1.5" {...s} /></>,
  svg: <><rect x="2" y="2" width="16" height="16" rx="2" {...s} /><path d="M5 13l3-5 3 4 2-3 3 4" {...s} /></>,
  rendertarget: <><rect x="2" y="2" width="16" height="16" rx="2" {...s} /><rect x="6" y="6" width="8" height="8" rx="1" {...s} /><path d="M10 2v4M10 14v4M2 10h4M14 10h4" {...s} /></>,
  screenshot: <><path d="M2 8V6a2 2 0 012-2h2M14 4h2a2 2 0 012 2v2M18 12v2a2 2 0 01-2 2h-2M6 16H4a2 2 0 01-2-2v-2" {...s} /><circle cx="10" cy="10" r="3" {...s} /></>,

  // ── Graphics ───────────────────────────────────────────────────────────────
  gfx: <><circle cx="10" cy="10" r="7" {...s} /><path d="M10 5v2M10 13v2M5 10h2M13 10h2M6.8 6.8l1.4 1.4M11.8 11.8l1.4 1.4M13.2 6.8l-1.4 1.4M8.2 11.8l-1.4 1.4" {...s} /></>,
  lighting: <><circle cx="10" cy="10" r="4" {...s} /><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.9 4.9l1.4 1.4M13.7 13.7l1.4 1.4M15.1 4.9l-1.4 1.4M6.3 13.7l-1.4 1.4" {...s} /></>,
  environment: <><path d="M2 15c2-5 4-7 8-7s6 2 8 7" {...s} /><path d="M6 15c1-3 2-4 4-4s3 1 4 4" {...s} /><circle cx="10" cy="5" r="2" {...s} /><path d="M10 2v1" {...s} /></>,
  shaderUniforms: <><path d="M4 4l5 5M4 9l5-5M11 7h6" {...s} /><path d="M4 13l5 5M4 18l5-5M11 15h6" {...s} /></>,
  decals: <><ellipse cx="10" cy="12" rx="6" ry="3" {...s} /><path d="M4 12V8a6 6 0 0112 0v4" {...s} /><path d="M10 9v3" {...s} /></>,
  particles: <><circle cx="10" cy="10" r="1.5" {...s} /><circle cx="5" cy="5" r="1" {...s} /><circle cx="15" cy="5" r="1.5" {...s} /><circle cx="5" cy="15" r="1.5" {...s} /><circle cx="15" cy="15" r="1" {...s} /><circle cx="10" cy="3" r="1" {...s} /><circle cx="17" cy="10" r="1" {...s} /><circle cx="3" cy="10" r="1" {...s} /><circle cx="10" cy="17" r="1" {...s} /></>,

  // ── 3D ─────────────────────────────────────────────────────────────────────
  model: <><path d="M10 2l7 4v8l-7 4-7-4V6z" {...s} /><path d="M10 2v14M3 6l7 4 7-4" {...s} /></>,
  camera3d: <><rect x="2" y="7" width="11" height="8" rx="2" {...s} /><path d="M13 9.5l5-2v7l-5-2" {...s} /></>,
  tween: <><path d="M3 16c2-7 4-9 7-9s5 5 7 9" {...s} /><circle cx="3" cy="16" r="1.5" {...s} /><circle cx="17" cy="16" r="1.5" {...s} /><circle cx="10" cy="7" r="1.5" {...s} /></>,
  meshPrimitives: <><path d="M10 2l7 4v8l-7 4-7-4V6z" {...s} /><path d="M5 5l5 3 5-3M10 8v8" {...s} /></>,

  // ── Physics ────────────────────────────────────────────────────────────────
  physics3d: <><circle cx="10" cy="10" r="7" {...s} /><path d="M10 6v4l3 3M7 17l3-3 3 3" {...s} /></>,
  navigation: <><circle cx="10" cy="10" r="7" {...s} /><path d="M10 5l1.5 4h4l-3 2.5 1 4-3.5-2.5L6.5 15.5l1-4-3-2.5h4z" {...s} /></>,

  // ── Audio ──────────────────────────────────────────────────────────────────
  audio: <><path d="M9 5v10l-4-3H2V8h3l4-3z" {...s} /><path d="M14 7a4 4 0 010 6M16 4a8 8 0 010 12" {...s} /></>,

  // ── Network ────────────────────────────────────────────────────────────────
  enet: <><circle cx="10" cy="10" r="7" {...s} /><path d="M3 10h14M10 3c-2 2-3 4.5-3 7s1 5 3 7M10 3c2 2 3 4.5 3 7s-1 5-3 7" {...s} /></>,
  websocket: <><path d="M4 8a6 6 0 0112 0" {...s} /><path d="M16 12a6 6 0 01-12 0" {...s} /><path d="M8 8l4 4M12 8l-4 4" {...s} /></>,
  multiplayer: <><circle cx="5" cy="5" r="2" {...s} /><circle cx="15" cy="5" r="2" {...s} /><circle cx="10" cy="15" r="2" {...s} /><path d="M5 7v2c0 1.1.9 2 2 2h6a2 2 0 002-2V7M10 13v-2" {...s} /></>,

  // ── Integrations ───────────────────────────────────────────────────────────
  discord: <><path d="M6 4a12 12 0 00-2 7c0 2 .7 3.5 2 4.5.5.4 1 .5 1.5.3L8 14c-.8-.5-1.3-1-1.5-1.8C6.2 11.4 6 10.5 6 9.5c0-2 .8-4 2-5.5" {...s} /><path d="M14 4a12 12 0 012 7c0 2-.7 3.5-2 4.5-.5.4-1 .5-1.5.3L12 14c.8-.5 1.3-1 1.5-1.8.3-.8.5-1.7.5-2.7 0-2-.8-4-2-5.5" {...s} /><circle cx="7.5" cy="10" r="1.5" {...s} /><circle cx="12.5" cy="10" r="1.5" {...s} /></>,
};

export const Roadmap_Section: RoadmapSection[] = build([
  {
    name: 'Sandbox',
    cards: [
      {
        label: 'Engine Core',
        desc: 'Top-level engine singleton access: quit, pause, version, and main loop control',
        icon: ICON.engineCore,
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
        icon: ICON.sceneTree,
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
        desc: 'Runtime resource loading, caching, unloading, and remote downloading via ResourceLoader',
        icon: ICON.resource,
        items: [
          { label: 'ResourceLoader.load (blocking)', status: 'partial' },
          { label: 'ResourceLoader.load_threaded_request', status: 'pending' },
          { label: 'ResourceLoader.load_threaded_get', status: 'pending' },
          { label: 'Resource caching control', status: 'pending' },
          { label: 'Custom resource types', status: 'pending' },
          { label: 'Resource downloader (HTTP fetch to disk)', status: 'pending' },
          { label: 'Download progress callbacks', status: 'pending' },
          { label: 'Checksum validation on download', status: 'pending' },
        ],
      },
      {
        label: 'Console',
        desc: 'Built-in runtime console for commands, debug output, and structured logging',
        icon: ICON.console,
        items: [
          { label: 'engine.print / warn / error', status: 'completed' },
          { label: 'Log levels (info / warn / error)', status: 'completed' },
          { label: 'Inspect (table pretty-print)', status: 'completed' },
          { label: 'Runtime command execution', status: 'completed' },
        ],
      },
      {
        label: 'Performance Monitor',
        desc: 'Read FPS, draw calls, memory, physics step time, and object counts from Lua',
        icon: ICON.perfMonitor,
        items: [
          { label: 'Performance.get (FPS / frame time)', status: 'pending' },
          { label: 'Draw calls & vertices', status: 'pending' },
          { label: 'Static / dynamic memory', status: 'pending' },
          { label: 'Physics step time', status: 'pending' },
          { label: 'Object / node count', status: 'pending' },
        ],
      },
      {
        label: 'Database',
        desc: 'Embedded database interface for persistent structured data storage and retrieval',
        icon: ICON.database,
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
        icon: ICON.dbQuery,
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

  {
    name: 'Utility',
    cards: [
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
        label: 'File I/O',
        desc: 'Read, write, and manage files on disk from within Lua scripts',
        icon: ICON.fileIO,
        items: [
          { label: 'File.read', status: 'completed' },
          { label: 'File.write', status: 'completed' },
          { label: 'File.append', status: 'completed' },
          { label: 'File.exists / delete', status: 'completed' },
          { label: 'Directory listing', status: 'completed' },
        ],
      },
      {
        label: 'HTTP',
        desc: 'Full async HTTP layer for communicating with external REST APIs and asset servers',
        icon: ICON.http,
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
        label: 'Event',
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

  {
    name: 'UI',
    cards: [
      {
        label: 'Main Menu',
        desc: 'Default client entry point — play, settings, credits, and server browser navigation',
        icon: ICON.mainMenu,
        items: [
          { label: 'Main menu scene & layout', status: 'pending' },
          { label: 'Play / browse servers flow', status: 'pending' },
          { label: 'Settings screen', status: 'pending' },
          { label: 'Credits screen', status: 'pending' },
          { label: 'Version & build info display', status: 'pending' },
        ],
      },
      {
        label: 'Game Browser',
        desc: 'In-client server list — query, filter, sort, and join available game servers',
        icon: ICON.gameBrowser,
        items: [
          { label: 'Server list fetch & display', status: 'pending' },
          { label: 'Filter by name / gamemode / region', status: 'pending' },
          { label: 'Sort by player count / ping / name', status: 'pending' },
          { label: 'Direct connect by IP & port', status: 'pending' },
          { label: 'Refresh & auto-refresh interval', status: 'pending' },
          { label: 'Favorite servers list', status: 'pending' },
        ],
      },
      {
        label: 'Display & Window',
        desc: 'DisplayServer — resolution, fullscreen, borderless, DPI, clipboard, and cursor from Lua',
        icon: ICON.displayWindow,
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
      {
        label: 'Webview',
        desc: 'HTML/CSS/JS renderer bridged into a SubViewport with bidirectional Lua ↔ JS messaging',
        icon: ICON.webview,
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
        icon: ICON.canvas,
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
        icon: ICON.font,
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
        icon: ICON.texture,
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
        icon: ICON.rendertarget,
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
        icon: ICON.screenshot,
        items: [
          { label: 'Viewport.get_texture snapshot', status: 'pending' },
          { label: 'Save to PNG / JPG', status: 'pending' },
          { label: 'Region capture (partial frame)', status: 'pending' },
        ],
      },
    ],
  },

  {
    name: 'Graphics',
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
        icon: ICON.lighting,
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
        icon: ICON.environment,
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
        icon: ICON.shaderUniforms,
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
        icon: ICON.decals,
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
        icon: ICON.camera3d,
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
        icon: ICON.meshPrimitives,
        items: [
          { label: 'BoxMesh / SphereMesh / CapsuleMesh', status: 'pending' },
          { label: 'CylinderMesh / PlaneMesh', status: 'pending' },
          { label: 'MeshInstance3D creation', status: 'pending' },
          { label: 'Surface material assignment', status: 'pending' },
        ],
      },
    ],
  },

  {
    name: 'Physics',
    cards: [
      {
        label: 'Physics 3D',
        desc: 'Raycast, shapecast, apply forces and impulses to rigid bodies, and query collision layers from Lua',
        icon: ICON.physics3d,
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
        icon: ICON.navigation,
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

  {
    name: 'Network',
    cards: [
      {
        label: 'ENet Transport',
        desc: 'High-performance UDP peer — reliable, sequenced, and unreliable channels for multiplayer',
        icon: ICON.enet,
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
        icon: ICON.websocket,
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
        icon: ICON.multiplayer,
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
]);