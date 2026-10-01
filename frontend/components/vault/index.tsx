'use client';
import * as config_site      from '@/configs/site';
import * as config_pages     from '@/configs/pages';
import * as config_vault     from '@/configs/vault';
import * as ui_modal         from '@/ui/modal';
import * as ui_tagpill       from '@/ui/tagpill';
import * as ui_iconbutton    from '@/ui/iconbutton';
import * as ui_card          from '@/ui/card';
import * as ui_filter        from '@/ui/filter';
import * as ui_search        from '@/ui/search';
import * as ui_button        from '@/ui/button';
import * as ui_divider       from '@/ui/divider';
import * as ui_wallpaper     from '@/ui/wallpaper';
import * as lib_api_url      from '@/lib/api_url';
import * as lib_auth_session from '@/lib/auth_session';
import * as lib_page_loading from '@/lib/page_loading';
import * as react            from 'react';
import * as lucide           from 'lucide-react';
import * as next_navigation  from 'next/navigation';
import './index.css';

const BANNER_CFG = {
  card: { wrap: 'vault-card-banner', ph: 'vault-card-banner-placeholder', overlay: 'vault-card-banner-overlay', ico: 48 },
  modal: { wrap: 'vault-modal-banner', ph: 'vault-modal-banner-placeholder', overlay: 'vault-modal-banner-overlay', ico: 80 },
} as const;

function valid_tags(tags: config_vault.VaultTag[] = []): config_vault.VaultTag[] {
  return tags.filter(t => (config_vault.ALL_TAGS as readonly string[]).includes(t));
}

function render_with_code(text: string): react.ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.length > 1 && part.startsWith('`') && part.endsWith('`')) return <code key={i} className="code-pill">{part.slice(1, -1)}</code>;
    return <react.Fragment key={i}>{part}</react.Fragment>;
  });
}

function use_vault_resources() {
  const [resources, set_resources] = react.useState<config_vault.VaultResource[]>([]);
  const [state, set_state] = react.useState<config_vault.LoadState>('loading');

  react.useEffect(() => {
    let cancelled = false;
    async function load() {
      set_state('loading');
      lib_page_loading.set_page_loading(true);
      try {
        const res = await fetch(lib_api_url.get_api_url('/vault'));
        if (!res.ok) throw new Error(`vault.json fetch ${res.status}`);
        const index: config_vault.VaultIndex = await res.json();
        const cleaned = (index.resources ?? []).map(r => ({ ...r, tags: valid_tags(r.tags) }));
        if (!cancelled) { set_resources(cleaned); set_state('done'); }
      }
      catch (err) {
        console.error('[Vault]', err);
        if (!cancelled) set_state('error');
      }
      finally {
        if (!cancelled) lib_page_loading.set_page_loading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
      lib_page_loading.set_page_loading(false);
    };
  }, []);

  return { 
    resources, 
    state 
  };
}

async function download_directory_zip(folder: string): Promise<void> {
  const res = await fetch(lib_api_url.get_api_url('/vault/tree'), { cache: 'no-store' });
  if (!res.ok) throw new Error(`tree fetch ${res.status}`);

  const tree_data: { tree: { path: string; type: string }[] } = await res.json();
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

function VaultModal({ resource, on_close, closing }: { resource: config_vault.VaultResource; on_close: () => void; closing: boolean }) {
  const is_dir = !resource.is_submodule;
  const folder = is_dir ? resource.id : '';
  const [downloading, set_downloading] = react.useState(false);
  const [dl_error, set_dl_error] = react.useState<string | null>(null);
  const [copied, set_copied] = react.useState(false);

  const handle_share = react.useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('modal', resource.id);
    const url = `${window.location.origin}/vault?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      set_copied(true);
      window.setTimeout(() => set_copied(false), 2000);
    });
  }, [resource.id]);

  const handle_download = react.useCallback(async () => {
    if (!is_dir || downloading) return;
    set_downloading(true);
    set_dl_error(null);
    try { await download_directory_zip(folder); }
    catch (err) {
      console.error('[Vault] directory zip failed', err);
      set_dl_error('Could not prepare the download. Please try again.');
    }
    finally { set_downloading(false); }
  }, [is_dir, folder, downloading]);

  const controls = (
    <>
      <ui_iconbutton.IconButton
        className={`ui-modal-share${copied ? ' copied' : ''}`}
        icon={copied ? lucide.Check : lucide.Link}
        iconProps={{ size: 14, strokeWidth: 2.5 }}
        onClick={handle_share}
      />
      <ui_iconbutton.IconButton
        className="ui-modal-close"
        icon={lucide.X}
        iconProps={{ size: 14, strokeWidth: 2.5 }}
        onClick={on_close}
      />
    </>
  );

  return (
    <ui_modal.Modal
      closing={closing}
      onClose={on_close}
      controls={controls}
      media={<Banner src={resource.banner} size="modal"/>}
      label={resource.name}
    >
      <ui_modal.ModalHeader
        author={resource.author}
        authorHref={resource.author_url}
        version={`v${resource.version}`}
        title={resource.name}
        tagline={resource.tagline}
      />
      <ui_modal.ModalBody>
        <p className="ui-modal-desc">{render_with_code(resource.description)}</p>
      </ui_modal.ModalBody>
      <ui_modal.ModalFooter>
        <div className="ui-modal-tags">
          {resource.tags.map(t => (
            <ui_tagpill.TagPill key={t} label={t} className="ui-modal-tag"/>
          ))}
        </div>
        <ui_modal.ModalActions>
          {is_dir ? (
            <ui_button.Button
              variant="primary"
              onClick={handle_download}
              disabled={downloading}
              className={downloading ? 'is-busy' : ''}
            >
              {downloading
                ? <><lucide.Loader2 size={14} strokeWidth={2.5} className="vault-spin"/> Preparing…</>
                : 'Download Resource'}
            </ui_button.Button>
          ) : (
            <ui_button.Button
              variant="primary"
              href={resource.download_url ?? resource.source_url ?? '#'}
              download
            >
              Download Resource
            </ui_button.Button>
          )}
          {resource.source_url && (
            <ui_button.Button
              variant="secondary"
              href={resource.source_url}
              target="_blank"
              rel="noreferrer"
            >
              :: View Source
            </ui_button.Button>
          )}
        </ui_modal.ModalActions>
        {dl_error && <p className="ui-modal-error">{dl_error}</p>}
      </ui_modal.ModalFooter>
    </ui_modal.Modal>
  );
}

function VaultCard({ resource, onClick }: { resource: config_vault.VaultResource; onClick: () => void }) {
  return (
    <ui_card.Card
      layout="stack"
      className={`vault-card rev${resource.featured ? ' featured' : ''}`}
      onClick={onClick}
      coverNode={<Banner src={resource.banner} size="card"/>}
      topRight={resource.featured && <span className="vault-card-featured-badge">Featured</span>}
      bodyClassName="vault-card-body"
      bodyContent={
        <>
          <ui_card.CardMeta
            author={resource.author}
            version={`v${resource.version}`}
            title={resource.name}
            tagline={resource.tagline}
          />
          <div className="vault-card-footer">
            <div className="vault-card-tags">
              {resource.tags.slice(0, 2).map(t => (
                <ui_tagpill.TagPill key={t} label={t}/>
              ))}
            </div>
          </div>
        </>
      }
    />
  );
}


type GhRepo = {
  full_name: string;
  html_url: string;
  description: string | null;
};

function VaultSubmitModal({
  on_close,
  closing,
}: {
  on_close: () => void;
  closing: boolean;
}) {
  const [session, set_session] = react.useState<lib_auth_session.AuthSession | null>(null);
  const [repos, set_repos] = react.useState<GhRepo[]>([]);
  const [loading_repos, set_loading_repos] = react.useState(false);
  const [repo, set_repo] = react.useState('');
  const [busy, set_busy] = react.useState(false);
  const [error, set_error] = react.useState<string | null>(null);
  const [done, set_done] = react.useState<{ pr_url?: string | null; path?: string; updated?: boolean } | null>(null);

  react.useEffect(() => {
    lib_auth_session.capture_oauth_hash();
    set_session(lib_auth_session.read_auth_session());
    const on_auth = () => set_session(lib_auth_session.read_auth_session());
    window.addEventListener(lib_auth_session.AUTH_SESSION_EVENT, on_auth);
    return () => window.removeEventListener(lib_auth_session.AUTH_SESSION_EVENT, on_auth);
  }, []);

  const auth_headers = react.useCallback((): HeadersInit => {
    const s = lib_auth_session.read_auth_session();
    if (!s) return {};
    return {
      Authorization: `Bearer ${s.token}`,
      'Content-Type': 'application/json'
    };
  }, []);

  const load_repos = react.useCallback(async () => {
    const s = lib_auth_session.read_auth_session();
    if (!s) return;
    set_loading_repos(true);
    set_error(null);
    try {
      const res = await fetch(lib_api_url.get_api_url('/vault/repos'), { headers: auth_headers() });
      const json = await res.json().catch(() => ({}));
      if (res.status === 403 && json?.error === 'reauth_required') {
        set_error('Sign in again to grant repository access.');
        return;
      }
      if (!res.ok) throw new Error(json?.error || 'Failed to load repositories');
      set_repos(Array.isArray(json.repos) ? json.repos : []);
    }
    catch (e) {
      set_error(e instanceof Error ? e.message : 'Failed to load repositories');
    }
    finally {
      set_loading_repos(false);
    }
  }, [auth_headers]);

  react.useEffect(() => {
    if (session) load_repos();
  }, [session, load_repos]);

  const login = () => {
    window.location.href = lib_api_url.get_api_url('/auth/github?next=/vault');
  };

  const submit = async () => {
    set_busy(true);
    set_error(null);
    try {
      const res = await fetch(lib_api_url.get_api_url('/vault/submit'), {
        method: 'POST',
        headers: auth_headers(),
        body: JSON.stringify({ repo })
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 403 && json?.error === 'reauth_required') {
        set_error('Sign in again to grant repository access.');
        return;
      }
      if (!res.ok) throw new Error(json?.error || 'Submission failed');
      set_done({ pr_url: json.pr_url, path: json.path, updated: Boolean(json.updated) });
    }
    catch (e) {
      set_error(e instanceof Error ? e.message : 'Submission failed');
    }
    finally {
      set_busy(false);
    }
  };

  return (
    <ui_modal.Modal
      closing={closing}
      onClose={on_close}
      label="Submit resource"
      maxWidth={520}
    >
      <ui_modal.ModalHeader
        title="Submit a resource"
        tagline="Select a public repo with a manifest.yaml — we add the submodule and open the PR."
      />

      {done ? (
        <ui_modal.ModalBody>
          <p className="ui-modal-desc">
            {done.updated ? 'Update pull request opened on Vital.vault' : 'Pull request opened on Vital.vault'}
            {done.path ? <> at <code>{done.path}</code></> : null}.
            {done.pr_url ? (
              <>
                {' '}
                <a href={done.pr_url} target="_blank" rel="noreferrer">
                  View pull request
                </a>
              </>
            ) : null}
          </p>
        </ui_modal.ModalBody>
      ) : !session ? (
        <ui_modal.ModalBody>
          <p className="ui-modal-desc">
            Sign in with GitHub to select a repository. Metadata (name, tags, description)
            comes from your repo&apos;s <code>manifest.yaml</code>.
          </p>
        </ui_modal.ModalBody>
      ) : (
        <ui_modal.ModalBody>
          <div className="vault-submit-fields">
            <label className="vault-submit-label">
              Repository
              <select
                className="vault-submit-input"
                value={repo}
                onChange={(e) => set_repo(e.target.value)}
                disabled={loading_repos || busy}
              >
                <option value="">
                  {loading_repos ? 'Loading repositories…' : 'Select a public repo you own'}
                </option>
                {repos.map((r) => (
                  <option key={r.full_name} value={r.full_name}>
                    {r.full_name}
                  </option>
                ))}
              </select>
            </label>
            <p className="vault-submit-hint">
              Requires a <code>manifest.yaml</code> at the repo root (same format as existing vault resources).
            </p>
          </div>
        </ui_modal.ModalBody>
      )}

      {error && <p className="ui-modal-error">{error}</p>}

      <ui_modal.ModalFooter>
        <ui_modal.ModalActions>
          {!session ? (
            <ui_button.Button variant="primary" onClick={login}>
              Sign in with GitHub
            </ui_button.Button>
          ) : done ? (
            <ui_button.Button variant="primary" onClick={on_close}>
              Done
            </ui_button.Button>
          ) : (
            <ui_button.Button
              variant="primary"
              onClick={submit}
              disabled={busy || !repo}
              className={busy ? 'is-busy' : ''}
            >
              {busy ? 'Opening PR…' : 'Open pull request'}
            </ui_button.Button>
          )}
          <ui_button.Button variant="secondary" onClick={on_close} disabled={busy}>
            Cancel
          </ui_button.Button>
        </ui_modal.ModalActions>
      </ui_modal.ModalFooter>
    </ui_modal.Modal>
  );
}

function VaultHead({ on_submit }: { on_submit: () => void }) {
  return (
    <div className="page-head">
      <div className="sec-head sec-head--intro">
        <div>
          <div className="slabel">Vault</div>
          <h2>Community built,<br/>All yours to <span>explore.</span></h2>
        </div>
      </div>
      <div className="page-intro vault-intro sec-head sec-head--intro">
        <div>{config_pages.pages.vault.description}</div>
        <button type="button" className="sec-link" onClick={on_submit}>
          :: Submit Resource
        </button>
      </div>
    </div>
  );
}

function VaultFilters({ search = '', on_search, active_tag = null, on_tag, disabled }: config_vault.VaultFiltersProps) {
  return (
    <div className="vault-filters">
      <ui_filter.Filter
        className="vault-filter-tags"
        buttonClassName="vault-filter-btn"
        tags={config_vault.ALL_TAGS as unknown as string[]}
        active={active_tag}
        onChange={on_tag}
        disabled={disabled}
      />
      <ui_search.Search
        className="vault-search"
        value={search}
        onChange={on_search}
        placeholder="Search resources…"
        icon={<lucide.Search size={14} strokeWidth={2.5}/>}
        disabled={disabled}
      />
    </div>
  );
}

function VaultSkeleton() {
  react.useEffect(() => {
    lib_page_loading.set_page_loading(true);
    return () => lib_page_loading.set_page_loading(false);
  }, []);

  return (
    <section id="vault" className="sec-pad">
      <ui_wallpaper.Wallpaper variant={18}/>
      <div className="sw">
        <VaultHead on_submit={() => {}}/>
        <VaultFilters disabled/>
        <ui_divider.Divider className="anim-in anim-in--3"/>
      </div>
    </section>
  );
}

function VaultInner() {
  const router = next_navigation.useRouter();
  const searchParams = next_navigation.useSearchParams();
  const { resources, state } = use_vault_resources();
  const [search,  set_search] = react.useState(() => searchParams.get('search') ?? '');
  const [selected, set_selected] = react.useState<config_vault.VaultResource | null>(null);
  const [closing, set_closing] = react.useState(false);
  const [submit_open, set_submit_open] = react.useState(false);
  const [submit_closing, set_submit_closing] = react.useState(false);

  react.useEffect(() => {
    lib_auth_session.capture_oauth_hash();
  }, []);
  const [active_tag, set_active_tag] = react.useState<config_vault.VaultTag | null>(() => {
    const t = searchParams.get('tag') as config_vault.VaultTag | null;
    return t && (config_vault.ALL_TAGS as readonly string[]).includes(t) ? t : null;
  });
  const [initial_modal_id, set_initial_modal_id] = react.useState(() => searchParams.get('modal'));

  react.useEffect(() => {
    const params = new URLSearchParams();
    if (active_tag) params.set('tag', active_tag);
    if (search.trim()) params.set('search', search.trim());
    if (selected) params.set('modal', selected.id);
    const qs = params.toString();
    router.replace(`/vault${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [active_tag, search, selected]);

  react.useEffect(() => {
    if (state !== 'done' || !initial_modal_id) return;
    const match = resources.find(r => r.id === initial_modal_id);
    if (match) { set_closing(false); set_selected(match); }
    set_initial_modal_id(null);
  }, [state, resources, initial_modal_id]);

  react.useEffect(() => {
    const els = document.querySelectorAll('.rev');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [resources, active_tag, search]);

  const filtered = react.useMemo(() => {
    const tagged = active_tag ? resources.filter(r => r.tags.includes(active_tag)) : resources;
    const q = search.trim().toLowerCase();
    const list = q ? tagged.filter(r => r.name.toLowerCase().includes(q)) : tagged;
    return [...list].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [resources, active_tag, search]);

  const open = react.useCallback((r: config_vault.VaultResource) => {
    set_closing(false);
    set_selected(r);
  }, []);

  const close = react.useCallback(() => {
    set_closing(prev => {
      if (prev) return prev;
      window.setTimeout(() => { set_selected(null); set_closing(false); }, 220);
      return true;
    });
  }, []);

  return (
    <>
      <section id="vault" className="sec-pad">
      <ui_wallpaper.Wallpaper variant={18}/>
        <div className="sw">
          <VaultHead on_submit={() => { set_submit_closing(false); set_submit_open(true); }}/>

          <VaultFilters
            search={search}
            on_search={set_search}
            active_tag={active_tag}
            on_tag={set_active_tag}
          />
          
          <ui_divider.Divider className="anim-in anim-in--3"/>

          {state !== 'loading' && (
            <div className="vault-grid">
              {state === 'error' && (
                <div className="state-empty">
                  <lucide.WifiOff size={24} strokeWidth={2.5}/>
                  Failed to load resources — check your connection and try again
                </div>
              )}
              {state === 'done' && filtered.length === 0 && (
                <div className="state-empty">
                  <lucide.PackageOpen size={24}/>
                  No resources match your query
                </div>
              )}
              {state === 'done' && filtered.map(r => (
                <VaultCard key={r.id} resource={r} onClick={() => open(r)}/>
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && <VaultModal resource={selected} on_close={close} closing={closing}/>}
      {submit_open && (
        <VaultSubmitModal
          closing={submit_closing}
          on_close={() => {
            set_submit_closing(true);
            window.setTimeout(() => { set_submit_open(false); set_submit_closing(false); }, 220);
          }}
        />
      )}
    </>
  );
}

export function Vault() {
  return (
    <react.Suspense fallback={<VaultSkeleton/>}>
      <VaultInner/>
    </react.Suspense>
  );
}
