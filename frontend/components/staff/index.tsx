'use client';

import { useCallback, useEffect, useState } from 'react';
import * as lib_api_url from '@/lib/api_url';
import * as lib_staff_session from '@/lib/staff_session';
import './index.css';

type MintResult = {
  token: string;
  id: string;
  name: string | null;
  note: string;
};

export function StaffMint() {
  const [session, setSession] = useState<lib_staff_session.StaffSession | null>(null);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MintResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setSession(lib_staff_session.read_staff_session());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (err) {
      setError(err);
      window.history.replaceState(null, '', window.location.pathname);
    }

    lib_staff_session.capture_oauth_hash();
    refresh();
    window.addEventListener(lib_staff_session.STAFF_SESSION_EVENT, refresh);
    return () => window.removeEventListener(lib_staff_session.STAFF_SESSION_EVENT, refresh);
  }, [refresh]);

  const login = useCallback(() => {
    window.location.href = lib_api_url.get_api_url('/auth/github');
  }, []);

  const mint = useCallback(async () => {
    if (!session?.token) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(lib_api_url.get_api_url('/masterlist/register'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name.trim() || undefined })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          lib_staff_session.clear_staff_session();
          setSession(null);
          setError('Session expired or unauthorized — sign in again.');
        }
        else setError(typeof data.error === 'string' ? data.error : `Request failed (${res.status})`);
        return;
      }
      setResult(data as MintResult);
      setName('');
    }
    catch { setError('Network error — is the API up?'); } 
    finally { setBusy(false); }
  }, [session, name]);

  const copy = useCallback(async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1600);
    }
    catch { setError('Clipboard write failed'); }
  }, []);

  return (
    <main className="staff-page sec-pad-sm">
      <div className="sw">
        <div className="page-head">
          <div className="slabel">Staff</div>
          <h2>
            Mint <span>server token</span>
          </h2>
          <p className="staff-lead">
            Register a masterlist token for a community server. The token is shown once — store it in
            that server&apos;s <code>config.yaml</code> immediately.
          </p>
        </div>

        {!session ? (
          <div className="staff-card">
            <p className="staff-card-text">
              Use the fingerprint icon in the navbar to sign in with GitHub. Only allowlisted
              accounts can mint server tokens.
            </p>
            {error && (
              <p className="staff-error" role="alert">
                {error}
              </p>
            )}
            <button type="button" className="btn-primary staff-btn" onClick={login}>
              Sign in with GitHub
            </button>
          </div>
        ) : (
          <div className="staff-card">
            <div className="staff-row staff-row--between">
              <div className="staff-user">
                <img
                  className="staff-user-avatar"
                  src={session.avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="staff-user-login">@{session.login}</div>
                  <div className="staff-user-role">Authenticated staff</div>
                </div>
              </div>
            </div>

            <label className="staff-label" htmlFor="server-name">
              Server name <span className="staff-optional">(optional)</span>
            </label>
            <input
              id="server-name"
              className="staff-input"
              type="text"
              maxLength={64}
              placeholder="e.g. Test Server"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={busy}
              autoComplete="off"
            />

            {error && (
              <p className="staff-error" role="alert">
                {error}
              </p>
            )}

            <button type="button" className="btn-primary staff-btn" onClick={mint} disabled={busy}>
              {busy ? 'Minting…' : 'Mint token'}
            </button>

            {result && (
              <div className="staff-result" role="status">
                <p className="staff-result-note">{result.note}</p>
                {result.name && (
                  <div className="staff-kv">
                    <span className="staff-k">Name</span>
                    <code className="staff-v">{result.name}</code>
                  </div>
                )}
                <div className="staff-kv">
                  <span className="staff-k">ID</span>
                  <code className="staff-v">{result.id}</code>
                  <button type="button" className="staff-copy" onClick={() => copy('id', result.id)}>
                    {copied === 'id' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="staff-kv">
                  <span className="staff-k">Token</span>
                  <code className="staff-v staff-v--secret">{result.token}</code>
                  <button type="button" className="staff-copy" onClick={() => copy('token', result.token)}>
                    {copied === 'token' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <button
                  type="button"
                  className="btn-secondary staff-btn-ghost"
                  onClick={() =>
                    copy(
                      'both',
                      `id: ${result.id}\ntoken: ${result.token}${result.name ? `\nname: ${result.name}` : ''}`
                    )
                  }
                >
                  {copied === 'both' ? 'Copied both' : 'Copy id + token'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
