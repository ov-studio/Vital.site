'use client';
import * as react            from 'react';
import * as lib_auth_session from '@/lib/auth_session';
import * as lib_page_loading from '@/lib/page_loading';

/** Keeps the global page-loading overlay in sync with a flag (always cleared on unmount). */
export function use_page_loading(loading: boolean) {
  react.useEffect(() => {
    lib_page_loading.set_page_loading(loading);
  }, [loading]);
  react.useEffect(() => () => lib_page_loading.set_page_loading(false), []);
}

/** Current auth session; captures the OAuth hash and follows session events (same-tab + cross-tab). */
export function use_auth_session(): lib_auth_session.AuthSession | null {
  const [session, set_session] = react.useState<lib_auth_session.AuthSession | null>(null);
  react.useEffect(() => {
    lib_auth_session.capture_oauth_hash();
    const sync = () => set_session(lib_auth_session.read_auth_session());
    sync();
    const on_storage = (e: StorageEvent) => {
      if (
        e.key === lib_auth_session.AUTH_TOKEN_KEY ||
        e.key === lib_auth_session.AUTH_LOGIN_KEY ||
        e.key === lib_auth_session.AUTH_STAFF_KEY ||
        e.key === null
      ) sync();
    };
    window.addEventListener(lib_auth_session.AUTH_SESSION_EVENT, sync);
    window.addEventListener('storage', on_storage);
    window.addEventListener('focus', sync);
    return () => {
      window.removeEventListener(lib_auth_session.AUTH_SESSION_EVENT, sync);
      window.removeEventListener('storage', on_storage);
      window.removeEventListener('focus', sync);
    };
  }, []);
  return session;
}

/** Clipboard helper: `copy(text, key)` and `copied` (the key copied most recently). */
export function use_clipboard(reset_ms = 1600) {
  const [copied, set_copied] = react.useState<string | null>(null);
  const copy = react.useCallback(async (value: string, key: string = value): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(value);
      set_copied(key);
      window.setTimeout(() => set_copied(null), reset_ms);
      return true;
    }
    catch { return false; }
  }, [reset_ms]);
  return { copied, copy };
}
