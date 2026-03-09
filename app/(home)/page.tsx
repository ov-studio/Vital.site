'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import './home.css';

// ─── Types ────────────────────────────────────────────────────────────────────

type FeatureItem = {
  n: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  wide?: boolean;
};

type WhyItem = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};

type FooterCol = {
  heading: string;
  links: { label: string; href: string }[];
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'API', href: '#api' },
  { label: 'Compare', href: '#compare' },
  { label: 'Docs', href: '/docs' },
];

const HERO_STATS = [
  { value: 'C++17', label: 'Engine Core' },
  { value: 'Lua', label: 'Scripting' },
  { value: '100+', label: 'API Functions' },
  { value: 'Open Source', label: 'No Royalties' },
];

const FEATURE_GROUPS: { group: string; items: FeatureItem[] }[] = [
  {
    group: 'Rendering',
    items: [
      { n: '01', title: 'Canvas', desc: 'Draw shapes, images, text, and polygons on the canvas each frame.', icon: <><rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" /><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></> },
      { n: '02', title: 'RenderTarget', desc: 'Create and bind off-screen surfaces, sampled as textures at runtime.', icon: <><rect x="1" y="3" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" /><path d="M11 6l4-2v6l-4-2" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></> },
      { n: '03', title: 'Texture', desc: 'Load, unload, and control texture samplers at runtime.', icon: <><rect x="3" y="3" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" /><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" /></> },
      { n: '04', title: 'Font & Text', desc: 'Load fonts and render text with full size and color control.', icon: <><path d="M3 12V5l4-2 4 2v7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><path d="M6 12V9h4v3" stroke="currentColor" strokeWidth="1.2" /></> },
      { n: '05', title: 'Webview', desc: 'Render embedded web content inside your sandbox window.', icon: <><rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" /><path d="M5 7h6M5 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></> },
      { n: '06', title: 'GFX Post-Processing', desc: 'Fog, LUTs, depth curves, and color grading — scriptable per frame.', icon: <path d="M2 10L5 4l3 6 2-3 2 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /> },
    ],
  },
  {
    group: 'Threading & Async',
    items: [
      { n: '07', title: 'Async / Await', desc: 'Non-blocking async execution with clean control flow.', icon: <><path d="M8 2v4l3 2-3 2v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 5l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></> },
      { n: '08', title: 'Promises', desc: 'Deferred values with chaining, resolution, and try/catch support.', icon: <><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" /><path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></> },
      { n: '09', title: 'Heartbeats', desc: 'Recurring callbacks at defined intervals for loops and polling.', icon: <><path d="M8 3a5 5 0 100 10A5 5 0 008 3z" stroke="currentColor" strokeWidth="1.2" /><path d="M8 6v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></> },
      { n: '10', title: 'Threader', desc: 'Low-level thread management, pooling, and lifecycle control.', wide: true, icon: <path d="M2 4h4v4H2zM10 4h4v4h-4zM6 10h4v4H6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /> },
    ],
  },
  {
    group: 'Models',
    items: [
      { n: '11', title: 'Load & Unload', desc: 'Load and unload named model assets at runtime, no restarts.', icon: <path d="M8 2l5 3v6l-5 3-5-3V5l5-3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /> },
      { n: '12', title: 'Instantiation', desc: 'Spawn and destroy independent instances from a shared asset.', icon: <><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" /><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" /><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" /><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" /></> },
      { n: '13', title: 'Transform', desc: 'Per-instance position, rotation, and scale at runtime.', icon: <><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" /></> },
      { n: '14', title: 'Animation', desc: 'Per-instance animation with speed, loop, pause, and resume.', icon: <><path d="M3 13V6l5-3 5 3v7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><path d="M6 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></> },
      { n: '15', title: 'Blend Shapes', desc: 'Per-component blend shapes for expressions and body morphs.', icon: <><circle cx="8" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" /><path d="M4 13c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></> },
      { n: '16', title: 'Component Visibility', desc: 'Per-component mesh visibility for clothing and equipment systems.', icon: <><path d="M4 4h8v8H4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><path d="M4 7h8M7 4v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></> },
    ],
  },
  {
    group: 'Core & Integrations',
    items: [
      { n: '17', title: 'Crypto', desc: 'Primitives for hashing, encryption, and payload security.', icon: <><rect x="3" y="3" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" /><path d="M6 8l1.5 1.5L10 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></> },
      { n: '18', title: 'Shrinker', desc: 'Compress assets and data to reduce memory and transfer overhead.', icon: <><path d="M4 12l2-8h4l2 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5.5 8.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></> },
      { n: '19', title: 'REST Networking', desc: 'Native HTTP GET and POST with full header support.', icon: <><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" /><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" /></> },
      { n: '20', title: 'Discord SDK', desc: 'Native Rich Presence and Discord API integration.', icon: <><path d="M3 8a5 5 0 0010 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><path d="M8 3v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><path d="M5 5l3-2 3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></> },
      { n: '21', title: 'Event System', desc: 'Pub/sub events for decoupled inter-module communication.', icon: <><circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" /><circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.2" /><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.2" /><path d="M6 8h2m2-2.5L8 8l2 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></> },
      { n: '22', title: 'Console', desc: 'Runtime console for commands, debug, info, and error output.', icon: <><rect x="2" y="4" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" /><path d="M5 8h2M5 10.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><path d="M5 4V3M11 4V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></> },
    ],
  },
];

const API_TABS = [
  { id: 'canvas', n: '01', name: 'Canvas', sig: 'draw_rectangle · draw_text · draw_circle', file: 'server/hud.lua' },
  { id: 'net', n: '02', name: 'Networking', sig: 'rest.get · rest.post', file: 'server/fetch.lua' },
  { id: 'gfx', n: '03', name: 'GFX', sig: 'fog · depth · LUTs · adjustment', file: 'server/gfx.lua' },
  { id: 'async', n: '04', name: 'Async', sig: 'thread · promise · try/catch', file: 'server/async.lua' },
];

const WHY_ITEMS: WhyItem[] = [
  { title: 'Open Source', desc: 'Fully open-source, no licensing fees, no royalties, no strings attached. What you build belongs to you — completely and unconditionally.', icon: <path d="M10 2l2.4 5 5.6.8-4 4 .9 5.5L10 14.5l-4.9 2.8.9-5.5-4-4 5.6-.8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /> },
  { title: 'Zero Monetization Limits', desc: 'No platform cuts, no revenue gates, no forced monetization systems. Ship free, charge what you want, keep everything.', icon: <><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></> },
  { title: 'No Bloat', desc: 'Lean by design. No unnecessary abstractions, no forced frameworks. Nothing stands between your scripts and the engine.', icon: <><path d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.4" /></> },
  { title: 'Full Runtime Scripting', desc: 'Script everything at runtime — rendering, networking, threading, models, GFX — one unified Lua API, top to bottom.', icon: <><path d="M4 4h12v8H4zM8 16h4M10 12v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></> },
  { title: 'Modding & Plugin Ready', desc: 'Built for user scripting, modding, and plugin systems from day one. Full sandboxed Lua isolation — safe, powerful, extensible.', icon: <><path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" stroke="currentColor" strokeWidth="1.4" /><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></> },
  { title: 'Performance First', desc: 'Built on Godot, engineered in C++17. No overhead, no interpreter bottlenecks — maximum throughput at every layer.', icon: <path d="M5 10h10M10 5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /> },
];

const FOOTER_COLS: FooterCol[] = [
  { heading: 'Product', links: [{ label: 'Features', href: '#' }, { label: 'API Reference', href: '#' }, { label: 'Changelog', href: '#' }, { label: 'Roadmap', href: '#' }] },
  { heading: 'Resources', links: [{ label: 'Documentation', href: '/docs' }, { label: 'Examples', href: '#' }, { label: 'Lua Guide', href: '#' }, { label: 'C++ SDK', href: 'https://github.com/ov-studio/Vital.sandbox' }] },
  { heading: 'Community', links: [{ label: 'GitHub', href: 'https://github.com/ov-studio' }, { label: 'Discord', href: 'http://discord.gg/sVCnxPW' }, { label: 'Ko-fi', href: 'https://ko-fi.com/ovstudio' }, { label: 'Contributing', href: '/docs/building' }] },
];

// ─── Shared atoms ─────────────────────────────────────────────────────────────

function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeatureCard({ n, title, desc, icon, wide }: FeatureItem) {
  return (
    <div className="fc" style={wide ? { gridColumn: 'span 3' } : undefined}>
      <div className="fc-top">
        <div className="fc-num">{n}</div>
        <div className="fc-ico">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">{icon}</svg>
        </div>
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="fc-bar" />
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Overlays() {
  return (
    <>
      <div id="vignette" />
      <div id="cur"><div id="cur-inner" /></div>
      <div id="cur-outer" />
    </>
  );
}

function Navbar() {
  return (
    <nav id="nav">
      <div className="ni">
        <div className="logo">
          <Image src="/vital_sandbox_logo.png" alt="vital.sandbox" width={36} height={36} style={{ filter: 'invert(1) brightness(2)' }} />
          <div className="logo-text">vital<b>.</b>sandbox</div>
        </div>
        <ul className="nl">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}><a href={href}>{label}</a></li>
          ))}
        </ul>
        <a href="#" className="ncta">Get Started</a>
      </div>
    </nav>
  );
}

function AnnouncementBar() {
  return (
    <div className="announce-bar">
      <span className="announce-dot" />
      <span className="announce-text">
        vital.sandbox is currently in active development — APIs and features are subject to change. Not recommended for production use.
      </span>
      <a href="#" className="announce-link">
        View Roadmap
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}

function Hero() {
  return (
    <section id="hero">
      <div className="hgrid" />
      <div className="hero-center">
        <Image src="/vital_sandbox_logo.png" alt="" width={72} height={72} className="hero-logo" />
        <div className="hero-wordmark">
          <span className="hw-vital">Vital</span><span className="hw-dot">.</span><span className="hw-sub">sandbox</span>
        </div>
        <div className="hero-motto">
          <span>Script It.</span>
          <span className="hm-sep">—</span>
          <span className="hm-blue">Ship It.</span>
          <span className="hm-sep">—</span>
          <span>Limitless.</span>
        </div>
        <p className="hero-sub">
          The next-generation sandbox runtime. One language, infinite power — Lua from the ground up, built on Godot, engineered in C++17.
        </p>
        <div className="hbtns">
          <a href="#" className="btn-primary">Start Building</a>
          <a href="#features" className="btn-secondary">
            Explore Features
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
        <div className="hero-stats">
          {HERO_STATS.map(({ value, label }, i) => (
            <>
              {i > 0 && <div key={`div-${i}`} className="hstat-div" />}
              <div key={value} className="hstat">
                <span className="hstat-n">{value}</span>
                <span className="hstat-l">{label}</span>
              </div>
            </>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" style={{ padding: '100px 0', borderTop: '1px solid var(--rule)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="sw">
        <div className="sec-head">
          <div className="rev">
            <div className="slabel">Platform</div>
            <h2>Built for creators.<br />Engineered for <span>production.</span></h2>
          </div>
          <a href="#" className="sec-link rev">View all docs <ArrowRight /></a>
        </div>
        {FEATURE_GROUPS.map(({ group, items }, gi) => (
          <div key={group} className="feat-group rev" style={gi > 0 ? { marginTop: '2px' } : undefined}>
            <div className="feat-group-label">{group}</div>
            <div className="feat-grid">
              {items.map(item => <FeatureCard key={item.n} {...item} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ApiSection() {
  return (
    <section id="api" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="sw" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="slabel rev">Developer API</div>
        <h2 className="rev" style={{ marginBottom: '48px' }}>Clean. Typed. <span>Powerful.</span></h2>
        <div className="api-wrap">
          <div className="api-left rev-l">
            <p style={{ fontSize: '.95rem', color: 'var(--dim)', lineHeight: '1.8', fontWeight: 300, marginBottom: '32px' }}>
              Every function follows the same conventions — predictable return values, structured errors, zero boilerplate.
            </p>
            <div className="api-tabs">
              {API_TABS.map(({ id, n, name, sig }, i) => (
                <div key={id} className={`atab${i === 0 ? ' on' : ''}`} data-t={id}>
                  <div className="atab-n">{n}</div>
                  <div>
                    <div className="atab-name">{name}</div>
                    <div className="atab-sig">{sig}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="api-right rev-r">
            <div className="code-win">
              <div className="cbar">
                <div className="cfile-tab">
                  <svg viewBox="0 0 12 12"><path d="M2 1h5l3 3v7H2z" /><path d="M7 1v3h3" /></svg>
                  <span className="cfile" id="cfile">server/hud.lua</span>
                </div>
                <div className="cbar-spacer" />
                <span className="cbar-lang">Lua</span>
              </div>
              <div className="cpane-container">
                <div className="cpane on" id="cp-canvas"><pre>
                  <span className="cm">{'-- draw handler — fires every frame'}</span>{'\n'}
                  <span className="kw">network</span><span className="pu">:</span><span className="fn">fetch</span><span className="pu">(</span><span className="st">{'"vital.sandbox:draw"'}</span><span className="pu">, </span><span className="kw">true</span><span className="pu">)</span>{'\n'}
                  {'  '}<span className="pu">:</span><span className="fn">on</span><span className="pu">(</span><span className="kw">function</span><span className="pu">()</span>{'\n\n'}
                  {'  '}engine<span className="pu">.</span><span className="fn">draw_rectangle</span><span className="pu">({'{'}</span><span className="nm">20</span><span className="pu">, </span><span className="nm">20</span><span className="pu">{'}'}, {'{'}</span><span className="nm">300</span><span className="pu">, </span><span className="nm">88</span><span className="pu">{'}'}, {'{'}</span><span className="nm">0</span><span className="pu">,</span><span className="nm">0</span><span className="pu">,</span><span className="nm">0</span><span className="pu">,</span><span className="nm">.75</span><span className="pu">{'}'}, </span><span className="nm">1</span><span className="pu">, {'{'}</span><span className="nm">.4</span><span className="pu">,</span><span className="nm">.6</span><span className="pu">,</span><span className="nm">1</span><span className="pu">,</span><span className="nm">.3</span><span className="pu">{'})'}</span>{'\n'}
                  {'  '}engine<span className="pu">.</span><span className="fn">draw_text</span><span className="pu">(</span><span className="st">{'"Player HUD"'}</span><span className="pu">, {'{'}</span><span className="nm">32</span><span className="pu">,</span><span className="nm">36</span><span className="pu">{'}'}, {'{'}</span><span className="nm">290</span><span className="pu">,</span><span className="nm">72</span><span className="pu">{'}'}, font, </span><span className="nm">16</span><span className="pu">, {'{'}</span><span className="nm">1</span><span className="pu">,</span><span className="nm">1</span><span className="pu">,</span><span className="nm">1</span><span className="pu">,</span><span className="nm">1</span><span className="pu">{'})'}</span>{'\n'}
                  {'  '}engine<span className="pu">.</span><span className="fn">draw_circle</span><span className="pu">(</span><span className="nm">{'{'}</span><span className="nm">275</span><span className="pu">,</span><span className="nm">54</span><span className="nm">{'}'}</span><span className="pu">, </span><span className="nm">6</span><span className="pu">, {'{'}</span><span className="nm">.3</span><span className="pu">,</span><span className="nm">1</span><span className="pu">,</span><span className="nm">.5</span><span className="pu">,</span><span className="nm">1</span><span className="pu">{'})'}</span>{'\n'}
                  <span className="kw">end</span><span className="pu">)</span>
                </pre></div><div className="cpane" id="cp-net"><pre>
                  <span className="cm">{'-- async GET inside a thread'}</span>{'\n'}
                  <span className="kw">local</span> self <span className="pu">=</span> thread<span className="pu">:</span><span className="fn">create</span><span className="pu">(</span><span className="kw">function</span><span className="pu">(self)</span>{'\n'}
                  {'  '}self<span className="pu">:</span><span className="fn">try</span><span className="pu">({'{'}</span>{'\n'}
                  {'    '}exec <span className="pu">=</span> <span className="kw">function</span><span className="pu">()</span>{'\n'}
                  {'      '}<span className="kw">local</span> res <span className="pu">=</span> rest<span className="pu">.</span><span className="fn">get</span><span className="pu">(</span><span className="st">{'"https://api.example.com/data"'}</span><span className="pu">)</span>{'\n'}
                  {'      '}engine<span className="pu">.</span><span className="fn">print</span><span className="pu">(</span><span className="st">{'"info"'}</span><span className="pu">, res)</span>{'\n'}
                  {'    '}<span className="kw">end</span><span className="pu">,</span>{'\n'}
                  {'    '}catch <span className="pu">=</span> <span className="kw">function</span><span className="pu">(err)</span>{'\n'}
                  {'      '}engine<span className="pu">.</span><span className="fn">print</span><span className="pu">(</span><span className="st">{'"error"'}</span><span className="pu">, err)</span>{'\n'}
                  {'    '}<span className="kw">end</span>{'\n'}
                  {'  '}<span className="pu">{'})'}</span>{'\n'}
                  <span className="kw">end</span><span className="pu">)</span>{'\n'}
                  self<span className="pu">:</span><span className="fn">resume</span><span className="pu">()</span>
                </pre></div><div className="cpane" id="cp-gfx"><pre>
                  <span className="cm">{'-- depth fog + cinematic LUT'}</span>{'\n'}
                  gfx<span className="pu">.</span>fog<span className="pu">.</span><span className="fn">set_mode</span><span className="pu">(</span><span className="st">{'"depth"'}</span><span className="pu">)</span>{'\n'}
                  gfx<span className="pu">.</span>fog<span className="pu">.</span><span className="fn">set_depth_begin</span><span className="pu">(</span><span className="nm">10.0</span><span className="pu">)</span>{'\n'}
                  gfx<span className="pu">.</span>fog<span className="pu">.</span><span className="fn">set_depth_end</span><span className="pu">(</span><span className="nm">200.0</span><span className="pu">)</span>{'\n'}
                  gfx<span className="pu">.</span>fog<span className="pu">.</span><span className="fn">set_depth_curve</span><span className="pu">(</span><span className="nm">1.5</span><span className="pu">)</span>{'\n\n'}
                  gfx<span className="pu">.</span>adjustment<span className="pu">.</span><span className="fn">set_lut</span><span className="pu">(</span><span className="st">{'"lut/cinematic.png"'}</span><span className="pu">)</span>
                </pre></div><div className="cpane" id="cp-async"><pre>
                  <span className="cm">{'-- promise with error handling'}</span>{'\n'}
                  <span className="kw">local</span> p <span className="pu">=</span> thread<span className="pu">:</span><span className="fn">create_promise</span><span className="pu">()</span>{'\n'}
                  <span className="kw">local</span> self <span className="pu">=</span> thread<span className="pu">:</span><span className="fn">create</span><span className="pu">(</span><span className="kw">function</span><span className="pu">(self)</span>{'\n'}
                  {'  '}self<span className="pu">:</span><span className="fn">try</span><span className="pu">({'{'}</span>{'\n'}
                  {'    '}exec <span className="pu">=</span> <span className="kw">function</span><span className="pu">()</span>{'\n'}
                  {'      '}<span className="kw">local</span> r <span className="pu">= {'{'}</span>self<span className="pu">:</span><span className="fn">await</span><span className="pu">(p){'}'}</span>{'\n'}
                  {'      '}engine<span className="pu">.</span><span className="fn">print</span><span className="pu">(</span><span className="st">{'"info"'}</span><span className="pu">, table.</span><span className="fn">unpack</span><span className="pu">(r))</span>{'\n'}
                  {'    '}<span className="kw">end</span><span className="pu">,</span>{'\n'}
                  {'    '}catch <span className="pu">=</span> <span className="kw">function</span><span className="pu">(e)</span>{'\n'}
                  {'      '}engine<span className="pu">.</span><span className="fn">print</span><span className="pu">(</span><span className="st">{'"error"'}</span><span className="pu">, e)</span>{'\n'}
                  {'    '}<span className="kw">end</span>{'\n'}
                  {'  '}<span className="pu">{'})'}</span>{'\n'}
                  <span className="kw">end</span><span className="pu">)</span>{'\n'}
                  self<span className="pu">:</span><span className="fn">resume</span><span className="pu">()</span>
                </pre></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section id="compare" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTop: '1px solid var(--rule)' }}>
      <div className="sw" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="slabel rev">Why vital.sandbox</div>
        <h2 className="rev" style={{ marginBottom: '56px' }}>No bloat. No strings.<br /><span>Just power.</span></h2>
        <div className="why-grid rev">
          {WHY_ITEMS.map(({ title, desc, icon }) => (
            <div className="why-card" key={title}>
              <div className="why-ico">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">{icon}</svg>
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-brand-lock">
            <Image src="/vital_sandbox_logo.png" alt="vital.sandbox" width={28} height={28} style={{ filter: 'brightness(0) invert(1)', opacity: .7 }} />
            <div className="footer-brand-name">Vital.sandbox</div>
          </div>
          <p className="footer-tagline">
            The next-generation sandbox runtime. One language, infinite power — built on Godot, engineered in C++17.
          </p>
        </div>
        <div className="footer-nav">
          {FOOTER_COLS.map(({ heading, links }) => (
            <div className="footer-nav-col" key={heading}>
              <h4>{heading}</h4>
              <ul>
                {links.map(({ label, href }) => (
                  <li key={label}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Effects hook ─────────────────────────────────────────────────────────────

function usePageEffects() {
  useEffect(() => {
    // Custom cursor
    const cur = document.getElementById('cur');
    const co = document.getElementById('cur-outer');
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
    };
    document.addEventListener('mousemove', onMouseMove);

    let animId: number;
    const loop = () => {
      rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
      if (co) { co.style.left = rx + 'px'; co.style.top = ry + 'px'; }
      animId = requestAnimationFrame(loop);
    };
    loop();

    // Nav blur on scroll
    const onScroll = () => {
      document.getElementById('nav')?.classList.toggle('s', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);

    // Scroll-reveal
    const revEls = document.querySelectorAll<HTMLElement>('.rev,.rev-l,.rev-r');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const sibs = [...(e.target.parentElement?.querySelectorAll('.rev,.rev-l,.rev-r') ?? [])];
        const idx = sibs.indexOf(e.target as Element);
        setTimeout(() => e.target.classList.add('in'), idx * 70);
        observer.unobserve(e.target);
      });
    }, { threshold: 0.08 });
    revEls.forEach(el => observer.observe(el));

    // API tab switching
    const fileNames = Object.fromEntries(API_TABS.map(t => [t.id, t.file]));
    document.querySelectorAll<HTMLElement>('.atab').forEach(tab => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.t!;
        const current = document.querySelector<HTMLElement>('.cpane.on');
        const next = document.getElementById('cp-' + key);
        if (!next || current === next) return;
        document.querySelectorAll('.atab').forEach(t => t.classList.remove('on'));
        tab.classList.add('on');
        const cfile = document.getElementById('cfile');
        if (cfile) cfile.textContent = fileNames[key];
        current?.classList.remove('on');
        requestAnimationFrame(() => next.classList.add('on'));
      });
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  usePageEffects();
  return (
    <>
      <Overlays />
      <Navbar />
      <AnnouncementBar />
      <Hero />
      <FeaturesSection />
      <ApiSection />
      <WhySection />
      <Footer />
    </>
  );
}