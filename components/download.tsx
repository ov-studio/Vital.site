'use client';
import { useEffect, useState } from 'react';
import { site } from '@/site.config';

interface ReleaseInfo {
  tag: string;
  clientUrl: string | null;
  serverUrl: string | null;
  clientSize: string | null;
  serverSize: string | null;
}

const fmtSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function Download() {
  const [info, setInfo] = useState<ReleaseInfo | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${site.git.sandbox.user}/${site.git.sandbox.repo}/releases?per_page=1`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => r.json())
      .then((releases) => {
        const release = Array.isArray(releases) ? releases[0] : null;
        if (!release) { setInfo({ tag: '', clientUrl: null, serverUrl: null, clientSize: null, serverSize: null }); return; }

        const assets: { name: string; browser_download_url: string; size: number }[] = release.assets ?? [];
        const client = assets.find((a) => a.name.toLowerCase().includes('client') && a.name.endsWith('.zip'));
        const server = assets.find((a) => a.name.toLowerCase().includes('server') && a.name.endsWith('.zip'));

        setInfo({
          tag: release.tag_name ?? '',
          clientUrl: client?.browser_download_url ?? null,
          serverUrl: server?.browser_download_url ?? null,
          clientSize: client ? fmtSize(client.size) : null,
          serverSize: server ? fmtSize(server.size) : null,
        });
      })
      .catch(() => setInfo({ tag: '', clientUrl: null, serverUrl: null, clientSize: null, serverSize: null }));
  }, []);

  if (!info) {
    return (
      <div className="hbtns">
        <button className="btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
          <DownloadIcon/> Fetching release…
        </button>
      </div>
    );
  }

  return (
    <div className="hbtns">
      <a href={info.clientUrl ?? `https://github.com/${site.git.sandbox.user}/${site.git.sandbox.repo}/releases`} className="btn-primary" target="_blank" rel="noreferrer">
        <DownloadIcon/>
        Download Client{info.clientSize ? ` · ${info.clientSize}` : ''}
      </a>

      {info.serverUrl && (
        <a href={info.serverUrl} className="btn-secondary" target="_blank" rel="noreferrer">
          <DownloadIcon/>
          Download Server{info.serverSize ? ` · ${info.serverSize}` : ''}
        </a>
      )}

      {info.tag && <span className="hero-release-tag">{info.tag}</span>}
    </div>
  );
}