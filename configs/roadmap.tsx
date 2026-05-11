import * as Icons from 'lucide-react';

const IC = { size: 18, strokeWidth: 2 };

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

export const Roadmap_Section: RoadmapSection[] = build([
  {
    name: 'Sandbox',
    cards: [
      {
        // TODO: WIP
        label: 'Engine Core',
        desc: 'Top-level engine singleton access: quit, pause, version, and main loop control',
        icon: <Icons.Cpu {...IC} />,
        items: [
          { label: 'Engine.get_version_info', status: 'completed' },
          { label: 'Engine.quit', status: 'partial' },
          { label: 'Engine.set_time_scale', status: 'pending' },
          { label: 'Engine.get_frames_per_second', status: 'pending' },
          { label: 'Engine.is_editor_hint', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'Scene & Node Tree',
        desc: 'SceneTree access, scene switching, additive loading, node queries, and groups',
        icon: <Icons.GitBranch {...IC} />,
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
        label: 'Console',
        desc: 'Built-in runtime console for commands, debug output, and structured logging',
        icon: <Icons.Terminal {...IC} />,
        items: [
          { label: 'Log levels (sbox / info / warn / error)', status: 'completed' },
          { label: '[Shared] Command: help', status: 'completed' },
          { label: '[Server] Command: info', status: 'pending' },
          { label: '[Shared] Command: version', status: 'completed' },
          { label: '[Shared] Command: clear', status: 'completed' },
          { label: '[Server] Command: srun <code>', status: 'completed' },
          { label: '[Server] Command: kick <id>', status: 'pending' },
          { label: '[Server] Command: players', status: 'pending' },
          { label: '[Server] Command: refresh', status: 'completed' },
          { label: '[Server] Command: start <name>', status: 'completed' },
          { label: '[Server] Command: stop <name>', status: 'completed' },
          { label: '[Server] Command: restart <name>', status: 'completed' },
          { label: '[Server] Command: start_all', status: 'completed' },
          { label: '[Server] Command: stop_all', status: 'completed' },
          { label: '[Server] Command: restart_all', status: 'completed' },
          { label: '[Server] Command: shutdown', status: 'completed' },
          { label: '[Client] Command: crun <code>', status: 'completed' },
          { label: '[Client] Command: connect <ip> <port>', status: 'pending' },
          { label: '[Client] Command: disconnect', status: 'pending' },
          { label: '[Client] Command: status', status: 'pending' }
        ],
      },
      {
        label: 'Resource System',
        desc: 'Runtime resource loading, caching, unloading, and remote downloading via ResourceLoader',
        icon: <Icons.FolderOpen {...IC} />,
        items: [
          { label: '[Server] Resource scannner', status: 'completed' },
          { label: '[Shared] Resource loader', status: 'partial' },
          { label: '[Shared] Resource unloader', status: 'completed' },
          { label: '[Shared] Resource cache', status: 'completed' },
          { label: '[Shared] Resource compression', status: 'completed' },
          { label: '[Shared] Resource streaming via HTTP', status: 'completed' }
        ],
      },
      {
        // TODO: WIP
        label: 'Performance Monitor',
        desc: 'Read FPS, draw calls, memory, physics step time, and object counts from Lua',
        icon: <Icons.Activity {...IC} />,
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
        icon: <Icons.Database {...IC} />,
        items: [
          { label: 'MySQL support', status: 'completed' },
          { label: 'ORM-style query with chainable methods', status: 'completed' },
          { label: 'Async query execution', status: 'completed' },
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'API: database.create', status: 'completed' },
          { label: 'API: self<database>:is_connected', status: 'completed' },
          { label: 'API: self<database>:define', status: 'completed' },
          { label: 'API: self<database>:sync', status: 'completed' },
          { label: 'API: self<database>:table', status: 'completed' },
          { label: 'API: self<db_query>:fetch', status: 'completed' },
          { label: 'API: self<db_query>:alter', status: 'completed' },
          { label: 'API: self<db_query>:drop', status: 'completed' },
          { label: 'API: self<db_query>:truncate', status: 'completed' },
          { label: 'API: self<db_query>:execute', status: 'completed' },
          { label: 'API: self<db_query>:select', status: 'completed' },
          { label: 'API: self<db_query>:where', status: 'completed' },
          { label: 'API: self<db_query>:insert', status: 'completed' },
          { label: 'API: self<db_query>:delete', status: 'completed' },
          { label: 'API: self<db_query>:update', status: 'completed' }
        ],
      },
    ],
  },

  {
    name: 'Utility',
    cards: [
      {
        label: 'Timer',
        desc: 'Precise one-shot and repeating timer scheduling with millisecond accuracy',
        icon: <Icons.Timer {...IC} />,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Customizable interval', status: 'completed' },
          { label: 'Customizable executions', status: 'completed' },
          { label: 'API: timer.create', status: 'completed' }
        ],
      },
      {
        label: 'Promise',
        desc: 'Deferred values with full chaining, resolution, rejection, and async/await support',
        icon: <Icons.CheckCircle {...IC} />,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'API: promise.create', status: 'completed' },
          { label: 'API: self<promise>:is_pending', status: 'completed' },
          { label: 'API: self<promise>:resolve', status: 'completed' },
          { label: 'API: self<promise>:reject', status: 'completed' }
        ],
      },
      {
        label: 'Thread',
        desc: 'Low-level thread management, pooling, and lifecycle control from Lua',
        icon: <Icons.Layers {...IC} />,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'API: thread.create', status: 'completed' },
          { label: 'API: thread.current', status: 'completed' },
          { label: 'API: self<thread>:resume', status: 'completed' },
          { label: 'API: self<thread>:pause', status: 'completed' },
          { label: 'API: self<thread>:sleep', status: 'completed' },
          { label: 'API: self<thread>:await', status: 'completed' }
        ],
      },
      {
        label: 'File I/O',
        desc: 'Read, write, and manage files on disk from within Lua scripts',
        icon: <Icons.FileText {...IC} />,
        items: [
          { label: 'API: file.exists', status: 'completed' },
          { label: 'API: file.size', status: 'completed' },
          { label: 'API: file.hash', status: 'completed' },
          { label: 'API: file.delete', status: 'completed' },
          { label: 'API: file.read', status: 'completed' },
          { label: 'API: file.write', status: 'completed' },
          { label: 'API: file.contents', status: 'completed' }
        ],
      },
      {
        label: 'HTTP',
        desc: 'Full async HTTP layer for communicating with external REST APIs and asset servers',
        icon: <Icons.Globe {...IC} />,
        items: [
          { label: 'Customizable headers', status: 'completed' },
          { label: 'Customizable timeout', status: 'completed' },
          { label: 'API: http.get', status: 'completed' },
          { label: 'API: http.post', status: 'completed' },
        ],
      },
      {
        label: 'Crypto',
        desc: 'Cryptographic primitives for hashing, signing, and securing sensitive payloads',
        icon: <Icons.Lock {...IC} />,
        items: [
          { label: 'SHA1 hashing', status: 'completed' },
          { label: 'SHA224 hashing', status: 'completed' },
          { label: 'SHA256 hashing', status: 'completed' },
          { label: 'SHA384 hashing', status: 'completed' },
          { label: 'SHA512 hashing', status: 'completed' },
          { label: 'Base64 encoding / decoding', status: 'completed' },
          { label: 'AES128 encryption / decryption', status: 'completed' },
          { label: 'AES192 encryption / decryption', status: 'completed' },
          { label: 'AES256 encryption / decryption', status: 'completed' },
          { label: 'API: crypto.hash', status: 'completed' },
          { label: 'API: crypto.encode', status: 'completed' },
          { label: 'API: crypto.decode', status: 'completed' },
          { label: 'API: crypto.encrypt', status: 'completed' },
          { label: 'API: crypto.decrypt', status: 'completed' }
        ],
      },
      {
        label: 'Shrinker',
        desc: 'Asset and data compression / decompression to reduce memory footprint and transfer overhead',
        icon: <Icons.Package {...IC} />,
        items: [
          { label: 'Data compression via zstd library', status: 'completed' },
          { label: 'API: shrinker.compress', status: 'completed' },
          { label: 'API: shrinker.decompress', status: 'completed' }
        ],
      },
      {
        // TODO: WIP
        label: 'Inspect',
        desc: 'Hardware inspection, device fingerprinting, and runtime environment queries',
        icon: <Icons.ScanSearch {...IC} />,
        items: [
          { label: 'CPU info (cores, arch)', status: 'completed' },
          { label: 'OS platform detection', status: 'completed' },
          { label: 'Memory usage query', status: 'completed' },
          { label: 'Device fingerprint generation', status: 'completed' },
        ],
      },
      {
        label: 'Event',
        desc: 'Publish / subscribe event bus for decoupled, reactive module communication',
        icon: <Icons.Zap {...IC} />,
        items: [
          { label: 'event.on / off', status: 'completed' },
          { label: 'event.emit', status: 'completed' },
          { label: 'event.once (auto-unsubscribe)', status: 'completed' },
          { label: 'Heartbeat (recurring tick)', status: 'completed' },
          { label: 'Priority-ordered listeners', status: 'partial' },
        ],
      },
      {
        // TODO: WIP
        label: 'Input',
        desc: 'Key state, mouse position and buttons, scroll delta, gamepad axes, and action map from Lua',
        icon: <Icons.Gamepad2 {...IC} />,
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
        // TODO: WIP
        label: 'Main Menu',
        desc: 'Default client entry point — play, settings, credits, and server browser navigation',
        icon: <Icons.LayoutDashboard {...IC} />,
        items: [
          { label: 'Main menu scene & layout', status: 'pending' },
          { label: 'Play / browse servers flow', status: 'pending' },
          { label: 'Settings screen', status: 'pending' },
          { label: 'Credits screen', status: 'pending' },
          { label: 'Version & build info display', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'Game Browser',
        desc: 'In-client server list — query, filter, sort, and join available game servers',
        icon: <Icons.Server {...IC} />,
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
        // TODO: WIP
        label: 'Display & Window',
        desc: 'DisplayServer — resolution, fullscreen, borderless, DPI, clipboard, and cursor from Lua',
        icon: <Icons.Monitor {...IC} />,
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
        desc: 'HTML/CSS/JS renderer with bidirectional Lua - JS messaging',
        icon: <Icons.Code2 {...IC} />,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Bidirectional Lua - JS messaging', status: 'completed' },
          { label: 'Serve files over HTTP instead of file://', status: 'pending' },
          { label: 'API: webview.create', status: 'completed' },
          { label: 'API: self<webview>:is_visible', status: 'completed' },
          { label: 'API: self<webview>:is_fullscreen', status: 'completed' },
          { label: 'API: self<webview>:is_transparent', status: 'completed' },
          { label: 'API: self<webview>:is_incognito', status: 'completed' },
          { label: 'API: self<webview>:is_autoplay', status: 'completed' },
          { label: 'API: self<webview>:is_zoomable', status: 'completed' },
          { label: 'API: self<webview>:is_devtools_visible', status: 'completed' },
          { label: 'API: self<webview>:get_position', status: 'completed' },
          { label: 'API: self<webview>:get_size', status: 'completed' },
          { label: 'API: self<webview>:set_position', status: 'completed' },
          { label: 'API: self<webview>:set_size', status: 'completed' },
          { label: 'API: self<webview>:set_visible', status: 'completed' },
          { label: 'API: self<webview>:set_devtools_visible', status: 'completed' },
          { label: 'API: self<webview>:set_message_handler', status: 'completed' },
          { label: 'API: self<webview>:load_url', status: 'completed' },
          { label: 'API: self<webview>:load_html', status: 'completed' },
          { label: 'API: self<webview>:clear_history', status: 'completed' },
          { label: 'API: self<webview>:focus', status: 'completed' },
          { label: 'API: self<webview>:reload', status: 'completed' },
          { label: 'API: self<webview>:zoom', status: 'completed' },
          { label: 'API: self<webview>:update', status: 'completed' },
          { label: 'API: self<webview>:eval', status: 'completed' },
          { label: 'API: self<webview>:emit', status: 'completed' }
        ],
      },
      {
        // TODO: WIP
        label: 'Canvas',
        desc: '2D drawing API — shapes, images, gradients, and text composited into viewports each frame',
        icon: <Icons.PenTool {...IC} />,
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
        desc: 'Runtime font loading for canvas-level text rendering',
        icon: <Icons.Type {...IC} />,
        items: [
          { label: 'Support format: TTF', status: 'completed' },
          { label: 'Support format: OTF', status: 'completed' },
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'API: font.create', status: 'completed' },
          { label: 'API: self<font>:get_antialiasing', status: 'completed' },
          { label: 'API: self<font>:get_oversampling', status: 'completed' },
          { label: 'API: self<font>:set_antialiasing', status: 'completed' },
          { label: 'API: self<font>:set_oversampling', status: 'completed' }
        ],
      },
      {
        label: 'Texture',
        desc: 'Runtime image texture loading, unloading, and rendering',
        icon: <Icons.Image {...IC} />,
        items: [
          { label: 'Support format: JPG', status: 'completed' },
          { label: 'Support format: PNG', status: 'completed' },
          { label: 'Support format: WEBP', status: 'completed' },
          { label: 'Support format: KTX / DDS (compressed)', status: 'pending' },
          { label: 'Texture cache', status: 'partial' },
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'API: texture.create', status: 'completed' }
        ],
      },
      {
        label: 'SVG',
        desc: 'Runtime vector svg loading, unloading, and rendering',
        icon: <Icons.FileCode {...IC} />,
        items: [
          { label: 'Support format: SVG', status: 'completed' },
          { label: 'SVG loading/updating from a raw string buffer', status: 'completed' },
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'API: svg.create', status: 'completed' },
          { label: 'API: svg.create_from_raw', status: 'completed' },
          { label: 'API: self<svg>:update', status: 'completed' }
        ],
      },
      {
        // TODO: WIP
        label: 'Rendertarget',
        desc: 'Off-screen render surfaces — create, bind, and sample as textures in the scene',
        icon: <Icons.Tv2 {...IC} />,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'SubViewport creation / destruction', status: 'completed' },
          { label: 'Render-to-texture binding', status: 'completed' },
          { label: 'Viewport texture sampling', status: 'completed' },
          { label: 'MSAA on rendertarget', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'Screenshot Capture',
        desc: 'Grab the current viewport frame as a raw image or save directly to disk',
        icon: <Icons.Camera {...IC} />,
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
        // TODO: WIP
        label: 'GFX',
        desc: 'Post-process and global illumination effects — SSAO, SSIL, SSR, SDFGI, fog, volumetric, adjustment',
        icon: <Icons.Sparkles {...IC} />,
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
        // TODO: WIP
        label: 'Lighting',
        desc: 'Create and configure DirectionalLight, OmniLight, and SpotLight — color, energy, shadows, and range from Lua',
        icon: <Icons.Sun {...IC} />,
        items: [
          { label: 'DirectionalLight3D (create / config)', status: 'pending' },
          { label: 'OmniLight3D (create / config)', status: 'pending' },
          { label: 'SpotLight3D (create / config)', status: 'pending' },
          { label: 'Shadow mode & bias control', status: 'pending' },
          { label: 'Light bake mode', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'Environment',
        desc: 'World environment overrides — sky, ambient light, tonemap, and background from Lua',
        icon: <Icons.Cloud {...IC} />,
        items: [
          { label: 'WorldEnvironment access', status: 'pending' },
          { label: 'Sky / panorama background', status: 'pending' },
          { label: 'Ambient light color & energy', status: 'pending' },
          { label: 'Tonemap mode (ACES / Filmic)', status: 'pending' },
          { label: 'Exposure & white balance', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'Shader Uniforms',
        desc: 'Set ShaderMaterial parameters and texture uniforms at runtime from Lua',
        icon: <Icons.Sliders {...IC} />,
        items: [
          { label: 'ShaderMaterial.set_shader_parameter', status: 'pending' },
          { label: 'Texture uniform binding', status: 'pending' },
          { label: 'Float / vec2 / vec3 / color uniforms', status: 'pending' },
          { label: 'Per-instance uniform override', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'Decals',
        desc: 'Project textures onto surfaces at runtime — bullet holes, footprints, and damage overlays',
        icon: <Icons.Stamp {...IC} />,
        items: [
          { label: 'Decal node creation / placement', status: 'pending' },
          { label: 'Texture assignment per channel', status: 'pending' },
          { label: 'Size, fade distance, modulate', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'GPU Particles',
        desc: 'GPUParticles3D control — emission, restart, and process material parameters from Lua',
        icon: <Icons.Wind {...IC} />,
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
        // TODO: WIP
        label: 'Model',
        desc: 'Load, instantiate, transform, animate, and manage 3D model assets at runtime',
        icon: <Icons.Box {...IC} />,
        items: [
          { label: 'Support format: GLB / GLTF', status: 'completed' },
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
        // TODO: WIP
        label: 'Camera 3D',
        desc: 'FOV, near/far clip, projection mode, and per-camera environment override from Lua',
        icon: <Icons.Video {...IC} />,
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
        // TODO: WIP
        label: 'Tween',
        desc: 'Interpolate any node property smoothly with easing functions, chaining, and parallel playback',
        icon: <Icons.TrendingUp {...IC} />,
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
        // TODO: WIP
        label: 'MeshInstance & Primitives',
        desc: 'Create primitive meshes (box, sphere, capsule, cylinder) and control MeshInstance3D from Lua',
        icon: <Icons.Shapes {...IC} />,
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
        // TODO: WIP
        label: 'Physics 3D',
        desc: 'Raycast, shapecast, apply forces and impulses to rigid bodies, and query collision layers from Lua',
        icon: <Icons.Atom {...IC} />,
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
        // TODO: WIP
        label: 'Navigation',
        desc: 'Agent pathfinding, steering avoidance, and navmesh queries — essential for NPC and AI movement',
        icon: <Icons.Navigation {...IC} />,
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
        // TODO: WIP
        label: 'Audio',
        desc: 'Play, stop, pause, and seek streams. Flat 2D audio and 3D positional sound with attenuation from Lua',
        icon: <Icons.Volume2 {...IC} />,
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
        // TODO: WIP
        label: 'ENet Transport',
        desc: 'High-performance UDP peer — reliable, sequenced, and unreliable channels for multiplayer',
        icon: <Icons.Network {...IC} />,
        items: [
          { label: 'ENet peer connect / disconnect', status: 'completed' },
          { label: 'Reliable channel send / receive', status: 'completed' },
          { label: 'Unreliable / sequenced channels', status: 'completed' },
          { label: 'Bandwidth limiting', status: 'completed' },
          { label: 'Ping & round-trip time', status: 'partial' },
        ],
      },
      {
        // TODO: WIP
        label: 'WebSocket',
        desc: 'Full-duplex WebSocket client and server for real-time browser and service communication',
        icon: <Icons.Wifi {...IC} />,
        items: [
          { label: 'WebSocketPeer.connect_to_url', status: 'pending' },
          { label: 'send / receive (text & binary)', status: 'pending' },
          { label: 'WebSocketServer (listen / accept)', status: 'pending' },
          { label: 'TLS / WSS support', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'Multiplayer API',
        desc: 'High-level multiplayer with RPC, spawning, and state synchronization from Lua',
        icon: <Icons.Users {...IC} />,
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
        // TODO: WIP
        label: 'Discord SDK',
        desc: 'Native Discord Rich Presence — dynamic state, player count, images, and invite links',
        icon: <Icons.MessageCircle {...IC} />,
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