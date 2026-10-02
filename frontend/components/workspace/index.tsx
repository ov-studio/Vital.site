'use client';
import * as config_pages     from '@/configs/pages';
import * as lib_api_url      from '@/lib/api_url';
import * as lib_auth_session from '@/lib/auth_session';
import * as lib_page_loading from '@/lib/page_loading';
import * as ui_wallpaper     from '@/ui/wallpaper';
import * as ui_tabs          from '@/ui/tabs';
import * as ui_button        from '@/ui/button';
import * as ui_table         from '@/ui/table';
import * as ui_search        from '@/ui/search';
import * as ui_divider       from '@/ui/divider';
import * as ui_stat          from '@/ui/stat';
import * as react            from 'react';
import * as lucide           from 'lucide-react';
import './index.css';

type Application = {
  appId:         string;
  login:         string;
  name:          string;
  status:        'pending' | 'approved' | 'rejected';
  createdAt:     number;
  decidedAt?:    number;
  decidedBy?:    string;
  token?:        string;
  tokenClaimed?: boolean;
};

type VaultSub = {
  id: string;
  login: string;
  repo_full: string;
  repo_url: string;
  name: string;
  path?: string;
  kind?: string;
  status: string;
  createdAt: number;
  pr_url?: string | null;
};

type VaultPublished = {
  id: string;
  name: string;
  author: string;
  path: string;
  source_url?: string;
  version?: string;
  is_submodule?: boolean;
};

type ApiState = {
  pending:       Application | null;
  applications:  Application[];
  staffPending?: Application[];
  staffTokens?:  Application[];
  vaultPending?: VaultSub[];
  vaultPublished?: VaultPublished[];
  myVaultResources?: VaultPublished[];
};

function fmt_date(ts?: number) {
  if (!ts) return '—';
  try { return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); } 
  catch { return '—'; }
}

export function Workspace() {
  const [session, setSession] = react.useState<lib_auth_session.AuthSession | null>(null);
  const [data, setData] = react.useState<ApiState | null>(null);
  const [loading, setLoading] = react.useState(true);
  const [name, setName] = react.useState('');
  const [busy, setBusy] = react.useState(false);
  const [error, setError] = react.useState<string | null>(null);
  const [copied, setCopied] = react.useState<string | null>(null);
  const [tab, setTab] = react.useState<'tokens' | 'pending'>('tokens');
  const [accountTab, setAccountTab] = react.useState<'servers' | 'resources'>('servers');
  const [accountQ, setAccountQ] = react.useState('');
  const [vaultTab, setVaultTab] = react.useState<'pending' | 'published'>('published');
  const [vaultQ, setVaultQ] = react.useState('');
  const [q, setQ] = react.useState('');
  const [revealed, setRevealed] = react.useState<Record<string, boolean>>({});

  const refresh_session = react.useCallback(() => {
    setSession(lib_auth_session.read_auth_session());
  }, []);

  const auth_headers = react.useCallback((): HeadersInit => {
    const s = lib_auth_session.read_auth_session();
    if (!s) return {};
    return {
      'Authorization': `Bearer ${s.token}`,
      'Content-Type': 'application/json'
    };
  }, []);

  const load = react.useCallback(async () => {
    const s = lib_auth_session.read_auth_session();
    if (!s) {
      setData(null);
      setLoading(false);
      lib_page_loading.set_page_loading(false);
      return;
    }
    setLoading(true);
    lib_page_loading.set_page_loading(true);
    try {
      const res  = await fetch(lib_api_url.get_api_url('/masterlist/applications'), { headers: auth_headers() });
      const json = await res.json().catch(() => ({}));
      if (res.status === 401) {
        lib_auth_session.clear_auth_session();
        setSession(null);
        setError('Session expired — sign in again.');
        return;
      }
      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'Failed to load');
        return;
      }
      let vaultPending: VaultSub[] = [];
      let vaultPublished: VaultPublished[] = [];
      let myVaultResources: VaultPublished[] = [];

      const login_lc = s.login.toLowerCase();
      try {
        const vault_res = await fetch(lib_api_url.get_api_url('/vault'), {
          headers: { Accept: 'application/json' }
        });
        if (vault_res.ok) {
          const vj = await vault_res.json().catch(() => ({} as { resources?: unknown[] }));
          const resources = Array.isArray(vj?.resources) ? vj.resources : [];
          myVaultResources = resources
            .filter((r: { author?: string; author_url?: string }) => {
              const a = (r.author || '').toLowerCase();
              const url = (r.author_url || '').toLowerCase();
              return a === login_lc || url.includes('github.com/' + login_lc);
            })
            .map((r: {
              id?: string; name?: string; author?: string; version?: string; source_url?: string;
            }) => ({
              id: r.id || '',
              name: r.name || r.id || '',
              author: r.author || '',
              path: r.id ? 'resources/' + r.id : '',
              source_url: r.source_url,
              version: r.version
            }))
            .filter((r: VaultPublished) => Boolean(r.id));
        }
      }
      catch { /* optional */ }

      if (s.staff) {
        const vr = await fetch(lib_api_url.get_api_url('/vault/submissions'), { headers: auth_headers() });
        if (vr.ok) {
          const vj = await vr.json().catch(() => ({}));
          vaultPending = Array.isArray(vj.pending) ? vj.pending : [];
          vaultPublished = Array.isArray(vj.published) ? vj.published : [];
        }
      }
      setData({ ...(json as ApiState), vaultPending, vaultPublished, myVaultResources });
      setError(null);
    } 
    catch { setError('Network error — is the API up?'); } 
    finally {
      setLoading(false);
      lib_page_loading.set_page_loading(false);
    }
  }, [auth_headers]);

  react.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (err) {
      setError(err);
      window.history.replaceState(null, '', window.location.pathname);
    }
    lib_auth_session.capture_oauth_hash();
    refresh_session();
    load();
    const on_auth = () => { refresh_session(); load(); };
    window.addEventListener(lib_auth_session.AUTH_SESSION_EVENT, on_auth);
    return () => {
      window.removeEventListener(lib_auth_session.AUTH_SESSION_EVENT, on_auth);
      lib_page_loading.set_page_loading(false);
    };
  }, [refresh_session, load]);

  const login = react.useCallback(() => {
    window.location.href = lib_api_url.get_api_url('/auth/github');
  }, []);

  const apply = react.useCallback(async () => {
    setBusy(true); setError(null);
    try {
      const res  = await fetch(lib_api_url.get_api_url('/masterlist/applications'), {
        method: 'POST', headers: auth_headers(),
        body: JSON.stringify({ name: name.trim() || undefined })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setError(typeof json.error === 'string' ? json.error : 'Apply failed'); return; }
      setName('');
      await load();
    } 
    catch { setError('Network error'); }
    finally { setBusy(false); }
  }, [name, auth_headers, load]);

  const cancel = react.useCallback(async (appId?: string) => {
    setBusy(true); setError(null);
    try {
      const res  = await fetch(lib_api_url.get_api_url('/masterlist/applications'), {
        method: 'DELETE', headers: auth_headers(),
        body: JSON.stringify(appId ? { appId } : {})
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setError(typeof json.error === 'string' ? json.error : 'Cancel failed'); return; }
      await load();
    } 
    catch { setError('Network error'); }
    finally { setBusy(false); }
  }, [auth_headers, load]);

  const claim = react.useCallback(async (appId: string) => {
    setBusy(true);
    try {
      await fetch(lib_api_url.get_api_url('/masterlist/applications/claim'), {
        method: 'POST', headers: auth_headers(),
        body: JSON.stringify({ appId })
      });
      setRevealed((prev) => {
        const next = { ...prev };
        delete next[appId];
        return next;
      });
      await load();
    } 
    finally { setBusy(false); }
  }, [auth_headers, load]);

  const decide = react.useCallback(async (appId: string, action: 'approve' | 'reject' | 'revoke') => {
    setBusy(true); setError(null);
    try {
      const res  = await fetch(lib_api_url.get_api_url('/masterlist/applications/decide'), {
        method: 'POST', headers: auth_headers(),
        body: JSON.stringify({ appId, action })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setError(typeof json.error === 'string' ? json.error : 'Action failed'); return; }
      await load();
    } 
    catch { setError('Network error'); }
    finally { setBusy(false); }
  }, [auth_headers, load]);

  const copy = react.useCallback(async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1600);
    } 
    catch { setError('Clipboard write failed'); }
  }, []);

  const toggleReveal = react.useCallback((key: string) => {
    setRevealed((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const pendingApp = data?.pending ?? null;
  const myApps = data?.applications ?? [];
  const myVault = data?.myVaultResources ?? [];
  const account_ql = accountQ.trim().toLowerCase();
  const filtered_my_apps = account_ql
    ? myApps.filter((a) => a.name.toLowerCase().includes(account_ql) || a.login.toLowerCase().includes(account_ql))
    : myApps;
  const filtered_my_vault = account_ql
    ? myVault.filter((r) =>
        r.name.toLowerCase().includes(account_ql) ||
        (r.author || '').toLowerCase().includes(account_ql) ||
        (r.path || '').toLowerCase().includes(account_ql)
      )
    : myVault;

  const staffPending = data?.staffPending ?? [];
  const staffTokens  = data?.staffTokens ?? [];
  const ql = q.trim().toLowerCase();
  const filtered_pending = ql
    ? staffPending.filter(p => p.name.toLowerCase().includes(ql) || p.login.toLowerCase().includes(ql))
    : staffPending;
  const filtered_tokens = ql
    ? staffTokens.filter(t => t.name.toLowerCase().includes(ql) || t.login.toLowerCase().includes(ql))
    : staffTokens;

  const vault_ql = vaultQ.trim().toLowerCase();
  const vault_pending_list = data?.vaultPending ?? [];
  const vault_published_list = data?.vaultPublished ?? [];
  const filtered_vault_pending = vault_ql
    ? vault_pending_list.filter((v) =>
        v.name.toLowerCase().includes(vault_ql) ||
        v.login.toLowerCase().includes(vault_ql) ||
        (v.repo_full || '').toLowerCase().includes(vault_ql)
      )
    : vault_pending_list;
  const filtered_vault_published = vault_ql
    ? vault_published_list.filter((r) =>
        r.name.toLowerCase().includes(vault_ql) ||
        (r.author || '').toLowerCase().includes(vault_ql) ||
        (r.path || '').toLowerCase().includes(vault_ql)
      )
    : vault_published_list;

  const decide_vault = react.useCallback(async (id: string, decision: 'approved' | 'rejected') => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(lib_api_url.get_api_url('/vault/submissions'), {
        method: 'POST',
        headers: auth_headers(),
        body: JSON.stringify({ id, decision })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || 'Failed');
      await load();
    }
    catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    }
    finally {
      setBusy(false);
    }
  }, [auth_headers, load]);

  const remove_vault = react.useCallback(async (path: string) => {
    if (!window.confirm('Open a PR to remove this resource from the vault?')) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(lib_api_url.get_api_url('/vault/submissions'), {
        method: 'POST',
        headers: auth_headers(),
        body: JSON.stringify({ action: 'remove', path })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || 'Failed to open removal PR');
      await load();
    }
    catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    }
    finally {
      setBusy(false);
    }
  }, [auth_headers, load]);


  const canApply = !pendingApp;

  return (
    <main className="ws-page sec-pad">
      <ui_wallpaper.Wallpaper variant={3}/>
      <div className="sw">
        <div className="page-head">
          <div className="sec-head sec-head--intro">
            <div>
              <div className="slabel">Workspace</div>
              <h2>Your servers.<br/>Managed in one <span>place.</span></h2>
            </div>
          </div>
          <p className="page-intro ws-lead">
            {config_pages.pages.workspace.description}
          </p>
        </div>

        {!session ? (
          <div className="ws-panel ws-panel--narrow">
            <p className="ws-text">Sign in with GitHub to open your workspace.</p>
            {error && <p className="ws-error" role="alert">Error: {error}</p>}
            <ui_button.Button variant="secondary" className="ws-btn" onClick={login}>
              Sign in with GitHub
            </ui_button.Button>
          </div>
        ) : (
          <>
            <div className="sec-title">Account</div>
            <ui_divider.Divider className="anim-in anim-in--3"/>

            {error && <p className="ws-error" role="alert">Error: {error}</p>}

            <div className="ws-profile-row">
              <div className="ws-profile-card">
                <div className="ws-avatar">
                  <div className="ws-avatar-img">
                    <img src={session.avatar} alt="" width={56} height={56} referrerPolicy="no-referrer"/>
                  </div>
                </div>
                <div>
                  <div className="ws-login">@{session.login}</div>
                  <div className="ws-role">{session.staff ? 'Authorized Personnel' : 'Unauthorized Personnel'}</div>
                </div>
              </div>
              <ui_stat.Stat
                label="Servers"
                icon={<lucide.Server size={16} strokeWidth={2}/>}
                value={loading ? '—' : myApps.length}
              />
              <ui_stat.Stat
                label="Resources"
                icon={<lucide.Package size={16} strokeWidth={2}/>}
                value={loading ? '—' : myVault.length}
              />
              {pendingApp && (
                <div className="ws-apply-card">
                  <div className="ws-pending-card ws-pending-card--in-panel">
                    <div className="ws-stat-top">
                      <div className="ws-stat-label">{pendingApp.name}</div>
                    </div>
                    <div className="ws-pending-card-bottom">
                      <div className="ws-pending-card-meta">
                        Waiting for staff review · submitted {fmt_date(pendingApp.createdAt)}
                      </div>
                      <ui_button.Button variant="action" danger onClick={() => cancel(pendingApp.appId)} disabled={busy}>
                        Cancel
                      </ui_button.Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {canApply && (
              <div className="ws-apply-card ws-apply-card--row">
                <div className="ws-apply">
                  <label className="ws-label" htmlFor="app-name">Request a masterlist token</label>
                  <div className="ws-apply-row">
                    <ui_search.Search
                      className="ws-apply-search"
                      placeholder="Night City RP"
                      value={name}
                      onChange={(v: string) => setName(String(v).slice(0, 64))}
                      disabled={busy}
                      icon={<lucide.Server size={14} strokeWidth={2}/>}
                    />
                    <ui_button.Button variant="action" size="lg" onClick={apply} disabled={busy}>
                      {busy ? 'Submitting…' : 'Submit'}
                    </ui_button.Button>
                  </div>
                </div>
              </div>
            )}

            <div className="ws-panel">
              <div className="ws-panel-head ws-panel-head--tabs">
                <ui_tabs.Tabs
                  value={accountTab}
                  onChange={(id) => setAccountTab(id as 'servers' | 'resources')}
                  ariaLabel="Account lists"
                  items={[
                    { id: 'servers', label: 'Servers', icon: <lucide.Server size={14} strokeWidth={2.25}/> },
                    { id: 'resources', label: 'Resources', icon: <lucide.Package size={14} strokeWidth={2.25}/> },
                  ]}
                />
                <ui_search.Search
                  className="ws-search-ui"
                  placeholder="Search name or author…"
                  value={accountQ}
                  onChange={setAccountQ}
                  icon={<lucide.Search size={14} strokeWidth={2}/>}
                />
              </div>

              {accountTab === 'servers' && (
                <ui_table.Table className="ui-table--apps">
                  <thead>
                    <tr>
                      <th>Server</th>
                      <th>Approved</th>
                      <th>Token</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered_my_apps.length === 0 ? (
                      <tr className="ui-table-empty">
                        <td colSpan={4}>
                          <div className="state-empty">
                            <lucide.Server size={28} strokeWidth={1.5}/>
                            <span>
                              {loading
                                ? 'Loading…'
                                : pendingApp
                                  ? 'No approved servers yet — your request is under review.'
                                  : 'No approved servers yet. Apply above to get a token.'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered_my_apps.map((app) => {
                        const isOpen = !!revealed[app.appId];
                        return (
                          <tr key={app.appId}>
                            <td>
                              <div className="ws-cell-title">{app.name}</div>
                            </td>
                            <td>{fmt_date(app.decidedAt ?? app.createdAt)}</td>
                            <td>
                              {app.token ? (
                                <button
                                  type="button"
                                  className={`ws-spoiler${isOpen ? ' ws-spoiler--open' : ''}`}
                                  onClick={() => toggleReveal(app.appId)}
                                  title={isOpen ? 'Click to hide' : 'Click to reveal'}
                                >
                                  <code className="ws-v ws-v--secret">
                                    {isOpen ? app.token : '•'.repeat(Math.min(48, app.token.length))}
                                  </code>
                                  <span className="ws-spoiler-hint">{isOpen ? 'Hide' : 'Reveal'}</span>
                                </button>
                              ) : app.tokenClaimed ? (
                                <span className="ws-muted">Saved (no longer stored)</span>
                              ) : (
                                <span className="ws-muted">—</span>
                              )}
                            </td>
                            <td className="ws-actions-cell">
                              <div className="ws-inline-actions">
                                {app.token && isOpen && (
                                  <ui_button.Button variant="action" onClick={() => copy(`tok-${app.appId}`, app.token!)}>
                                    {copied === `tok-${app.appId}` ? 'Copied' : 'Copy'}
                                  </ui_button.Button>
                                )}
                                {app.token && !app.tokenClaimed && (
                                  <ui_button.Button variant="action" disabled={busy} onClick={() => claim(app.appId)}>
                                    Mark as saved
                                  </ui_button.Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </ui_table.Table>
              )}

              {accountTab === 'resources' && (
                <ui_table.Table>
                  <thead>
                    <tr>
                      <th>Resource</th>
                      <th>Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered_my_vault.length === 0 ? (
                      <tr className="ui-table-empty">
                        <td colSpan={2}>
                          <div className="state-empty">
                            <lucide.Package size={28} strokeWidth={1.5}/>
                            <span>{loading ? 'Loading…' : 'No vault resources linked to your GitHub account.'}</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered_my_vault.map((r) => (
                        <tr key={r.id}>
                          <td>
                            {r.source_url ? (
                              <a className="ws-cell-title" href={r.source_url} target="_blank" rel="noreferrer">{r.name}</a>
                            ) : (
                              <div className="ws-cell-title">{r.name}</div>
                            )}
                            <div className="ws-muted">{r.path}</div>
                          </td>
                          <td>{r.version || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </ui_table.Table>
              )}
            </div>

            {session.staff && (
              <>
                <div className="sec-title">Review Applications</div>
                <ui_divider.Divider className="anim-in anim-in--3"/>
                <ui_stat.StatGrid columns="auto" className="ws-stats">
                  <ui_stat.Stat
                    label="Issued"
                    icon={<lucide.KeyRound size={16} strokeWidth={2}/>}
                    value={loading ? '—' : staffTokens.length}
                  />
                  <ui_stat.Stat
                    label="Pending"
                    icon={<lucide.Clock size={16} strokeWidth={2}/>}
                    value={loading ? '—' : staffPending.length}
                  />
                </ui_stat.StatGrid>

                <div className="ws-panel">
                  <div className="ws-panel-head ws-panel-head--tabs">
                    <ui_tabs.Tabs
                      value={tab}
                      onChange={(id) => setTab(id as 'tokens' | 'pending')}
                      ariaLabel="Application lists"
                      items={[
                        {
                          id: 'tokens',
                          label: 'Issued',
                          icon: <lucide.KeyRound size={14} strokeWidth={2.25}/>,
                        },
                        {
                          id: 'pending',
                          label: 'Pending',
                          icon: <lucide.Inbox size={14} strokeWidth={2.25}/>,
                        },
                      ]}
                    />
                    {(tab === 'pending' || tab === 'tokens') && (
                      <ui_search.Search
                        className="ws-search-ui"
                        placeholder="Search name or author…"
                        value={q}
                        onChange={setQ}
                        icon={<lucide.Search size={14} strokeWidth={2}/>}
                      />
                    )}
                  </div>

                  {tab === 'pending' && (
                    <ui_table.Table>
                        <thead>
                          <tr>
                            <th>Server</th>
                            <th>Author</th>
                            <th>Submitted</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered_pending.length === 0 ? (
                            <tr className="ui-table-empty">
                              <td colSpan={4}>
                                <div className="state-empty">
                                  <lucide.Inbox size={28} strokeWidth={1.5}/>
                                  <span>{loading ? 'Loading…' : 'No pending requests.'}</span>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filtered_pending.map((p) => (
                              <tr key={p.appId}>
                                <td>
                                  <div className="ws-cell-title">{p.name}</div>
                                </td>
                                <td>@{p.login}</td>
                                <td>{fmt_date(p.createdAt)}</td>
                                <td className="ws-actions-cell">
                                  <div className="ws-inline-actions">
                                    <ui_button.Button variant="action" disabled={busy} onClick={() => decide(p.appId, 'approve')}>Approve</ui_button.Button>
                                    <ui_button.Button variant="action" danger disabled={busy} onClick={() => decide(p.appId, 'reject')}>Reject</ui_button.Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </ui_table.Table>
                  )}

                  {tab === 'tokens' && (
                    <ui_table.Table>
                        <thead>
                          <tr>
                            <th>Server</th>
                            <th>Author</th>
                            <th>Approved by</th>
                            <th>Date</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered_tokens.length === 0 ? (
                            <tr className="ui-table-empty">
                              <td colSpan={5}>
                                <div className="state-empty">
                                  <lucide.KeyRound size={28} strokeWidth={1.5}/>
                                  <span>{loading ? 'Loading…' : 'No issued tokens.'}</span>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filtered_tokens.map((t) => (
                              <tr key={t.appId}>
                                <td><div className="ws-cell-title">{t.name}</div></td>
                                <td>@{t.login}</td>
                                <td>{t.decidedBy ? `@${t.decidedBy}` : '—'}</td>
                                <td>{fmt_date(t.decidedAt ?? t.createdAt)}</td>
                                <td className="ws-actions-cell">
                                  <div className="ws-inline-actions">
                                    <ui_button.Button variant="action" danger disabled={busy} onClick={() => decide(t.appId, 'revoke')}>Revoke</ui_button.Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </ui_table.Table>
                  )}
                </div>
              
                <div className="sec-title anim-in anim-in--4">Vault Submissions</div>
                <ui_divider.Divider className="anim-in anim-in--4"/>
                <div className="ws-stats anim-in anim-in--4">
                  <div className="ws-stat">
                    <div className="ws-stat-top">
                      <div className="ws-stat-label">Published</div>
                      <lucide.Package size={16} strokeWidth={2} className="ws-stat-icon"/>
                    </div>
                    <div className="ws-stat-value">{loading ? '—' : (data?.vaultPublished?.length ?? 0)}</div>
                  </div>
                  <div className="ws-stat">
                    <div className="ws-stat-top">
                      <div className="ws-stat-label">Pending</div>
                      <lucide.Inbox size={16} strokeWidth={2} className="ws-stat-icon"/>
                    </div>
                    <div className="ws-stat-value">{loading ? '—' : (data?.vaultPending?.length ?? 0)}</div>
                  </div>
                </div>
                                <div className="ws-panel anim-in anim-in--4">
                  <div className="ws-panel-head ws-panel-head--tabs">
                    <ui_tabs.Tabs
                      value={vaultTab}
                      onChange={(id) => setVaultTab(id as 'pending' | 'published')}
                      ariaLabel="Vault lists"
                      items={[
                        { id: 'published', label: 'Published', icon: <lucide.Package size={14} strokeWidth={2.25}/> },
                        { id: 'pending', label: 'Pending', icon: <lucide.Inbox size={14} strokeWidth={2.25}/> },
                      ]}
                    />
                    <ui_search.Search
                      className="ws-search-ui"
                      placeholder="Search name or author…"
                      value={vaultQ}
                      onChange={setVaultQ}
                      icon={<lucide.Search size={14} strokeWidth={2}/>}
                    />
                  </div>

                  {vaultTab === 'pending' && (
                    <ui_table.Table>
                      <thead>
                        <tr>
                          <th>Resource</th>
                          <th>Submitter</th>
                          <th>Submitted</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered_vault_pending.length === 0 ? (
                          <tr className="ui-table-empty">
                            <td colSpan={4}>
                              <div className="state-empty">
                                <lucide.Inbox size={28} strokeWidth={1.5}/>
                                <span>{loading ? 'Loading…' : 'No open resource pull requests.'}</span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filtered_vault_pending.map((v) => (
                            <tr key={v.id}>
                              <td>
                                {v.repo_url ? (
                                  <a className="ws-cell-title" href={v.repo_url} target="_blank" rel="noreferrer">{v.name}</a>
                                ) : (
                                  <div className="ws-cell-title">{v.name}</div>
                                )}
                                <div className="ws-muted">{v.repo_full || v.kind}</div>
                              </td>
                              <td>@{v.login}</td>
                              <td>{fmt_date(v.createdAt)}</td>
                              <td className="ws-actions-cell">
                                <div className="ws-inline-actions">
                                  <ui_button.Button variant="action" disabled={busy} onClick={() => decide_vault(v.id, 'approved')}>
                                    Approve
                                  </ui_button.Button>
                                  <ui_button.Button variant="action" danger disabled={busy} onClick={() => decide_vault(v.id, 'rejected')}>
                                    Reject
                                  </ui_button.Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </ui_table.Table>
                  )}

                  {vaultTab === 'published' && (
                    <ui_table.Table>
                      <thead>
                        <tr>
                          <th>Resource</th>
                          <th>Author</th>
                          <th>Version</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered_vault_published.length === 0 ? (
                          <tr className="ui-table-empty">
                            <td colSpan={4}>
                              <div className="state-empty">
                                <lucide.Package size={28} strokeWidth={1.5}/>
                                <span>{loading ? 'Loading…' : 'No published vault resources.'}</span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filtered_vault_published.map((r) => (
                            <tr key={r.id}>
                              <td>
                                {r.source_url ? (
                                  <a className="ws-cell-title" href={r.source_url} target="_blank" rel="noreferrer">{r.name}</a>
                                ) : (
                                  <div className="ws-cell-title">{r.name}</div>
                                )}
                                <div className="ws-muted">{r.path}</div>
                              </td>
                              <td>{r.author ? `@${r.author}` : '—'}</td>
                              <td>{r.version || '—'}</td>
                              <td className="ws-actions-cell">
                                <div className="ws-inline-actions">
                                  <ui_button.Button variant="action" danger disabled={busy} onClick={() => remove_vault(r.path)}>
                                    Remove
                                  </ui_button.Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </ui_table.Table>
                  )}
                </div>


</>
            )}
          </>
        )}
      </div>
    </main>
  );
}
