'use client';
import * as config_pages from '@/configs/pages';
import * as ui_brand     from '@/ui/brand';
import * as ui_search    from '@/ui/search';
import * as ui_button    from '@/ui/button';
import * as ui_tabs      from '@/ui/tabs';
import * as ui_wallpaper from '@/ui/wallpaper';
import * as ui_page      from '@/ui/page';
import * as ui_pagehead  from '@/ui/pagehead';
import * as ui_checkbox  from '@/ui/checkbox';
import * as lib_download from '@/lib/download';
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
  } 
  catch {
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

export function Studio() {
  const [section, setSection] = react.useState<Section>('og');
  const [tagline, setTagline] = react.useState('Script It — Ship It — Limitless');
  const [ogPlaceholder, setOgPlaceholder] = react.useState(false);
  const [logoNeon, setLogoNeon] = react.useState(true);
  const [logoRays, setLogoRays] = react.useState(false);
  const [logoBg, setLogoBg] = react.useState(true);
  const [logoPad, setLogoPad] = react.useState(false);
  const [logoSquare, setLogoSquare] = react.useState(false);
  const [logoRound, setLogoRound] = react.useState(false);
  const [logoCenter, setLogoCenter] = react.useState(true);
  const [bannerText, setBannerText] = react.useState('ov-studio');
  const [bannerSub, setBannerSub] = react.useState('Weaving ideas, pixel by pixel');
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

  const ogWrapRef = react.useRef<HTMLDivElement>(null);
  const logoWrapRef = react.useRef<HTMLDivElement>(null);
  const bannerWrapRef = react.useRef<HTMLDivElement>(null);
  const ogPreviewRef = react.useRef<HTMLDivElement>(null);
  const logoPreviewRef = react.useRef<HTMLDivElement>(null);

  react.useEffect(() => {
    type Pair = {
      active:    boolean;
      wrap:      HTMLDivElement | null;
      frame:     HTMLDivElement | null;
      canvas:    HTMLDivElement | null;
      nativeW:   number;
      nativeH:   number;
      fillWidth: boolean;
    };

    const pairs: Pair[] = [
      {
        active: section === 'og',
        wrap: ogWrapRef.current,
        frame: ogPreviewRef.current,
        canvas: ogRef.current,
        nativeW: OG_W,
        nativeH: OG_H,
        fillWidth: false,
      },
      {
        active: section === 'logo',
        wrap: logoWrapRef.current,
        frame: logoPreviewRef.current,
        canvas: logoRef.current,
        nativeW: logoW,
        nativeH: logoH,
        fillWidth: false,
      },
      {
        active: section === 'banner',
        wrap: bannerWrapRef.current,
        frame: bannerPreviewRef.current,
        canvas: bannerRef.current,
        nativeW: BANNER_W,
        nativeH: BANNER_H,
        fillWidth: true,
      },
    ];

    const PREVIEW_PAD = 16;
    const cleanups: Array<() => void> = [];

    for (const { active, wrap, frame, canvas, nativeW, nativeH, fillWidth } of pairs) {
      if (!active || !frame || !canvas) continue;
      const host = wrap ?? (frame.parentElement as HTMLDivElement | null);

      const update = () => {
        const hostW = Math.max(
          1,
          (host?.clientWidth ?? frame.clientWidth) - (fillWidth ? 0 : PREVIEW_PAD * 2)
        );
        // Never upscale past native; shrink on narrow viewports
        const scale = Math.min(1, hostW / nativeW);
        canvas.style.transformOrigin = 'top left';
        canvas.style.transform = `scale(${scale})`;

        if (!fillWidth) {
          frame.style.width = `${Math.round(nativeW * scale)}px`;
          frame.style.height = `${Math.round(nativeH * scale)}px`;
        }
      };

      update();
      const ro = new ResizeObserver(update);
      if (host) ro.observe(host);
      cleanups.push(() => {
        ro.disconnect();
        canvas.style.transform = '';
        canvas.style.transformOrigin = '';
        if (!fillWidth) {
          frame.style.width = '';
          frame.style.height = '';
        }
      });
    }
    return () => cleanups.forEach((fn) => fn());
  }, [section, logoW, logoH]);


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

    try {
      const dataUrl = await toPng(el, {
        cacheBust: true,
        pixelRatio: 2,
        width,
        height,
        backgroundColor: opts?.transparent ? 'transparent' : undefined,
        style: {
          transform: 'none',
          transformOrigin: 'top left',
          margin: '0',
          padding: '0',
          width: `${width}px`,
          height: `${height}px`,
          position: 'relative',
          left: '0',
          top: '0',
          ...(opts?.transparent
            ? { background: 'transparent', backgroundImage: 'none' }
            : {}),
        },
      });
      return dataUrl;
    } catch (err) {
      console.error(err);
      alert('Export failed – check console');
      return null;
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
    lib_download.trigger_download(dataUrl, filename);
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
    const folder = zip.folder('public/og');
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
      lib_download.trigger_download(blob, 'og-presets.zip');
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
      rays: logoRays,
      bg: logoBg,
      pad: logoPad,
      square: logoSquare,
      round: logoRound,
      center: logoCenter,
    };

    const zip = new JSZip();
    const folder = zip.folder('public/logo');
    if (!folder) {
      setPresetBusy(false);
      return;
    }

    type LogoPreset = {
      path:   string;
      neon:   boolean;
      rays:   boolean;
      bg:     boolean;
      square: boolean;
      round:  boolean;
    };

    const presets: LogoPreset[] = [
      { path: 'transparent.png',                      neon: false, rays: false, bg: false, square: false, round: false },
      { path: 'background.png',                       neon: false, rays: false, bg: true,  square: false, round: false },
      { path: 'neon_transparent.png',                 neon: true,  rays: false, bg: false, square: false, round: false },
      { path: 'neon_rays_transparent.png',            neon: true,  rays: true,  bg: false, square: false, round: false },
      { path: 'neon_background.png',                  neon: true,  rays: false, bg: true,  square: false, round: false },
      { path: 'neon_rays_background.png',             neon: true,  rays: true,  bg: true,  square: false, round: false },

      { path: 'background_round.png',                 neon: false, rays: false, bg: true,  square: false, round: true  },
      { path: 'neon_background_round.png',            neon: true,  rays: false, bg: true,  square: false, round: true  },
      { path: 'neon_rays_background_round.png',       neon: true,  rays: true,  bg: true,  square: false, round: true  },

      { path: 'transparent_square.png',               neon: false, rays: false, bg: false, square: true,  round: false },
      { path: 'background_square.png',                neon: false, rays: false, bg: true,  square: true,  round: false },
      { path: 'neon_transparent_square.png',          neon: true,  rays: false, bg: false, square: true,  round: false },
      { path: 'neon_rays_transparent_square.png',     neon: true,  rays: true,  bg: false, square: true,  round: false },
      { path: 'neon_background_square.png',           neon: true,  rays: false, bg: true,  square: true,  round: false },
      { path: 'neon_rays_background_square.png',      neon: true,  rays: true,  bg: true,  square: true,  round: false },

      { path: 'background_square_round.png',          neon: false, rays: false, bg: true,  square: true,  round: true  },
      { path: 'neon_background_square_round.png',     neon: true,  rays: false, bg: true,  square: true,  round: true  },
      { path: 'neon_rays_background_square_round.png', neon: true, rays: true,  bg: true,  square: true,  round: true  },
    ];

    try {
      for (const p of presets) {
        setLogoNeon(p.neon);
        setLogoRays(p.rays);
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
      lib_download.trigger_download(blob, 'logo-presets.zip');
    } 
    catch (err) {
      console.error(err);
      alert('Preset export failed – check console');
    } 
    finally {
      setLogoNeon(prev.neon);
      setLogoRays(prev.rays);
      setLogoBg(prev.bg);
      setLogoPad(prev.pad);
      setLogoSquare(prev.square);
      setLogoRound(prev.round);
      setLogoCenter(prev.center);
      setPresetBusy(false);
    }
  }

  return (
    <ui_page.Page id="studio">
        <ui_pagehead.PageHead
          label="Studio"
          title={<>Brand assets,<br/>ready to <span>export.</span></>}
          intro={config_pages.pages.studio.description}
          introClassName="studio-intro"
        />

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
                <ui_checkbox.Checkbox label="Placeholder" checked={ogPlaceholder} onChange={setOgPlaceholder}/>
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

            <div ref={ogWrapRef} className="studio-preview-wrap">
              <div ref={ogPreviewRef} className="studio-preview-frame">
              <div
                ref={ogRef}
                className="studio-canvas studio-og"
                style={{ width: OG_W, height: OG_H }}
              >
                <div className="studio-og-content">
                  <ui_brand.Brand size="xl" variant="logo-only" neon={true} rays={false}/>
                  {(tagline.trim() || ogPlaceholder) && (
                    <div
                      className={`studio-og-tagline${
                        ogPlaceholder ? ' is-placeholder' : ''
                      }`}
                      aria-hidden={!tagline.trim() || ogPlaceholder}
                    >
                      {
                        tagline.trim() ? tagline.split('—').map((part, i, arr) => (
                          <react.Fragment key={i}>
                            <span className={i === 1 ? 'hl' : ''}>{part.trim()}</span>
                            {i < arr.length - 1 && <span className="sep">—</span>}
                          </react.Fragment>
                        )) : '\u00a0'
                      }
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>
        )}

        {section === 'logo' && (
          <div className="studio-panel">
            <div className="studio-controls">
              <div className="studio-controls-row">
                <ui_checkbox.Checkbox label="Neon" checked={logoNeon} onChange={setLogoNeon}/>
                <ui_checkbox.Checkbox label="Rays" checked={logoRays} disabled={!logoNeon} onChange={setLogoRays}/>
                <ui_checkbox.Checkbox label="Background" checked={logoBg} onChange={setLogoBg}/>
              </div>
              <div className="studio-controls-row">
                <ui_checkbox.Checkbox label="Centered" checked={logoCenter} onChange={setLogoCenter}/>
                <ui_checkbox.Checkbox label="Extra padding" checked={logoPad} onChange={setLogoPad}/>
              </div>
              <div className="studio-controls-row">
                <ui_checkbox.Checkbox label="Square" checked={logoSquare} onChange={setLogoSquare}/>
                <ui_checkbox.Checkbox label="Rounded" checked={logoRound} onChange={setLogoRound}/>
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

            <div ref={logoWrapRef} className="studio-preview-wrap studio-preview-wrap--logo">
              <div ref={logoPreviewRef} className="studio-preview-frame">
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
                  rays={logoNeon && logoRays}
                />
              </div>
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
                <ui_checkbox.Checkbox label="Rounded" checked={bannerRound} onChange={setBannerRound}/>
                <ui_checkbox.Checkbox label="Neon text" checked={bannerNeon} onChange={setBannerNeon}/>
                <ui_checkbox.Checkbox label="Wallpaper" checked={bannerWallpaper} onChange={setBannerWallpaper}/>
                <ui_checkbox.Checkbox label="Vignette" checked={bannerVignette} disabled={!bannerWallpaper} onChange={setBannerVignette}/>
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

            <div ref={bannerWrapRef} className="studio-preview-wrap studio-preview-wrap--banner">
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
                  <ui_wallpaper.Wallpaper variant={18} vignette={bannerVignette}/>
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
    </ui_page.Page>
  );
}
