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
import * as ui_page          from '@/ui/page';
import * as ui_pagehead      from '@/ui/pagehead';
import * as ui_empty         from '@/ui/empty';
import * as lib_api_url      from '@/lib/api_url';
import * as lib_auth_session from '@/lib/auth_session';
import * as lib_hooks        from '@/lib/hooks';
import * as lib_api_request  from '@/lib/api_request';
import * as lib_download     from '@/lib/download';
import * as lib_search       from '@/lib/search_filter';
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

  lib_hooks.use_page_loading(state === 'loading');

  react.useEffect(() => {
    let cancelled = false;
    async function load() {
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
    }
    load();
    return () => { cancelled = true; };
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

  lib_download.trigger_download(await zip.generateAsync({ type: 'blob' }), `${folder}.zip`);
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
  const { copied: copied_key, copy } = lib_hooks.use_clipboard(2000);
  const copied = copied_key !== null;

  const handle_share = react.useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('modal', resource.id);
    const url = `${window.location.origin}/vault?${params.toString()}`;
    copy(url);
  }, [resource.id, copy]);

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
  full_name:   string;
  html_url:    string;
  description: string | null;
};

function VaultSubmitModal({
  on_close,
  closing,
}: {
  on_close: () => void;
  closing:  boolean;
}) {
  const session = lib_hooks.use_auth_session();
  const [repos, set_repos] = react.useState<GhRepo[]>([]);
  const [loading_repos, set_loading_repos] = react.useState(false);
  const [repo, set_repo] = react.useState('');
  const [busy, set_busy] = react.useState(false);
  const [error, set_error] = react.useState<string | null>(null);
  const [done, set_done] = react.useState<{ pr_url?: string | null; path?: string; updated?: boolean } | null>(null);

  const REAUTH_MESSAGE = 'Sign in again to grant repository access.';

  const load_repos = react.useCallback(async () => {
    if (!lib_auth_session.read_auth_session()) return;
    set_loading_repos(true);
    set_error(null);
    try {
      const r = await lib_api_request.api_request('/vault/repos');
      if (r.status === 403 && r.error === 'reauth_required') { set_error(REAUTH_MESSAGE); return; }
      if (!r.ok) throw new Error(r.error || 'Failed to load repositories');
      set_repos(Array.isArray(r.json.repos) ? r.json.repos : []);
    }
    catch (e) {
      set_error(e instanceof Error ? e.message : 'Failed to load repositories');
    }
    finally {
      set_loading_repos(false);
    }
  }, []);

  react.useEffect(() => {
    if (session) load_repos();
  }, [session, load_repos]);

  const login = () => {
    const url = '/workspace?auto_close=1';
    const w = window.open(url, '_blank');
    if (!w) { window.location.href = url; }
  };

  const submit = async () => {
    set_busy(true);
    set_error(null);
    try {
      const r = await lib_api_request.api_request('/vault/submit', { method: 'POST', body: { repo } });
      if (r.status === 403 && r.error === 'reauth_required') { set_error(REAUTH_MESSAGE); return; }
      if (!r.ok) throw new Error(r.error || 'Submission failed');
      set_done({ pr_url: r.json.pr_url, path: r.json.path, updated: Boolean(r.json.updated) });
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
      maxWidth={session ? 560 : 780}
    >
      <ui_modal.ModalHeader
        title="Submit a resource"
        tagline={
          session
            ? 'Select a public repo with a manifest.yaml — we add the submodule and open the PR.'
            : 'Sign-in is required to publish community resources to the vault.'
        }
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
          <div className="vault-submit-gate">
            <p className="ui-modal-desc vault-submit-gate-lead">
              You must be signed into workspace before you can submit a resource.
            </p>
            <ul className="vault-submit-gate-list">
              <li>List public repositories you own</li>
              <li>Read <code>manifest.yaml</code> (name, tags, description)</li>
              <li>Open a pull request on <code>Vital.vault</code> to add the submodule</li>
            </ul>
            <p className="vault-submit-hint">
              Sign in opens the workspace in a new tab. After you finish, that tab auto-closes and
              this page stays on the vault so you can continue your submission.
            </p>
          </div>
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
              Sign in on workspace
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
    <ui_pagehead.PageHead
      label="Vault"
      title={<>Community built,<br/>All yours to <span>explore.</span></>}
    >
      <div className="page-intro vault-intro sec-head sec-head--intro">
        <div>{config_pages.pages.vault.description}</div>
        <button type="button" className="sec-link" onClick={on_submit}>
          :: Submit Resource
        </button>
      </div>
    </ui_pagehead.PageHead>
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
  lib_hooks.use_page_loading(true);

  return (
    <ui_page.Page id="vault" wallpaper={18}>
      <VaultHead on_submit={() => {}}/>
      <VaultFilters disabled/>
      <ui_divider.Divider className="anim-in anim-in--3"/>
    </ui_page.Page>
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
    if (typeof window !== 'undefined' && window.location.hash.includes('auth_token')) return;
    const params = new URLSearchParams();
    if (active_tag) params.set('tag', active_tag);
    if (search.trim()) params.set('search', search.trim());
    if (selected) params.set('modal', selected.id);
    const qs = params.toString();
    const next = `/vault${qs ? `?${qs}` : ''}`;
    const cur = window.location.pathname + window.location.search;
    if (cur === next) return;
    router.replace(next, { scroll: false });
  }, [active_tag, search, selected, router]);

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
    const list = lib_search.search_filter(tagged, search, r => [r.name]);
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
      <ui_page.Page id="vault" wallpaper={18}>
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
              <ui_empty.EmptyState icon={<lucide.WifiOff size={24} strokeWidth={2.5}/>}>
                Failed to load resources — check your connection and try again
              </ui_empty.EmptyState>
            )}
            {state === 'done' && filtered.length === 0 && (
              <ui_empty.EmptyState icon={<lucide.PackageOpen size={24}/>}>
                No resources match your query
              </ui_empty.EmptyState>
            )}
            {state === 'done' && filtered.map(r => (
              <VaultCard key={r.id} resource={r} onClick={() => open(r)}/>
            ))}
          </div>
        )}
      </ui_page.Page>

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
