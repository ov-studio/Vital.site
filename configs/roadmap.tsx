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
          { label: 'db.connect / disconnect', status: 'completed' },
          { label: 'db.exec (raw query)', status: 'completed' },
          { label: 'Prepared statements', status: 'completed' },
          { label: 'Transaction support', status: 'completed' },
        ],
      },
      {
        label: 'Database Query',
        desc: 'Fluent query builder API — select, insert, update, delete, and filtering',
        icon: <Icons.Table2 {...IC} />,
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
        icon: <Icons.ScanSearch {...IC} />,
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
        icon: <Icons.Timer {...IC} />,
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
        icon: <Icons.CheckCircle {...IC} />,
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
        icon: <Icons.Layers {...IC} />,
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
          { label: 'Request: GET', status: 'completed' },
          { label: 'Request: POST', status: 'completed' },
          { label: 'Custom headers', status: 'completed' },
          { label: 'Custom Timeout', status: 'completed' },
        ],
      },
      {
        label: 'Crypto',
        desc: 'Cryptographic primitives for hashing, signing, and securing sensitive payloads',
        icon: <Icons.Lock {...IC} />,
        items: [
          { label: 'Hash: SHA1', status: 'completed' },
          { label: 'Hash: SHA224', status: 'completed' },
          { label: 'Hash: SHA256', status: 'completed' },
          { label: 'Hash: SHA384', status: 'completed' },
          { label: 'Hash: SHA512', status: 'completed' },
          { label: 'Encode / Decode: Base64', status: 'completed' },
          { label: 'Encrypt / Decrypt: AES128', status: 'completed' },
          { label: 'Encrypt / Decrypt: AES192', status: 'completed' },
          { label: 'Encrypt / Decrypt: AES256', status: 'completed' }
        ],
      },
      {
        label: 'Shrinker',
        desc: 'Asset and data compression / decompression to reduce memory footprint and transfer overhead',
        icon: <Icons.Package {...IC} />,
        items: [
          { label: 'Data compression via zstd', status: 'completed' },
          { label: 'API: shrinker.compress', status: 'completed' },
          { label: 'API: shrinker.decompress', status: 'completed' }
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
        desc: 'HTML/CSS/JS renderer bridged into a SubViewport with bidirectional Lua ↔ JS messaging',
        icon: <Icons.Code2 {...IC} />,
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
        desc: 'Runtime font loading and text metrics for canvas-level text rendering',
        icon: <Icons.Type {...IC} />,
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
        icon: <Icons.Image {...IC} />,
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
        icon: <Icons.FileCode {...IC} />,
        items: [
          { label: 'SVG load from file / string', status: 'completed' },
          { label: 'Render to texture', status: 'completed' },
          { label: 'Resize / scale on render', status: 'completed' },
        ],
      },
      {
        label: 'Rendertarget',
        desc: 'Off-screen render surfaces — create, bind, and sample as textures in the scene',
        icon: <Icons.Tv2 {...IC} />,
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
        label: 'Model',
        desc: 'Load, instantiate, transform, animate, and manage 3D model assets at runtime',
        icon: <Icons.Box {...IC} />,
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