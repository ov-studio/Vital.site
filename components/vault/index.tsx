'use client';
import * as config_site from '@/configs/site';
import * as config_vault from '@/configs/vault';
import * as react from 'react';
import * as lucide from 'lucide-react';
import * as react_dom from 'react-dom';
import './index.css';

function useVaultResources() {
  const [resources, set_resources] = react.useState<config_vault.VaultResource[]>([]);
  const [state,     set_state]     = react.useState<config_vault.LoadState>('loading');

  react.useEffect(() => {
    let cancelled = false;
    async function load() {
      set_state('loading');
      try {
        const res = await fetch('/api/vault');
        if (!res.ok) throw new Error(`vault.json fetch ${res.status}`);
        const index: VaultIndex = await res.json();
        const index: config_vault.VaultIndex = await res.json();
        if (!cancelled) { set_resources(index.resources ?? []); set_state('done'); }
      } catch (err) {
        console.error('[Vault]', err);
        if (!cancelled) set_state('error');
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { resources, state };
}

async function download_directory_zip(folder: string): Promise<void> {
  const tree_res = await fetch(
    `https://api.github.com/repos/${config_site.info.git.vault.user}/${config_site.info.git.vault.repo}/git/trees/main?recursive=1`,
    { headers: { Accept: 'application/vnd.github+json' } }
  );
  if (!tree_res.ok) throw new Error(`tree fetch ${tree_res.status}`);

  const tree_data: { tree: { path: string; type: string }[] } = await tree_res.json();
  const prefix = `resources/${folder}/`;
  const files  = tree_data.tree.filter(i => i.type === 'blob' && i.path.startsWith(prefix));
  if (!files.length) throw new Error(`No files found under ${prefix}`);

  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  await Promise.all(files.map(async file => {
    const r = await fetch(
      `https://raw.githubusercontent.com/${config_site.info.git.vault.user}/${config_site.info.git.vault.repo}/main/${file.path}`
    );
    if (!r.ok) return;
    zip.file(file.path.slice(prefix.length), await r.arrayBuffer());
  }));

  const blob = await zip.generateAsync({ type: 'blob' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: `${folder}.zip` });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const BANNER_CFG = {
  card:  { wrap: 'vault-card-banner',  ph: 'vault-card-banner-placeholder',  overlay: 'vault-card-banner-overlay',  ico: 48 },
  modal: { wrap: 'vault-modal-banner', ph: 'vault-modal-banner-placeholder', overlay: 'vault-modal-banner-overlay', ico: 80 },
} as const;

function Banner({ src, size = 'card' }: { src?: string; size?: 'card' | 'modal' }) {
  const { wrap, ph, overlay, ico } = BANNER_CFG[size];
  return (
    <div className={wrap}>
      {src
        ? <img src={src} alt="Resource banner"/>
        : <div className={ph}><lucide.Package size={ico} color="var(--blue)"/></div>
      }
      <div className={overlay}/>
    </div>
  );
}

function VaultModal({ resource, onClose }: { resource: VaultResource; onClose: () => void }) {
  const is_dir = !resource.is_submodule;
  const folder = is_dir ? resource.id.slice(4) : '';
  const [downloading, set_downloading] = react.useState(false);
  const [dl_error,    set_dl_error]    = react.useState<string | null>(null);

  const handle_download = react.useCallback(async () => {
    if (!is_dir || downloading) return;
    set_downloading(true);
    set_dl_error(null);
    try {
      await download_directory_zip(folder);
    } catch (err) {
      console.error('[Vault] directory zip failed', err);
      set_dl_error('Could not prepare the download. Please try again.');
    } finally {
      set_downloading(false);
    }
  }, [is_dir, folder, downloading]);

  react.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  react.useEffect(() => {
    const sw = window.innerWidth - document.documentElement.clientWidth;
    if (sw <= 0) {
      document.documentElement.style.overflow = 'hidden';
      return () => { document.documentElement.style.overflow = ''; };
    }

    const fixed: { el: HTMLElement; prev: string }[] = [];
    document.querySelectorAll<HTMLElement>('nav, header, [data-fixed], .vault-modal-overlay').forEach(el => {
      const s = getComputedStyle(el);
      if (s.position === 'fixed' || s.position === 'sticky') {
        fixed.push({ el, prev: el.style.paddingRight });
        el.style.paddingRight = `${(parseFloat(s.paddingRight) || 0) + sw}px`;
      }
    });

    const prev_ov = document.documentElement.style.overflow;
    const prev_pr = document.body.style.paddingRight;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.paddingRight = `${sw}px`;

    return () => {
      document.documentElement.style.overflow = prev_ov;
      document.body.style.paddingRight = prev_pr;
      fixed.forEach(({ el, prev }) => { el.style.paddingRight = prev; });
    };
  }, []);

  if (typeof document === 'undefined') return null;
  return react_dom.createPortal(
    <div className="vault-modal-overlay" onClick={onClose}>
      <div className="vault-modal" onClick={e => e.stopPropagation()}>

        <button className="vault-modal-close" onClick={onClose} aria-label="Close">
          <lucide.X size={14}/>
        </button>

        <Banner src={resource.banner} size="modal"/>

        <div className="vault-modal-body">
          <div className="vault-modal-eyebrow">
            <span className="vault-modal-author">
              {resource.author_url
                ? <a href={resource.author_url} target="_blank" rel="noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}>{resource.author}</a>
                : resource.author
              }
            </span>
            <span className="vault-modal-version">v{resource.version}</span>
          </div>

          <div className="vault-modal-name">{resource.name}</div>
          <div className="vault-modal-tagline">{resource.tagline}</div>

          <hr className="vault-modal-divider"/>

          <p className="vault-modal-desc">{resource.description}</p>

          <div className="vault-modal-tags">
            {resource.tags.map(t => (
              <span key={t} className="tag-pill vault-modal-tag">#{t}</span>
            ))}
          </div>

          <div className="vault-modal-actions">
            {is_dir ? (
              <button
                className="btn-primary"
                onClick={handle_download}
                disabled={downloading}
                style={downloading ? { opacity: 0.7, cursor: 'wait' } : undefined}
              >
                {downloading
                  ? <><lucide.Loader2 size={14} className="vault-spin"/> Preparing…</>
                  : 'Download Resource'
                }
              </button>
            ) : (
              <a href={resource.download_url ?? resource.source_url ?? '#'} className="btn-primary" download>
                Download Resource
              </a>
            )}
            {resource.source_url && (
              <a href={resource.source_url} target="_blank" rel="noreferrer" className="btn-secondary">
                :: View Source
              </a>
            )}
          </div>

          {dl_error && <p className="vault-modal-dl-error">{dl_error}</p>}
        </div>

      </div>
    </div>,
    document.body
  );
}

function VaultCard({ resource, onClick }: { resource: VaultResource; onClick: () => void }) {
  return (
    <div
      className={`vault-card rev${resource.featured ? ' featured' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <Banner src={resource.banner} size="card"/>

      {resource.featured && <span className="vault-card-featured-badge">Featured</span>}

      <div className="vault-card-body">
        <div className="vault-card-meta">
          <span className="vault-card-author">{resource.author}</span>
          <span className="vault-card-version">v{resource.version}</span>
        </div>
        <div className="vault-card-name">{resource.name}</div>
        <div className="vault-card-tagline">{resource.tagline}</div>
        <div className="vault-card-footer">
          <div className="vault-card-tags">
            {resource.tags.slice(0, 2).map(t => (
              <span key={t} className="tag-pill">#{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VaultSkeleton() {
  return (
    <div className="vault-card vault-card--skeleton">
      <div className="vault-card-banner vault-skeleton-banner shimmer"/>
      <div className="vault-card-body">
        <div className="vault-skeleton-line vault-skeleton-line--sm shimmer"/>
        <div className="vault-skeleton-line vault-skeleton-line--lg shimmer"/>
        <div className="vault-skeleton-line vault-skeleton-line--md shimmer"/>
      </div>
    </div>
  );
}

export function Vault() {
  const { resources, state } = useVaultResources();
  const [active_tag, set_active_tag] = react.useState<config_vault.VaultTag | null>(null);
  const [selected,   set_selected]   = react.useState<config_vault.VaultResource | null>(null);

  react.useEffect(() => {
    const els = document.querySelectorAll('.rev');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [resources, active_tag]);

  const filtered = active_tag ? resources.filter(r => r.tags.includes(active_tag)) : resources;
  const close    = react.useCallback(() => set_selected(null), []);

  return (
    <>
      <section id="vault">
        <div className="sw">
          <div className="vault-head">
            <div className="sec-head">
              <div>
                <h2>Community built,<br/>All yours to <span>explore.</span></h2>
              </div>
            </div>
            <div className="vault-intro sec-head">
              <div>Community-built scripts, gamemodes, tools, and libraries for Vital.sandbox</div>
              <a
                href={`https://github.com/${config_site.info.git.vault.user}/${config_site.info.git.vault.repo}`}
                target="_blank"
                rel="noreferrer"
                className="sec-link"
              >
                :: Submit Resource
              </a>
            </div>
          </div>

          <div className="vault-filters">
            <button
              className={`vault-filter-btn${active_tag === null ? ' active' : ''}`}
              onClick={() => set_active_tag(null)}
            >All</button>
            {config_vault.ALL_TAGS.map(tag => (
              <button
                key={tag}
                className={`vault-filter-btn${active_tag === tag ? ' active' : ''}`}
                onClick={() => set_active_tag(tag === active_tag ? null : tag)}
              >{tag}</button>
            ))}
          </div>

          <div className="vault-grid">
            {state === 'loading' && Array.from({ length: 3 }).map((_, i) => <VaultSkeleton key={i}/>)}
            {state === 'error' && (
              <div className="state-empty">Failed to load resources. Check your connection and try again.</div>
            )}
            {state === 'done' && filtered.length === 0 && (
              <div className="state-empty">No resources found for this filter.</div>
            )}
            {state === 'done' && filtered.map(r => (
              <VaultCard key={r.id} resource={r} onClick={() => set_selected(r)}/>
            ))}
          </div>
        </div>
      </section>

      {selected && <VaultModal resource={selected} onClose={close}/>}
    </>
  );
}