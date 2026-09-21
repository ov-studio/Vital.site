'use client';
import * as ui_button   from '@/ui/button';
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
    fetch(lib_api_url.get_api_url('/build'))
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => setInfo({ tag: '', client_url: null, server_url: null, client_size: null, server_size: null }));
  }, []);

  if (!info) {
    return (
      <div className="download-buttons">
        <ui_button.Button variant="primary" disabled>
          <lucide.Download size={14} strokeWidth={2.5}/> Fetching release…
        </ui_button.Button>
      </div>
    );
  }

  return (
    <div className="download-buttons">
      {info.tag && <span className="download-release-tag">{info.tag}</span>}

      <ui_button.Button
        variant="primary"
        href={info.client_url ?? 'https://github.com/ov-studio/Vital.sandbox/releases'}
        target="_blank"
        rel="noreferrer"
      >
        Download Client{info.client_size ? ` · ${info.client_size}` : ''}
      </ui_button.Button>

      {info.server_url && (
        <ui_button.Button
          variant="secondary"
          href={info.server_url}
          target="_blank"
          rel="noreferrer"
        >
          <lucide.CloudDownload size={14} strokeWidth={2.5}/>
          Download Server{info.server_size ? ` · ${info.server_size}` : ''}
        </ui_button.Button>
      )}

      <p className="download-tos-note">
        By downloading, you agree to our <a href="/tos" className="download-tos-link">Terms of Service</a> and its conditions*
      </p>
    </div>
  );
}