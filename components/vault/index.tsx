'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as lucide from 'lucide-react';
import * as config_vault from '@/configs/vault';
import './index.css';

const ALL_TAGS: config_vault.VaultTag[] = [
  'gamemode', 'utility', 'ui', 'physics', 'audio', 'networking', 'tools',
];

function fmt_downloads(n?: number): string {
  if (!n) return '0';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function fmt_date(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

// ── Banner ────────────────────────────────
function Banner({ src, size = 'card' }: { src?: string; size?: 'card' | 'modal' }) {
  const cls = size === 'modal' ? 'vault-modal-banner' : 'vault-card-banner';
  const ph = size === 'modal' ? 'vault-modal-banner-placeholder' : 'vault-card-banner-placeholder';
  const ico = size === 'modal' ? 80 : 48;

  return (
    <div className={cls}>
      {src
        ? <img src={src} alt="Resource banner" />
        : (
          <div className={ph}>
            <lucide.Package size={ico} color="var(--blue)" />
          </div>
        )
      }
      {size === 'modal'
        ? <div className="vault-modal-banner-overlay" />
        : <div className="vault-card-banner-overlay" />
      }
    </div>
  );
}

// ── Modal ─────────────────────────────────
function VaultModal({ resource, onClose }: {
  resource: config_vault.VaultResource;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock background scroll while the modal is open.
  // Locks both <html> and <body> since either can be the scrolling element
  // depending on the page's CSS, and compensates for the vanished scrollbar
  // width so fixed-position content (navbar, etc.) doesn't shift sideways.
  useEffect(() => {
    const scrollbar_w = window.innerWidth - document.documentElement.clientWidth;

    const html = document.documentElement;
    const body = document.body;

    const prev_html_overflow = html.style.overflow;
    const prev_body_overflow = body.style.overflow;
    const prev_body_padding_right = body.style.paddingRight;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (scrollbar_w > 0) {
      body.style.paddingRight = `${scrollbar_w}px`;
    }

    return () => {
      html.style.overflow = prev_html_overflow;
      body.style.overflow = prev_body_overflow;
      body.style.paddingRight = prev_body_padding_right;
    };
  }, []);

  const modal_markup = (
    <div className="vault-modal-overlay" onClick={onClose}>
      <div className="vault-modal" onClick={e => e.stopPropagation()}>

        <button className="vault-modal-close" onClick={onClose} aria-label="Close">
          <lucide.X size={14} />
        </button>

        <Banner src={resource.banner} size="modal" />

        <div className="vault-modal-body">
          <div className="vault-modal-eyebrow">
            <span className="vault-modal-author">
              {resource.author_url
                ? <a href={resource.author_url} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{resource.author}</a>
                : resource.author
              }
            </span>
            <span className="vault-modal-version">v{resource.version}</span>
          </div>

          <div className="vault-modal-name">{resource.name}</div>
          <div className="vault-modal-tagline">{resource.tagline}</div>

          <hr className="vault-modal-divider" />

          <p className="vault-modal-desc">{resource.description}</p>

          <div className="vault-modal-tags">
            {resource.tags.map(t => (
              <span key={t} className="vault-modal-tag">{t}</span>
            ))}
          </div>

          <div className="vault-modal-actions">
            <a href={resource.download_url} className="btn-primary" download>
              Download Asset
            </a>

            {resource.source_url && (
              <a href={resource.source_url} target="_blank" rel="noreferrer" className="btn-secondary">
                <lucide.Github size={14} />
                View Source
              </a>
            )}

            <span className="vault-modal-updated">
              Updated {fmt_date(resource.updated)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );

  // Render via portal so the overlay is a direct child of <body>.
  // This guarantees nothing up the component tree (page transition
  // wrappers, transformed/filtered ancestors, etc.) can create a stacking
  // context that breaks backdrop-filter blur.
  if (typeof document === 'undefined') return null;
  return createPortal(modal_markup, document.body);
}

// ── Card ──────────────────────────────────
function VaultCard({ resource, onClick }: {
  resource: config_vault.VaultResource;
  onClick: () => void;
}) {
  return (
    <div
      className={`vault-card rev${resource.featured ? ' featured' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <Banner src={resource.banner} size="card" />

      {resource.featured && (
        <span className="vault-card-featured-badge">Featured</span>
      )}

      <div className="vault-card-body">
        <div className="vault-card-meta">
          <span className="vault-card-author">{resource.author}</span>
          <span className="vault-card-version">v{resource.version}</span>
        </div>

        <div className="vault-card-name">{resource.name}</div>
        <div className="vault-card-tagline">{resource.tagline}</div>

        <div className="vault-card-footer">
          <div className="vault-card-tags">
            {resource.tags.slice(0, 2).map(t => (
              <span key={t} className="vault-card-tag">{t}</span>
            ))}
          </div>
          <span className="vault-card-dl-count">
            <lucide.Download size={11} />
            {fmt_downloads(resource.downloads)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────
export function Vault() {
  const [active_tag, set_active_tag] = useState<config_vault.VaultTag | null>(null);
  const [selected, set_selected] = useState<config_vault.VaultResource | null>(null);

  // Intersection observer for .rev animations
  useEffect(() => {
    const els = document.querySelectorAll('.rev');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [active_tag]);

  const filtered = active_tag
    ? config_vault.Vault.filter(r => r.tags.includes(active_tag))
    : config_vault.Vault;

  const close = useCallback(() => set_selected(null), []);

  return (
    <>
      <section id="vault">
        <div className="sw">

          {/* Header */}
          <div className="vault-head">
            <div className="sec-head">
              <div>
                <h2>Community built,<br />All yours to <span>explore.</span></h2>
              </div>

              <a
                href="https://github.com/ov-studio/Vital.sandbox"
                target="_blank"
                rel="noreferrer"
                className="sec-link"
              >
                Submit a Resource
                <lucide.ArrowRight size={13} />
              </a>
            </div>
            <div className="vault-intro">
              Community-built scripts, gamemodes, tools, and libraries for Vital.sandbox — browse, download, and ship faster.
            </div>
          </div>

          {/* Tag filters */}
          <div className="vault-filters">
            <button
              className={`vault-filter-btn${active_tag === null ? ' active' : ''}`}
              onClick={() => set_active_tag(null)}
            >
              All
            </button>
            {ALL_TAGS.map(tag => (
              <button
                key={tag}
                className={`vault-filter-btn${active_tag === tag ? ' active' : ''}`}
                onClick={() => set_active_tag(tag === active_tag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="vault-grid">
            {filtered.length === 0
              ? <div className="vault-empty">No resources found for this filter.</div>
              : filtered.map(r => (
                <VaultCard
                  key={r.id}
                  resource={r}
                  onClick={() => set_selected(r)}
                />
              ))
            }
          </div>

        </div>
      </section>

      {selected && <VaultModal resource={selected} onClose={close} />}
    </>
  );
}