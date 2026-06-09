import * as Icons from 'lucide-react';
import { site } from '@/configs/site';

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
        label: 'Framework',
        desc: 'Godot-backed framework — platform targets, build configuration, and low-level engine internals',
        icon: <Icons.Puzzle {...site.lucide} />,
        items: [
          { label: 'Platform: Windows support', status: 'completed' },
          { label: 'Platform: Linux support', status: 'pending' }
        ],
      },
      {
        // TODO: WIP
        label: 'Main Menu',
        desc: 'Client entry point — play, game browser, settings, credits, and quit',
        icon: <Icons.LayoutDashboard {...site.lucide} />,
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
        desc: 'Client server browser — query, filter, sort, favorite, and join available game servers',
        icon: <Icons.Server {...site.lucide} />,
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
        label: 'Settings Menu',
        desc: 'Client settings menu — window mode, resolution, keybinds, audio, and display configuration',
        icon: <Icons.SlidersHorizontal {...site.lucide} />,
        items: [
          { label: 'Window mode (fullscreen / borderless / windowed)', status: 'pending' },
          { label: 'Resolution & DPI / scale factor', status: 'pending' },
          { label: 'Window title & icon', status: 'pending' },
          { label: 'Clipboard get / set', status: 'pending' },
          { label: 'Cursor mode (visible / hidden / captured)', status: 'pending' },
          { label: 'Multi-monitor screen info', status: 'pending' },
          { label: 'Keybind configuration', status: 'pending' },
          { label: 'Audio output device & volume', status: 'pending' },
        ],
      },
      {
        label: 'Console',
        desc: 'Runtime console — commands, debug output, and structured logging across both sides',
        icon: <Icons.Terminal {...site.lucide} />,
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
          { label: '[Client] Command: status', status: 'pending' },
        ],
      },
      {
        label: 'Resource System',
        desc: 'Runtime resource manager — loading, caching, unloading, and client-side asset sync and download',
        icon: <Icons.FolderOpen {...site.lucide} />,
        items: [
          { label: '[Server] Resource scanner', status: 'completed' },
          { label: '[Shared] Resource cache', status: 'completed' },
          { label: '[Shared] Resource loader / unloader', status: 'completed' },
          { label: '[Shared] Resource asset compression', status: 'completed' },
          { label: '[Shared] Resource asset streaming via HTTP server', status: 'completed' },
          { label: '[Shared] Resource-scoped entity lifetime', status: 'completed' },
          { label: '[Shared] Per-resource isolated Lua environments', status: 'completed' },
          { label: '[Shared] Main-thread execution enforcement for Lua script callbacks', status: 'completed' },
          { label: '[Shared] Runtime cross-resource exports', status: 'completed' },
          { label: '[Client] Manifest-driven asset sync with hash verification', status: 'completed' },
          { label: '[Client] Concurrent threaded downloads with cancellation', status: 'completed' },
        ],
      },
      {
        // TODO: WIP
        label: 'Performance Monitor',
        desc: 'Runtime performance monitor — FPS, frame time, draw calls, memory usage, and object counts',
        icon: <Icons.Activity {...site.lucide} />,
        items: [
          { label: 'Performance.get (FPS / frame time)', status: 'pending' },
          { label: 'Draw calls & vertices', status: 'pending' },
          { label: 'Static / dynamic memory', status: 'pending' },
          { label: 'Physics step time', status: 'pending' },
          { label: 'Object / node count', status: 'pending' },
        ],
      }
    ],
  },

  {
    name: 'Core',
    cards: [
      {
        label: 'Engine',
        desc: 'Top-level engine singleton access for runtime and scene control',
        icon: <Icons.Cpu {...site.lucide} />,
        items: [
          { label: '[Shared] API: engine.print', status: 'completed' },
          { label: '[Shared] API: engine.iprint', status: 'completed' },
          { label: '[Shared] API: engine.inspect', status: 'completed' },
          { label: '[Client] API: engine.quit', status: 'pending' },
          { label: '[Shared] API: engine.compile_string', status: 'completed' },
          { label: '[Shared] API: engine.load_string', status: 'completed' },
          { label: '[Shared] API: engine.get_tick', status: 'completed' },
          { label: '[Shared] API: engine.get_version', status: 'completed' },
          { label: '[Shared] API: engine.get_serial', status: 'completed' },
          { label: '[Shared] API: engine.get_entities', status: 'completed' },
          { label: '[Shared] API: engine.get_resolution', status: 'completed' }
        ],
      },
      {
        label: 'Database',
        desc: 'Embedded database interface for persistent structured data storage and retrieval',
        icon: <Icons.Database {...site.lucide} />,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Database Backend: MySQL', status: 'completed' },
          { label: 'ORM-style query with chainable methods', status: 'completed' },
          { label: 'Asynchronous query execution', status: 'completed' },
          { label: '[Server] API: database.create', status: 'completed' },
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
        ],
      },
      {
        label: 'Model',
        desc: 'Load, instantiate, transform, animate, and manage 3D model assets at runtime',
        icon: <Icons.Box {...site.lucide} />,
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
        ],
      },
      {
        // TODO: WIP
        label: 'Camera 3D',
        desc: 'FOV, near/far clip, projection mode, and per-camera environment override from Lua',
        icon: <Icons.Video {...site.lucide} />,
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
        label: 'Webview',
        desc: 'HTML/CSS/JS renderer with bidirectional Lua - JS messaging',
        icon: <Icons.Code2 {...site.lucide} />,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Bidirectional Lua - JS messaging', status: 'completed' },
          { label: 'Serve webview files over HTTP instead of file://', status: 'pending' },
          { label: '[Client] API: webview.create', status: 'completed' },
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
        ],
      },
      {
        label: 'Canvas',
        desc: '2D drawing API — shapes, images and text composited into rendertarget each frame',
        icon: <Icons.PenTool {...site.lucide} />,
        items: [
          { label: '[Client] API: engine.world_to_screen', status: 'completed' },
          { label: '[Client] API: engine.screen_to_world', status: 'completed' },
          { label: '[Client] API: engine.draw_line', status: 'completed' },
          { label: '[Client] API: engine.draw_polygon', status: 'completed' },
          { label: '[Client] API: engine.draw_rectangle', status: 'completed' },
          { label: '[Client] API: engine.draw_circle', status: 'completed' },
          { label: '[Client] API: engine.draw_image', status: 'completed' },
          { label: '[Client] API: engine.draw_text', status: 'completed' }
        ],
      },
      {
        label: 'Font',
        desc: 'Runtime font loading, unloading, and rendering for canvas-level text with antialiasing control',
        icon: <Icons.Type {...site.lucide} />,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Format: TTF', status: 'completed' },
          { label: 'Format: OTF', status: 'completed' },
          { label: 'Format: WOFF', status: 'completed' },
          { label: 'Format: WOFF2', status: 'completed' },
          { label: '[Client] API: font.create', status: 'completed' },
          { label: '[Client] API: self<font>:is_type', status: 'completed' },
          { label: '[Client] API: self<font>:get_type', status: 'completed' },
          { label: '[Client] API: self<font>:destroy', status: 'completed' },
          { label: '[Client] API: self<font>:get_antialiasing', status: 'completed' },
          { label: '[Client] API: self<font>:get_oversampling', status: 'completed' },
          { label: '[Client] API: self<font>:set_antialiasing', status: 'completed' },
          { label: '[Client] API: self<font>:set_oversampling', status: 'completed' }
        ],
      },
      {
        label: 'Texture',
        desc: 'Runtime image texture loading, unloading, and rendering with implicit cache for draw calls',
        icon: <Icons.Image {...site.lucide} />,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Format: JPG | JPEG', status: 'completed' },
          { label: 'Format: PNG', status: 'completed' },
          { label: 'Format: WEBP', status: 'completed' },
          { label: 'Format: KTX | DDS (compressed)', status: 'pending' },
          { label: 'Implicit texture cache for draw calls', status: 'completed' },
          { label: '[Client] API: texture.create', status: 'completed' },
          { label: '[Client] API: self<texture>:is_type', status: 'completed' },
          { label: '[Client] API: self<texture>:get_type', status: 'completed' },
          { label: '[Client] API: self<texture>:destroy', status: 'completed' }
        ],
      },
      {
        label: 'SVG',
        desc: 'Runtime vector SVG loading, unloading, rendering, and mutation from raw string buffers',
        icon: <Icons.FileCode {...site.lucide} />,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Format: SVG', status: 'completed' },
          { label: 'SVG instantiation and mutation from raw string buffers', status: 'completed' },
          { label: '[Client] API: svg.create', status: 'completed' },
          { label: '[Client] API: svg.create_from_raw', status: 'completed' },
          { label: '[Client] API: self<svg>:is_type', status: 'completed' },
          { label: '[Client] API: self<svg>:get_type', status: 'completed' },
          { label: '[Client] API: self<svg>:destroy', status: 'completed' },
          { label: '[Client] API: self<svg>:update', status: 'completed' }
        ],
      },
      {
        label: 'Rendertarget',
        desc: 'Off-screen render surfaces — create, bind, and sample as textures in the scene',
        icon: <Icons.Layers {...site.lucide} />,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Optional alpha-transparent render surface', status: 'completed' },
          { label: 'Optional immediate-mode per-frame updates', status: 'completed' },
          { label: '[Client] API: rendertarget.create', status: 'completed' },
          { label: '[Client] API: rendertarget.get_active', status: 'completed' },
          { label: '[Client] API: rendertarget.set_active', status: 'completed' },
          { label: '[Client] API: self<rendertarget>:is_type', status: 'completed' },
          { label: '[Client] API: self<rendertarget>:get_type', status: 'completed' },
          { label: '[Client] API: self<rendertarget>:destroy', status: 'completed' },
          { label: '[Client] API: self<rendertarget>:is_active', status: 'completed' },
          { label: '[Client] API: self<rendertarget>:get_size', status: 'completed' },
          { label: '[Client] API: self<rendertarget>:set_active', status: 'completed' }
        ],
      },
      {
        // TODO: WIP
        label: 'Screenshot Capture',
        desc: 'Grab the current viewport frame as a raw image or save directly to disk',
        icon: <Icons.Camera {...site.lucide} />,
        items: [
          { label: 'Viewport.get_texture snapshot', status: 'pending' },
          { label: 'Save to PNG / JPG', status: 'pending' },
          { label: 'Region capture (partial frame)', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'MeshInstance & Primitives',
        desc: 'Create primitive meshes (box, sphere, capsule, cylinder) and control MeshInstance3D from Lua',
        icon: <Icons.Shapes {...site.lucide} />,
        items: [
          { label: 'BoxMesh / SphereMesh / CapsuleMesh', status: 'pending' },
          { label: 'CylinderMesh / PlaneMesh', status: 'pending' },
          { label: 'MeshInstance3D creation', status: 'pending' },
          { label: 'Surface material assignment', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'Tween',
        desc: 'Interpolate any node property smoothly with easing functions, chaining, and parallel playback',
        icon: <Icons.TrendingUp {...site.lucide} />,
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
    ],
  },

  {
    name: 'Utility',
    cards: [
      {
        label: 'Math',
        desc: 'Lua math library, enriched with sandbox-native utilities and helpers',
        icon: <Icons.Calculator {...site.lucide} />,
        items: [
          { label: '[Shared] API: math.abs', status: 'completed' },
          { label: '[Shared] API: math.ceil', status: 'completed' },
          { label: '[Shared] API: math.floor', status: 'completed' },
          { label: '[Shared] API: math.sqrt', status: 'completed' },
          { label: '[Shared] API: math.exp', status: 'completed' },
          { label: '[Shared] API: math.log', status: 'completed' },
          { label: '[Shared] API: math.fmod', status: 'completed' },
          { label: '[Shared] API: math.modf', status: 'completed' },
          { label: '[Shared] API: math.max', status: 'completed' },
          { label: '[Shared] API: math.min', status: 'completed' },
          { label: '[Shared] API: math.sin', status: 'completed' },
          { label: '[Shared] API: math.cos', status: 'completed' },
          { label: '[Shared] API: math.tan', status: 'completed' },
          { label: '[Shared] API: math.asin', status: 'completed' },
          { label: '[Shared] API: math.acos', status: 'completed' },
          { label: '[Shared] API: math.atan', status: 'completed' },
          { label: '[Shared] API: math.deg', status: 'completed' },
          { label: '[Shared] API: math.rad', status: 'completed' },
          { label: '[Shared] API: math.random', status: 'completed' },
          { label: '[Shared] API: math.randomseed', status: 'completed' },
          { label: '[Shared] API: math.tointeger', status: 'completed' },
          { label: '[Shared] API: math.type', status: 'completed' },
          { label: '[Shared] API: math.ult', status: 'completed' },
          { label: '[Shared] Constant: math.pi', status: 'completed' },
          { label: '[Shared] Constant: math.huge', status: 'completed' },
          { label: '[Shared] Constant: math.maxinteger', status: 'completed' },
          { label: '[Shared] Constant: math.mininteger', status: 'completed' },
        ],
      },
      {
        label: 'String',
        desc: 'Lua string library, enriched with sandbox-native utilities and helpers',
        icon: <Icons.Regex {...site.lucide} />,
        items: [
          { label: '[Shared] API: string.void', status: 'completed' },
          { label: '[Shared] API: string.parse', status: 'completed' },
          { label: '[Shared] API: string.parse_hex', status: 'completed' },
          { label: '[Shared] API: string.len', status: 'completed' },
          { label: '[Shared] API: string.byte', status: 'completed' },
          { label: '[Shared] API: string.char', status: 'completed' },
          { label: '[Shared] API: string.find', status: 'completed' },
          { label: '[Shared] API: string.match', status: 'completed' },
          { label: '[Shared] API: string.gmatch', status: 'completed' },
          { label: '[Shared] API: string.sub', status: 'completed' },
          { label: '[Shared] API: string.gsub', status: 'completed' },
          { label: '[Shared] API: string.format', status: 'completed' },
          { label: '[Shared] API: string.format_time', status: 'completed' },
          { label: '[Shared] API: string.lower', status: 'completed' },
          { label: '[Shared] API: string.upper', status: 'completed' },
          { label: '[Shared] API: string.reverse', status: 'completed' },
          { label: '[Shared] API: string.rep', status: 'completed' },
          { label: '[Shared] API: string.kern', status: 'completed' },
          { label: '[Shared] API: string.split', status: 'completed' },
          { label: '[Shared] API: string.pack', status: 'completed' },
          { label: '[Shared] API: string.packsize', status: 'completed' },
          { label: '[Shared] API: string.unpack', status: 'completed' },
        ],
      },
      {
        label: 'Table',
        desc: 'Lua table library, enriched with sandbox-native utilities and helpers',
        icon: <Icons.Table {...site.lucide} />,
        items: [
          { label: '[Shared] API: table.len', status: 'completed' },
          { label: '[Shared] API: table.pack', status: 'completed' },
          { label: '[Shared] API: table.unpack', status: 'completed' },
          { label: '[Shared] API: table.insert', status: 'completed' },
          { label: '[Shared] API: table.remove', status: 'completed' },
          { label: '[Shared] API: table.move', status: 'completed' },
          { label: '[Shared] API: table.sort', status: 'completed' },
          { label: '[Shared] API: table.clone', status: 'completed' },
          { label: '[Shared] API: table.concat', status: 'completed' },
          { label: '[Shared] API: table.encode', status: 'completed' },
          { label: '[Shared] API: table.decode', status: 'completed' },
        ],
      },
      {
        label: 'Timer',
        desc: 'Precise one-shot and repeating timer scheduling with millisecond accuracy',
        icon: <Icons.Timer {...site.lucide}/>,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: 'Customizable interval', status: 'completed' },
          { label: 'Customizable executions', status: 'completed' },
          { label: '[Shared] API: timer.create', status: 'completed' },
          { label: '[Shared] API: self<timer>:is_type', status: 'completed' },
          { label: '[Shared] API: self<timer>:get_type', status: 'completed' },
          { label: '[Shared] API: self<timer>:destroy', status: 'completed' }
        ],
      },
      {
        label: 'Promise',
        desc: 'Deferred values with full chaining, resolution, rejection, and async/await support',
        icon: <Icons.CheckCircle {...site.lucide}/>,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: '[Shared] API: promise.create', status: 'completed' },
          { label: '[Shared] API: self<promise>:is_type', status: 'completed' },
          { label: '[Shared] API: self<promise>:get_type', status: 'completed' },
          { label: '[Shared] API: self<promise>:destroy', status: 'completed' },
          { label: '[Shared] API: self<promise>:is_pending', status: 'completed' },
          { label: '[Shared] API: self<promise>:resolve', status: 'completed' },
          { label: '[Shared] API: self<promise>:reject', status: 'completed' }
        ],
      },
      {
        label: 'Thread',
        desc: 'Low-level thread management, pooling, and lifecycle control from Lua',
        icon: <Icons.Blocks {...site.lucide}/>,
        items: [
          { label: 'Lifecycle hooks', status: 'completed' },
          { label: '[Shared] API: thread.create', status: 'completed' },
          { label: '[Shared] API: thread.current', status: 'completed' },
          { label: '[Shared] API: self<thread>:is_type', status: 'completed' },
          { label: '[Shared] API: self<thread>:get_type', status: 'completed' },
          { label: '[Shared] API: self<thread>:destroy', status: 'completed' },
          { label: '[Shared] API: self<thread>:resume', status: 'completed' },
          { label: '[Shared] API: self<thread>:pause', status: 'completed' },
          { label: '[Shared] API: self<thread>:sleep', status: 'completed' },
          { label: '[Shared] API: self<thread>:await', status: 'completed' }
        ],
      },
      {
        label: 'File',
        desc: 'Read, write, and manage files on disk from within Lua scripts',
        icon: <Icons.FileText {...site.lucide}/>,
        items: [
          { label: '[Shared] API: file.exists', status: 'completed' },
          { label: '[Shared] API: file.size', status: 'completed' },
          { label: '[Shared] API: file.hash', status: 'completed' },
          { label: '[Shared] API: file.delete', status: 'completed' },
          { label: '[Shared] API: file.read', status: 'completed' },
          { label: '[Shared] API: file.write', status: 'completed' },
          { label: '[Shared] API: file.contents', status: 'completed' }
        ],
      },
      {
        label: 'HTTP',
        desc: 'Full async HTTP layer for communicating with external REST APIs and asset servers',
        icon: <Icons.Globe {...site.lucide}/>,
        items: [
          { label: 'Customizable headers', status: 'completed' },
          { label: 'Customizable timeout', status: 'completed' },
          { label: '[Shared] API: http.get', status: 'completed' },
          { label: '[Shared] API: http.post', status: 'completed' },
        ],
      },
      {
        label: 'Crypto',
        desc: 'Cryptographic primitives for hashing, signing, and securing sensitive payloads',
        icon: <Icons.Lock {...site.lucide}/>,
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
          { label: '[Shared] API: crypto.hash', status: 'completed' },
          { label: '[Shared] API: crypto.encode', status: 'completed' },
          { label: '[Shared] API: crypto.decode', status: 'completed' },
          { label: '[Shared] API: crypto.encrypt', status: 'completed' },
          { label: '[Shared] API: crypto.decrypt', status: 'completed' }
        ],
      },
      {
        label: 'Shrinker',
        desc: 'Asset and data compression / decompression to reduce memory footprint and transfer overhead',
        icon: <Icons.Package {...site.lucide}/>,
        items: [
          { label: 'Data compression via zstd library', status: 'completed' },
          { label: '[Shared] API: shrinker.compress', status: 'completed' },
          { label: '[Shared] API: shrinker.decompress', status: 'completed' }
        ],
      },
      {
        label: 'Exports',
        desc: 'Cross-resource function registry — expose and consume APIs across resource boundaries',
        icon: <Icons.Blocks {...site.lucide}/>,
        items: [
          { label: '[Shared] API: exports.register', status: 'completed' },
          { label: '[Shared] API: exports.call', status: 'completed' },
          { label: '[Shared] API: exports.list', status: 'completed' },
        ],
      },
      {
        // TODO: WIP
        label: 'Inspect',
        desc: 'Hardware inspection, device fingerprinting, and runtime environment queries',
        icon: <Icons.FingerprintPattern {...site.lucide}/>,
        items: [
          { label: 'CPU info (cores, arch)', status: 'pending' },
          { label: 'OS platform detection', status: 'pending' },
          { label: 'Memory usage query', status: 'pending' },
          { label: 'Device fingerprint generation', status: 'completed' },
        ],
      },
      {
        // TODO: WIP
        label: 'Event',
        desc: 'Publish / subscribe event bus for decoupled, reactive module communication',
        icon: <Icons.Zap {...site.lucide}/>,
        items: [
          { label: 'Priority-ordered listeners', status: 'pending' },
          { label: 'Auto-unsubscribe listeners', status: 'pending' },
          { label: '[Shared] API: event.on', status: 'partial' },
          { label: '[Shared] API: event.off', status: 'pending' },
          { label: '[Shared] API: event.emit', status: 'pending' },
          { label: '[Shared] API: event.emit_callback', status: 'pending' }
        ],
      },
      {
        label: 'Resource',
        desc: 'Introspect the running resource and control start, stop, and restart of server-managed resources',
        icon: <Icons.PackageOpen {...site.lucide} />,
        items: [
          { label: '[Shared] API: resource.current', status: 'completed' },
          { label: '[Server] API: resource.start', status: 'pending' },
          { label: '[Server] API: resource.stop', status: 'pending' },
          { label: '[Server] API: resource.restart', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'Input',
        desc: 'Key state, mouse position and buttons, scroll delta, gamepad axes, and action map from Lua',
        icon: <Icons.Gamepad2 {...site.lucide}/>,
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
      }
    ],
  },

  {
    name: 'Graphics',
    cards: [
      {
        // TODO: WIP
        label: 'Environment',
        desc: 'Post-process, global illumination, and world environment control from Lua',
        icon: <Icons.Sparkles {...site.lucide}/>,
        items: [
          { label: 'Adjustment (brightness / contrast / saturation / LUT)', status: 'completed' },
          { label: 'Emissive', status: 'completed' },
          { label: 'SSR (Screen-Space Reflections)', status: 'completed' },
          { label: 'SSIL (Screen-Space Indirect Lighting)', status: 'completed' },
          { label: 'SDFGI (Signed Distance Field GI)', status: 'completed' },
          { label: 'SSAO (Screen-Space Ambient Occlusion)', status: 'completed' },
          { label: 'Fog (height & depth)', status: 'completed' },
          { label: 'Volumetric fog', status: 'completed' },
          { label: 'Sky / panorama background', status: 'pending' },
          { label: 'Ambient light color & energy', status: 'pending' },
          { label: 'Exposure & white balance', status: 'pending' },
          { label: 'Environment reset', status: 'pending' }
        ],
      },
      {
        // TODO: WIP
        label: 'Lighting',
        desc: 'Runtime creation and configuration of Directional, Omni, and Spot lights from Lua',
        icon: <Icons.Sun {...site.lucide}/>,
        items: [
          { label: 'DirectionalLight3D', status: 'pending' },
          { label: 'OmniLight3D', status: 'pending' },
          { label: 'SpotLight3D', status: 'pending' },
          { label: 'Shadow mode & bias control', status: 'pending' },
          { label: 'Light bake mode', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'Shader',
        desc: 'Runtime shader compilation and ShaderMaterial parameter/uniform control from Lua',
        icon: <Icons.Sliders {...site.lucide}/>,
        items: [
          { label: 'Custom shader authoring and compilation from Lua', status: 'pending' },
          { label: 'ShaderMaterial.set_shader_parameter', status: 'pending' },
          { label: 'Texture uniform binding', status: 'pending' },
          { label: 'Float / vec2 / vec3 / color uniforms', status: 'pending' },
          { label: 'Per-instance uniform override', status: 'pending' },
          { label: 'Auto-bind model textures to shader uniforms (albedo / normal / ORM)', status: 'pending' },
          { label: 'ShaderMaterial — replace BaseMaterial3D on surface while preserving original textures', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'Decals',
        desc: 'Project textures onto surfaces at runtime — bullet holes, footprints, and damage overlays',
        icon: <Icons.Stamp {...site.lucide}/>,
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
        icon: <Icons.Wind {...site.lucide}/>,
        items: [
          { label: 'GPUParticles3D node access', status: 'pending' },
          { label: 'Emit / restart / one-shot', status: 'pending' },
          { label: 'Amount, lifetime, speed scale', status: 'pending' },
          { label: 'Process material param overrides', status: 'pending' },
          { label: 'Trail & sub-emitters', status: 'pending' },
        ],
      }
    ],
  },

  {
    name: 'Physics',
    cards: [
      {
        // TODO: WIP
        label: 'Physics 3D',
        desc: 'Raycast, shapecast, apply forces and impulses to rigid bodies, and query collision layers from Lua',
        icon: <Icons.Atom {...site.lucide}/>,
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
        desc: 'Navmesh pathfinding, agent steering, and RVO2 avoidance for NPC and AI movement from Lua',
        icon: <Icons.Navigation {...site.lucide}/>,
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
    ],
  },

  {
    name: 'Audio',
    cards: [
      {
        // TODO: WIP
        label: 'Audio 2D',
        desc: 'Flat stereo playback, bus routing, and bus effects from Lua',
        icon: <Icons.Volume2 {...site.lucide}/>,
        priority: 'Must have',
        items: [
          { label: 'AudioStreamPlayer (2D flat)', status: 'pending' },
          { label: 'Play / stop / pause / seek', status: 'pending' },
          { label: 'Volume (linear & dB) control', status: 'pending' },
          { label: 'Pitch scale control', status: 'pending' },
          { label: 'AudioServer bus routing', status: 'pending' },
          { label: 'Bus effects (Reverb / EQ / Limiter)', status: 'pending' },
          { label: 'AudioStream format: OGG / WAV / MP3', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'Audio 3D',
        desc: 'Positional playback with attenuation and panning from Lua',
        icon: <Icons.Headphones {...site.lucide}/>,
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
    ],
  },
  
  {
    name: 'Network',
    cards: [
      {
        // TODO: WIP
        label: 'ENet Transport',
        desc: 'Low-level ENet UDP transport — reliable, sequenced, and unreliable packet delivery',
        icon: <Icons.Network {...site.lucide}/>,
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
        ],
      },
      {
        // TODO: WIP
        label: 'Multiplayer API',
        desc: 'High-level RPC, entity spawning, and state synchronization from Lua',
        icon: <Icons.Users {...site.lucide}/>,
        items: [
          { label: 'MultiplayerAPI setup', status: 'completed' },
          { label: 'MultiplayerSpawner with custom spawn delegate', status: 'completed' },
          { label: 'MultiplayerSynchronizer — position & rotation replication', status: 'completed' },
          { label: 'Synced model spawn with per-peer authority assignment', status: 'completed' },
          { label: 'Spawn queue — deferred spawn until asset is ready', status: 'completed' },
          { label: 'Lua RPC bindings', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'WebSocket',
        desc: 'Full-duplex WebSocket client and server for real-time browser and service communication',
        icon: <Icons.Wifi {...site.lucide}/>,
        items: [
          { label: 'WebSocketPeer.connect_to_url', status: 'pending' },
          { label: 'send / receive (text & binary)', status: 'pending' },
          { label: 'WebSocketServer (listen / accept)', status: 'pending' },
          { label: 'TLS / WSS support', status: 'pending' },
        ],
      },
      {
        // TODO: WIP
        label: 'VoIP',
        desc: 'In-game voice communication — capture, encode, transmit, and decode player audio in real time',
        icon: <Icons.Mic {...site.lucide}/>,
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
    ],
  },

  {
    name: 'Integrations',
    cards: [
      {
        // TODO: WIP
        label: 'Discord SDK',
        desc: 'Native Discord Rich Presence — dynamic state, player count, images, and invite links',
        icon: <Icons.Gamepad2 {...site.lucide}/>,
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