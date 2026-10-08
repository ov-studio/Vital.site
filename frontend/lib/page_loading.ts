export const PAGE_LOADING_EVENT = 'vital:page-loading';

const MIN_VISIBLE_MS = 1500;

let _loading = false;
let _shown_at = 0;
let _hide_timer: ReturnType<typeof setTimeout> | null = null;

function emit() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(PAGE_LOADING_EVENT, { detail: { loading: _loading } })
  );
}

/**
 * Show or hide the global page loader.
 * Enforces a minimum visible duration so the spinner does not flicker.
 */
export function set_page_loading(loading: boolean) {
  if (typeof window === 'undefined') {
    _loading = !!loading;
    return;
  }

  if (loading) {
    if (_hide_timer) {
      clearTimeout(_hide_timer);
      _hide_timer = null;
    }
    if (!_loading) {
      _loading = true;
      _shown_at = Date.now();
      emit();
    }
    return;
  }

  const elapsed = Date.now() - _shown_at;
  const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
  if (_hide_timer) clearTimeout(_hide_timer);
  if (!_loading) return;
  if (wait === 0) {
    _loading = false;
    _hide_timer = null;
    emit();
    return;
  }

  _hide_timer = setTimeout(() => {
    _hide_timer = null;
    _loading = false;
    emit();
  }, wait);
}

/** Current page-loading flag (sync read). */
export function get_page_loading(): boolean {
  return _loading;
}

/** Extract the loading boolean from a PAGE_LOADING_EVENT. */
export function read_page_loading_detail(e: Event): boolean {
  const d = (e as CustomEvent<{ loading?: boolean }>).detail;
  return !!d?.loading;
}
