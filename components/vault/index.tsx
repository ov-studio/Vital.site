'use client';
import * as config_site from '@/configs/site';
import * as react from 'react';
import * as lucide from 'lucide-react';
import * as react_dom from 'react-dom';
import './index.css';

// ── Types ─────────────────────────────────
type VaultTag = 'gamemode' | 'utility' | 'ui' | 'physics' | 'audio' | 'networking' | 'tools';

interface VaultResource {
  id:           string;
  name:         string;
  author:       string;
  author_url?:  string;
  version:      string;
  tagline:      string;
  description:  string;
  tags:         VaultTag[];
  banner?:      string;
  featured:     boolean;
  source_url?:  string;
  download_url: string;
}

interface VaultIndex {
  generated_at: string;
  commit:       string;
  count:        number;
  resources:    VaultResource[];
}

type LoadState = 'loading' | 'error' | 'done';

// ── Constants ─────────────────────────────
const VAULT_OWNER = 'ov-studio';
const VAULT_REPO  = 'Vital.vault';

// Fetched via jsDelivr rather than raw.githubusercontent.com or a release
// asset. Release assets (objects.githubusercontent.com) don't send an
// Access-Control-Allow-Origin header, so a browser fetch() gets blocked by
// CORS even though the file downloads fine via direct navigation.
// raw.githubusercontent.com does send CORS headers, but its CDN cache has no
// public purge mechanism and ignores query strings when computing the cache
// key — so a stale response can stick around with no way to force a refresh.
// jsDelivr is CORS-friendly too, but exposes a purge API, which the build
// workflow calls right after pushing vault.json — so this URL reflects the
// latest build within seconds instead of waiting out an unbustable TTL.
const VAULT_JSON_URL = `https://cdn.jsdelivr.net/gh/${VAULT_OWNER}/${VAULT_REPO}@main/vault.json`;

const ALL_TAGS: VaultTag[] = [
  'gamemode', 'utility', 'ui', 'physics', 'audio', 'networking', 'tools',
];

// ── Data hook — single direct fetch ───────
function useVaultResources() {
  const [resources, set_resources] = react.useState<VaultResource[]>([]);
  const [state,     set_state]     = react.useState<LoadState>('loading');

  react.useEffect(() => {
    let cancelled = false;

    async function load() {
      set_state('loading');
      try {
        const res = await fetch(VAULT_JSON_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error(`vault.json fetch ${res.status}`);

        const index: VaultIndex = await res.json();

        if (!cancelled) {
          set_resources(index.resources ?? []);
          set_state('done');
        }
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

// ── Directory download (non-submodule resources) ──
// GitHub has no endpoint that zips just a subfolder — archive/refs/heads/
// zips only work for a whole repo. So for plain-directory resources (as
// opposed to submodules, which already are their own repo) we build the
// zip client-side: list the repo tree once via the Git Trees API, pull only
// the blobs under this resource's path from raw.githubusercontent.com (CDN,
// CORS-enabled, not meaningfully rate-limited), and zip them in the browser.
// This runs from each visitor's own browser/IP, so it isn't subject to the
// same shared-server rate-limit concerns as a server-side proxy would be —
// though a single visitor triggering many downloads in a short window could
// still hit api.github.com's 60 req/hr unauthenticated cap for the one tree
// call per download.
async function download_directory_zip(folder: string): Promise<void> {
  const tree_res = await fetch(
    `https://api.github.com/repos/${VAULT_OWNER}/${VAULT_REPO}/git/trees/main?recursive=1`,
    { headers: { Accept: 'application/vnd.github+json' } }
  );
  if (!tree_res.ok) throw new Error(`tree fetch ${tree_res.status}`);

  const tree_data: { tree: { path: string; type: string }[] } = await tree_res.json();
  const prefix = `resources/${folder}/`;
  const files = tree_data.tree.filter(item => item.type === 'blob' && item.path.startsWith(prefix));

  if (files.length === 0) throw new Error(`No files found under ${prefix}`);

  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  await Promise.all(files.map(async file => {
    const raw_url = `https://raw.githubusercontent.com/${VAULT_OWNER}/${VAULT_REPO}/main/${file.path}`;
    const file_res = await fetch(raw_url);
    if (!file_res.ok) return; // skip a single failed file rather than aborting the whole zip
    const buf = await file_res.arrayBuffer();
    zip.file(file.path.slice(prefix.length), buf);
  }));

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folder}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ── Banner ────────────────────────────────
function Banner({ src, size = 'card' }: { src?: string; size?: 'card' | 'modal' }) {
  const cls = size === 'modal' ? 'vault-modal-banner' : 'vault-card-banner';
  const ph  = size === 'modal' ? 'vault-modal-banner-placeholder' : 'vault-card-banner-placeholder';
  const ico = size === 'modal' ? 80 : 48;

  return (
    <div className={cls}>
      {src
        ? <img src={src} alt="Resource banner" />
        : (
          <div className={ph}>
            <lucide.Package size={ico} color="var(--blue)" />
          </div>
        )
      }
      {size === 'modal'
        ? <div className="vault-modal-banner-overlay" />
        : <div className="vault-card-banner-overlay" />
      }
    </div>
  );
}

// ── Modal ─────────────────────────────────
function VaultModal({ resource, onClose }: {
  resource: VaultResource;
  onClose:  () => void;
}) {
  const is_dir = resource.id.startsWith('dir:');
  const folder = is_dir ? resource.id.slice('dir:'.length) : '';

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
    const scrollbar_w = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar_w <= 0) {
      document.documentElement.style.overflow = 'hidden';
      return () => { document.documentElement.style.overflow = ''; };
    }

    const fixed_els: { el: HTMLElement; prev: string }[] = [];
    document.querySelectorAll<HTMLElement>(
      'nav, header, [data-fixed], .vault-modal-overlay'
    ).forEach(el => {
      const style = getComputedStyle(el);
      if (style.position === 'fixed' || style.position === 'sticky') {
        fixed_els.push({ el, prev: el.style.paddingRight });
        el.style.paddingRight = `${(parseFloat(style.paddingRight) || 0) + scrollbar_w}px`;
      }
    });

    const prev_overflow = document.documentElement.style.overflow;
    const prev_body_pr  = document.body.style.paddingRight;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbar_w}px`;

    return () => {
      document.documentElement.style.overflow = prev_overflow;
      document.body.style.paddingRight = prev_body_pr;
      fixed_els.forEach(({ el, prev }) => { el.style.paddingRight = prev; });
    };
  }, []);

  const modal_markup = (
    <div className="vault-modal-overlay" onClick={onClose}>
      <div className="vault-modal" onClick={e => e.stopPropagation()}>

        <button className="vault-modal-close" onClick={onClose} aria-label="Close">
          <lucide.X size={14} />
        </button>

        <Banner src={resource.banner} size="modal" />

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

          <hr className="vault-modal-divider" />

          <p className="vault-modal-desc">{resource.description}</p>

          <div className="vault-modal-tags">
            {resource.tags.map(t => (
              <span key={t} className="vault-modal-tag">{t}</span>
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
                  ? <><lucide.Loader2 size={14} className="vault-spin" /> Preparing…</>
                  : 'Download Resource'
                }
              </button>
            ) : (
              <a href={resource.download_url} className="btn-primary" download>
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
    </div>
  );

  if (typeof document === 'undefined') return null;
  return react_dom.createPortal(modal_markup, document.body);
}

// ── Card ──────────────────────────────────
function VaultCard({ resource, onClick }: {
  resource: VaultResource;
  onClick:  () => void;
}) {
  return (
    <div
      className={`vault-card rev${resource.featured ? ' featured' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <Banner src={resource.banner} size="card" />

      {resource.featured && (
        <span className="vault-card-featured-badge">Featured</span>
      )}

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
              <span key={t} className="vault-card-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton card ─────────────────────────
function VaultSkeleton() {
  return (
    <div className="vault-card vault-card--skeleton">
      <div className="vault-card-banner vault-skeleton-banner" />
      <div className="vault-card-body">
        <div className="vault-skeleton-line vault-skeleton-line--sm" />
        <div className="vault-skeleton-line vault-skeleton-line--lg" />
        <div className="vault-skeleton-line vault-skeleton-line--md" />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────
export function Vault() {
  const { resources, state } = useVaultResources();

  const [active_tag, set_active_tag] = react.useState<VaultTag | null>(null);
  const [selected,   set_selected]   = react.useState<VaultResource | null>(null);

  react.useEffect(() => {
    const els = document.querySelectorAll('.rev');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [resources, active_tag]);

  const filtered = active_tag
    ? resources.filter(r => r.tags.includes(active_tag))
    : resources;

  const close = react.useCallback(() => set_selected(null), []);

  return (
    <>
      <section id="vault">
        <div className="sw">

          <div className="vault-head">
            <div className="sec-head">
              <div>
                <h2>Community built,<br />All yours to <span>explore.</span></h2>
              </div>
            </div>
            <div className="vault-intro sec-head">
              <div>
                Community-built scripts, gamemodes, tools, and libraries for Vital.sandbox
              </div>
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
            >
              All
            </button>
            {ALL_TAGS.map(tag => (
              <button
                key={tag}
                className={`vault-filter-btn${active_tag === tag ? ' active' : ''}`}
                onClick={() => set_active_tag(tag === active_tag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="vault-grid">
            {state === 'loading' &&
              Array.from({ length: 3 }).map((_, i) => <VaultSkeleton key={i} />)
            }
            {state === 'error' && (
              <div className="vault-empty">
                Failed to load resources. Check your connection and try again.
              </div>
            )}
            {state === 'done' && filtered.length === 0 && (
              <div className="vault-empty">No resources found for this filter.</div>
            )}
            {state === 'done' && filtered.map(r => (
              <VaultCard key={r.id} resource={r} onClick={() => set_selected(r)} />
            ))}
          </div>

        </div>
      </section>

      {selected && <VaultModal resource={selected} onClose={close} />}
    </>
  );
}