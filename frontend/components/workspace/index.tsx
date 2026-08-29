'use client';
import * as react            from 'react';
import * as lib_api_url      from '@/lib/api_url';
import * as lib_auth_session from '@/lib/auth_session';
import * as ui_wallpaper     from '@/ui/wallpaper';
import * as ui_search        from '@/ui/search';
import * as lucide           from 'lucide-react';
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
  const [mintResult, setMintResult] = react.useState<{ token: string; id: string; name: string; note: string } | null>(null);
  const [copied, setCopied] = react.useState<string | null>(null);
  const [tab, setTab] = react.useState<'pending' | 'tokens' | 'mint'>('pending');
  const [q, setQ] = react.useState('');
  const [revealToken, setRevealToken] = react.useState(false);

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
    setBusy(true); setError(null);
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
    const trimmed = mintName.trim();
    if (!trimmed) { setError('Server name is required'); return; }
    setBusy(true); setError(null); setMintResult(null);
    try {
      const res  = await fetch(lib_api_url.get_api_url('/masterlist/register'), {
        method: 'POST', headers: auth_headers(),
        body: JSON.stringify({ name: trimmed })
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
                <img className="ws-avatar" src={session.avatar} alt="" width={40} height={40} referrerPolicy="no-referrer" />
                <div>
                  <div className="ws-login">@{session.login}</div>
                  <div className="ws-role">{session.staff ? 'Staff' : 'Member'}</div>
                </div>
              </div>
              {error && <p className="ws-error" role="alert">{error}</p>}
            </div>

            {/* Member: application panel */}
            <div className="ws-panel">
              <div className="ws-panel-head">
                <h3 className="ws-panel-title">
                  <lucide.Server size={16} strokeWidth={2} />
                  Your application
                </h3>
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
                    <span className="ws-badge ws-badge--pending"><lucide.Clock size={11} strokeWidth={2.5} />Pending</span>
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
                {app?.status === 'approved' && (
                  <div className="ws-result">
                    <div className="ws-status-row">
                      <span className="ws-badge ws-badge--active"><lucide.Check size={11} strokeWidth={2.5} />Approved</span>
                      <span className="ws-text"><strong>{app.name}</strong>{app.id ? ` · ${app.id.slice(0, 8)}…` : ''}</span>
                    </div>
                    {app.id && (
                      <div className="ws-kv">
                        <span className="ws-k">ID</span>
                        <code className="ws-v">{app.id}</code>
                        <button type="button" className="ws-copy" onClick={() => copy('id', app.id!)}>{copied === 'id' ? 'Copied' : 'Copy'}</button>
                      </div>
                    )}
                    {app.token ? (
                      <div className="ws-kv">
                        <span className="ws-k">Token</span>
                        <button
                          type="button"
                          className={`ws-spoiler${revealToken ? ' ws-spoiler--open' : ''}`}
                          onClick={() => setRevealToken(v => !v)}
                          title={revealToken ? 'Click to hide' : 'Click to reveal'}
                        >
                          <code className="ws-v ws-v--secret">
                            {revealToken ? app.token : '•'.repeat(Math.min(48, app.token.length))}
                          </code>
                          <span className="ws-spoiler-hint">{revealToken ? 'Hide' : 'Reveal'}</span>
                        </button>
                        {revealToken && (
                          <button type="button" className="ws-copy" onClick={() => copy('token', app.token!)}>{copied === 'token' ? 'Copied' : 'Copy'}</button>
                        )}
                      </div>
                    ) : (
                      <p className="ws-text">Token is no longer stored on the server. Contact staff if you need a re-issue.</p>
                    )}
                    {app.token && !app.tokenClaimed && (
                      <button type="button" className="btn-secondary ws-btn" onClick={async () => { await claim(); setRevealToken(false); }} disabled={busy}>
                        Mark as saved
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Staff dashboard */}
            {session.staff && (
              <>
                <div className="ws-stats">
                  <div className="ws-stat">
                    <div className="ws-stat-top">
                      <div className="ws-stat-label">Pending</div>
                      <lucide.Clock size={16} strokeWidth={2} className="ws-stat-icon" />
                    </div>
                    <div className="ws-stat-value">{pending.length}</div>
                  </div>
                  <div className="ws-stat">
                    <div className="ws-stat-top">
                      <div className="ws-stat-label">Issued tokens</div>
                      <lucide.KeyRound size={16} strokeWidth={2} className="ws-stat-icon" />
                    </div>
                    <div className="ws-stat-value">{tokens.length}</div>
                  </div>
                </div>

                <div className="ws-panel">
                  <div className="ws-panel-head ws-panel-head--tabs">
                    <div className="ws-tabs">
                      <button type="button" className={`ws-tab${tab === 'pending' ? ' ws-tab--active' : ''}`} onClick={() => setTab('pending')}>
                        <lucide.Inbox size={14} strokeWidth={2} />
                        Pending{pending.length ? ` (${pending.length})` : ''}
                      </button>
                      <button type="button" className={`ws-tab${tab === 'tokens' ? ' ws-tab--active' : ''}`} onClick={() => setTab('tokens')}>
                        <lucide.KeyRound size={14} strokeWidth={2} />
                        Tokens{tokens.length ? ` (${tokens.length})` : ''}
                      </button>
                      <button type="button" className={`ws-tab${tab === 'mint' ? ' ws-tab--active' : ''}`} onClick={() => setTab('mint')}>
                        <lucide.Sparkles size={14} strokeWidth={2} />
                        Mint
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
                        <div className="ws-empty">
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
                              <tr key={p.login}>
                                <td>
                                  <div className="ws-cell-title">{p.name}</div>
                                </td>
                                <td className="ws-muted">@{p.login}</td>
                                <td className="ws-muted">{fmt_date(p.createdAt)}</td>
                                <td><span className="ws-badge ws-badge--pending"><lucide.Clock size={11} strokeWidth={2.5} />Pending</span></td>
                                <td className="ws-actions-cell">
                                  <div className="ws-inline-actions">
                                    <button type="button" className="ws-action-btn" disabled={busy} onClick={() => decide(p.login, 'approve')}>Approve</button>
                                    <button type="button" className="ws-action-btn ws-action-btn--danger" disabled={busy} onClick={() => decide(p.login, 'reject')}>Reject</button>
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
                        <div className="ws-empty">
                          <lucide.KeyRound size={28} strokeWidth={1.5} />
                          <span>No issued tokens.</span>
                        </div>
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
                                  <div className="ws-inline-actions">
                                    {t.id && (
                                      <button type="button" className="ws-action-btn" disabled={busy} onClick={() => copy(`tid-${t.login}`, t.id!)}>
                                        {copied === `tid-${t.login}` ? 'Copied' : 'Copy ID'}
                                      </button>
                                    )}
                                    <button type="button" className="ws-action-btn ws-action-btn--danger" disabled={busy} onClick={() => decide(t.login, 'revoke')}>Revoke</button>
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
                      <p className="ws-text ws-text--icon">
                        <lucide.Sparkles size={15} strokeWidth={2} />
                        Staff giveaway — creates a token immediately (not tied to an application).
                      </p>
                      <div className="ws-mint-form">
                        <label className="ws-label" htmlFor="mint-name">Server name</label>
                        <input
                          id="mint-name"
                          className="ws-input"
                          type="text"
                          maxLength={64}
                          value={mintName}
                          onChange={(e) => setMintName(e.target.value)}
                          disabled={busy}
                          placeholder="e.g. Night City RP"
                        />
                        <button type="button" className="btn-secondary ws-btn" onClick={mint} disabled={busy || !mintName.trim()}>
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
