'use client';
import * as lib_api_url from '@/lib/api_url';
import * as react       from 'react';
import * as lucide      from 'lucide-react';
import './index.css';

interface ReleaseInfo {
  tag:         string;
  client_url:  string | null;
  server_url:  string | null;
  client_size: string | null;
  server_size: string | null;
}

export function Download() {
  const [info, setInfo] = react.useState<ReleaseInfo | null>(null);

  react.useEffect(() => {
    fetch(lib_api_url.api_url('/api/build'))
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => setInfo({ tag: '', client_url: null, server_url: null, client_size: null, server_size: null }));
  }, []);

  if (!info) {
    return (
      <div className="download-buttons">
        <button className="btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
          <lucide.Download size={14} strokeWidth={2.5}/> Fetching release…
        </button>
      </div>
    );
  }

  return (
    <div className="download-buttons">
      {info.tag && <span className="download-release-tag">{info.tag}</span>}

      <a href={info.client_url ?? 'https://github.com/ov-studio/Vital.sandbox/releases'} className="btn-primary" target="_blank" rel="noreferrer">
        Download Client{info.client_size ? ` · ${info.client_size}` : ''}
      </a>

      {info.server_url && (
        <a href={info.server_url} className="btn-secondary" target="_blank" rel="noreferrer">
          <lucide.CloudDownload size={14} strokeWidth={2.5}/>
          Download Server{info.server_size ? ` · ${info.server_size}` : ''}
        </a>
      )}

      <p className="download-tos-note">
        By downloading, you agree to our <a href="/tos" className="download-tos-link">Terms of Service</a> and its conditions
      </p>
    </div>
  );
}