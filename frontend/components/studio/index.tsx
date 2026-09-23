'use client';
import * as ui_brand     from '@/ui/brand';
import * as ui_search    from '@/ui/search';
import * as ui_button    from '@/ui/button';
import * as ui_tabs      from '@/ui/tabs';
import * as ui_wallpaper from '@/ui/wallpaper';
import * as react        from 'react';
import * as lucide       from 'lucide-react';
import './index.css';

type Section = 'og' | 'logo' | 'banner';

const OG_W = 1000;
const OG_H = 300;
const LOGO_W = 1000;
const LOGO_H_TIGHT = 300;
const LOGO_H_PAD = 400;
const LOGO_SQ_TIGHT = 380;
const LOGO_SQ_PAD = 460;
const BANNER_W = 2560;
const BANNER_H = 640;

function nextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

async function loadToPng() {
  try {
    const mod = await import('html-to-image');
    return mod.toPng;
  } catch {
    alert(
      'html-to-image is required for download.\n\n' +
        'Run:  cd frontend && npm i html-to-image'
    );
    return null;
  }
}

async function loadJSZip() {
  try {
    const mod = await import('jszip');
    return mod.default;
  } 
  catch {
    alert(
      'jszip is required for preset export.\n\n' +
        'Run:  cd frontend && npm i jszip'
    );
    return null;
  }
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/png';
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

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
  const [bannerText, setBannerText] = react.useState('vital.sandbox');
  const [bannerSub, setBannerSub] = react.useState('Script It — Ship It — Limitless');
  const [bannerRound, setBannerRound] = react.useState(false);
  const [bannerNeon, setBannerNeon] = react.useState(true);
  const [bannerWallpaper, setBannerWallpaper] = react.useState(true);
  const [bannerVignette, setBannerVignette] = react.useState(true);
  const [presetBusy, setPresetBusy] = react.useState(false);

  const ogRef = react.useRef<HTMLDivElement>(null);
  const logoRef = react.useRef<HTMLDivElement>(null);
  const bannerRef = react.useRef<HTMLDivElement>(null);
  const bannerPreviewRef = react.useRef<HTMLDivElement>(null);

  const logoSize = logoSquare ? (logoPad ? LOGO_SQ_PAD : LOGO_SQ_TIGHT) : null;
  const logoW = logoSize ?? LOGO_W;
  const logoH = logoSize ?? (logoPad ? LOGO_H_PAD : LOGO_H_TIGHT);

  const ogPreviewRef = react.useRef<HTMLDivElement>(null);
  const logoPreviewRef = react.useRef<HTMLDivElement>(null);

  react.useEffect(() => {
    const pairs: Array<{
      active: boolean;
      frame: HTMLDivElement | null;
      canvas: HTMLDivElement | null;
      nativeW: number;
    }> = [
      {
        active: section === 'og',
        frame: ogPreviewRef.current,
        canvas: ogRef.current,
        nativeW: OG_W,
      },
      {
        active: section === 'logo',
        frame: logoPreviewRef.current,
        canvas: logoRef.current,
        nativeW: logoW,
      },
      {
        active: section === 'banner',
        frame: bannerPreviewRef.current,
        canvas: bannerRef.current,
        nativeW: BANNER_W,
      },
    ];

    const cleanups: Array<() => void> = [];
    for (const { active, frame, canvas, nativeW } of pairs) {
      if (!active || !frame || !canvas) continue;
      const update = () => {
        const avail = Math.max(1, frame.clientWidth);
        const scale = Math.min(1, avail / nativeW);
        canvas.style.transformOrigin = 'top left';
        canvas.style.transform = `scale(${scale})`;
      };
      update();
      const ro = new ResizeObserver(update);
      ro.observe(frame);
      cleanups.push(() => {
        ro.disconnect();
        canvas.style.transform = '';
        canvas.style.transformOrigin = '';
      });
    }
    return () => cleanups.forEach((fn) => fn());
  }, [section, logoW]);


  async function capturePng(
    ref: react.RefObject<HTMLDivElement | null>,
    width: number,
    height: number,
    opts?: { transparent?: boolean }
  ): Promise<string | null> {
    if (!ref.current) return null;

    const toPng = await loadToPng();
    if (!toPng) return null;

    const el = ref.current;
    const prevClass = el.className;
    const prevBg = el.style.background;
    const prevBgImage = el.style.backgroundImage;
    const prevTransform = el.style.transform;
    el.style.transform = 'none';

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
        backgroundColor: opts?.transparent ? 'transparent' : undefined,
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
      return dataUrl;
    } 
    catch (err) {
      console.error(err);
      alert('Export failed – check console');
      return null;
    } 
    finally {
      el.className = prevClass;
      el.style.background = prevBg;
      el.style.backgroundImage = prevBgImage;
      el.style.transform = prevTransform;
    }
  }

  async function download(
    ref: react.RefObject<HTMLDivElement | null>,
    filename: string,
    width: number,
    height: number,
    opts?: { transparent?: boolean }
  ) {
    const dataUrl = await capturePng(ref, width, height, opts);
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }

  async function downloadOgPresets() {
    if (presetBusy) return;
    setPresetBusy(true);

    const JSZip = await loadJSZip();
    if (!JSZip) {
      setPresetBusy(false);
      return;
    }

    const prevPlaceholder = ogPlaceholder;
    const zip = new JSZip();
    const folder = zip.folder('public/cdn/og');
    if (!folder) {
      setPresetBusy(false);
      return;
    }

    try {
      setOgPlaceholder(false);
      await nextPaint();
      const defaultUrl = await capturePng(ogRef, OG_W, OG_H);
      if (defaultUrl) folder.file('default.png', dataUrlToBlob(defaultUrl));
      setOgPlaceholder(true);
      await nextPaint();
      const placeholderUrl = await capturePng(ogRef, OG_W, OG_H);
      if (placeholderUrl) folder.file('placeholder.png', dataUrlToBlob(placeholderUrl));

      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(blob, 'og-presets.zip');
    } 
    catch (err) {
      console.error(err);
      alert('Preset export failed – check console');
    } 
    finally {
      setOgPlaceholder(prevPlaceholder);
      setPresetBusy(false);
    }
  }

  async function downloadLogoPresets() {
    if (presetBusy) return;
    setPresetBusy(true);

    const JSZip = await loadJSZip();
    if (!JSZip) {
      setPresetBusy(false);
      return;
    }

    const prev = {
      neon: logoNeon,
      bg: logoBg,
      pad: logoPad,
      square: logoSquare,
      round: logoRound,
      center: logoCenter,
    };

    const zip = new JSZip();
    const folder = zip.folder('public/cdn/logo');
    if (!folder) {
      setPresetBusy(false);
      return;
    }

    type LogoPreset = {
      path: string;
      neon: boolean;
      bg: boolean;
      square: boolean;
      round: boolean;
    };

    const presets: LogoPreset[] = [
      { path: 'transparent.png',                 neon: false, bg: false, square: false, round: false },
      { path: 'background.png',                  neon: false, bg: true,  square: false, round: false },
      { path: 'neon_transparent.png',            neon: true,  bg: false, square: false, round: false },
      { path: 'neon_background.png',             neon: true,  bg: true,  square: false, round: false },

      { path: 'background_round.png',            neon: false, bg: true,  square: false, round: true  },
      { path: 'neon_background_round.png',       neon: true,  bg: true,  square: false, round: true  },

      { path: 'transparent_square.png',          neon: false, bg: false, square: true,  round: false },
      { path: 'background_square.png',           neon: false, bg: true,  square: true,  round: false },
      { path: 'neon_transparent_square.png',     neon: true,  bg: false, square: true,  round: false },
      { path: 'neon_background_square.png',      neon: true,  bg: true,  square: true,  round: false },

      { path: 'background_square_round.png',     neon: false, bg: true,  square: true,  round: true  },
      { path: 'neon_background_square_round.png', neon: true, bg: true,  square: true,  round: true  },
    ];

    try {
      for (const p of presets) {
        setLogoNeon(p.neon);
        setLogoBg(p.bg);
        setLogoPad(false);
        setLogoSquare(p.square);
        setLogoRound(p.round);
        setLogoCenter(true);
        await nextPaint();

        const w = p.square ? LOGO_SQ_TIGHT : LOGO_W;
        const h = p.square ? LOGO_SQ_TIGHT : LOGO_H_TIGHT;
        const dataUrl = await capturePng(logoRef, w, h, {
          transparent: !p.bg,
        });
        if (dataUrl) folder.file(p.path, dataUrlToBlob(dataUrl));
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(blob, 'logo-presets.zip');
    } 
    catch (err) {
      console.error(err);
      alert('Preset export failed – check console');
    } 
    finally {
      setLogoNeon(prev.neon);
      setLogoBg(prev.bg);
      setLogoPad(prev.pad);
      setLogoSquare(prev.square);
      setLogoRound(prev.round);
      setLogoCenter(prev.center);
      setPresetBusy(false);
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
          <p className="page-intro studio-intro">
            Open Graph images, neon logos, and channel banners using the real Brand component.
          </p>
        </div>

        <div className="studio-shell anim-in anim-in--3">
          <div className="studio-panel-head">
            <ui_tabs.Tabs
              value={section}
              onChange={(id) => setSection(id as Section)}
              ariaLabel="Studio sections"
              items={[
                {
                  id: 'og',
                  label: 'Opengraph',
                  icon: <lucide.Image size={14} strokeWidth={2.25}/>,
                },
                {
                  id: 'logo',
                  label: 'Branding',
                  icon: <lucide.Shapes size={14} strokeWidth={2.25}/>,
                },
                {
                  id: 'banner',
                  label: 'Banner',
                  icon: <lucide.PanelTop size={14} strokeWidth={2.25}/>,
                },
              ]}
            />
          </div>

        {section === 'og' && (
          <div className="studio-panel">
            <div className="studio-controls">
              <div className="studio-controls-row">
                <ui_search.Search
                  value={tagline}
                  onChange={setTagline}
                  placeholder="Tagline…"
                  icon={<lucide.Type size={14} strokeWidth={2}/>}
                />
              </div>
              <div className="studio-controls-row">
                <label className="studio-check">
                  <input
                    type="checkbox"
                    checked={ogPlaceholder}
                    onChange={(e) => setOgPlaceholder(e.target.checked)}
                  />
                  Placeholder
                </label>
              </div>
              <div className="studio-controls-row studio-controls-row--actions">
                <ui_button.Button
                  variant="action"
                  size="lg"
                  onClick={() => download(ogRef, 'og.png', OG_W, OG_H)}
                >
                  Download Asset
                </ui_button.Button>
                <ui_button.Button
                  variant="action"
                  size="lg"
                  disabled={presetBusy}
                  onClick={downloadOgPresets}
                >
                  {presetBusy ? 'Exporting…' : 'Download Preset'}
                </ui_button.Button>
              </div>
            </div>

            <div ref={ogPreviewRef} className="studio-preview-wrap">
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
                        ogPlaceholder ? ' is-placeholder' : ''
                      }`}
                      aria-hidden={!tagline.trim() || ogPlaceholder}
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

        {section === 'logo' && (
          <div className="studio-panel">
            <div className="studio-controls">
              <div className="studio-controls-row">
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
                  Background
                </label>
              </div>
              <div className="studio-controls-row">
                <label className="studio-check">
                  <input
                    type="checkbox"
                    checked={logoCenter}
                    onChange={(e) => setLogoCenter(e.target.checked)}
                  />
                  Centered
                </label>
                <label className="studio-check">
                  <input
                    type="checkbox"
                    checked={logoPad}
                    onChange={(e) => setLogoPad(e.target.checked)}
                  />
                  Extra padding
                </label>
              </div>
              <div className="studio-controls-row">
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
              </div>
              <div className="studio-controls-row studio-controls-row--actions">
                <ui_button.Button
                  variant="action"
                  size="lg"
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
                  Download Asset
                </ui_button.Button>
                <ui_button.Button
                  variant="action"
                  size="lg"
                  disabled={presetBusy}
                  onClick={downloadLogoPresets}
                >
                  {presetBusy ? 'Exporting…' : 'Download Preset'}
                </ui_button.Button>
              </div>
            </div>

            <div ref={logoPreviewRef} className="studio-preview-wrap studio-preview-wrap--logo">
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

        {section === 'banner' && (
          <div className="studio-panel">
            <div className="studio-controls">
              <div className="studio-controls-row">
                <ui_search.Search
                  value={bannerText}
                  onChange={setBannerText}
                  placeholder="Title…"
                  icon={<lucide.Type size={14} strokeWidth={2}/>}
                />
              </div>
              <div className="studio-controls-row">
                <ui_search.Search
                  value={bannerSub}
                  onChange={setBannerSub}
                  placeholder="Subtitle…"
                  icon={<lucide.Text size={14} strokeWidth={2}/>}
                />
              </div>
              <div className="studio-controls-row">
                <label className="studio-check">
                  <input
                    type="checkbox"
                    checked={bannerRound}
                    onChange={(e) => setBannerRound(e.target.checked)}
                  />
                  Rounded
                </label>
                <label className="studio-check">
                  <input
                    type="checkbox"
                    checked={bannerNeon}
                    onChange={(e) => setBannerNeon(e.target.checked)}
                  />
                  Neon text
                </label>
                <label className="studio-check">
                  <input
                    type="checkbox"
                    checked={bannerWallpaper}
                    onChange={(e) => setBannerWallpaper(e.target.checked)}
                  />
                  Wallpaper
                </label>
                <label className="studio-check">
                  <input
                    type="checkbox"
                    checked={bannerVignette}
                    onChange={(e) => setBannerVignette(e.target.checked)}
                    disabled={!bannerWallpaper}
                  />
                  Vignette
                </label>
              </div>
              <div className="studio-controls-row studio-controls-row--actions">
                <ui_button.Button
                  variant="action"
                  size="lg"
                  onClick={() => download(bannerRef, 'banner.png', BANNER_W, BANNER_H)}
                >
                  Download Asset
                </ui_button.Button>
              </div>
            </div>

            <div className="studio-preview-wrap studio-preview-wrap--banner">
              <div ref={bannerPreviewRef} className="studio-banner-frame">
              <div
                ref={bannerRef}
                className={[
                  'studio-canvas',
                  'studio-banner',
                  bannerRound ? 'is-round' : '',
                  bannerNeon ? 'is-neon' : '',
                ].filter(Boolean).join(' ')}
                style={{ width: BANNER_W, height: BANNER_H }}
              >
                {bannerWallpaper && (
                  <ui_wallpaper.Wallpaper seed={1} opacity={0.14} vignette={bannerVignette}/>
                )}
                <div className="studio-banner-content">
                  <div className="studio-banner-title">{bannerText.trim() || '\u00a0'}</div>
                  {bannerSub.trim() && (
                    <div className="studio-banner-sub">{bannerSub}</div>
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
