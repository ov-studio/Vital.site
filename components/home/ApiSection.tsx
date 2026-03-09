import { API_TABS } from '@/configs/homeData';

export function ApiSection() {
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
