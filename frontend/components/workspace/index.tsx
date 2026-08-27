'use client';
import * as react            from 'react';
import * as lib_api_url      from '@/lib/api_url';
import * as lib_auth_session from '@/lib/auth_session';
import * as ui_wallpaper     from '@/ui/wallpaper';
import './index.css';

type Application = {
  login:         string;
  name:          string;
  status:        'pending' | 'approved' | 'rejected';
  createdAt:     number;
  decidedAt?:    number;
  decidedBy?:    string;
  token?:        string;
  id?:           string;
  tokenClaimed?: boolean;
};

type ApiState = {
  application: Application | null;
  pending?:    Application[];
  tokens?:     Application[];
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
  const [mintName, setMintName] = react.useState('');
  const [mintResult, setMintResult] = react.useState<{ token: string; id: string; name: string | null; note: string } | null>(null);
  const [copied, setCopied] = react.useState<string | null>(null);
  const [menu, setMenu] = react.useState<string | null>(null);
  const [tab, setTab] = react.useState<'pending' | 'tokens' | 'mint'>('pending');
  const [q, setQ] = react.useState('');

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

  react.useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [menu]);

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

  const cancel = react.useCallback(async () => {
    setBusy(true); setError(null);
    try {
      const res  = await fetch(lib_api_url.get_api_url('/masterlist/applications'), {
        method: 'DELETE', headers: auth_headers()
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setError(typeof json.error === 'string' ? json.error : 'Cancel failed'); return; }
      await load();
    } catch { setError('Network error'); }
    finally { setBusy(false); }
  }, [auth_headers, load]);

  const claim = react.useCallback(async () => {
    setBusy(true);
    try {
      await fetch(lib_api_url.get_api_url('/masterlist/applications/claim'), {
        method: 'POST', headers: auth_headers()
      });
      await load();
    } finally { setBusy(false); }
  }, [auth_headers, load]);

  const decide = react.useCallback(async (login: string, action: 'approve' | 'reject' | 'revoke') => {
    setBusy(true); setError(null); setMenu(null);
    try {
      const res  = await fetch(lib_api_url.get_api_url('/masterlist/applications/decide'), {
        method: 'POST', headers: auth_headers(),
        body: JSON.stringify({ login, action })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setError(typeof json.error === 'string' ? json.error : 'Action failed'); return; }
      await load();
    } catch { setError('Network error'); }
    finally { setBusy(false); }
  }, [auth_headers, load]);

  const mint = react.useCallback(async () => {
    setBusy(true); setError(null); setMintResult(null);
    try {
      const res  = await fetch(lib_api_url.get_api_url('/masterlist/register'), {
        method: 'POST', headers: auth_headers(),
        body: JSON.stringify({ name: mintName.trim() || undefined })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setError(typeof json.error === 'string' ? json.error : 'Mint failed'); return; }
      setMintResult(json);
      setMintName('');
      await load();
    } catch { setError('Network error'); }
    finally { setBusy(false); }
  }, [mintName, auth_headers, load]);

  const copy = react.useCallback(async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1600);
    } catch { setError('Clipboard write failed'); }
  }, []);

  const app = data?.application ?? null;
  const pending = data?.pending ?? [];
  const tokens  = data?.tokens ?? [];
  const ql = q.trim().toLowerCase();
  const filtered_pending = ql
    ? pending.filter(p => p.name.toLowerCase().includes(ql) || p.login.toLowerCase().includes(ql))
    : pending;
  const filtered_tokens = ql
    ? tokens.filter(t => t.name.toLowerCase().includes(ql) || t.login.toLowerCase().includes(ql) || (t.id ?? '').toLowerCase().includes(ql))
    : tokens;

  return (
    <main className="ws-page">
      <ui_wallpaper.Wallpaper seed={8} vignette={false} />
      <div className="sw">
        <div className="page-head">
          <div className="slabel">Account</div>
          <h2>Work<span>space</span></h2>
          <p className="ws-lead">
            Apply for a masterlist server token, track status, or manage community applications if you are staff.
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
                <img className="ws-avatar" src={session.avatarUrl} alt="" width={40} height={40} referrerPolicy="no-referrer" />
                <div>
                  <div className="ws-login">@{session.login}</div>
                  <div className="ws-role">{session.isStaff ? 'Staff' : 'Member'}</div>
                </div>
              </div>
              {error && <p className="ws-error" role="alert">{error}</p>}
            </div>

            {/* Member: application panel */}
            <div className="ws-panel">
              <div className="ws-panel-head">
                <h3 className="ws-panel-title">Your application</h3>
              </div>
              <div className="ws-panel-body">
                {!app && (
                  <div className="ws-form-row">
                    <div className="ws-form-grow">
                      <label className="ws-label" htmlFor="app-name">Server name</label>
                      <input
                        id="app-name"
                        className="ws-input"
                        type="text"
                        maxLength={64}
                        placeholder="e.g. Night City RP"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={busy}
                        autoComplete="off"
                      />
                    </div>
                    <button type="button" className="btn-secondary ws-btn" onClick={apply} disabled={busy}>
                      {busy ? 'Submitting…' : 'Apply'}
                    </button>
                  </div>
                )}
                {app?.status === 'pending' && (
                  <div className="ws-status-row">
                    <span className="ws-badge ws-badge--pending">Pending</span>
                    <span className="ws-text"><strong>{app.name}</strong> — waiting for staff review.</span>
                    <button type="button" className="btn-secondary ws-btn-sm" onClick={cancel} disabled={busy}>Cancel</button>
                  </div>
                )}
                {app?.status === 'rejected' && (
                  <div className="ws-form-row">
                    <p className="ws-text">Last application for <strong>{app.name}</strong> was rejected. Apply again:</p>
                    <div className="ws-form-grow">
                      <input
                        className="ws-input"
                        type="text"
                        maxLength={64}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={busy}
                        placeholder="Server name"
                      />
                    </div>
                    <button type="button" className="btn-secondary ws-btn" onClick={apply} disabled={busy}>Apply again</button>
                  </div>
                )}
                {app?.status === 'approved' && app.token && (
                  <div className="ws-result">
                    <p className="ws-text">Approved — store this token in config.yaml. It will not be shown again after you dismiss it.</p>
                    {app.id && (
                      <div className="ws-kv">
                        <span className="ws-k">ID</span>
                        <code className="ws-v">{app.id}</code>
                        <button type="button" className="ws-copy" onClick={() => copy('id', app.id!)}>{copied === 'id' ? 'Copied' : 'Copy'}</button>
                      </div>
                    )}
                    <div className="ws-kv">
                      <span className="ws-k">Token</span>
                      <code className="ws-v ws-v--secret">{app.token}</code>
                      <button type="button" className="ws-copy" onClick={() => copy('token', app.token!)}>{copied === 'token' ? 'Copied' : 'Copy'}</button>
                    </div>
                    <button type="button" className="btn-secondary ws-btn" onClick={claim} disabled={busy}>I saved it — dismiss</button>
                  </div>
                )}
                {app?.status === 'approved' && !app.token && (
                  <div className="ws-status-row">
                    <span className="ws-badge ws-badge--active">Approved</span>
                    <span className="ws-text">
                      {app.name}{app.id ? ` · ${app.id.slice(0, 8)}…` : ''}. Token already revealed.
                      {!session.isStaff && ' Contact staff if you need a re-issue.'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Staff dashboard */}
            {session.isStaff && (
              <>
                <div className="ws-stats">
                  <div className="ws-stat">
                    <div className="ws-stat-label">Pending</div>
                    <div className="ws-stat-value">{pending.length}</div>
                  </div>
                  <div className="ws-stat">
                    <div className="ws-stat-label">Issued tokens</div>
                    <div className="ws-stat-value">{tokens.length}</div>
                  </div>
                  <div className="ws-stat">
                    <div className="ws-stat-label">Your role</div>
                    <div className="ws-stat-value ws-stat-value--sm">Staff</div>
                  </div>
                </div>

                <div className="ws-panel">
                  <div className="ws-panel-head ws-panel-head--tabs">
                    <div className="ws-tabs">
                      <button type="button" className={`ws-tab${tab === 'pending' ? ' ws-tab--active' : ''}`} onClick={() => setTab('pending')}>
                        Pending{pending.length ? ` (${pending.length})` : ''}
                      </button>
                      <button type="button" className={`ws-tab${tab === 'tokens' ? ' ws-tab--active' : ''}`} onClick={() => setTab('tokens')}>
                        Tokens{tokens.length ? ` (${tokens.length})` : ''}
                      </button>
                      <button type="button" className={`ws-tab${tab === 'mint' ? ' ws-tab--active' : ''}`} onClick={() => setTab('mint')}>
                        Mint
                      </button>
                    </div>
                    {(tab === 'pending' || tab === 'tokens') && (
                      <input
                        className="ws-search"
                        type="search"
                        placeholder="Search name or author…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                      />
                    )}
                  </div>

                  {tab === 'pending' && (
                    <div className="ws-table-wrap">
                      {filtered_pending.length === 0 ? (
                        <p className="ws-empty">No pending requests.</p>
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
                              <tr key={p.login}>
                                <td>
                                  <div className="ws-cell-title">{p.name}</div>
                                </td>
                                <td className="ws-muted">@{p.login}</td>
                                <td className="ws-muted">{fmt_date(p.createdAt)}</td>
                                <td><span className="ws-badge ws-badge--pending">Pending</span></td>
                                <td className="ws-actions-cell">
                                  <div className="ws-menu-wrap">
                                    <button
                                      type="button"
                                      className="ws-menu-btn"
                                      disabled={busy}
                                      onClick={(e) => { e.stopPropagation(); setMenu(menu === p.login ? null : p.login); }}
                                    >
                                      Actions ▾
                                    </button>
                                    {menu === p.login && (
                                      <div className="ws-menu" onClick={(e) => e.stopPropagation()}>
                                        <button type="button" onClick={() => decide(p.login, 'approve')}>Approve</button>
                                        <button type="button" className="ws-menu-danger" onClick={() => decide(p.login, 'reject')}>Reject</button>
                                      </div>
                                    )}
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
                        <p className="ws-empty">No issued tokens.</p>
                      ) : (
                        <table className="ws-table">
                          <thead>
                            <tr>
                              <th>Server</th>
                              <th>Author</th>
                              <th>Token ID</th>
                              <th>Approved by</th>
                              <th>Date</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {filtered_tokens.map((t) => (
                              <tr key={t.login}>
                                <td><div className="ws-cell-title">{t.name}</div></td>
                                <td className="ws-muted">@{t.login}</td>
                                <td className="ws-mono">{t.id ? `${t.id.slice(0, 12)}…` : '—'}</td>
                                <td className="ws-muted">{t.decidedBy ? `@${t.decidedBy}` : '—'}</td>
                                <td className="ws-muted">{fmt_date(t.decidedAt ?? t.createdAt)}</td>
                                <td className="ws-actions-cell">
                                  <div className="ws-menu-wrap">
                                    <button
                                      type="button"
                                      className="ws-menu-btn"
                                      disabled={busy}
                                      onClick={(e) => { e.stopPropagation(); setMenu(menu === `t:${t.login}` ? null : `t:${t.login}`); }}
                                    >
                                      Actions ▾
                                    </button>
                                    {menu === `t:${t.login}` && (
                                      <div className="ws-menu" onClick={(e) => e.stopPropagation()}>
                                        {t.id && (
                                          <button type="button" onClick={() => copy(`tid-${t.login}`, t.id!)}>
                                            {copied === `tid-${t.login}` ? 'Copied ID' : 'Copy ID'}
                                          </button>
                                        )}
                                        <button type="button" className="ws-menu-danger" onClick={() => decide(t.login, 'revoke')}>Revoke</button>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}

                  {tab === 'mint' && (
                    <div className="ws-panel-body">
                      <p className="ws-text">Staff giveaway — creates a token immediately (not tied to an application).</p>
                      <div className="ws-form-row">
                        <div className="ws-form-grow">
                          <label className="ws-label" htmlFor="mint-name">Server name (optional)</label>
                          <input
                            id="mint-name"
                            className="ws-input"
                            type="text"
                            maxLength={64}
                            value={mintName}
                            onChange={(e) => setMintName(e.target.value)}
                            disabled={busy}
                          />
                        </div>
                        <button type="button" className="btn-secondary ws-btn" onClick={mint} disabled={busy}>
                          Mint token
                        </button>
                      </div>
                      {mintResult && (
                        <div className="ws-result">
                          <p className="ws-text">{mintResult.note}</p>
                          <div className="ws-kv">
                            <span className="ws-k">ID</span>
                            <code className="ws-v">{mintResult.id}</code>
                            <button type="button" className="ws-copy" onClick={() => copy('mid', mintResult.id)}>{copied === 'mid' ? 'Copied' : 'Copy'}</button>
                          </div>
                          <div className="ws-kv">
                            <span className="ws-k">Token</span>
                            <code className="ws-v ws-v--secret">{mintResult.token}</code>
                            <button type="button" className="ws-copy" onClick={() => copy('mt', mintResult.token)}>{copied === 'mt' ? 'Copied' : 'Copy'}</button>
                          </div>
                        </div>
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
