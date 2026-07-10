import * as config_site from '@/configs/site';
import * as lucide from 'lucide-react';

type CardInput = Omit<RoadmapCard, 'id'>;
type SectionInput = { name: string; cards: CardInput[] };

function to_id(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function build(sections: SectionInput[]): RoadmapSection[] {
  return sections.map(s => ({
    name: s.name,
    cards: s.cards.map(c => ({ ...c, id: to_id(c.label) })),
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

export const Roadmap: RoadmapSection[] = build([
  {
    name: 'Sandbox',
    cards: [
      {
        label: 'Framework',
        desc: 'Godot-backed framework — platform targets, build configuration, and low-level engine internals',
        icon: <lucide.Puzzle {...config_site.info.lucide}/>,
        items: [
          { label: 'Platform: Windows support', status: 'completed' },
          { label: 'Platform: Linux support', status: 'pending' }
        ]
      },
      {
        // TODO: WIP
        label: 'Main Menu',
        desc: 'Client entry point — play, game browser, settings, credits, and quit',
        icon: <lucide.LayoutDashboard {...config_site.info.lucide}/>,
        items: [
          { label: 'Main menu scene & layout', status: 'pending' },
          { label: 'Play / browse servers flow', status: 'pending' },
          { label: 'Settings screen', status: 'pending' },
          { label: 'Credits screen', status: 'pending' },
          { label: 'Version & build info display', status: 'pending' },
        ]
      },
      {
        // TODO: WIP
        label: 'Game Browser',
        desc: 'Client server browser — query, filter, sort, favorite, and join available game servers',
        icon: <lucide.Server {...config_site.info.lucide}/>,
        items: [
          { label: 'Server list fetch & display', status: 'pending' },
          { label: 'Filter by name / gamemode / region', status: 'pending' },
          { label: 'Sort by player count / ping / name', status: 'pending' },
          { label: 'Direct connect by IP & port', status: 'pending' },
          { label: 'Refresh & auto-refresh interval', status: 'pending' },
          { label: 'Favorite servers list', status: 'pending' },
        ]
      },
      {
        // TODO: WIP
        label: 'Settings Menu',
        desc: 'Client settings menu — window mode, resolution, keybinds, audio, and display configuration',
        icon: <lucide.SlidersHorizontal {...config_site.info.lucide}/>,
        items: [
          { label: 'Window mode (fullscreen / borderless / windowed)', status: 'pending' },
          { label: 'Resolution & DPI / scale factor', status: 'pending' },
          { label: 'Window title & icon', status: 'pending' },
          { label: 'Clipboard get / set', status: 'pending' },
          { label: 'Cursor mode (visible / hidden / captured)', status: 'pending' },
          { label: 'Multi-monitor screen info', status: 'pending' },
          { label: 'Keybind configuration', status: 'pending' },
          { label: 'Audio output device & volume', status: 'pending' },
        ]
      },
      {
        label: 'Console',
        desc: 'Runtime console — commands, debug output, and structured logging across both sides',
        icon: <lucide.Terminal {...config_site.info.lucide}/>,
        items: [
          { label: 'Log levels (sbox / info / warn / error)', status: 'completed' },
          { label: '[Shared] Command: help', status: 'completed' },
          { label: '[Server] Command: info', status: 'completed' },
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
        ]
      },
      {
        label: 'Resource System',
        desc: 'Runtime resource manager — loading, caching, unloading, and client-side asset sync and download',
        icon: <lucide.FolderOpen {...config_site.info.lucide}/>,
        items: [
          { label: '[Server] Resource scanner', status: 'completed' },
          { label: '[Shared] Resource cache', status: 'completed' },
          { label: '[Shared] Resource loader / unloader', status: 'completed' },
          { label: '[Shared] Resource asset compression', status: 'completed' },
          { label: '[Shared] Resource asset streaming via HTTP server', status: 'completed' },
          { label: '[Shared] Resource-scoped entity lifetime', status: 'completed' },
          { label: '[Shared] Per-resource isolated Lua environments', status: 'completed' },
          { label: '[Shared] Resource start-order persistence for late-joining clients', status: 'completed' },
          { label: '[Shared] Main-thread execution enforcement for Lua script callbacks', status: 'completed' },
          { label: '[Shared] Runtime cross-resource exports', status: 'completed' },
          { label: '[Client] Manifest-driven asset sync with hash verification', status: 'completed' },
          { label: '[Client] Concurrent threaded downloads with cancellation', status: 'completed' }
        ]
      },
      {
        // TODO: WIP
        label: 'Performance Monitor',
        desc: 'Runtime performance monitor — FPS, frame time, draw calls, memory usage, and object counts',
        icon: <lucide.Activity {...config_site.info.lucide}/>,
        items: [
          { label: 'Performance.get (FPS / frame time)', status: 'pending' },
          { label: 'Draw calls & vertices', status: 'pending' },
          { label: 'Static / dynamic memory', status: 'pending' },
          { label: 'Physics step time', status: 'pending' },
          { label: 'Object / node count', status: 'pending' },
        ],
      }
    ]
  },

  {
    name: 'Core',
    cards: [
      {
        label: 'Engine',
        desc: 'Top-level engine singleton access for runtime and scene control',
        icon: <lucide.Cpu {...config_site.info.lucide}/>,
        items: [
          { label: '[Shared] API: core.engine.print', status: 'completed' },
          { label: '[Shared] API: core.engine.iprint', status: 'completed' },
          { label: '[Shared] API: core.engine.inspect', status: 'completed' },
          { label: '[Client] API: core.engine.quit', status: 'pending' },
          { label: '[Shared] API: core.engine.compile_string', status: 'completed' },
          { label: '[Shared] API: core.engine.load_string', status: 'completed' },
          { label: '[Shared] API: core.engine.get_tick', status: 'completed' },
          { label: '[Shared] API: core.engine.get_version', status: 'completed' },
          { label: '[Shared] API: core.engine.get_platform', status: 'completed' },
          { label: '[Shared] API: core.engine.get_timestamp', status: 'completed' },
          { label: '[Shared] API: core.engine.get_resolution', status: 'completed' },
          { label: '[Shared] API: core.engine.get_serial', status: 'completed' },
          { label: '[Shared] API: core.engine.get_entities', status: 'completed' }
        ]
      },
      {
        label: 'Canvas',
        desc: '2D drawing API — shapes, images and text composited into rendertarget each frame',
        icon: <lucide.PenTool {...config_site.info.lucide} />,
        items: [
          { label: '[Client] API: core.engine.world_to_screen', status: 'completed' },
          { label: '[Client] API: core.engine.screen_to_world', status: 'completed' },
          { label: '[Client] API: core.engine.draw_line', status: 'completed' },
          { label: '[Client] API: core.engine.draw_polygon', status: 'completed' },
          { label: '[Client] API: core.engine.draw_rectangle', status: 'completed' },
          { label: '[Client] API: core.engine.draw_circle', status: 'completed' },
          { label: '[Client] API: core.engine.draw_image', status: 'completed' },
          { label: '[Client] API: core.engine.draw_text', status: 'completed' }
        ]
      },
      {
        label: 'Database',
        desc: 'Embedded database interface for persistent structured data storage and retrieval',
        icon: <lucide.Database {...config_site.info.lucide}/>,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Database Backend: MySQL', status: 'completed' },
          { label: 'ORM-style query with chainable methods', status: 'completed' },
          { label: 'Asynchronous query execution', status: 'completed' },
          { label: '[Server] API: core.database.create', status: 'completed' },
          { label: '[Shared] API: self<database>:is_type', status: 'completed' },
          { label: '[Shared] API: self<database>:get_type', status: 'completed' },
          { label: '[Shared] API: self<database>:destroy', status: 'completed' },
          { label: '[Server] API: self<database>:is_connected', status: 'completed' },
          { label: '[Server] API: self<database>:define', status: 'completed' },
          { label: '[Server] API: self<database>:sync', status: 'completed' },
          { label: '[Server] API: self<database>:table', status: 'completed' },
          { label: '[Shared] API: self<db_query>:is_type', status: 'completed' },
          { label: '[Shared] API: self<db_query>:get_type', status: 'completed' },
          { label: '[Shared] API: self<db_query>:destroy', status: 'completed' },
          { label: '[Server] API: self<db_query>:fetch', status: 'completed' },
          { label: '[Server] API: self<db_query>:alter', status: 'completed' },
          { label: '[Server] API: self<db_query>:drop', status: 'completed' },
          { label: '[Server] API: self<db_query>:truncate', status: 'completed' },
          { label: '[Server] API: self<db_query>:execute', status: 'completed' },
          { label: '[Server] API: self<db_query>:select', status: 'completed' },
          { label: '[Server] API: self<db_query>:where', status: 'completed' },
          { label: '[Server] API: self<db_query>:insert', status: 'completed' },
          { label: '[Server] API: self<db_query>:delete', status: 'completed' },
          { label: '[Server] API: self<db_query>:update', status: 'completed' }
        ]
      },
      {
        label: 'Model',
        desc: 'Load, instantiate, transform, animate, and manage 3D model assets at runtime',
        icon: <lucide.Box {...config_site.info.lucide}/>,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Support format: GLB', status: 'completed' },
          { label: 'Model loader / unloader', status: 'completed' },
          { label: 'Server spawn replication with per-peer authority', status: 'completed' },
          { label: 'Server transform replication', status: 'pending' },
          { label: 'Server blendshape replication', status: 'pending' },
          { label: 'Server material override replication', status: 'pending' },
          { label: 'Server material flag replication', status: 'pending' },
          { label: 'Server animation state replication', status: 'pending' },
          { label: 'Transform (position / rotation / scale) control', status: 'partial' },
          { label: 'Animation playback (play / stop / pause / resume)', status: 'completed' },
          { label: 'Animation speed scale', status: 'completed' },
          { label: 'Blendshape (morph target) control', status: 'completed' },
          { label: 'Component visibility override per mesh', status: 'completed' },
          { label: 'Material visibility override per component', status: 'completed' },
          { label: 'Material feature & flag overrides', status: 'completed' },
          { label: 'Wildcard component / material targeting', status: 'completed' },
          { label: 'Skeleton & bone transforms', status: 'partial' },
          { label: 'LOD (Level of Detail) control', status: 'pending' }
        ]
      },
      {
        // TODO: WIP
        label: 'Camera 3D',
        desc: 'FOV, near/far clip, projection mode, and per-camera environment override from Lua',
        icon: <lucide.Video {...config_site.info.lucide}/>,
        items: [
          { label: 'Camera3D transform (position / rotation)', status: 'pending' },
          { label: 'FOV / orthographic size', status: 'pending' },
          { label: 'Near / far clip plane', status: 'pending' },
          { label: 'Projection mode (perspective / ortho)', status: 'pending' },
          { label: 'set_current (make active)', status: 'pending' },
          { label: 'Per-camera environment override', status: 'pending' },
          { label: 'Frustum culling mask', status: 'pending' },
        ]
      },
      {
        label: 'Webview',
        desc: 'HTML/CSS/JS renderer with bidirectional Lua - JS messaging',
        icon: <lucide.Code2 {...config_site.info.lucide}/>,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Bidirectional Lua - JS messaging', status: 'completed' },
          { label: 'Serve webview files over HTTP instead of file://', status: 'completed' },
          { label: '[Client] API: core.webview.create', status: 'completed' },
          { label: '[Client] API: self<webview>:is_type', status: 'completed' },
          { label: '[Client] API: self<webview>:get_type', status: 'completed' },
          { label: '[Client] API: self<webview>:destroy', status: 'completed' },
          { label: '[Client] API: self<webview>:is_visible', status: 'completed' },
          { label: '[Client] API: self<webview>:is_fullscreen', status: 'completed' },
          { label: '[Client] API: self<webview>:is_transparent', status: 'completed' },
          { label: '[Client] API: self<webview>:is_incognito', status: 'completed' },
          { label: '[Client] API: self<webview>:is_autoplay', status: 'completed' },
          { label: '[Client] API: self<webview>:is_zoomable', status: 'completed' },
          { label: '[Client] API: self<webview>:is_devtools_visible', status: 'completed' },
          { label: '[Client] API: self<webview>:get_position', status: 'completed' },
          { label: '[Client] API: self<webview>:get_size', status: 'completed' },
          { label: '[Client] API: self<webview>:set_position', status: 'completed' },
          { label: '[Client] API: self<webview>:set_size', status: 'completed' },
          { label: '[Client] API: self<webview>:set_visible', status: 'completed' },
          { label: '[Client] API: self<webview>:set_devtools_visible', status: 'completed' },
          { label: '[Client] API: self<webview>:set_message_handler', status: 'completed' },
          { label: '[Client] API: self<webview>:load_url', status: 'completed' },
          { label: '[Client] API: self<webview>:load_html', status: 'completed' },
          { label: '[Client] API: self<webview>:clear_history', status: 'completed' },
          { label: '[Client] API: self<webview>:focus', status: 'completed' },
          { label: '[Client] API: self<webview>:reload', status: 'completed' },
          { label: '[Client] API: self<webview>:zoom', status: 'completed' },
          { label: '[Client] API: self<webview>:update', status: 'completed' },
          { label: '[Client] API: self<webview>:eval', status: 'completed' },
          { label: '[Client] API: self<webview>:emit', status: 'completed' }
        ]
      },
      {
        label: 'Font',
        desc: 'Runtime font loading, unloading, and rendering for canvas-level text with antialiasing control',
        icon: <lucide.Type {...config_site.info.lucide}/>,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Format: TTF', status: 'completed' },
          { label: 'Format: OTF', status: 'completed' },
          { label: 'Format: WOFF', status: 'completed' },
          { label: 'Format: WOFF2', status: 'completed' },
          { label: '[Client] API: core.font.create', status: 'completed' },
          { label: '[Client] API: self<font>:is_type', status: 'completed' },
          { label: '[Client] API: self<font>:get_type', status: 'completed' },
          { label: '[Client] API: self<font>:destroy', status: 'completed' },
          { label: '[Client] API: self<font>:get_antialiasing', status: 'completed' },
          { label: '[Client] API: self<font>:get_oversampling', status: 'completed' },
          { label: '[Client] API: self<font>:set_antialiasing', status: 'completed' },
          { label: '[Client] API: self<font>:set_oversampling', status: 'completed' }
        ]
      },
      {
        label: 'Texture',
        desc: 'Runtime image texture loading, unloading, and rendering with implicit cache for draw calls',
        icon: <lucide.Image {...config_site.info.lucide}/>,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Format: JPG | JPEG', status: 'completed' },
          { label: 'Format: PNG', status: 'completed' },
          { label: 'Format: WEBP', status: 'completed' },
          { label: 'Format: BMP', status: 'completed' },
          { label: 'Format: DDS', status: 'completed' },
          { label: 'Format: KTX', status: 'completed' },
          { label: 'Format: EXR', status: 'completed' },
          { label: 'Implicit texture cache for draw calls', status: 'completed' },
          { label: '[Client] API: core.texture.create', status: 'completed' },
          { label: '[Client] API: self<texture>:is_type', status: 'completed' },
          { label: '[Client] API: self<texture>:get_type', status: 'completed' },
          { label: '[Client] API: self<texture>:destroy', status: 'completed' },
          { label: '[Client] API: self<texture>:is_compressed', status: 'completed' },
          { label: '[Client] API: self<texture>:get_size', status: 'completed' },
          { label: '[Client] API: self<texture>:convert', status: 'completed' },
          { label: '[Client] API: self<texture>:compress', status: 'completed' }
        ]
      },
      {
        label: 'SVG',
        desc: 'Runtime vector SVG loading, unloading, rendering, and mutation from raw string buffers',
        icon: <lucide.FileCode {...config_site.info.lucide}/>,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Format: SVG', status: 'completed' },
          { label: 'SVG instantiation and mutation from raw string buffers', status: 'completed' },
          { label: '[Client] API: core.svg.create', status: 'completed' },
          { label: '[Client] API: core.svg.create_from_raw', status: 'completed' },
          { label: '[Client] API: self<svg>:is_type', status: 'completed' },
          { label: '[Client] API: self<svg>:get_type', status: 'completed' },
          { label: '[Client] API: self<svg>:destroy', status: 'completed' },
          { label: '[Client] API: self<svg>:get_size', status: 'completed' },
          { label: '[Client] API: self<svg>:update', status: 'completed' }
        ]
      },
      {
        label: 'Rendertarget',
        desc: 'Off-screen render surfaces — create, bind, and sample as textures in the scene',
        icon: <lucide.Layers {...config_site.info.lucide}/>,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Optional alpha-transparent render surface', status: 'completed' },
          { label: 'Optional immediate-mode per-frame updates', status: 'completed' },
          { label: '[Client] API: core.rendertarget.create', status: 'completed' },
          { label: '[Client] API: core.rendertarget.get_active', status: 'completed' },
          { label: '[Client] API: core.rendertarget.set_active', status: 'completed' },
          { label: '[Client] API: self<rendertarget>:is_type', status: 'completed' },
          { label: '[Client] API: self<rendertarget>:get_type', status: 'completed' },
          { label: '[Client] API: self<rendertarget>:destroy', status: 'completed' },
          { label: '[Client] API: self<rendertarget>:is_active', status: 'completed' },
          { label: '[Client] API: self<rendertarget>:get_size', status: 'completed' },
          { label: '[Client] API: self<rendertarget>:set_active', status: 'completed' }
        ]
      },
      {
        // TODO: WIP
        label: 'Screenshot Capture',
        desc: 'Grab the current viewport frame as a raw image or save directly to disk',
        icon: <lucide.Camera {...config_site.info.lucide}/>,
        items: [
          { label: 'Viewport.get_texture snapshot', status: 'pending' },
          { label: 'Save to PNG / JPG', status: 'pending' },
          { label: 'Region capture (partial frame)', status: 'pending' },
        ]
      },
      {
        // TODO: WIP
        label: 'MeshInstance & Primitives',
        desc: 'Create primitive meshes (box, sphere, capsule, cylinder) and control MeshInstance3D from Lua',
        icon: <lucide.Shapes {...config_site.info.lucide}/>,
        items: [
          { label: 'BoxMesh / SphereMesh / CapsuleMesh', status: 'pending' },
          { label: 'CylinderMesh / PlaneMesh', status: 'pending' },
          { label: 'MeshInstance3D creation', status: 'pending' },
          { label: 'Surface material assignment', status: 'pending' },
        ]
      },
      {
        // TODO: WIP
        label: 'Tween',
        desc: 'Interpolate any node property smoothly with easing functions, chaining, and parallel playback',
        icon: <lucide.TrendingUp {...config_site.info.lucide}/>,
        priority: 'Must have',
        items: [
          { label: 'Tween.tween_property', status: 'pending' },
          { label: 'Tween.tween_callback', status: 'pending' },
          { label: 'Tween.tween_interval', status: 'pending' },
          { label: 'Easing & transition types', status: 'pending' },
          { label: 'Sequence / parallel / chained', status: 'pending' },
          { label: 'Pause / resume / kill', status: 'pending' },
        ],
      }
    ]
  },

  {
    name: 'Utility',
    cards: [
      {
        label: 'Math',
        desc: 'Lua math library, enriched with sandbox-native utilities and helpers',
        icon: <lucide.Calculator {...config_site.info.lucide}/>,
        items: [
          { label: '[Shared] Constant: util.math.pi', status: 'completed' },
          { label: '[Shared] Constant: util.math.huge', status: 'completed' },
          { label: '[Shared] Constant: util.math.maxinteger', status: 'completed' },
          { label: '[Shared] Constant: util.math.mininteger', status: 'completed' },
          { label: '[Shared] API: util.math.abs', status: 'completed' },
          { label: '[Shared] API: util.math.fmod', status: 'completed' },
          { label: '[Shared] API: util.math.percent', status: 'completed' },
          { label: '[Shared] API: util.math.max', status: 'completed' },
          { label: '[Shared] API: util.math.min', status: 'completed' },
          { label: '[Shared] API: util.math.round', status: 'completed' },
          { label: '[Shared] API: util.math.ceil', status: 'completed' },
          { label: '[Shared] API: util.math.floor', status: 'completed' },
          { label: '[Shared] API: util.math.modf', status: 'completed' },
          { label: '[Shared] API: util.math.sqrt', status: 'completed' },
          { label: '[Shared] API: util.math.exp', status: 'completed' },
          { label: '[Shared] API: util.math.log', status: 'completed' },
          { label: '[Shared] API: util.math.sin', status: 'completed' },
          { label: '[Shared] API: util.math.cos', status: 'completed' },
          { label: '[Shared] API: util.math.tan', status: 'completed' },
          { label: '[Shared] API: util.math.asin', status: 'completed' },
          { label: '[Shared] API: util.math.acos', status: 'completed' },
          { label: '[Shared] API: util.math.atan', status: 'completed' },
          { label: '[Shared] API: util.math.deg', status: 'completed' },
          { label: '[Shared] API: util.math.rad', status: 'completed' },
          { label: '[Shared] API: util.math.distance_2d', status: 'completed' },
          { label: '[Shared] API: util.math.distance_3d', status: 'completed' },
          { label: '[Shared] API: util.math.rotation_2d', status: 'completed' },
          { label: '[Shared] API: util.math.project_2d', status: 'completed' },
          { label: '[Shared] API: util.math.random', status: 'completed' },
          { label: '[Shared] API: util.math.randomseed', status: 'completed' },
          { label: '[Shared] API: util.math.type', status: 'completed' },
          { label: '[Shared] API: util.math.tointeger', status: 'completed' },
          { label: '[Shared] API: util.math.ult', status: 'completed' }
        ]
      },
      {
        label: 'String',
        desc: 'Lua string library, enriched with sandbox-native utilities and helpers',
        icon: <lucide.Regex {...config_site.info.lucide}/>,
        items: [
          { label: '[Shared] API: util.string.parse', status: 'completed' },
          { label: '[Shared] API: util.string.parse_hex', status: 'completed' },
          { label: '[Shared] API: util.string.char', status: 'completed' },
          { label: '[Shared] API: util.string.byte', status: 'completed' },
          { label: '[Shared] API: util.string.codepoint', status: 'completed' },
          { label: '[Shared] API: util.string.codes', status: 'completed' },
          { label: '[Shared] API: util.string.next', status: 'completed' },
          { label: '[Shared] API: util.string.sub', status: 'completed' },
          { label: '[Shared] API: util.string.insert', status: 'completed' },
          { label: '[Shared] API: util.string.remove', status: 'completed' },
          { label: '[Shared] API: util.string.rep', status: 'completed' },
          { label: '[Shared] API: util.string.kern', status: 'completed' },
          { label: '[Shared] API: util.string.reverse', status: 'completed' },
          { label: '[Shared] API: util.string.split', status: 'completed' },
          { label: '[Shared] API: util.string.detab', status: 'completed' },
          { label: '[Shared] API: util.string.lower', status: 'completed' },
          { label: '[Shared] API: util.string.upper', status: 'completed' },
          { label: '[Shared] API: util.string.title', status: 'completed' },
          { label: '[Shared] API: util.string.fold', status: 'completed' },
          { label: '[Shared] API: util.string.ncasecmp', status: 'completed' },
          { label: '[Shared] API: util.string.match', status: 'completed' },
          { label: '[Shared] API: util.string.gmatch', status: 'completed' },
          { label: '[Shared] API: util.string.find', status: 'completed' },
          { label: '[Shared] API: util.string.gsub', status: 'completed' },
          { label: '[Shared] API: util.string.format', status: 'completed' },
          { label: '[Shared] API: util.string.format_time', status: 'completed' },
          { label: '[Shared] API: util.string.void', status: 'completed' },
          { label: '[Shared] API: util.string.isvalid', status: 'completed' },
          { label: '[Shared] API: util.string.invalidoffset', status: 'completed' },
          { label: '[Shared] API: util.string.clean', status: 'completed' },
          { label: '[Shared] API: util.string.isnfc', status: 'completed' },
          { label: '[Shared] API: util.string.offset', status: 'completed' },
          { label: '[Shared] API: util.string.charpos', status: 'completed' },
          { label: '[Shared] API: util.string.normalize_nfc', status: 'completed' },
          { label: '[Shared] API: util.string.len', status: 'completed' },
          { label: '[Shared] API: util.string.width', status: 'completed' },
          { label: '[Shared] API: util.string.widthindex', status: 'completed' },
          { label: '[Shared] API: util.string.grapheme_indices', status: 'completed' },
          { label: '[Shared] API: util.string.pack', status: 'completed' },
          { label: '[Shared] API: util.string.packsize', status: 'completed' },
          { label: '[Shared] API: util.string.unpack', status: 'completed' },
          { label: '[Shared] API: util.string.escape', status: 'completed' },
          { label: '[Shared] API: util.string.charpattern', status: 'completed' }
        ]
      },
      {
        label: 'Table',
        desc: 'Lua table library, enriched with sandbox-native utilities and helpers',
        icon: <lucide.Table {...config_site.info.lucide}/>,
        items: [
          { label: '[Shared] API: util.table.insert', status: 'completed' },
          { label: '[Shared] API: util.table.remove', status: 'completed' },
          { label: '[Shared] API: util.table.move', status: 'completed' },
          { label: '[Shared] API: util.table.sort', status: 'completed' },
          { label: '[Shared] API: util.table.pack', status: 'completed' },
          { label: '[Shared] API: util.table.unpack', status: 'completed' },
          { label: '[Shared] API: util.table.concat', status: 'completed' },
          { label: '[Shared] API: util.table.clone', status: 'completed' },
          { label: '[Shared] API: util.table.len', status: 'completed' },
          { label: '[Shared] API: util.table.encode', status: 'completed' },
          { label: '[Shared] API: util.table.decode', status: 'completed' }
        ]
      },
      {
        label: 'Timer',
        desc: 'Precise one-shot and repeating timer scheduling with millisecond accuracy',
        icon: <lucide.Timer {...config_site.info.lucide}/>,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Customizable interval', status: 'completed' },
          { label: 'Customizable executions', status: 'completed' },
          { label: '[Shared] API: util.timer.create', status: 'completed' },
          { label: '[Shared] API: util.timer.next_tick', status: 'completed' },
          { label: '[Shared] API: self<timer>:is_type', status: 'completed' },
          { label: '[Shared] API: self<timer>:get_type', status: 'completed' },
          { label: '[Shared] API: self<timer>:destroy', status: 'completed' }
        ]
      },
      {
        label: 'Promise',
        desc: 'Deferred values with full chaining, resolution, rejection, and async/await support',
        icon: <lucide.CheckCircle {...config_site.info.lucide}/>,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: '[Shared] API: util.promise.create', status: 'completed' },
          { label: '[Shared] API: self<promise>:is_type', status: 'completed' },
          { label: '[Shared] API: self<promise>:get_type', status: 'completed' },
          { label: '[Shared] API: self<promise>:destroy', status: 'completed' },
          { label: '[Shared] API: self<promise>:is_pending', status: 'completed' },
          { label: '[Shared] API: self<promise>:resolve', status: 'completed' },
          { label: '[Shared] API: self<promise>:reject', status: 'completed' }
        ]
      },
      {
        label: 'Thread',
        desc: 'Low-level thread management, pooling, and lifecycle control from Lua',
        icon: <lucide.Blocks {...config_site.info.lucide}/>,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: '[Shared] API: util.thread.create', status: 'completed' },
          { label: '[Shared] API: util.thread.current', status: 'completed' },
          { label: '[Shared] API: self<thread>:is_type', status: 'completed' },
          { label: '[Shared] API: self<thread>:get_type', status: 'completed' },
          { label: '[Shared] API: self<thread>:destroy', status: 'completed' },
          { label: '[Shared] API: self<thread>:resume', status: 'completed' },
          { label: '[Shared] API: self<thread>:pause', status: 'completed' },
          { label: '[Shared] API: self<thread>:sleep', status: 'completed' },
          { label: '[Shared] API: self<thread>:await', status: 'completed' }
        ]
      },
      {
        label: 'File',
        desc: 'Read, write, and manage files on disk from within Lua scripts',
        icon: <lucide.FileText {...config_site.info.lucide}/>,
        items: [
          { label: '[Shared] API: util.file.exists', status: 'completed' },
          { label: '[Shared] API: util.file.size', status: 'completed' },
          { label: '[Shared] API: util.file.hash', status: 'completed' },
          { label: '[Shared] API: util.file.delete', status: 'completed' },
          { label: '[Shared] API: util.file.read', status: 'completed' },
          { label: '[Shared] API: util.file.write', status: 'completed' },
          { label: '[Shared] API: util.file.contents', status: 'completed' }
        ]
      },
      {
        label: 'HTTP',
        desc: 'Full async HTTP layer for communicating with external REST APIs and asset servers',
        icon: <lucide.Globe {...config_site.info.lucide}/>,
        items: [
          { label: 'Customizable headers', status: 'completed' },
          { label: 'Customizable timeout', status: 'completed' },
          { label: '[Shared] API: util.http.get', status: 'completed' },
          { label: '[Shared] API: util.http.post', status: 'completed' }
        ]
      },
      {
        label: 'Crypto',
        desc: 'Cryptographic primitives for hashing, signing, and securing sensitive payloads',
        icon: <lucide.Lock {...config_site.info.lucide}/>,
        items: [
          { label: 'Hash algorithm: SHA1', status: 'completed' },
          { label: 'Hash algorithm: SHA224', status: 'completed' },
          { label: 'Hash algorithm: SHA256', status: 'completed' },
          { label: 'Hash algorithm: SHA384', status: 'completed' },
          { label: 'Hash algorithm: SHA512', status: 'completed' },
          { label: 'Encoding algorithm: Base64', status: 'completed' },
          { label: 'Encryption algorithm: AES128', status: 'completed' },
          { label: 'Encryption algorithm: AES192', status: 'completed' },
          { label: 'Encryption algorithm: AES256', status: 'completed' },
          { label: '[Shared] API: util.crypto.hash', status: 'completed' },
          { label: '[Shared] API: util.crypto.encode', status: 'completed' },
          { label: '[Shared] API: util.crypto.decode', status: 'completed' },
          { label: '[Shared] API: util.crypto.encrypt', status: 'completed' },
          { label: '[Shared] API: util.crypto.decrypt', status: 'completed' }
        ]
      },
      {
        label: 'Shrinker',
        desc: 'Asset and data compression / decompression to reduce memory footprint and transfer overhead',
        icon: <lucide.Package {...config_site.info.lucide}/>,
        items: [
          { label: 'Data compression via zstd library', status: 'completed' },
          { label: '[Shared] API: util.shrinker.compress', status: 'completed' },
          { label: '[Shared] API: util.shrinker.decompress', status: 'completed' }
        ]
      },
      {
        label: 'Resource',
        desc: 'Introspect the running resource and control start, stop, and restart of server-managed resources',
        icon: <lucide.PackageOpen {...config_site.info.lucide} />,
        items: [
          { label: '[Shared] API: util.resource.current', status: 'completed' },
          { label: '[Shared] API: util.resource.list', status: 'completed' },
          { label: '[Server] API: util.resource.is_loaded', status: 'completed' },
          { label: '[Server] API: util.resource.is_running', status: 'completed' },
          { label: '[Server] API: util.resource.start', status: 'completed' },
          { label: '[Server] API: util.resource.stop', status: 'completed' },
          { label: '[Server] API: util.resource.restart', status: 'completed' }
        ]
      },
      {
        label: 'Export',
        desc: 'Cross-resource function registry — expose and consume APIs across resource boundaries',
        icon: <lucide.Blocks {...config_site.info.lucide}/>,
        items: [
          { label: '[Shared] API: util.export.register', status: 'completed' },
          { label: '[Shared] API: util.export.call', status: 'completed' },
          { label: '[Shared] API: util.export.list', status: 'completed' }
        ]
      },
      {
        // TODO: WIP
        label: 'Inspect',
        desc: 'Hardware inspection, device fingerprinting, and runtime environment queries',
        icon: <lucide.FingerprintPattern {...config_site.info.lucide}/>,
        items: [
          { label: 'CPU info (cores, arch)', status: 'pending' },
          { label: 'OS platform detection', status: 'pending' },
          { label: 'Memory usage query', status: 'pending' },
          { label: 'Device fingerprint generation', status: 'completed' },
        ]
      },
      {
        // TODO: WIP, ADD ALL EXPOSED EVENTS
        label: 'Event',
        desc: 'Publish / subscribe event bus for decoupled, reactive module communication',
        icon: <lucide.Zap {...config_site.info.lucide}/>,
        items: [
          { label: 'Priority-ordered listeners', status: 'completed' },
          { label: 'Auto-unsubscribe listeners', status: 'completed' },
          { label: '[Shared] API: util.event.on', status: 'completed' },
          { label: '[Shared] API: util.event.off', status: 'completed' },
          { label: '[Shared] API: util.event.emit', status: 'completed' },
          { label: '[Shared] API: util.event.emit_callback', status: 'completed' }
        ]
      },
      {
        // TODO: WIP
        label: 'Input',
        desc: 'Key state, mouse position and buttons, scroll delta, gamepad axes, and action map from Lua',
        icon: <lucide.Gamepad2 {...config_site.info.lucide}/>,
        priority: 'Must have',
        items: [
          { label: 'Input singleton access', status: 'pending' },
          { label: 'is_key_pressed / just_pressed / just_released', status: 'pending' },
          { label: 'Mouse position & relative motion', status: 'pending' },
          { label: 'Mouse button state & scroll delta', status: 'pending' },
          { label: 'Mouse capture / visibility mode', status: 'pending' },
          { label: 'Gamepad / joystick axis & buttons', status: 'pending' },
          { label: 'InputMap action queries', status: 'pending' },
          { label: 'InputEvent pass-through (process_event)', status: 'pending' }
        ],
      }
    ]
  },

  {
    name: 'Graphics',
    cards: [
      {
        label: 'Environment',
        desc: 'Global background, ambient light, reflection source, and tonemapping control from Lua',
        icon: <lucide.Sunset {...config_site.info.lucide}/>,
        items: [
          { label: '[Client] Enum: gfx.env.background_mode', status: 'completed' },
          { label: '[Client] Enum: gfx.env.ambient_source', status: 'completed' },
          { label: '[Client] Enum: gfx.env.reflection_source', status: 'completed' },
          { label: '[Client] Enum: gfx.env.tonemapper_mode', status: 'completed' },
          { label: '[Client] API: gfx.env.get_background_mode', status: 'completed' },
          { label: '[Client] API: gfx.env.get_background_color', status: 'completed' },
          { label: '[Client] API: gfx.env.get_background_energy', status: 'completed' },
          { label: '[Client] API: gfx.env.get_background_intensity', status: 'completed' },
          { label: '[Client] API: gfx.env.get_ambient_source', status: 'completed' },
          { label: '[Client] API: gfx.env.get_ambient_color', status: 'completed' },
          { label: '[Client] API: gfx.env.get_ambient_energy', status: 'completed' },
          { label: '[Client] API: gfx.env.get_ambient_sky_contribution', status: 'completed' },
          { label: '[Client] API: gfx.env.get_reflection_source', status: 'completed' },
          { label: '[Client] API: gfx.env.get_tonemapper_mode', status: 'completed' },
          { label: '[Client] API: gfx.env.get_tonemap_exposure', status: 'completed' },
          { label: '[Client] API: gfx.env.get_tonemap_white', status: 'completed' },
          { label: '[Client] API: gfx.env.set_background_mode', status: 'completed' },
          { label: '[Client] API: gfx.env.set_background_color', status: 'completed' },
          { label: '[Client] API: gfx.env.set_background_energy', status: 'completed' },
          { label: '[Client] API: gfx.env.set_background_intensity', status: 'completed' },
          { label: '[Client] API: gfx.env.set_ambient_source', status: 'completed' },
          { label: '[Client] API: gfx.env.set_ambient_color', status: 'completed' },
          { label: '[Client] API: gfx.env.set_ambient_energy', status: 'completed' },
          { label: '[Client] API: gfx.env.set_ambient_sky_contribution', status: 'completed' },
          { label: '[Client] API: gfx.env.set_reflection_source', status: 'completed' },
          { label: '[Client] API: gfx.env.set_tonemapper_mode', status: 'completed' },
          { label: '[Client] API: gfx.env.set_tonemap_exposure', status: 'completed' },
          { label: '[Client] API: gfx.env.set_tonemap_white', status: 'completed' }
        ]
      },
      {
        label: 'Adjustment',
        desc: 'Brightness, contrast, saturation, and LUT color grading control from Lua',
        icon: <lucide.SlidersHorizontal {...config_site.info.lucide}/>,
        items: [
          { label: '[Client] API: gfx.adjustment.is_enabled', status: 'completed' },
          { label: '[Client] API: gfx.adjustment.get_brightness', status: 'completed' },
          { label: '[Client] API: gfx.adjustment.get_contrast', status: 'completed' },
          { label: '[Client] API: gfx.adjustment.get_saturation', status: 'completed' },
          { label: '[Client] API: gfx.adjustment.get_lut', status: 'completed' },
          { label: '[Client] API: gfx.adjustment.set_enabled', status: 'completed' },
          { label: '[Client] API: gfx.adjustment.set_brightness', status: 'completed' },
          { label: '[Client] API: gfx.adjustment.set_contrast', status: 'completed' },
          { label: '[Client] API: gfx.adjustment.set_saturation', status: 'completed' },
          { label: '[Client] API: gfx.adjustment.set_lut', status: 'completed' },
          { label: '[Client] API: gfx.adjustment.reset_lut', status: 'completed' }
        ]
      },
      {
        label: 'Sky',
        desc: 'Sky material mode, FOV, rotation, radiance size, and process mode control from Lua',
        icon: <lucide.CloudSun {...config_site.info.lucide}/>,
        items: [
          { label: '[Client] Enum: gfx.sky.radiance_size', status: 'completed' },
          { label: '[Client] Enum: gfx.sky.process_mode', status: 'completed' },
          { label: '[Client] API: gfx.sky.get_mode', status: 'completed' },
          { label: '[Client] API: gfx.sky.get_fov', status: 'completed' },
          { label: '[Client] API: gfx.sky.get_rotation', status: 'completed' },
          { label: '[Client] API: gfx.sky.get_radiance_size', status: 'completed' },
          { label: '[Client] API: gfx.sky.get_process_mode', status: 'completed' },
          { label: '[Client] API: gfx.sky.set_mode', status: 'completed' },
          { label: '[Client] API: gfx.sky.set_fov', status: 'completed' },
          { label: '[Client] API: gfx.sky.set_rotation', status: 'completed' },
          { label: '[Client] API: gfx.sky.set_radiance_size', status: 'completed' },
          { label: '[Client] API: gfx.sky.set_process_mode', status: 'completed' }
        ]
      },
      {
        label: 'Sky Panorama',
        desc: 'Panorama sky material texture and energy control from Lua',
        icon: <lucide.Image {...config_site.info.lucide}/>,
        items: [
          { label: '[Client] API: gfx.sky_panorama.is_filtering_enabled', status: 'completed' },
          { label: '[Client] API: gfx.sky_panorama.get_texture', status: 'completed' },
          { label: '[Client] API: gfx.sky_panorama.get_energy_multiplier', status: 'completed' },
          { label: '[Client] API: gfx.sky_panorama.set_texture', status: 'completed' },
          { label: '[Client] API: gfx.sky_panorama.set_filtering_enabled', status: 'completed' },
          { label: '[Client] API: gfx.sky_panorama.set_energy_multiplier', status: 'completed' },
          { label: '[Client] API: gfx.sky_panorama.reset_texture', status: 'completed' }
        ]
      },
      {
        label: 'Sky Physical',
        desc: 'Physically-based atmospheric scattering sky control from Lua',
        icon: <lucide.Atom {...config_site.info.lucide}/>,
        items: [
          { label: '[Client] API: gfx.sky_physical.get_rayleigh_coefficient', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.get_rayleigh_color', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.get_mie_coefficient', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.get_mie_eccentricity', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.get_mie_color', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.get_turbidity', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.get_sun_disk_scale', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.get_ground_color', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.get_energy_multiplier', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.get_use_debanding', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.get_night_sky', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.set_rayleigh_coefficient', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.set_rayleigh_color', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.set_mie_coefficient', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.set_mie_eccentricity', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.set_mie_color', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.set_turbidity', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.set_sun_disk_scale', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.set_ground_color', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.set_energy_multiplier', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.set_use_debanding', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.set_night_sky', status: 'completed' },
          { label: '[Client] API: gfx.sky_physical.reset_night_sky', status: 'completed' }
        ]
      },
      {
        label: 'Sky Procedural',
        desc: 'Procedural sky and ground gradient control from Lua',
        icon: <lucide.Wand {...config_site.info.lucide}/>,
        items: [
          { label: '[Client] API: gfx.sky_procedural.get_sky_top_color', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.get_sky_horizon_color', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.get_sky_curve', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.get_sky_energy_multiplier', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.get_sky_cover', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.get_sky_cover_modulate', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.get_ground_bottom_color', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.get_ground_horizon_color', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.get_ground_curve', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.get_ground_energy_multiplier', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.get_sun_angle_max', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.get_sun_curve', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.get_use_debanding', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.get_energy_multiplier', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.set_sky_top_color', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.set_sky_horizon_color', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.set_sky_curve', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.set_sky_energy_multiplier', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.set_sky_cover', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.reset_sky_cover', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.set_sky_cover_modulate', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.set_ground_bottom_color', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.set_ground_horizon_color', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.set_ground_curve', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.set_ground_energy_multiplier', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.set_sun_angle_max', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.set_sun_curve', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.set_use_debanding', status: 'completed' },
          { label: '[Client] API: gfx.sky_procedural.set_energy_multiplier', status: 'completed' }
        ]
      },
      {
        label: 'Glow',
        desc: 'Bloom-style glow intensity, blending, and HDR bleed control from Lua',
        icon: <lucide.CircleDot {...config_site.info.lucide}/>,
        items: [
          { label: '[Client] Enum: gfx.glow.blend_mode', status: 'completed' },
          { label: '[Client] API: gfx.glow.is_enabled', status: 'completed' },
          { label: '[Client] API: gfx.glow.is_normalized', status: 'completed' },
          { label: '[Client] API: gfx.glow.get_level_intensity', status: 'completed' },
          { label: '[Client] API: gfx.glow.get_intensity', status: 'completed' },
          { label: '[Client] API: gfx.glow.get_strength', status: 'completed' },
          { label: '[Client] API: gfx.glow.get_mix', status: 'completed' },
          { label: '[Client] API: gfx.glow.get_bloom', status: 'completed' },
          { label: '[Client] API: gfx.glow.get_blend_mode', status: 'completed' },
          { label: '[Client] API: gfx.glow.get_hdr_bleed_threshold', status: 'completed' },
          { label: '[Client] API: gfx.glow.get_hdr_bleed_scale', status: 'completed' },
          { label: '[Client] API: gfx.glow.get_hdr_luminance_cap', status: 'completed' },
          { label: '[Client] API: gfx.glow.get_map_strength', status: 'completed' },
          { label: '[Client] API: gfx.glow.get_map', status: 'completed' },
          { label: '[Client] API: gfx.glow.set_enabled', status: 'completed' },
          { label: '[Client] API: gfx.glow.set_level_intensity', status: 'completed' },
          { label: '[Client] API: gfx.glow.set_normalized', status: 'completed' },
          { label: '[Client] API: gfx.glow.set_intensity', status: 'completed' },
          { label: '[Client] API: gfx.glow.set_strength', status: 'completed' },
          { label: '[Client] API: gfx.glow.set_mix', status: 'completed' },
          { label: '[Client] API: gfx.glow.set_bloom', status: 'completed' },
          { label: '[Client] API: gfx.glow.set_blend_mode', status: 'completed' },
          { label: '[Client] API: gfx.glow.set_hdr_bleed_threshold', status: 'completed' },
          { label: '[Client] API: gfx.glow.set_hdr_bleed_scale', status: 'completed' },
          { label: '[Client] API: gfx.glow.set_hdr_luminance_cap', status: 'completed' },
          { label: '[Client] API: gfx.glow.set_map_strength', status: 'completed' },
          { label: '[Client] API: gfx.glow.set_map', status: 'completed' },
          { label: '[Client] API: gfx.glow.reset_map', status: 'completed' }

        ]
      },
      {
        label: 'SSR',
        desc: 'Screen-space reflection step count and fade control from Lua',
        icon: <lucide.Sparkles {...config_site.info.lucide}/>,
        items: [
          { label: '[Client] API: gfx.ssr.is_enabled', status: 'completed' },
          { label: '[Client] API: gfx.ssr.get_max_steps', status: 'completed' },
          { label: '[Client] API: gfx.ssr.get_fade_in', status: 'completed' },
          { label: '[Client] API: gfx.ssr.get_fade_out', status: 'completed' },
          { label: '[Client] API: gfx.ssr.get_depth_tolerance', status: 'completed' },
          { label: '[Client] API: gfx.ssr.set_enabled', status: 'completed' },
          { label: '[Client] API: gfx.ssr.set_max_steps', status: 'completed' },
          { label: '[Client] API: gfx.ssr.set_fade_in', status: 'completed' },
          { label: '[Client] API: gfx.ssr.set_fade_out', status: 'completed' },
          { label: '[Client] API: gfx.ssr.set_depth_tolerance', status: 'completed' }
        ]
      },
      {
        label: 'SSIL',
        desc: 'Screen-space indirect lighting radius and intensity control from Lua',
        icon: <lucide.Lightbulb {...config_site.info.lucide}/>,
        items: [
          { label: '[Client] API: gfx.ssil.is_enabled', status: 'completed' },
          { label: '[Client] API: gfx.ssil.get_radius', status: 'completed' },
          { label: '[Client] API: gfx.ssil.get_intensity', status: 'completed' },
          { label: '[Client] API: gfx.ssil.get_sharpness', status: 'completed' },
          { label: '[Client] API: gfx.ssil.get_normal_rejection', status: 'completed' },
          { label: '[Client] API: gfx.ssil.set_enabled', status: 'completed' },
          { label: '[Client] API: gfx.ssil.set_radius', status: 'completed' },
          { label: '[Client] API: gfx.ssil.set_intensity', status: 'completed' },
          { label: '[Client] API: gfx.ssil.set_sharpness', status: 'completed' },
          { label: '[Client] API: gfx.ssil.set_normal_rejection', status: 'completed' }
        ]
      },
      {
        label: 'SDFGI',
        desc: 'Signed distance field global illumination cascades and quality control from Lua',
        icon: <lucide.Sun {...config_site.info.lucide}/>,
        items: [
          { label: '[Client] Enum: gfx.sdfgi.y_scale', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.is_enabled', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.is_using_occlusion', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.is_reading_sky_light', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.get_cascades', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.get_min_cell_size', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.get_max_distance', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.get_y_scale', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.get_bounce_feedback', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.get_energy', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.get_normal_bias', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.get_probe_bias', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.set_enabled', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.set_cascades', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.set_min_cell_size', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.set_max_distance', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.set_y_scale', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.set_use_occlusion', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.set_bounce_feedback', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.set_read_sky_light', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.set_energy', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.set_normal_bias', status: 'completed' },
          { label: '[Client] API: gfx.sdfgi.set_probe_bias', status: 'completed' }
        ]
      },
      {
        label: 'SSAO',
        desc: 'Screen-space ambient occlusion radius, power, and channel control from Lua',
        icon: <lucide.Layers {...config_site.info.lucide}/>,
        items: [
          { label: '[Client] API: gfx.ssao.is_enabled', status: 'completed' },
          { label: '[Client] API: gfx.ssao.get_radius', status: 'completed' },
          { label: '[Client] API: gfx.ssao.get_intensity', status: 'completed' },
          { label: '[Client] API: gfx.ssao.get_power', status: 'completed' },
          { label: '[Client] API: gfx.ssao.get_detail', status: 'completed' },
          { label: '[Client] API: gfx.ssao.get_horizon', status: 'completed' },
          { label: '[Client] API: gfx.ssao.get_sharpness', status: 'completed' },
          { label: '[Client] API: gfx.ssao.get_direct_light_affect', status: 'completed' },
          { label: '[Client] API: gfx.ssao.get_channel_affect', status: 'completed' },
          { label: '[Client] API: gfx.ssao.set_enabled', status: 'completed' },
          { label: '[Client] API: gfx.ssao.set_radius', status: 'completed' },
          { label: '[Client] API: gfx.ssao.set_intensity', status: 'completed' },
          { label: '[Client] API: gfx.ssao.set_power', status: 'completed' },
          { label: '[Client] API: gfx.ssao.set_detail', status: 'completed' },
          { label: '[Client] API: gfx.ssao.set_horizon', status: 'completed' },
          { label: '[Client] API: gfx.ssao.set_sharpness', status: 'completed' },
          { label: '[Client] API: gfx.ssao.set_direct_light_affect', status: 'completed' },
          { label: '[Client] API: gfx.ssao.set_channel_affect', status: 'completed' }
        ]
      },
      {
        label: 'Fog',
        desc: 'Exponential and depth-based fog density, lighting, and scattering control from Lua',
        icon: <lucide.CloudFog {...config_site.info.lucide}/>,
        items: [
          { label: '[Client] Enum: gfx.fog.fog_mode', status: 'completed' },
          { label: '[Client] API: gfx.fog.is_enabled', status: 'completed' },
          { label: '[Client] API: gfx.fog.get_mode', status: 'completed' },
          { label: '[Client] API: gfx.fog.get_light_color', status: 'completed' },
          { label: '[Client] API: gfx.fog.get_light_energy', status: 'completed' },
          { label: '[Client] API: gfx.fog.get_sun_scatter', status: 'completed' },
          { label: '[Client] API: gfx.fog.get_density', status: 'completed' },
          { label: '[Client] API: gfx.fog.get_height', status: 'completed' },
          { label: '[Client] API: gfx.fog.get_height_density', status: 'completed' },
          { label: '[Client] API: gfx.fog.get_aerial_perspective', status: 'completed' },
          { label: '[Client] API: gfx.fog.get_sky_affect', status: 'completed' },
          { label: '[Client] API: gfx.fog.get_depth_curve', status: 'completed' },
          { label: '[Client] API: gfx.fog.get_depth_begin', status: 'completed' },
          { label: '[Client] API: gfx.fog.get_depth_end', status: 'completed' },
          { label: '[Client] API: gfx.fog.set_enabled', status: 'completed' },
          { label: '[Client] API: gfx.fog.set_mode', status: 'completed' },
          { label: '[Client] API: gfx.fog.set_light_color', status: 'completed' },
          { label: '[Client] API: gfx.fog.set_light_energy', status: 'completed' },
          { label: '[Client] API: gfx.fog.set_sun_scatter', status: 'completed' },
          { label: '[Client] API: gfx.fog.set_density', status: 'completed' },
          { label: '[Client] API: gfx.fog.set_height', status: 'completed' },
          { label: '[Client] API: gfx.fog.set_height_density', status: 'completed' },
          { label: '[Client] API: gfx.fog.set_aerial_perspective', status: 'completed' },
          { label: '[Client] API: gfx.fog.set_sky_affect', status: 'completed' },
          { label: '[Client] API: gfx.fog.set_depth_curve', status: 'completed' },
          { label: '[Client] API: gfx.fog.set_depth_begin', status: 'completed' },
          { label: '[Client] API: gfx.fog.set_depth_end', status: 'completed' }
        ]
      },
      {
        label: 'Volumetric Fog',
        desc: 'Participating media density, emission, and temporal reprojection control from Lua',
        icon: <lucide.CloudHail {...config_site.info.lucide}/>,
        items: [
          { label: '[Client] API: gfx.volumetric_fog.is_enabled', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.is_temporal_reprojection_enabled', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.get_emission', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.get_albedo', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.get_density', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.get_emission_energy', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.get_anisotropy', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.get_length', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.get_detail_spread', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.get_gi_inject', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.get_ambient_inject', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.get_sky_affect', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.get_temporal_reprojection_amount', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.set_enabled', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.set_emission', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.set_albedo', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.set_density', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.set_emission_energy', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.set_anisotropy', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.set_length', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.set_detail_spread', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.set_gi_inject', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.set_ambient_inject', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.set_sky_affect', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.set_temporal_reprojection_enabled', status: 'completed' },
          { label: '[Client] API: gfx.volumetric_fog.set_temporal_reprojection_amount', status: 'completed' }
        ]
      },
      {
        // TODO: WIP
        label: 'Shader',
        desc: 'Runtime shader compilation and ShaderMaterial parameter/uniform control from Lua',
        icon: <lucide.Sliders {...config_site.info.lucide}/>,
        items: [
          { label: 'Custom shader authoring and compilation from Lua', status: 'pending' },
          { label: 'ShaderMaterial.set_shader_parameter', status: 'pending' },
          { label: 'Texture uniform binding', status: 'pending' },
          { label: 'Float / vec2 / vec3 / color uniforms', status: 'pending' },
          { label: 'Per-instance uniform override', status: 'pending' },
          { label: 'Auto-bind model textures to shader uniforms (albedo / normal / ORM)', status: 'pending' },
          { label: 'ShaderMaterial — replace BaseMaterial3D on surface while preserving original textures', status: 'pending' },
        ]
      },
      {
        // TODO: WIP
        label: 'Decals',
        desc: 'Project textures onto surfaces at runtime — bullet holes, footprints, and damage overlays',
        icon: <lucide.Stamp {...config_site.info.lucide}/>,
        items: [
          { label: 'Decal node creation / placement', status: 'pending' },
          { label: 'Texture assignment per channel', status: 'pending' },
          { label: 'Size, fade distance, modulate', status: 'pending' },
        ]
      },
      {
        // TODO: WIP
        label: 'GPU Particles',
        desc: 'GPUParticles3D control — emission, restart, and process material parameters from Lua',
        icon: <lucide.Wind {...config_site.info.lucide}/>,
        items: [
          { label: 'GPUParticles3D node access', status: 'pending' },
          { label: 'Emit / restart / one-shot', status: 'pending' },
          { label: 'Amount, lifetime, speed scale', status: 'pending' },
          { label: 'Process material param overrides', status: 'pending' },
          { label: 'Trail & sub-emitters', status: 'pending' },
        ],
      }
    ]
  },

  {
    name: 'Lighting',
    cards: [
      {
        // TODO: WIP
        label: 'Lighting',
        desc: 'Runtime creation and configuration of Directional, Omni, and Spot lights from Lua',
        icon: <lucide.Sun {...config_site.info.lucide}/>,
        items: [
          { label: 'DirectionalLight3D', status: 'pending' },
          { label: 'OmniLight3D', status: 'pending' },
          { label: 'SpotLight3D', status: 'pending' },
          { label: 'Shadow mode & bias control', status: 'pending' },
          { label: 'Light bake mode', status: 'pending' },
        ]
      }
    ]
  },

  {
    name: 'Physics',
    cards: [
      {
        // TODO: WIP
        label: 'Physics 3D',
        desc: 'Raycast, shapecast, apply forces and impulses to rigid bodies, and query collision layers from Lua',
        icon: <lucide.Atom {...config_site.info.lucide}/>,
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
        ]
      },
      {
        // TODO: WIP
        label: 'Navigation',
        desc: 'Navmesh pathfinding, agent steering, and RVO2 avoidance for NPC and AI movement from Lua',
        icon: <lucide.Navigation {...config_site.info.lucide}/>,
        priority: 'Must have',
        items: [
          { label: 'NavigationServer3D singleton access', status: 'pending' },
          { label: 'NavigationAgent3D (target / velocity)', status: 'pending' },
          { label: 'get_simple_path (point-to-point)', status: 'pending' },
          { label: 'Navmesh region queries', status: 'pending' },
          { label: 'Avoidance (RVO2)', status: 'pending' },
          { label: 'Navigation layers', status: 'pending' },
        ],
      }
    ]
  },

  {
    name: 'Audio',
    cards: [
      {
        // TODO: WIP
        label: 'Audio 2D',
        desc: 'Flat stereo playback, bus routing, and bus effects from Lua',
        icon: <lucide.Volume2 {...config_site.info.lucide}/>,
        priority: 'Must have',
        items: [
          { label: 'AudioStreamPlayer (2D flat)', status: 'pending' },
          { label: 'Play / stop / pause / seek', status: 'pending' },
          { label: 'Volume (linear & dB) control', status: 'pending' },
          { label: 'Pitch scale control', status: 'pending' },
          { label: 'AudioServer bus routing', status: 'pending' },
          { label: 'Bus effects (Reverb / EQ / Limiter)', status: 'pending' },
          { label: 'AudioStream format: OGG / WAV / MP3', status: 'pending' },
        ]
      },
      {
        // TODO: WIP
        label: 'Audio 3D',
        desc: 'Positional playback with attenuation and panning from Lua',
        icon: <lucide.Headphones {...config_site.info.lucide}/>,
        priority: 'Must have',
        items: [
          { label: 'AudioStreamPlayer3D (positional)', status: 'pending' },
          { label: 'Play / stop / pause / seek', status: 'pending' },
          { label: 'Volume (linear & dB) control', status: 'pending' },
          { label: 'Pitch scale control', status: 'pending' },
          { label: 'Attenuation model & max distance', status: 'pending' },
          { label: 'AudioServer bus routing', status: 'pending' },
          { label: 'AudioStream format: OGG / WAV / MP3', status: 'pending' },
        ],
      }
    ]
  },
  
  {
    name: 'Network',
    cards: [
      {
        // TODO: WIP
        label: 'ENet Transport',
        desc: 'Low-level ENet UDP transport — reliable, sequenced, and unreliable packet delivery',
        icon: <lucide.Network {...config_site.info.lucide}/>,
        items: [
          { label: 'ENet client connect / disconnect', status: 'completed' },
          { label: 'ENet server host / close', status: 'completed' },
          { label: 'Peer join / leave tracking', status: 'completed' },
          { label: 'Peer ID management', status: 'completed' },
          { label: 'Reliable RPC transport', status: 'completed' },
          { label: 'Unreliable / sequenced channels', status: 'pending' },
          { label: 'Auto-reconnect with configurable attempts and delay', status: 'completed' },
          { label: 'Bandwidth limiting', status: 'pending' },
          { label: 'send / broadcast API', status: 'completed' },
          { label: 'Peer handshake on connect', status: 'completed' },
          { label: 'Ping & round-trip time', status: 'pending' },
        ]
      },
      {
        // TODO: WIP
        label: 'Multiplayer API',
        desc: 'High-level RPC, entity spawning, and state synchronization from Lua',
        icon: <lucide.Users {...config_site.info.lucide}/>,
        items: [
          { label: 'MultiplayerAPI setup', status: 'completed' },
          { label: 'MultiplayerSpawner with custom spawn delegate', status: 'completed' },
          { label: 'MultiplayerSynchronizer — position & rotation replication', status: 'completed' },
          { label: 'Synced model spawn with per-peer authority assignment', status: 'completed' },
          { label: 'Spawn queue — deferred spawn until asset is ready', status: 'completed' },
          { label: 'Lua RPC bindings', status: 'pending' },
        ]
      },
      {
        // TODO: WIP
        label: 'WebSocket',
        desc: 'Full-duplex WebSocket client and server for real-time browser and service communication',
        icon: <lucide.Wifi {...config_site.info.lucide}/>,
        items: [
          { label: 'WebSocketPeer.connect_to_url', status: 'pending' },
          { label: 'send / receive (text & binary)', status: 'pending' },
          { label: 'WebSocketServer (listen / accept)', status: 'pending' },
          { label: 'TLS / WSS support', status: 'pending' },
        ]
      },
      {
        // TODO: WIP
        label: 'VoIP',
        desc: 'In-game voice communication — capture, encode, transmit, and decode player audio in real time',
        icon: <lucide.Mic {...config_site.info.lucide}/>,
        items: [
          { label: 'Microphone capture via AudioEffectCapture', status: 'pending' },
          { label: 'Opus encoding / decoding', status: 'pending' },
          { label: 'Voice packet send / receive over ENet', status: 'pending' },
          { label: 'Per-peer 3D positional playback', status: 'pending' },
          { label: 'Mute / unmute (local & remote)', status: 'pending' },
          { label: 'Voice activity detection (VAD)', status: 'pending' },
          { label: 'Volume per speaker', status: 'pending' },
        ],
      }
    ]
  },

  {
    name: 'Integrations',
    cards: [
      {
        // TODO: WIP
        label: 'Discord SDK',
        desc: 'Native Discord Rich Presence — dynamic state, player count, images, and invite links',
        icon: <lucide.Gamepad2 {...config_site.info.lucide}/>,
        items: [
          { label: 'Rich Presence state & details', status: 'completed' },
          { label: 'Large / small image keys', status: 'completed' },
          { label: 'Player count placeholders', status: 'completed' },
          { label: 'Discord invite link integration', status: 'completed' },
          { label: 'Dynamic updates at runtime', status: 'completed' },
        ],
      }
    ],
  }
]);
