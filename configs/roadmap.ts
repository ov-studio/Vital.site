export type FeatureStatus = 'completed' | 'partial' | 'pending';

export interface RoadmapItem {
  label: string;
  status: FeatureStatus;
}

export interface RoadmapCard {
  id: string;
  label: string;
  desc: string;
  icon: string; // SVG path d=
  items: RoadmapItem[];
}

// ── SVG icon paths (24x24 viewBox) ───────────────────────────────────────────
const ICON = {
  cpu:       'M9 3H7a2 2 0 00-2 2v2M9 3h6M9 3v2m6-2h2a2 2 0 012 2v2m-4-4v2M3 9v6m18-6v6M9 21H7a2 2 0 01-2-2v-2m4 4h6m-6 0v-2m6 2h2a2 2 0 002-2v-2m-4 4v-2M9 9h6v6H9z',
  audio:     'M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z',
  input:     'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  physics:   'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  scene:     'M3 7a2 2 0 012-2h4l2 3h8a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z',
  render:    'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  gfx:       'M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 12h16',
  model:     'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  network:   'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
  ui:        'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  light:     'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  camera:    'M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z',
  shader:    'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  tween:     'M13 10V3L4 14h7v7l9-11h-7z',
  particles: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  display:   'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  perf:      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  ws:        'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
  multi:     'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0',
};

export const Roadmap_Content: RoadmapCard[] = [
  // ── CORE RUNTIME ────────────────────────────────────────────────────────────
  {
    id: 'core',
    label: 'Core Runtime',
    desc: 'Threading, timers, crypto, promises, I/O utilities',
    icon: ICON.cpu,
    items: [
      { label: 'Thread & Mutex',          status: 'completed' },
      { label: 'Timer',                   status: 'completed' },
      { label: 'File I/O',                status: 'completed' },
      { label: 'HTTP client',             status: 'completed' },
      { label: 'Crypto',                  status: 'completed' },
      { label: 'Promise',                 status: 'completed' },
      { label: 'Shrinker (minifier)',     status: 'completed' },
      { label: 'Console / Inspect',       status: 'completed' },
    ],
  },

  // ── UI (WEBVIEW) ─────────────────────────────────────────────────────────────
  {
    id: 'ui',
    label: 'UI — Webview',
    desc: 'HTML/CSS/JS rendered into SubViewport',
    icon: ICON.ui,
    items: [
      { label: 'SubViewport bridge',      status: 'completed' },
      { label: 'HTML/CSS rendering',      status: 'completed' },
      { label: 'JS ↔ Lua messaging',      status: 'completed' },
    ],
  },

  // ── RENDERING ────────────────────────────────────────────────────────────────
  {
    id: 'rendering',
    label: 'Rendering',
    desc: 'Canvas, viewports, textures, fonts, SVG',
    icon: ICON.render,
    items: [
      { label: 'Canvas (2D draw API)',    status: 'completed' },
      { label: 'Rendertarget / Viewport', status: 'completed' },
      { label: 'Texture',                 status: 'completed' },
      { label: 'Font',                    status: 'completed' },
      { label: 'SVG',                     status: 'completed' },
      { label: 'Screenshot capture',      status: 'pending'   },
    ],
  },

  // ── GFX / ENVIRONMENT ────────────────────────────────────────────────────────
  {
    id: 'gfx',
    label: 'GFX & Environment',
    desc: 'SSAO, SSIL, SSR, SDFGI, fog, volumetric, adjustment',
    icon: ICON.gfx,
    items: [
      { label: 'SSAO',                    status: 'completed' },
      { label: 'SSIL',                    status: 'completed' },
      { label: 'SSR',                     status: 'completed' },
      { label: 'SDFGI',                   status: 'completed' },
      { label: 'Fog',                     status: 'completed' },
      { label: 'Volumetric Fog',          status: 'completed' },
      { label: 'Adjustment (color grade)',status: 'completed' },
      { label: 'Emissive',                status: 'completed' },
    ],
  },

  // ── MODELS ───────────────────────────────────────────────────────────────────
  {
    id: 'models',
    label: 'Models',
    desc: 'Load/unload, transform, animation, blend shapes',
    icon: ICON.model,
    items: [
      { label: 'Load / unload',           status: 'completed' },
      { label: 'Transform (pos/rot/scale)',status: 'completed' },
      { label: 'Animation player',        status: 'completed' },
      { label: 'Blend shapes',            status: 'completed' },
    ],
  },

  // ── NETWORKING ───────────────────────────────────────────────────────────────
  {
    id: 'networking',
    label: 'Networking',
    desc: 'HTTP, ENet low-level UDP, WebSocket, multiplayer API',
    icon: ICON.network,
    items: [
      { label: 'HTTP (requests)',         status: 'completed' },
      { label: 'ENet (UDP peer)',         status: 'completed' },
      { label: 'WebSocket (WebSocketPeer)',status: 'pending'  },
      { label: 'MultiplayerAPI',          status: 'pending'  },
      { label: 'MultiplayerSpawner',      status: 'pending'  },
      { label: 'MultiplayerSynchronizer', status: 'pending'  },
    ],
  },

  // ── AUDIO ────────────────────────────────────────────────────────────────────
  {
    id: 'audio',
    label: 'Audio',
    desc: 'Playback, 3D positional sound, bus effects',
    icon: ICON.audio,
    items: [
      { label: 'AudioStreamPlayer (2D)',  status: 'pending' },
      { label: 'AudioStreamPlayer3D',     status: 'pending' },
      { label: 'AudioServer',             status: 'pending' },
      { label: 'Bus effects (reverb/EQ)', status: 'pending' },
    ],
  },

  // ── INPUT ────────────────────────────────────────────────────────────────────
  {
    id: 'input',
    label: 'Input',
    desc: 'Keyboard, mouse, gamepad, InputMap bindings',
    icon: ICON.input,
    items: [
      { label: 'Input singleton',         status: 'pending' },
      { label: 'InputEvent',              status: 'pending' },
      { label: 'InputMap',                status: 'pending' },
      { label: 'Gamepad / joy axis',      status: 'pending' },
      { label: 'Mouse position & buttons',status: 'pending' },
    ],
  },

  // ── PHYSICS 3D ───────────────────────────────────────────────────────────────
  {
    id: 'physics3d',
    label: 'Physics 3D',
    desc: 'RigidBody3D, raycasts, shapecasts, collision layers',
    icon: ICON.physics,
    items: [
      { label: 'PhysicsServer3D',         status: 'pending' },
      { label: 'RigidBody3D control',     status: 'pending' },
      { label: 'Raycast / shapecast',     status: 'pending' },
      { label: 'Collision layer queries', status: 'pending' },
      { label: 'PhysicsDirectBodyState3D',status: 'pending' },
    ],
  },

  // ── PHYSICS 2D ───────────────────────────────────────────────────────────────
  {
    id: 'physics2d',
    label: 'Physics 2D',
    desc: '2D raycast, collision queries, rigidbody for platformers',
    icon: ICON.physics,
    items: [
      { label: 'PhysicsServer2D',         status: 'pending' },
      { label: 'RigidBody2D control',     status: 'pending' },
      { label: '2D raycast',              status: 'pending' },
    ],
  },

  // ── NAVIGATION ───────────────────────────────────────────────────────────────
  {
    id: 'navigation',
    label: 'Navigation',
    desc: 'Navmesh queries, agent pathfinding, avoidance',
    icon: ICON.scene,
    items: [
      { label: 'NavigationServer3D',      status: 'pending' },
      { label: 'NavigationAgent3D',       status: 'pending' },
      { label: 'Navmesh region queries',  status: 'pending' },
    ],
  },

  // ── SCENE / NODE TREE ────────────────────────────────────────────────────────
  {
    id: 'scene',
    label: 'Scene & Node Tree',
    desc: 'SceneTree, scene loading, node query, groups',
    icon: ICON.scene,
    items: [
      { label: 'SceneTree access',        status: 'partial' },
      { label: 'Change / reload scene',   status: 'pending' },
      { label: 'Additive scene load',     status: 'pending' },
      { label: 'get_node / find_child',   status: 'pending' },
      { label: 'Node groups',             status: 'pending' },
    ],
  },

  // ── TWEEN ────────────────────────────────────────────────────────────────────
  {
    id: 'tween',
    label: 'Tween',
    desc: 'Interpolate any node property with easing & chaining',
    icon: ICON.tween,
    items: [
      { label: 'Tween.tween_property',    status: 'pending' },
      { label: 'Easing functions',        status: 'pending' },
      { label: 'Sequence / parallel',     status: 'pending' },
    ],
  },

  // ── CAMERA 3D ────────────────────────────────────────────────────────────────
  {
    id: 'camera',
    label: 'Camera 3D',
    desc: 'Camera control, FOV, projection, current camera',
    icon: ICON.camera,
    items: [
      { label: 'Camera3D transform',      status: 'pending' },
      { label: 'FOV / projection',        status: 'pending' },
      { label: 'Set current camera',      status: 'pending' },
    ],
  },

  // ── LIGHTING ─────────────────────────────────────────────────────────────────
  {
    id: 'lighting',
    label: 'Lighting',
    desc: 'Directional, omni, spot lights from Lua',
    icon: ICON.light,
    items: [
      { label: 'DirectionalLight3D',      status: 'pending' },
      { label: 'OmniLight3D',             status: 'pending' },
      { label: 'SpotLight3D',             status: 'pending' },
    ],
  },

  // ── SHADER UNIFORMS ──────────────────────────────────────────────────────────
  {
    id: 'shader',
    label: 'Shader Uniforms',
    desc: 'Set ShaderMaterial uniforms and parameters from Lua',
    icon: ICON.shader,
    items: [
      { label: 'ShaderMaterial.set_shader_parameter', status: 'pending' },
      { label: 'Texture uniform binding', status: 'pending' },
    ],
  },

  // ── GPU PARTICLES ────────────────────────────────────────────────────────────
  {
    id: 'particles',
    label: 'GPU Particles',
    desc: 'GPUParticles3D control, emission, restart from Lua',
    icon: ICON.particles,
    items: [
      { label: 'GPUParticles3D',          status: 'pending' },
      { label: 'Emit / restart',          status: 'pending' },
      { label: 'Process material params', status: 'pending' },
    ],
  },

  // ── DECALS ───────────────────────────────────────────────────────────────────
  {
    id: 'decals',
    label: 'Decals',
    desc: 'Project textures onto surfaces at runtime',
    icon: ICON.render,
    items: [
      { label: 'Decal node control',      status: 'pending' },
      { label: 'Texture assignment',      status: 'pending' },
    ],
  },

  // ── DISPLAY / WINDOW ─────────────────────────────────────────────────────────
  {
    id: 'display',
    label: 'Display & Window',
    desc: 'DisplayServer: resolution, fullscreen, clipboard',
    icon: ICON.display,
    items: [
      { label: 'DisplayServer.window_*',  status: 'pending' },
      { label: 'Fullscreen / borderless', status: 'pending' },
      { label: 'Clipboard get/set',       status: 'pending' },
    ],
  },

  // ── PERFORMANCE ──────────────────────────────────────────────────────────────
  {
    id: 'perf',
    label: 'Performance Monitor',
    desc: 'Read FPS, draw calls, memory from Lua scripts',
    icon: ICON.perf,
    items: [
      { label: 'Performance singleton',   status: 'pending' },
      { label: 'FPS / frame time',        status: 'pending' },
      { label: 'Draw calls & memory',     status: 'pending' },
    ],
  },
];
