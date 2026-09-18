'use client';

import * as react from 'react';
import * as ui_brand from '@/ui/brand';
import * as ui_wallpaper from '@/ui/wallpaper';
import './index.css';

type Section = 'og' | 'logo';

const OG_W = 1000;
const OG_H = 300;
const LOGO_W = 640;
const LOGO_H = 640;

export function Studio() {
  const [section, setSection] = react.useState<Section>('og');
  const [tagline, setTagline] = react.useState('Script It — Ship It — Limitless');
  const [logoNeon, setLogoNeon] = react.useState(true);
  const [logoBg, setLogoBg] = react.useState(true);

  const ogRef = react.useRef<HTMLDivElement>(null);
  const logoRef = react.useRef<HTMLDivElement>(null);

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
      <ui_wallpaper.Wallpaper seed={0} opacity={0.1} />

      <div className="sw">
        <div className="page-head">
          <div className="sec-head sec-head--intro">
            <div>
              <div className="slabel">Studio</div>
              <h2>
                Brand assets,<br />
                ready to <span>export.</span>
              </h2>
            </div>
          </div>
          <p className="studio-intro">
            Open Graph images and neon logos using the real Brand component.
          </p>
        </div>

        <div className="studio-tabs">
          <button
            type="button"
            className={section === 'og' ? 'studio-tab active' : 'studio-tab'}
            onClick={() => setSection('og')}
          >
            Open Graph
          </button>
          <button
            type="button"
            className={section === 'logo' ? 'studio-tab active' : 'studio-tab'}
            onClick={() => setSection('logo')}
          >
            Logo Export
          </button>
        </div>

        {/* Open Graph – background matches homepage hero (slanted lines) */}
        {section === 'og' && (
          <div className="studio-panel">
            <div className="studio-controls">
              <label>
                Tagline
                <input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Script It — Ship It — Limitless"
                />
              </label>
              <button
                type="button"
                className="studio-btn"
                onClick={() => download(ogRef, 'og.png', OG_W, OG_H)}
              >
                Download PNG (1000×300)
              </button>
            </div>

            <div className="studio-preview-wrap">
              <div
                ref={ogRef}
                className="studio-canvas studio-og"
                style={{ width: OG_W, height: OG_H }}
              >
                <div className="studio-og-content">
                  <ui_brand.Brand size="xl" variant="logo-only" neon={true} />
                  <div className="studio-og-tagline">
                    {tagline.split('—').map((part, i, arr) => (
                      <react.Fragment key={i}>
                        <span className={i === 1 ? 'hl' : ''}>{part.trim()}</span>
                        {i < arr.length - 1 && <span className="sep">—</span>}
                      </react.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="studio-hint">
              Save as <code>frontend/public/cdn/og.png</code> — backend{' '}
              <code>/og</code> serves this file for homepage Open Graph.
            </p>
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
              <button
                type="button"
                className="studio-btn"
                onClick={() => {
                  const name = [
                    'logo',
                    logoNeon ? 'neon' : 'solid',
                    logoBg ? 'bg' : 'transparent',
                  ].join('-');
                  download(logoRef, `${name}.png`, LOGO_W, LOGO_H, {
                    transparent: !logoBg,
                  });
                }}
              >
                Download PNG
              </button>
            </div>

            <div className="studio-preview-wrap studio-preview-wrap--logo">
              <div
                ref={logoRef}
                className={`studio-canvas studio-logo ${logoBg ? 'has-bg' : 'no-bg'}`}
                style={{ width: LOGO_W, height: LOGO_H }}
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
