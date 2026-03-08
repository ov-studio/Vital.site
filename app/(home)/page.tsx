'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import './home.css';

export default function HomePage() {
  useEffect(() => {
    // --- Cursor ---
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

    // --- Nav scroll ---
    const onScroll = () => {
      const nav = document.getElementById('nav');
      if (nav) nav.classList.toggle('s', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);

    // --- Reveal on scroll ---
    const allRevs = document.querySelectorAll<HTMLElement>('.rev,.rev-l,.rev-r');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const sibs = [...(e.target.parentElement?.querySelectorAll('.rev,.rev-l,.rev-r') ?? [])];
          const idx = sibs.indexOf(e.target as Element);
          setTimeout(() => e.target.classList.add('in'), idx * 70);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    allRevs.forEach(el => io.observe(el));

    // --- API tabs ---
    const fnames: Record<string, string> = {
      canvas: 'server/hud.lua', net: 'server/fetch.lua',
      gfx: 'server/gfx.lua', async: 'server/async.lua',
    };
    const tabs = document.querySelectorAll<HTMLElement>('.atab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const t = tab.dataset.t!;
        const current = document.querySelector<HTMLElement>('.cpane.on');
        const next = document.getElementById('cp-' + t);
        if (!next || current === next) return;
        document.querySelectorAll('.atab').forEach(tb => tb.classList.remove('on'));
        tab.classList.add('on');
        const cfile = document.getElementById('cfile');
        if (cfile) cfile.textContent = fnames[t];
        current?.classList.remove('on');
        requestAnimationFrame(() => next.classList.add('on'));
      });
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animId);
      io.disconnect();
    };
  }, []);

  return (
    <>

      <div id="vignette"></div>
      <div id="cur"><div id="cur-inner"></div></div>
      <div id="cur-outer"></div>

      {/* NAV */}
      <nav id="nav">
        <div className="ni">
          <div className="logo">
            <Image src="/vital_sandbox_logo.png" alt="vital.sandbox" width={36} height={36} style={{filter:'invert(1) brightness(2)'}} />
            <div className="logo-text">vital<b>.</b>sandbox</div>
          </div>
          <ul className="nl">
            <li><a href="#features">Features</a></li>
            <li><a href="#api">API</a></li>
            <li><a href="#compare">Compare</a></li>
            <li><a href="/docs">Docs</a></li>
          </ul>
          <a href="#" className="ncta">Get Started</a>
        </div>
      </nav>

      {/* ANNOUNCEMENT BAR */}
      <div className="announce-bar">
        <span className="announce-dot"></span>
        <span className="announce-text">vital.sandbox is currently in active development — APIs and features are subject to change. Not recommended for production use.</span>
        <a href="#" className="announce-link">View Roadmap
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
      </div>

      {/* HERO */}
      <section id="hero">
        <div className="hgrid"></div>
        <div className="hero-center">
          <Image src="/vital_sandbox_logo.png" alt="" width={72} height={72} className="hero-logo" />
          <div className="hero-wordmark"><span className="hw-vital">Vital</span><span className="hw-dot">.</span><span className="hw-sub">sandbox</span></div>
          <div className="hero-motto">
            <span>Script It.</span>
            <span className="hm-sep">—</span>
            <span className="hm-blue">Ship It.</span>
            <span className="hm-sep">—</span>
            <span>Limitless.</span>
          </div>
          <p className="hero-sub">The next-generation sandbox runtime. One language, infinite power — Lua from the ground up, built on Godot, engineered in C++17.</p>
          <div className="hbtns">
            <a href="#" className="btn-primary">Start Building</a>
            <a href="#features" className="btn-secondary">
              Explore Features
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
          <div className="hero-stats">
            <div className="hstat"><span className="hstat-n">C++17</span><span className="hstat-l">Engine Core</span></div>
            <div className="hstat-div"></div>
            <div className="hstat"><span className="hstat-n">Lua</span><span className="hstat-l">Scripting</span></div>
            <div className="hstat-div"></div>
            <div className="hstat"><span className="hstat-n">100+</span><span className="hstat-l">API Functions</span></div>
            <div className="hstat-div"></div>
            <div className="hstat"><span className="hstat-n">Open Source</span><span className="hstat-l">No Royalties</span></div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{padding:'100px 0',borderTop:'1px solid var(--rule)',minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <div className="sw">
          <div className="sec-head">
            <div className="rev">
              <div className="slabel">Platform</div>
              <h2>Built for creators.<br/>Engineered for <span>production.</span></h2>
            </div>
            <a href="#" className="sec-link rev">View all docs <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
          </div>

          {/* Rendering */}
          <div className="feat-group rev">
            <div className="feat-group-label">Rendering</div>
            <div className="feat-grid">
              {[
                {n:'01',title:'Canvas',desc:'Draw shapes, images, text, and polygons on the canvas each frame.',icon:<><rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>},
                {n:'02',title:'RenderTarget',desc:'Create and bind off-screen surfaces, sampled as textures at runtime.',icon:<><rect x="1" y="3" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M11 6l4-2v6l-4-2" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></>},
                {n:'03',title:'Texture',desc:'Load, unload, and control texture samplers at runtime.',icon:<><rect x="3" y="3" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/></>},
                {n:'04',title:'Font & Text',desc:'Load fonts and render text with full size and color control.',icon:<><path d="M3 12V5l4-2 4 2v7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6 12V9h4v3" stroke="currentColor" strokeWidth="1.2"/></>},
                {n:'05',title:'Webview',desc:'Render embedded web content inside your sandbox window.',icon:<><rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7h6M5 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>},
                {n:'06',title:'GFX Post-Processing',desc:'Fog, LUTs, depth curves, and color grading — scriptable per frame.',icon:<path d="M2 10L5 4l3 6 2-3 2 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>},
              ].map(f => (
                <div className="fc" key={f.n}>
                  <div className="fc-top"><div className="fc-num">{f.n}</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none">{f.icon}</svg></div></div>
                  <h3>{f.title}</h3><p>{f.desc}</p><div className="fc-bar"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Threading */}
          <div className="feat-group rev" style={{marginTop:'2px'}}>
            <div className="feat-group-label">Threading & Async</div>
            <div className="feat-grid">
              <div className="fc"><div className="fc-top"><div className="fc-num">07</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v4l3 2-3 2v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 5l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></div></div><h3>Async / Await</h3><p>Non-blocking async execution with clean control flow.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">08</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Promises</h3><p>Deferred values with chaining, resolution, and try/catch support.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">09</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3a5 5 0 100 10A5 5 0 008 3z" stroke="currentColor" strokeWidth="1.2"/><path d="M8 6v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Heartbeats</h3><p>Recurring callbacks at defined intervals for loops and polling.</p><div className="fc-bar"></div></div>
              <div className="fc" style={{gridColumn:'span 3'}}><div className="fc-top"><div className="fc-num">10</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h4v4H2zM10 4h4v4h-4zM6 10h4v4H6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg></div></div><h3>Threader</h3><p>Low-level thread management, pooling, and lifecycle control.</p><div className="fc-bar"></div></div>
            </div>
          </div>

          {/* Models */}
          <div className="feat-group rev" style={{marginTop:'2px'}}>
            <div className="feat-group-label">Models</div>
            <div className="feat-grid">
              <div className="fc"><div className="fc-top"><div className="fc-num">11</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l5 3v6l-5 3-5-3V5l5-3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg></div></div><h3>Load & Unload</h3><p>Load and unload named model assets at runtime, no restarts.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">12</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg></div></div><h3>Instantiation</h3><p>Spawn and destroy independent instances from a shared asset.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">13</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/></svg></div></div><h3>Transform</h3><p>Per-instance position, rotation, and scale at runtime.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">14</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 13V6l5-3 5 3v7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Animation</h3><p>Per-instance animation with speed, loop, pause, and resume.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">15</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M4 13c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Blend Shapes</h3><p>Per-component blend shapes for expressions and body morphs.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">16</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4h8v8H4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4 7h8M7 4v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Component Visibility</h3><p>Per-component mesh visibility for clothing and equipment systems.</p><div className="fc-bar"></div></div>
            </div>
          </div>

          {/* Core & Integrations */}
          <div className="feat-group rev" style={{marginTop:'2px'}}>
            <div className="feat-group-label">Core & Integrations</div>
            <div className="feat-grid">
              <div className="fc"><div className="fc-top"><div className="fc-num">17</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="3" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M6 8l1.5 1.5L10 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></div></div><h3>Crypto</h3><p>Primitives for hashing, encryption, and payload security.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">18</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l2-8h4l2 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.5 8.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Shrinker</h3><p>Compress assets and data to reduce memory and transfer overhead.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">19</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/></svg></div></div><h3>REST Networking</h3><p>Native HTTP GET and POST with full header support.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">20</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8a5 5 0 0010 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8 3v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M5 5l3-2 3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></div></div><h3>Discord SDK</h3><p>Native Rich Presence and Discord API integration.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">21</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M6 8h2m2-2.5L8 8l2 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Event System</h3><p>Pub/sub events for decoupled inter-module communication.</p><div className="fc-bar"></div></div>
              <div className="fc"><div className="fc-top"><div className="fc-num">22</div><div className="fc-ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5 8h2M5 10.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M5 4V3M11 4V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div></div><h3>Console</h3><p>Runtime console for commands, debug, info, and error output.</p><div className="fc-bar"></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* API */}
      <section id="api" style={{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <div className="sw" style={{paddingTop:'100px',paddingBottom:'100px'}}>
          <div className="slabel rev">Developer API</div>
          <h2 className="rev" style={{marginBottom:'48px'}}>Clean. Typed. <span>Powerful.</span></h2>
          <div className="api-wrap">
            <div className="api-left rev-l">
              <p style={{fontSize:'.95rem',color:'var(--dim)',lineHeight:'1.8',fontWeight:300,marginBottom:'32px'}}>Every function follows the same conventions — predictable return values, structured errors, zero boilerplate.</p>
              <div className="api-tabs">
                <div className="atab on" data-t="canvas"><div className="atab-n">01</div><div><div className="atab-name">Canvas</div><div className="atab-sig">draw_rectangle · draw_text · draw_circle</div></div></div>
                <div className="atab" data-t="net"><div className="atab-n">02</div><div><div className="atab-name">Networking</div><div className="atab-sig">rest.get · rest.post</div></div></div>
                <div className="atab" data-t="gfx"><div className="atab-n">03</div><div><div className="atab-name">GFX</div><div className="atab-sig">fog · depth · LUTs · adjustment</div></div></div>
                <div className="atab" data-t="async"><div className="atab-n">04</div><div><div className="atab-name">Async</div><div className="atab-sig">thread · promise · try/catch</div></div></div>
              </div>
            </div>
            <div className="api-right rev-r">
              <div className="code-win">
                <div className="cbar">
                  <div className="cfile-tab">
                    <svg viewBox="0 0 12 12"><path d="M2 1h5l3 3v7H2z"/><path d="M7 1v3h3"/></svg>
                    <span className="cfile" id="cfile">server/hud.lua</span>
                  </div>
                  <div className="cbar-spacer"></div>
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
                  </pre></div>
                  <div className="cpane" id="cp-net"><pre>
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
                  </pre></div>
                  <div className="cpane" id="cp-gfx"><pre>
<span className="cm">{'-- depth fog + cinematic LUT'}</span>{'\n'}
gfx<span className="pu">.</span>fog<span className="pu">.</span><span className="fn">set_mode</span><span className="pu">(</span><span className="st">{'"depth"'}</span><span className="pu">)</span>{'\n'}
gfx<span className="pu">.</span>fog<span className="pu">.</span><span className="fn">set_depth_begin</span><span className="pu">(</span><span className="nm">10.0</span><span className="pu">)</span>{'\n'}
gfx<span className="pu">.</span>fog<span className="pu">.</span><span className="fn">set_depth_end</span><span className="pu">(</span><span className="nm">200.0</span><span className="pu">)</span>{'\n'}
gfx<span className="pu">.</span>fog<span className="pu">.</span><span className="fn">set_depth_curve</span><span className="pu">(</span><span className="nm">1.5</span><span className="pu">)</span>{'\n\n'}
gfx<span className="pu">.</span>adjustment<span className="pu">.</span><span className="fn">set_lut</span><span className="pu">(</span><span className="st">{'"lut/cinematic.png"'}</span><span className="pu">)</span>
                  </pre></div>
                  <div className="cpane" id="cp-async"><pre>
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

      {/* WHY */}
      <section id="compare" style={{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',borderTop:'1px solid var(--rule)'}}>
        <div className="sw" style={{paddingTop:'100px',paddingBottom:'100px'}}>
          <div className="slabel rev">Why vital.sandbox</div>
          <h2 className="rev" style={{marginBottom:'56px'}}>No bloat. No strings.<br/><span>Just power.</span></h2>
          <div className="why-grid rev">
            {[
              {title:'Open Source',desc:'Fully open-source, no licensing fees, no royalties, no strings attached. What you build belongs to you — completely and unconditionally.',icon:<path d="M10 2l2.4 5 5.6.8-4 4 .9 5.5L10 14.5l-4.9 2.8.9-5.5-4-4 5.6-.8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>},
              {title:'Zero Monetization Limits',desc:'No platform cuts, no revenue gates, no forced monetization systems. Ship free, charge what you want, keep everything.',icon:<><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></>},
              {title:'No Bloat',desc:'Lean by design. No unnecessary abstractions, no forced frameworks. Nothing stands between your scripts and the engine.',icon:<><path d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.4"/></>},
              {title:'Full Runtime Scripting',desc:'Script everything at runtime — rendering, networking, threading, models, GFX — one unified Lua API, top to bottom.',icon:<><path d="M4 4h12v8H4zM8 16h4M10 12v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></>},
              {title:'Modding & Plugin Ready',desc:'Built for user scripting, modding, and plugin systems from day one. Full sandboxed Lua isolation — safe, powerful, extensible.',icon:<><path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" stroke="currentColor" strokeWidth="1.4"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></>},
              {title:'Performance First',desc:'Built on Godot, engineered in C++17. No overhead, no interpreter bottlenecks — maximum throughput at every layer.',icon:<path d="M5 10h10M10 5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>},
            ].map(c => (
              <div className="why-card" key={c.title}>
                <div className="why-ico"><svg width="20" height="20" viewBox="0 0 20 20" fill="none">{c.icon}</svg></div>
                <h3>{c.title}</h3><p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}


      {/* FOOTER */}
      <footer>
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-brand-lock">
              <Image src="/vital_sandbox_logo.png" alt="vital.sandbox" width={28} height={28} style={{filter:'brightness(0) invert(1)',opacity:.7}} />
              <div className="footer-brand-name">Vital.sandbox</div>
            </div>
            <p className="footer-tagline">The next-generation sandbox runtime. One language, infinite power — built on Godot, engineered in C++17.</p>
          </div>
          <div className="footer-nav">
            <div className="footer-nav-col"><h4>Product</h4><ul><li><a href="#">Features</a></li><li><a href="#">API Reference</a></li><li><a href="#">Changelog</a></li><li><a href="#">Roadmap</a></li></ul></div>
            <div className="footer-nav-col"><h4>Resources</h4><ul><li><a href="/docs">Documentation</a></li><li><a href="#">Examples</a></li><li><a href="#">Lua Guide</a></li><li><a href="https://github.com/ov-studio/Vital.sandbox">C++ SDK</a></li></ul></div>
            <div className="footer-nav-col"><h4>Community</h4><ul><li><a href="https://github.com/ov-studio">GitHub</a></li><li><a href="http://discord.gg/sVCnxPW">Discord</a></li><li><a href="https://ko-fi.com/ovstudio">Ko-fi</a></li><li><a href="/docs/building">Contributing</a></li></ul></div>
          </div>
        </div>
      </footer>
    </>
  );
}
