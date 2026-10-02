/** Triggers a browser download for a Blob or a URL/data-URL. */
export function trigger_download(source: Blob | string, filename: string): void {
  const is_blob = typeof source !== 'string';
  const href = is_blob ? URL.createObjectURL(source) : source;
  const a = Object.assign(document.createElement('a'), { href, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  if (is_blob) URL.revokeObjectURL(href);
}
