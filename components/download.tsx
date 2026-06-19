'use client';
import { useEffect, useState } from 'react';
import * as config_site from '@/configs/site';

interface ReleaseInfo {
  tag: string;
  client_url: string | null;
  server_url: string | null;
  client_size: string | null;
  server_size: string | null;
}

const format_size = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function Download() {
  const [info, setInfo] = useState<ReleaseInfo | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${config_site.info.git.sandbox.user}/${config_site.info.git.sandbox.repo}/releases?per_page=1`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => r.json())
      .then((releases) => {
        const release = Array.isArray(releases) ? releases[0] : null;
        if (!release) { setInfo({ tag: '', client_url: null, server_url: null, client_size: null, server_size: null }); return; }

        const assets: { name: string; browser_download_url: string; size: number }[] = release.assets ?? [];
        const client = assets.find((a) => a.name.toLowerCase().includes('client') && a.name.endsWith('.zip'));
        const server = assets.find((a) => a.name.toLowerCase().includes('server') && a.name.endsWith('.zip'));
        setInfo({
          tag: release.tag_name ?? '',
          client_url: client?.browser_download_url ?? null,
          server_url: server?.browser_download_url ?? null,
          client_size: client ? format_size(client.size) : null,
          server_size: server ? format_size(server.size) : null,
        });
      })
      .catch(() => setInfo({ tag: '', client_url: null, server_url: null, client_size: null, server_size: null }));
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
      {info.tag && <span className="hero-release-tag">{info.tag}</span>}

      <a href={info.client_url ?? `https://github.com/${config_site.info.git.sandbox.user}/${config_site.info.git.sandbox.repo}/releases`} className="btn-primary" target="_blank" rel="noreferrer">
        <DownloadIcon/>
        Download Client{info.client_size ? ` · ${info.client_size}` : ''}
      </a>

      {info.server_url && (
        <a href={info.server_url} className="btn-secondary" target="_blank" rel="noreferrer">
          <DownloadIcon/>
          Download Server{info.server_size ? ` · ${info.server_size}` : ''}
        </a>
      )}
      
      <p className="hero-tos-note">
        By downloading, you agree to our <a href="/tos" className="hero-tos-link">Terms of Service</a> and its conditions
      </p>
    </div>
  );
}