'use client';
import * as react            from 'react';
import * as lib_api_url      from '@/lib/api_url';
import * as lib_auth_session from '@/lib/auth_session';
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
};

export function Workspace() {
  const [session, setSession] = react.useState<lib_auth_session.AuthSession | null>(null);
  const [data, setData] = react.useState<ApiState | null>(null);
  const [name, setName] = react.useState('');
  const [busy, setBusy] = react.useState(false);
  const [error, setError] = react.useState<string | null>(null);
  const [mintName, setMintName] = react.useState('');
  const [mintResult, setMintResult] = react.useState<{ token: string; id: string; name: string | null; note: string } | null>(null);
  const [copied, setCopied]   = react.useState<string | null>(null);

  const refresh_session = react.useCallback(() => {
    setSession(lib_auth_session.read_auth_session());
  }, []);

  const auth_headers = react.useCallback((): HeadersInit => {
    const s = lib_auth_session.read_auth_session();
    if (!s) return {};
    return {
      'Authorization':  `Bearer ${s.token}`,
      'Content-Type': 'application/json'
    };
  }, []);

  const load = react.useCallback(async () => {
    const s = lib_auth_session.read_auth_session();
    if (!s) {
      setData(null);
      return;
    }
    try {
      const res  = await fetch(lib_api_url.get_api_url('/masterlist/applications'), {
        headers: auth_headers()
      });
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
    }
    catch {
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
    window.addEventListener(lib_auth_session.AUTH_SESSION_EVENT, () => {
      refresh_session();
      load();
    });
  }, [refresh_session, load]);

  const login = react.useCallback(() => {
    window.location.href = lib_api_url.get_api_url('/auth/github');
  }, []);

  const apply = react.useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res  = await fetch(lib_api_url.get_api_url('/masterlist/applications'), {
        method:  'POST',
        headers: auth_headers(),
        body:    JSON.stringify({ name: name.trim() || undefined })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'Apply failed');
        return;
      }
      setName('');
      await load();
    }
    catch { setError('Network error'); }
    finally { setBusy(false); }
  }, [name, auth_headers, load]);

  const cancel = react.useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res  = await fetch(lib_api_url.get_api_url('/masterlist/applications'), {
        method:  'DELETE',
        headers: auth_headers()
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'Cancel failed');
        return;
      }
      await load();
    }
    catch { setError('Network error'); }
    finally { setBusy(false); }
  }, [auth_headers, load]);

  const claim = react.useCallback(async () => {
    setBusy(true);
    try {
      await fetch(lib_api_url.get_api_url('/masterlist/applications/claim'), {
        method:  'POST',
        headers: auth_headers()
      });
      await load();
    }
    finally { setBusy(false); }
  }, [auth_headers, load]);

  const decide = react.useCallback(async (login: string, action: 'approve' | 'reject' | 'revoke') => {
    setBusy(true);
    setError(null);
    try {
      const res  = await fetch(lib_api_url.get_api_url('/masterlist/applications/decide'), {
        method:  'POST',
        headers: auth_headers(),
        body:    JSON.stringify({ login, action })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'Action failed');
        return;
      }
      await load();
    }
    catch { setError('Network error'); }
    finally { setBusy(false); }
  }, [auth_headers, load]);

  const mint = react.useCallback(async () => {
    setBusy(true);
    setError(null);
    setMintResult(null);
    try {
      const res  = await fetch(lib_api_url.get_api_url('/masterlist/register'), {
        method:  'POST',
        headers: auth_headers(),
        body:    JSON.stringify({ name: mintName.trim() || undefined })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'Mint failed');
        return;
      }
      setMintResult(json);
      setMintName('');
    }
    catch { setError('Network error'); }
    finally { setBusy(false); }
  }, [mintName, auth_headers]);

  const copy = react.useCallback(async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1600);
    }
    catch { setError('Clipboard write failed'); }
  }, []);

  const app = data?.application ?? null;

  return (
    <main className="ws-page sec-pad-sm">
      <div className="sw">
        <div className="page-head">
          <div className="slabel">Account</div>
          <h2>Work<span>space</span></h2>
          <p className="ws-lead">
            Apply for a masterlist server token, track status, or manage community applications if you are staff.
          </p>
        </div>

        {!session ? (
          <div className="ws-card">
            <p className="ws-text">Sign in with GitHub to open your workspace.</p>
            {error && <p className="ws-error" role="alert">{error}</p>}
            <button type="button" className="btn-primary ws-btn" onClick={login}>
              Sign in with GitHub
            </button>
          </div>
        ) : (
          <>
            <div className="ws-card">
              <div className="ws-user">
                <img className="ws-avatar" src={session.avatarUrl} alt="" width={40} height={40} referrerPolicy="no-referrer"/>
                <div>
                  <div className="ws-login">@{session.login}</div>
                  <div className="ws-role">{session.isStaff ? 'Staff' : 'Member'}</div>
                </div>
              </div>
              {error && <p className="ws-error" role="alert">{error}</p>}
            </div>

            <div className="ws-card">
              <div className="slabel">Your application</div>
              {!app && (
                <>
                  <p className="ws-text">Request a masterlist token. One pending request per account.</p>
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
                  <button type="button" className="btn-primary ws-btn" onClick={apply} disabled={busy}>
                    {busy ? 'Submitting…' : 'Apply'}
                  </button>
                </>
              )}
              {app?.status === 'pending' && (
                <>
                  <p className="ws-text">
                    Pending for <strong>{app.name}</strong> — wait for staff or cancel to submit a new one.
                  </p>
                  <button type="button" className="btn-secondary ws-btn-ghost" onClick={cancel} disabled={busy}>
                    Cancel application
                  </button>
                </>
              )}
              {app?.status === 'rejected' && (
                <>
                  <p className="ws-text">Your last application for <strong>{app.name}</strong> was rejected. You can apply again.</p>
                  <label className="ws-label" htmlFor="app-name-retry">Server name</label>
                  <input
                    id="app-name-retry"
                    className="ws-input"
                    type="text"
                    maxLength={64}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={busy}
                  />
                  <button type="button" className="btn-primary ws-btn" onClick={apply} disabled={busy}>
                    Apply again
                  </button>
                </>
              )}
              {app?.status === 'approved' && app.token && (
                <div className="ws-result">
                  <p className="ws-text">Approved — store this token in config.yaml. It will not be shown again after you dismiss it.</p>
                  {app.id && (
                    <div className="ws-kv">
                      <span className="ws-k">ID</span>
                      <code className="ws-v">{app.id}</code>
                      <button type="button" className="ws-copy" onClick={() => copy('id', app.id!)}>
                        {copied === 'id' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}
                  <div className="ws-kv">
                    <span className="ws-k">Token</span>
                    <code className="ws-v ws-v--secret">{app.token}</code>
                    <button type="button" className="ws-copy" onClick={() => copy('token', app.token!)}>
                      {copied === 'token' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <button type="button" className="btn-primary ws-btn" onClick={claim} disabled={busy}>
                    I saved it — dismiss
                  </button>
                </div>
              )}
              {app?.status === 'approved' && !app.token && (
                <p className="ws-text">
                  Approved{app.id ? ` (id ${app.id.slice(0, 8)}…)` : ''}. Token was already revealed.
                  {session.isStaff ? '' : ' Contact staff only if you lost it and need a re-issue.'}
                </p>
              )}
            </div>

            {session.isStaff && (
              <>
                <div className="ws-card">
                  <div className="slabel">Pending applications</div>
                  {(!data?.pending || data.pending.length === 0) && (
                    <p className="ws-text">No pending requests.</p>
                  )}
                  {data?.pending?.map((p) => (
                    <div key={p.login} className="ws-pending-row">
                      <div>
                        <div className="ws-pending-name">{p.name}</div>
                        <div className="ws-pending-meta">@{p.login}</div>
                      </div>
                      <div className="ws-pending-actions">
                        <button type="button" className="btn-primary ws-btn-sm" disabled={busy} onClick={() => decide(p.login, 'approve')}>
                          Approve
                        </button>
                        <button type="button" className="btn-secondary ws-btn-ghost" disabled={busy} onClick={() => decide(p.login, 'reject')}>
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ws-card">
                  <div className="slabel">Direct mint</div>
                  <p className="ws-text">Staff giveaway — creates a token immediately (not tied to an application).</p>
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
                  <button type="button" className="btn-primary ws-btn" onClick={mint} disabled={busy}>
                    Mint token
                  </button>
                  {mintResult && (
                    <div className="ws-result">
                      <p className="ws-text">{mintResult.note}</p>
                      <div className="ws-kv">
                        <span className="ws-k">ID</span>
                        <code className="ws-v">{mintResult.id}</code>
                        <button type="button" className="ws-copy" onClick={() => copy('mid', mintResult.id)}>
                          {copied === 'mid' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="ws-kv">
                        <span className="ws-k">Token</span>
                        <code className="ws-v ws-v--secret">{mintResult.token}</code>
                        <button type="button" className="ws-copy" onClick={() => copy('mt', mintResult.token)}>
                          {copied === 'mt' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
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
