'use client';
import * as ui_brand     from '@/ui/brand';
import * as ui_search    from '@/ui/search';
import * as ui_tabs      from '@/ui/tabs';
import * as ui_wallpaper from '@/ui/wallpaper';
import * as react        from 'react';
import * as lucide       from 'lucide-react';
import './index.css';

type Section = 'og' | 'logo';

const OG_W = 1000;
const OG_H = 300;
const LOGO_W = 1000;
const LOGO_H_TIGHT = 300;
const LOGO_H_PAD = 400;
const LOGO_SQ_TIGHT = 380;
const LOGO_SQ_PAD = 460;

export function Studio() {
  const [section, setSection] = react.useState<Section>('og');
  const [tagline, setTagline] = react.useState('Script It — Ship It — Limitless');
  const [ogPlaceholder, setOgPlaceholder] = react.useState(false);
  const [logoNeon, setLogoNeon] = react.useState(true);
  const [logoBg, setLogoBg] = react.useState(true);
  const [logoPad, setLogoPad] = react.useState(false);
  const [logoSquare, setLogoSquare] = react.useState(false);
  const [logoRound, setLogoRound] = react.useState(false);
  const [logoCenter, setLogoCenter] = react.useState(true);

  const ogRef = react.useRef<HTMLDivElement>(null);
  const logoRef = react.useRef<HTMLDivElement>(null);
  const logoSize = logoSquare
    ? (logoPad ? LOGO_SQ_PAD : LOGO_SQ_TIGHT)
    : null;
  const logoW = logoSize ?? LOGO_W;
  const logoH = logoSize ?? (logoPad ? LOGO_H_PAD : LOGO_H_TIGHT);

  async function download(
    ref: react.RefObject<HTMLDivElement | null>,
    filename: string,
    width: number,
    height: number,
    opts?: { transparent?: boolean }
  ) {
    if (!ref.current) return;

    let toPng: (node: HTMLElement, opts?: object) => Promise<string>;
    try {
      const mod = await import('html-to-image');
      toPng = mod.toPng;
    } catch {
      alert(
        'html-to-image is required for download.\n\n' +
          'Run:  cd frontend && npm i html-to-image'
      );
      return;
    }

    const el = ref.current;
    const prevClass = el.className;
    const prevBg = el.style.background;
    const prevBgImage = el.style.backgroundImage;

    if (opts?.transparent) {
      el.classList.remove('no-bg');
      el.classList.add('export-transparent');
      el.style.background = 'transparent';
      el.style.backgroundImage = 'none';
    }

    try {
      const dataUrl = await toPng(el, {
        cacheBust: true,
        pixelRatio: 2,
        width,
        height,
        backgroundColor: opts?.transparent ? null : undefined,
        style: {
          transform: 'none',
          margin: '0',
          padding: '0',
          width: `${width}px`,
          height: `${height}px`,
          ...(opts?.transparent
            ? { background: 'transparent', backgroundImage: 'none' }
            : {}),
        },
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      a.click();
    } catch (err) {
      console.error(err);
      alert('Export failed – check console');
    } finally {
      el.className = prevClass;
      el.style.background = prevBg;
      el.style.backgroundImage = prevBgImage;
    }
  }

  return (
    <section id="studio" className="sec-pad">
      <ui_wallpaper.Wallpaper seed={1}/>

      <div className="sw">
        <div className="page-head">
          <div className="sec-head sec-head--intro">
            <div>
              <div className="slabel">Studio</div>
              <h2>
                Brand assets,<br/>
                ready to <span>export.</span>
              </h2>
            </div>
          </div>
          <p className="studio-intro">
            Open Graph images and neon logos using the real Brand component.
          </p>
        </div>

        <div className="studio-panel-head">
          <ui_tabs.Tabs
            value={section}
            onChange={(id) => setSection(id as Section)}
            ariaLabel="Studio sections"
            items={[
              {
                id: 'og',
                label: 'Open Graph',
                icon: <lucide.Image size={14} strokeWidth={2.25}/>,
              },
              {
                id: 'logo',
                label: 'Logo Export',
                icon: <lucide.Shapes size={14} strokeWidth={2.25}/>,
              },
            ]}
          />
        </div>

        {/* Open Graph */}
        {section === 'og' && (
          <div className="studio-panel">
            <div className="studio-controls">
              <ui_search.Search
                value={tagline}
                onChange={setTagline}
                placeholder="Tagline…"
                icon={<lucide.Type size={14} strokeWidth={2}/>}
              />
              <label className="studio-check">
                <input
                  type="checkbox"
                  checked={ogPlaceholder}
                  onChange={(e) => setOgPlaceholder(e.target.checked)}
                />
                Placeholder
              </label>
              <button
                type="button"
                className="ws-action-btn ws-apply-btn"
                onClick={() => download(ogRef, 'og.png', OG_W, OG_H)}
              >
                Download
              </button>
            </div>

            <div className="studio-preview-wrap">
              <div
                ref={ogRef}
                className="studio-canvas studio-og"
                style={{ width: OG_W, height: OG_H }}
              >
                <div className="studio-og-content">
                  <ui_brand.Brand size="xl" variant="logo-only" neon={true}/>
                  {(tagline.trim() || ogPlaceholder) && (
                    <div
                      className={`studio-og-tagline${
                        !tagline.trim() && ogPlaceholder ? ' is-placeholder' : ''
                      }`}
                      aria-hidden={!tagline.trim()}
                    >
                      {tagline.trim()
                        ? tagline.split('—').map((part, i, arr) => (
                            <react.Fragment key={i}>
                              <span className={i === 1 ? 'hl' : ''}>{part.trim()}</span>
                              {i < arr.length - 1 && <span className="sep">—</span>}
                            </react.Fragment>
                          ))
                        : '\u00a0'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logo Export */}
        {section === 'logo' && (
          <div className="studio-panel">
            <div className="studio-controls">
              <label className="studio-check">
                <input
                  type="checkbox"
                  checked={logoNeon}
                  onChange={(e) => setLogoNeon(e.target.checked)}
                />
                Neon
              </label>
              <label className="studio-check">
                <input
                  type="checkbox"
                  checked={logoBg}
                  onChange={(e) => setLogoBg(e.target.checked)}
                />
                Background (--bg4)
              </label>
              <label className="studio-check">
                <input
                  type="checkbox"
                  checked={logoPad}
                  onChange={(e) => setLogoPad(e.target.checked)}
                />
                Extra padding
              </label>
              <label className="studio-check">
                <input
                  type="checkbox"
                  checked={logoSquare}
                  onChange={(e) => setLogoSquare(e.target.checked)}
                />
                Square
              </label>
              <label className="studio-check">
                <input
                  type="checkbox"
                  checked={logoRound}
                  onChange={(e) => setLogoRound(e.target.checked)}
                />
                Rounded
              </label>
              <label className="studio-check">
                <input
                  type="checkbox"
                  checked={logoCenter}
                  onChange={(e) => setLogoCenter(e.target.checked)}
                />
                Center
              </label>
              <button
                type="button"
                className="ws-action-btn ws-apply-btn"
                onClick={() => {
                  const name = [
                    'logo',
                    logoNeon ? 'neon' : 'solid',
                    logoBg ? 'bg' : 'transparent',
                    logoSquare ? 'sq' : null,
                    logoRound ? 'round' : null,
                  ].filter(Boolean).join('-');
                  download(logoRef, `${name}.png`, logoW, logoH, {
                    transparent: !logoBg,
                  });
                }}
              >
                Download
              </button>
            </div>

            <div className="studio-preview-wrap studio-preview-wrap--logo">
              <div
                ref={logoRef}
                className={[
                  'studio-canvas',
                  'studio-logo',
                  logoBg ? 'has-bg' : 'no-bg',
                  logoRound ? 'is-round' : '',
                  logoCenter ? 'is-center' : '',
                ].filter(Boolean).join(' ')}
                style={{ width: logoW, height: logoH }}
              >
                <ui_brand.Brand
                  size="xxl"
                  variant="logo-only"
                  neon={logoNeon}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
