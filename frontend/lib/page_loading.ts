export const PAGE_LOADING_EVENT = 'vital:page-loading';

let _loading = false;

export function set_page_loading(loading: boolean) {
  _loading = !!loading;
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(PAGE_LOADING_EVENT, { detail: { loading: _loading } })
  );
}

export function get_page_loading(): boolean {
  return _loading;
}

export function read_page_loading_detail(e: Event): boolean {
  const d = (e as CustomEvent<{ loading?: boolean }>).detail;
  return !!d?.loading;
}
