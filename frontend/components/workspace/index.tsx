'use client';
import * as config_pages     from '@/configs/pages';
import * as lib_api_url      from '@/lib/api_url';
import * as lib_auth_session from '@/lib/auth_session';
import * as lib_format       from '@/lib/format';
import * as lib_hooks        from '@/lib/hooks';
import * as lib_api_request  from '@/lib/api_request';
import * as lib_search       from '@/lib/search_filter';
import * as ui_page          from '@/ui/page';
import * as ui_pagehead      from '@/ui/pagehead';
import * as ui_panel         from '@/ui/panel';
import * as ui_section       from '@/ui/section';
import * as ui_secret        from '@/ui/secret';
import * as ui_button        from '@/ui/button';
import * as ui_iconbutton    from '@/ui/iconbutton';
import * as ui_table         from '@/ui/table';
import * as ui_search        from '@/ui/search';
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
  id:        string;
  login:     string;
  repo_full: string;
  repo_url:  string;
  name:      string;
  path?:     string;
  kind?:     string;
  status:    string;
  createdAt: number;
  pr_url?:   string | null;
};

type VaultPublished = {
  id:            string;
  name:          string;
  author:        string;
  path:          string;
  source_url?:   string;
  version?:      string;
  is_submodule?: boolean;
};

type ApiState = {
  pending:           Application | null;
  applications:      Application[];
  staffPending?:     Application[];
  staffTokens?:      Application[];
  vaultPending?:     VaultSub[];
  vaultPublished?:   VaultPublished[];
  myVaultResources?: VaultPublished[];
};

const ACCOUNT_TABS = [
  { id: 'servers',   label: 'Servers',   icon: <lucide.Server size={14} strokeWidth={2.25}/> },
  { id: 'resources', label: 'Resources', icon: <lucide.Package size={14} strokeWidth={2.25}/> },
];
const REVIEW_TABS = [
  { id: 'tokens',  label: 'Issued',  icon: <lucide.KeyRound size={14} strokeWidth={2.25}/> },
  { id: 'pending', label: 'Pending', icon: <lucide.Inbox size={14} strokeWidth={2.25}/> },
];
const VAULT_TABS = [
  { id: 'published', label: 'Published', icon: <lucide.Package size={14} strokeWidth={2.25}/> },
  { id: 'pending',   label: 'Pending',   icon: <lucide.Inbox size={14} strokeWidth={2.25}/> },
];

const empty_state = (icon: react.ReactNode, text: string) => ({ icon, text });

export function Workspace() {
  const [session, setSession] = react.useState<lib_auth_session.AuthSession | null>(null);
  const [autoClose, setAutoClose] = react.useState(false);
  const [data, setData] = react.useState<ApiState | null>(null);
  const [loading, setLoading] = react.useState(true);
  const [name, setName] = react.useState('');
  const [busy, setBusy] = react.useState(false);
  const [error, setError] = react.useState<string | null>(null);
  const { copied, copy: copy_to_clipboard } = lib_hooks.use_clipboard();
  const [tab, setTab] = react.useState<'tokens' | 'pending'>('tokens');
  const [accountTab, setAccountTab] = react.useState<'servers' | 'resources'>('servers');
  const [accountQ, setAccountQ] = react.useState('');
  const [vaultTab, setVaultTab] = react.useState<'pending' | 'published'>('published');
  const [vaultQ, setVaultQ] = react.useState('');
  const [q, setQ] = react.useState('');
  const [revealed, setRevealed] = react.useState<Record<string, boolean>>({});

  lib_hooks.use_page_loading(loading);

  const refresh_session = react.useCallback(() => {
    setSession(lib_auth_session.read_auth_session());
  }, []);

  const load = react.useCallback(async () => {
    const s = lib_auth_session.read_auth_session();
    if (!s) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { ok, status, json, error: api_error } = await lib_api_request.api_request('/masterlist/applications');
      if (status === 401) {
        lib_auth_session.clear_auth_session();
        setSession(null);
        setError('Session expired — sign in again.');
        return;
      }
      if (!ok) {
        setError(api_error ?? 'Failed to load');
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
      catch {}

      if (s.staff) {
        const vr = await lib_api_request.api_request('/vault/submissions');
        if (vr.ok) {
          vaultPending = Array.isArray(vr.json.pending) ? vr.json.pending : [];
          vaultPublished = Array.isArray(vr.json.published) ? vr.json.published : [];
        }
      }
      setData({ ...(json as ApiState), vaultPending, vaultPublished, myVaultResources });
      setError(null);
    } 
    catch { setError('Network error — is the API up?'); } 
    finally { setLoading(false); }
  }, []);

  react.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    const auto_close = params.get('auto_close') === '1' || params.get('auto_close') === 'true';
    setAutoClose(auto_close);
    if (err) {
      setError(err);
      window.history.replaceState(
        null,
        '',
        window.location.pathname + (auto_close ? '?auto_close=1' : '')
      );
    }
    lib_auth_session.capture_oauth_hash();
    refresh_session();
    load();

    const try_auto_close = () => {
      if (!auto_close) return;
      if (!lib_auth_session.read_auth_session()) return;
      window.setTimeout(() => {
        window.close();
      }, 400);
    };
    try_auto_close();

    const on_auth = () => {
      refresh_session();
      load();
      try_auto_close();
    };
    window.addEventListener(lib_auth_session.AUTH_SESSION_EVENT, on_auth);
    return () => {
      window.removeEventListener(lib_auth_session.AUTH_SESSION_EVENT, on_auth);
    };
  }, [refresh_session, load]);

  const login = react.useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const auto_close = params.get('auto_close') === '1' || params.get('auto_close') === 'true';
    const next = auto_close ? '/workspace?auto_close=1' : '/workspace';
    window.location.href = lib_api_url.get_api_url(
      `/auth/github?next=${encodeURIComponent(next)}`
    );
  }, []);

  const act = react.useCallback(async (
    path: string,
    method: 'POST' | 'DELETE',
    body: unknown,
    fail: string
  ): Promise<boolean> => {
    setBusy(true); setError(null);
    try {
      const r = await lib_api_request.api_request(path, { method, body });
      if (!r.ok) { setError(r.error ?? fail); return false; }
      await load();
      return true;
    }
    catch { setError('Network error'); return false; }
    finally { setBusy(false); }
  }, [load]);

  const apply = react.useCallback(async () => {
    const server_name = name.trim();
    if (!server_name) { setError('Server name cannot be empty.'); return; }
    if (await act('/masterlist/applications', 'POST', { name: server_name }, 'Apply failed')) setName('');
  }, [name, act]);

  const cancel = react.useCallback((appId?: string) => {
    return act('/masterlist/applications', 'DELETE', appId ? { appId } : {}, 'Cancel failed');
  }, [act]);

  const claim = react.useCallback(async (appId: string) => {
    setBusy(true);
    try {
      await lib_api_request.api_request('/masterlist/applications/claim', { method: 'POST', body: { appId } });
      setRevealed((prev) => {
        const next = { ...prev };
        delete next[appId];
        return next;
      });
      await load();
    } 
    finally { setBusy(false); }
  }, [load]);

  const decide = react.useCallback((appId: string, action: 'approve' | 'reject' | 'revoke') => {
    return act('/masterlist/applications/decide', 'POST', { appId, action }, 'Action failed');
  }, [act]);

  const copy = react.useCallback(async (label: string, value: string) => {
    if (!(await copy_to_clipboard(value, label))) setError('Clipboard write failed');
  }, [copy_to_clipboard]);

  const toggleReveal = react.useCallback((key: string) => {
    setRevealed((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const first_load = loading && !data;
  const pendingApp = data?.pending ?? null;
  const myApps = data?.applications ?? [];
  const myVault = data?.myVaultResources ?? [];
  const staffPending = data?.staffPending ?? [];
  const staffTokens  = data?.staffTokens ?? [];
  const vaultPending = data?.vaultPending ?? [];
  const vaultPublished = data?.vaultPublished ?? [];

  const filtered_my_apps         = lib_search.search_filter(myApps, accountQ, (a) => [a.name, a.login]);
  const filtered_my_vault        = lib_search.search_filter(myVault, accountQ, (r) => [r.name, r.author, r.path]);
  const filtered_pending         = lib_search.search_filter(staffPending, q, (p) => [p.name, p.login]);
  const filtered_tokens          = lib_search.search_filter(staffTokens, q, (t) => [t.name, t.login]);
  const filtered_vault_pending   = lib_search.search_filter(vaultPending, vaultQ, (v) => [v.name, v.login, v.repo_full]);
  const filtered_vault_published = lib_search.search_filter(vaultPublished, vaultQ, (r) => [r.name, r.author, r.path]);

  const decide_vault = react.useCallback((id: string, decision: 'approved' | 'rejected') => {
    return act('/vault/submissions', 'POST', { id, decision }, 'Failed');
  }, [act]);

  const remove_vault = react.useCallback(async (path: string) => {
    if (!window.confirm('Open a PR to remove this resource from the vault?')) return;
    await act('/vault/submissions', 'POST', { action: 'remove', path }, 'Failed to open removal PR');
  }, [act]);

  const error_banner = error && (
    <div className="ws-error" role="alert">
      <span>Error: {error}</span>
      <ui_iconbutton.IconButton
        className="ws-error-close"
        icon={lucide.X}
        iconProps={{ size: 14, strokeWidth: 2.5 }}
        title="Dismiss"
        onClick={() => setError(null)}
      />
    </div>
  );

  return (
    <ui_page.Page as="main" className="ws-page" wallpaper={3}>
      <ui_pagehead.PageHead
        label="Workspace"
        title={<>Your servers.<br/>Managed in one <span>place.</span></>}
        intro={config_pages.pages.workspace.description}
        introClassName="ws-lead"
      />

        {!session ? (
          <ui_panel.Panel className="ws-panel--narrow">
            <p className="ws-text">
              {autoClose
                ? 'Sign in with GitHub to continue your vault submission. This tab will close when you are done.'
                : 'Sign in with GitHub to open your workspace.'}
            </p>
            {error_banner}
            <ui_button.Button variant="secondary" className="ws-btn" onClick={login}>
              Sign in with GitHub
            </ui_button.Button>
          </ui_panel.Panel>
        ) : (
          <>
            <ui_section.Section className="anim-in anim-in--3">Account</ui_section.Section>

            {error_banner}

            <div className="ws-profile-row">
              <ui_stat.Stat className="ws-profile-card">
                <div className="ws-avatar">
                  <div className="ws-avatar-img">
                    <img src={session.avatar} alt="" width={56} height={56} referrerPolicy="no-referrer"/>
                  </div>
                </div>
                <div>
                  <div className="ws-login">@{session.login}</div>
                  <div className="ws-role">{session.staff ? 'Authorized Personnel' : 'Unauthorized Personnel'}</div>
                </div>
              </ui_stat.Stat>
              <ui_stat.Stat
                label="Servers"
                icon={<lucide.Server size={16} strokeWidth={2}/>}
                value={myApps.length}
              />
              <ui_stat.Stat
                label="Resources"
                icon={<lucide.Package size={16} strokeWidth={2}/>}
                value={myVault.length}
              />
            </div>

            <ui_stat.Stat
              className="ws-apply-card--row"
              label={pendingApp ? pendingApp.name : 'Request a masterlist token'}
            >
              {pendingApp ? (
                <div className="ws-pending-bottom">
                  <div className="ws-pending-meta">
                    Waiting for staff review · submitted {lib_format.fmt_date(pendingApp.createdAt)}
                  </div>
                  <ui_button.Button variant="action" size="lg" danger onClick={() => cancel(pendingApp.appId)} disabled={busy}>
                    Cancel
                  </ui_button.Button>
                </div>
              ) : (
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
              )}
            </ui_stat.Stat>

            <ui_panel.TabPanel
              tabs={ACCOUNT_TABS}
              value={accountTab}
              onChange={(id) => setAccountTab(id as 'servers' | 'resources')}
              ariaLabel="Account lists"
              query={accountQ}
              onQuery={setAccountQ}
            >
              {accountTab === 'servers' && (
                <ui_table.DataTable
                  className="ui-table--apps"
                  head={['Server', 'Approved', 'Token', '']}
                  rows={filtered_my_apps}
                  rowKey={(app) => app.appId}
                  empty={empty_state(
                    <lucide.Server size={24} strokeWidth={2.5}/>,
                    first_load ? 'Loading…'
                      : pendingApp
                        ? 'No approved servers yet — your request is under review.'
                        : 'No approved servers yet. Apply above to get a token.'
                  )}
                  renderRow={(app) => {
                    const isOpen = !!revealed[app.appId];
                    return (
                      <>
                        <td><ui_table.TableTitle>{app.name}</ui_table.TableTitle></td>
                        <td>{lib_format.fmt_date(app.decidedAt ?? app.createdAt)}</td>
                        <td>
                          {app.token ? (
                            <ui_secret.Secret value={app.token} open={isOpen} onToggle={() => toggleReveal(app.appId)}/>
                          ) : app.tokenClaimed ? (
                            <span>Saved (no longer stored)</span>
                          ) : (
                            <span>—</span>
                          )}
                        </td>
                        <ui_table.TableActions>
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
                        </ui_table.TableActions>
                      </>
                    );
                  }}
                />
              )}

              {accountTab === 'resources' && (
                <ui_table.DataTable
                  head={['Resource', 'Version']}
                  rows={filtered_my_vault}
                  rowKey={(r) => r.id}
                  empty={empty_state(
                    <lucide.Package size={24} strokeWidth={2.5}/>,
                    first_load ? 'Loading…' : 'No vault resources linked to your GitHub account.'
                  )}
                  renderRow={(r) => (
                    <>
                      <td><ui_table.TableTitle href={r.source_url} sub={r.path}>{r.name}</ui_table.TableTitle></td>
                      <td>{r.version || '—'}</td>
                    </>
                  )}
                />
              )}
            </ui_panel.TabPanel>

            {session.staff && (
              <>
                <ui_section.Section className="anim-in anim-in--3">Review Applications</ui_section.Section>
                <ui_stat.StatGrid columns="auto" className="ws-stats">
                  <ui_stat.Stat
                    label="Issued"
                    icon={<lucide.KeyRound size={16} strokeWidth={2}/>}
                    value={staffTokens.length}
                  />
                  <ui_stat.Stat
                    label="Pending"
                    icon={<lucide.Clock size={16} strokeWidth={2}/>}
                    value={staffPending.length}
                  />
                </ui_stat.StatGrid>

                <ui_panel.TabPanel
                  tabs={REVIEW_TABS}
                  value={tab}
                  onChange={(id) => setTab(id as 'tokens' | 'pending')}
                  ariaLabel="Application lists"
                  query={q}
                  onQuery={setQ}
                >
                  {tab === 'pending' && (
                    <ui_table.DataTable
                      head={['Server', 'Author', 'Submitted', '']}
                      rows={filtered_pending}
                      rowKey={(p) => p.appId}
                      empty={empty_state(
                        <lucide.Inbox size={24} strokeWidth={2.5}/>,
                        first_load ? 'Loading…' : 'No pending requests.'
                      )}
                      renderRow={(p) => (
                        <>
                          <td><ui_table.TableTitle>{p.name}</ui_table.TableTitle></td>
                          <td>@{p.login}</td>
                          <td>{lib_format.fmt_date(p.createdAt)}</td>
                          <ui_table.TableActions>
                            <ui_button.Button variant="action" disabled={busy} onClick={() => decide(p.appId, 'approve')}>Approve</ui_button.Button>
                            <ui_button.Button variant="action" danger disabled={busy} onClick={() => decide(p.appId, 'reject')}>Reject</ui_button.Button>
                          </ui_table.TableActions>
                        </>
                      )}
                    />
                  )}

                  {tab === 'tokens' && (
                    <ui_table.DataTable
                      head={['Server', 'Author', 'Approved by', 'Date', '']}
                      rows={filtered_tokens}
                      rowKey={(t) => t.appId}
                      empty={empty_state(
                        <lucide.KeyRound size={24} strokeWidth={2.5}/>,
                        first_load ? 'Loading…' : 'No issued tokens.'
                      )}
                      renderRow={(t) => (
                        <>
                          <td><ui_table.TableTitle>{t.name}</ui_table.TableTitle></td>
                          <td>@{t.login}</td>
                          <td>{t.decidedBy ? `@${t.decidedBy}` : '—'}</td>
                          <td>{lib_format.fmt_date(t.decidedAt ?? t.createdAt)}</td>
                          <ui_table.TableActions>
                            <ui_button.Button variant="action" danger disabled={busy} onClick={() => decide(t.appId, 'revoke')}>Revoke</ui_button.Button>
                          </ui_table.TableActions>
                        </>
                      )}
                    />
                  )}
                </ui_panel.TabPanel>

                <ui_section.Section className="anim-in anim-in--4" titleClassName="anim-in anim-in--4">Vault Submissions</ui_section.Section>
                <ui_stat.StatGrid columns="auto" className="ws-stats anim-in anim-in--4">
                  <ui_stat.Stat
                    label="Published"
                    icon={<lucide.Package size={16} strokeWidth={2}/>}
                    value={vaultPublished.length}
                  />
                  <ui_stat.Stat
                    label="Pending"
                    icon={<lucide.Inbox size={16} strokeWidth={2}/>}
                    value={vaultPending.length}
                  />
                </ui_stat.StatGrid>

                <ui_panel.TabPanel
                  className="anim-in anim-in--4"
                  tabs={VAULT_TABS}
                  value={vaultTab}
                  onChange={(id) => setVaultTab(id as 'pending' | 'published')}
                  ariaLabel="Vault lists"
                  query={vaultQ}
                  onQuery={setVaultQ}
                >
                  {vaultTab === 'pending' && (
                    <ui_table.DataTable
                      head={['Resource', 'Submitter', 'Submitted', '']}
                      rows={filtered_vault_pending}
                      rowKey={(v) => v.id}
                      empty={empty_state(
                        <lucide.Inbox size={24} strokeWidth={2.5}/>,
                        first_load ? 'Loading…' : 'No open resource pull requests.'
                      )}
                      renderRow={(v) => (
                        <>
                          <td><ui_table.TableTitle href={v.repo_url || undefined} sub={v.repo_full || v.kind}>{v.name}</ui_table.TableTitle></td>
                          <td>@{v.login}</td>
                          <td>{lib_format.fmt_date(v.createdAt)}</td>
                          <ui_table.TableActions>
                            <ui_button.Button variant="action" disabled={busy} onClick={() => decide_vault(v.id, 'approved')}>Approve</ui_button.Button>
                            <ui_button.Button variant="action" danger disabled={busy} onClick={() => decide_vault(v.id, 'rejected')}>Reject</ui_button.Button>
                          </ui_table.TableActions>
                        </>
                      )}
                    />
                  )}

                  {vaultTab === 'published' && (
                    <ui_table.DataTable
                      head={['Resource', 'Author', 'Version', '']}
                      rows={filtered_vault_published}
                      rowKey={(r) => r.id}
                      empty={empty_state(
                        <lucide.Package size={24} strokeWidth={2.5}/>,
                        first_load ? 'Loading…' : 'No published vault resources.'
                      )}
                      renderRow={(r) => (
                        <>
                          <td><ui_table.TableTitle href={r.source_url} sub={r.path}>{r.name}</ui_table.TableTitle></td>
                          <td>{r.author ? `@${r.author}` : '—'}</td>
                          <td>{r.version || '—'}</td>
                          <ui_table.TableActions>
                            <ui_button.Button variant="action" danger disabled={busy} onClick={() => remove_vault(r.path)}>Remove</ui_button.Button>
                          </ui_table.TableActions>
                        </>
                      )}
                    />
                  )}
                </ui_panel.TabPanel>
              </>
            )}
          </>
        )}
    </ui_page.Page>
  );
}
