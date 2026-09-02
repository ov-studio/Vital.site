'use client';
import * as react            from 'react';
import * as lib_api_url      from '@/lib/api_url';
import * as lib_auth_session from '@/lib/auth_session';
import * as ui_wallpaper     from '@/ui/wallpaper';
import * as ui_search        from '@/ui/search';
import * as ui_divider       from '@/ui/divider';
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

type ApiState = {
  pending:       Application | null;
  applications:  Application[];
  staffPending?: Application[];
  staffTokens?:  Application[];
};

function fmt_date(ts?: number) {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return '—'; }
}

export function Workspace() {
  const [session, setSession] = react.useState<lib_auth_session.AuthSession | null>(null);
  const [data, setData] = react.useState<ApiState | null>(null);
  const [name, setName] = react.useState('');
  const [busy, setBusy] = react.useState(false);
  const [error, setError] = react.useState<string | null>(null);
  const [copied, setCopied] = react.useState<string | null>(null);
  const [tab, setTab] = react.useState<'pending' | 'tokens'>('pending');
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
    if (!s) { setData(null); return; }
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
      setData(json as ApiState);
      setError(null);
    } catch {
      setError('Network error — is the API up?');
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
    return () => window.removeEventListener(lib_auth_session.AUTH_SESSION_EVENT, on_auth);
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
    } catch { setError('Network error'); }
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
    } catch { setError('Network error'); }
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
    } finally { setBusy(false); }
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
    } catch { setError('Network error'); }
    finally { setBusy(false); }
  }, [auth_headers, load]);

  const copy = react.useCallback(async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1600);
    } catch { setError('Clipboard write failed'); }
  }, []);

  const toggleReveal = react.useCallback((key: string) => {
    setRevealed((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const pendingApp = data?.pending ?? null;
  const myApps = data?.applications ?? [];
  const staffPending = data?.staffPending ?? [];
  const staffTokens  = data?.staffTokens ?? [];
  const ql = q.trim().toLowerCase();
  const filtered_pending = ql
    ? staffPending.filter(p => p.name.toLowerCase().includes(ql) || p.login.toLowerCase().includes(ql))
    : staffPending;
  const filtered_tokens = ql
    ? staffTokens.filter(t => t.name.toLowerCase().includes(ql) || t.login.toLowerCase().includes(ql))
    : staffTokens;

  const canApply = !pendingApp;

  return (
    <main className="ws-page">
      <ui_wallpaper.Wallpaper seed={8} vignette={false} />
      <div className="sw">
        <div className="page-head">
          <div className="sec-head sec-head--intro">
            <div className="rev">
              <div className="slabel">Workspace</div>
              <h2>Your servers.<br/>Managed in one <span>place.</span></h2>
            </div>
          </div>
          <p className="ws-lead">
            Apply for masterlist tokens, track application status, and review requests.
          </p>
        </div>

        {!session ? (
          <div className="ws-panel ws-panel--narrow">
            <p className="ws-text">Sign in with GitHub to open your workspace.</p>
            {error && <p className="ws-error" role="alert">{error}</p>}
            <button type="button" className="btn-secondary ws-btn" onClick={login}>
              Sign in with GitHub
            </button>
          </div>
        ) : (
          <>
            {/* Profile strip */}
            <div className="ws-profile">
              <div className="ws-user">
                <div className="ws-avatar">
                  <div className="ws-avatar-img">
                    <img src={session.avatar} alt="" width={56} height={56} referrerPolicy="no-referrer" />
                  </div>
                </div>
                <div>
                  <div className="ws-login">@{session.login}</div>
                  <div className="ws-role">{session.staff ? 'Staff' : 'Member'}</div>
                </div>
              </div>
              {error && <p className="ws-error" role="alert">{error}</p>}
            </div>

            {/* Member: applications */}
            <div className="slabel ws-section-title">Manage your applications</div>
            <ui_divider.Divider/>
            <div className="ws-panel">
              <div className="ws-panel-body m-">
                {canApply && (
                  <div className="ws-apply" style={{ marginBottom: myApps.length || pendingApp ? 4 : 0 }}>
                    <label className="ws-label" htmlFor="app-name">Server name</label>
                    <div className="ws-apply-row">
                      <ui_search.Search
                        className="ws-apply-search"
                        placeholder="e.g. Night City RP"
                        value={name}
                        onChange={(v) => setName(String(v).slice(0, 64))}
                        disabled={busy}
                        icon={<lucide.Server size={14} strokeWidth={2} />}
                      />
                      <button type="button" className="btn-secondary ws-btn ws-apply-btn" onClick={apply} disabled={busy}>
                        {busy ? 'Submitting…' : 'Apply'}
                      </button>
                    </div>
                  </div>
                )}

                {pendingApp && (
                  <div className="ws-status-row">
                    <span className="ws-text">
                      <strong className="ws-server-name">{pendingApp.name}</strong> — waiting for staff review.
                    </span>
                    <button type="button" className="btn-secondary ws-btn-sm" onClick={() => cancel(pendingApp.appId)} disabled={busy}>Cancel</button>
                  </div>
                )}

                {myApps.length > 0 ? (
                  <div className="ws-table-wrap">
                    <table className="ws-table">
                      <thead>
                        <tr>
                          <th>Server</th>
                          <th>Status</th>
                          <th>Approved</th>
                          <th>Token</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {myApps.map((app) => {
                          const isOpen = !!revealed[app.appId];
                          return (
                            <tr key={app.appId}>
                              <td>
                                <div className="ws-cell-title">{app.name}</div>
                              </td>
                              <td>
                                <span className="ws-badge ws-badge--active">
                                  <lucide.Check size={14} strokeWidth={2.5} />Approved
                                </span>
                              </td>
                              <td className="ws-muted">{fmt_date(app.decidedAt ?? app.createdAt)}</td>
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
                                ) : (
                                  <span className="ws-muted">Saved (no longer stored)</span>
                                )}
                              </td>
                              <td className="ws-actions-cell">
                                <div className="ws-inline-actions">
                                  {app.token && isOpen && (
                                    <button
                                      type="button"
                                      className="ws-action-btn"
                                      onClick={() => copy(`tok-${app.appId}`, app.token!)}
                                    >
                                      {copied === `tok-${app.appId}` ? 'Copied' : 'Copy'}
                                    </button>
                                  )}
                                  {app.token && !app.tokenClaimed && (
                                    <button
                                      type="button"
                                      className="ws-action-btn"
                                      disabled={busy}
                                      onClick={() => claim(app.appId)}
                                    >
                                      Mark as saved
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  !pendingApp && (
                      <div className="state-empty" style={{ padding: '24px 20px' }}>
                      <lucide.KeyRound size={24} strokeWidth={1.5} />
                      <span>No approved servers yet. Apply above to get a token.</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Staff dashboard */}
            {session.staff && (
              <>
                <div className="slabel ws-section-title">Review community applications</div>
                <ui_divider.Divider/>
                <div className="ws-stats">
                  <div className="ws-stat">
                    <div className="ws-stat-top">
                      <div className="ws-stat-label">Pending</div>
                      <lucide.Clock size={16} strokeWidth={2} className="ws-stat-icon" />
                    </div>
                    <div className="ws-stat-value">{staffPending.length}</div>
                  </div>
                  <div className="ws-stat">
                    <div className="ws-stat-top">
                      <div className="ws-stat-label">Issued tokens</div>
                      <lucide.KeyRound size={16} strokeWidth={2} className="ws-stat-icon" />
                    </div>
                    <div className="ws-stat-value">{staffTokens.length}</div>
                  </div>
                </div>

                <div className="ws-panel">
                  <div className="ws-panel-head ws-panel-head--tabs">
                    <div className="ws-tabs">
                      <button type="button" className={`ws-tab${tab === 'pending' ? ' ws-tab--active' : ''}`} onClick={() => setTab('pending')}>
                        <lucide.Inbox size={14} strokeWidth={2} />
                        Pending{staffPending.length ? ` (${staffPending.length})` : ''}
                      </button>
                      <button type="button" className={`ws-tab${tab === 'tokens' ? ' ws-tab--active' : ''}`} onClick={() => setTab('tokens')}>
                        <lucide.KeyRound size={14} strokeWidth={2} />
                        Tokens{staffTokens.length ? ` (${staffTokens.length})` : ''}
                      </button>
                    </div>
                    {(tab === 'pending' || tab === 'tokens') && (
                      <ui_search.Search
                        className="ws-search-ui"
                        placeholder="Search name or author…"
                        value={q}
                        onChange={setQ}
                        icon={<lucide.Search size={14} strokeWidth={2} />}
                      />
                    )}
                  </div>

                  {tab === 'pending' && (
                    <div className="ws-table-wrap">
                      {filtered_pending.length === 0 ? (
                        <div className="state-empty">
                          <lucide.Inbox size={28} strokeWidth={1.5} />
                          <span>No pending requests.</span>
                        </div>
                      ) : (
                        <table className="ws-table">
                          <thead>
                            <tr>
                              <th>Server</th>
                              <th>Author</th>
                              <th>Submitted</th>
                              <th>Status</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {filtered_pending.map((p) => (
                              <tr key={p.appId}>
                                <td>
                                  <div className="ws-cell-title">{p.name}</div>
                                </td>
                                <td className="ws-muted">@{p.login}</td>
                                <td className="ws-muted">{fmt_date(p.createdAt)}</td>
                                <td><span className="ws-badge ws-badge--pending"><lucide.Clock size={14} strokeWidth={2.5} />Pending</span></td>
                                <td className="ws-actions-cell">
                                  <div className="ws-inline-actions">
                                    <button type="button" className="ws-action-btn" disabled={busy} onClick={() => decide(p.appId, 'approve')}>Approve</button>
                                    <button type="button" className="ws-action-btn ws-action-btn--danger" disabled={busy} onClick={() => decide(p.appId, 'reject')}>Reject</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}

                  {tab === 'tokens' && (
                    <div className="ws-table-wrap">
                      {filtered_tokens.length === 0 ? (
                        <div className="state-empty">
                          <lucide.KeyRound size={28} strokeWidth={1.5} />
                          <span>No issued tokens.</span>
                        </div>
                      ) : (
                        <table className="ws-table">
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
                            {filtered_tokens.map((t) => (
                              <tr key={t.appId}>
                                <td><div className="ws-cell-title">{t.name}</div></td>
                                <td className="ws-muted">@{t.login}</td>
                                <td className="ws-muted">{t.decidedBy ? `@${t.decidedBy}` : '—'}</td>
                                <td className="ws-muted">{fmt_date(t.decidedAt ?? t.createdAt)}</td>
                                <td className="ws-actions-cell">
                                  <div className="ws-inline-actions">
                                    <button type="button" className="ws-action-btn ws-action-btn--danger" disabled={busy} onClick={() => decide(t.appId, 'revoke')}>Revoke</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
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
