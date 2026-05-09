'use client';
import './index.css';
import { useState } from 'react';
import { Roadmap_Content, type FeatureStatus, type RoadmapCard } from '@/configs/roadmap';

/* ── helpers ─────────────────────────────────────────────── */
const STATUS_WEIGHT: Record<FeatureStatus, number> = {
  completed: 1,
  partial: 0.5,
  pending: 0,
};

function cardPct(card: RoadmapCard): number {
  if (!card.items.length) return 0;
  return Math.round(
    (card.items.reduce((s, i) => s + STATUS_WEIGHT[i.status], 0) / card.items.length) * 100
  );
}

/* ── single row ──────────────────────────────────────────── */
function FeatureRow({ card, index }: { card: RoadmapCard; index: number }) {
  const [open, setOpen] = useState(false);
  const pct     = cardPct(card);
  const done    = card.items.filter(i => i.status === 'completed').length;
  const partial = card.items.filter(i => i.status === 'partial').length;
  const pending = card.items.filter(i => i.status === 'pending').length;

  const rowStatus: FeatureStatus =
    pct === 100 ? 'completed' : pct > 0 ? 'partial' : 'pending';

  return (
    <>
      <div
        className={`rrow${open ? ' rrow--open' : ''}`}
        style={{ '--i': index } as React.CSSProperties}
        onClick={() => setOpen(o => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
      >
        <span className="rrow-accent" style={{ width: `${pct}%` }} />

        <div className="rrow-category">
          <div className="rrow-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d={card.icon} fill="currentColor" />
            </svg>
          </div>
          <div className="rrow-text">
            <span className="rrow-name">{card.label}</span>
            <span className="rrow-subdesc">{card.desc}</span>
          </div>
        </div>

        <div className="rrow-cell rrow-cell--status">
          <span className={`rdot rdot--${rowStatus}`} />
          <span className="rrow-pct">{pct}%</span>
        </div>

        <div className="rrow-cell rrow-cell--counts">
          {done > 0    && <span className="rcount rcount--done">{done}</span>}
          {partial > 0 && <span className="rcount rcount--partial">{partial}</span>}
          {pending > 0 && <span className="rcount rcount--pending">{pending}</span>}
        </div>

        <div className="rrow-cell rrow-cell--chevron">
          <svg
            width="10" height="10" viewBox="0 0 10 10" fill="none"
            className={`rchevron${open ? ' rchevron--up' : ''}`}
          >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {open && (
        <div className="rrow-items">
          {card.items.map((item, i) => (
            <div key={i} className={`ritem ritem--${item.status}`}>
              <span className="ritem-dot" />
              <span className="ritem-label">{item.label}</span>
              <span className="ritem-status">
                {item.status === 'completed' ? 'Done'
                  : item.status === 'partial' ? 'Partial'
                  : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ── overall progress ────────────────────────────────────── */
function OverallProgress() {
  const all     = Roadmap_Content.flatMap(c => c.items);
  const total   = all.length;
  const done    = all.filter(i => i.status === 'completed').length;
  const partial = all.filter(i => i.status === 'partial').length;
  const pending = all.filter(i => i.status === 'pending').length;
  const pct     = total
    ? Math.round((all.reduce((s, i) => s + STATUS_WEIGHT[i.status], 0) / total) * 100)
    : 0;

  return (
    <div className="roadmap-progress">
      <div className="roadmap-progress-track">
        <span className="roadmap-progress-fill roadmap-progress-fill--done"
          style={{ width: `${(done / total) * 100}%` }} />
        <span className="roadmap-progress-fill roadmap-progress-fill--partial"
          style={{ width: `${(partial / total) * 100}%` }} />
      </div>
      <div className="roadmap-progress-meta">
        <span className="roadmap-progress-pct">{pct}% complete</span>
        <div className="roadmap-progress-counts">
          <span className="rcount rcount--done">{done} done</span>
          <span className="rcount rcount--partial">{partial} partial</span>
          <span className="rcount rcount--pending">{pending} pending</span>
        </div>
      </div>
    </div>
  );
}

/* ── main export ─────────────────────────────────────────── */
export function RoadmapGrid() {
  return (
    <section id="roadmap">
      <div className="sw">
        <div className="roadmap-head">
          <div className="slabel">Roadmap</div>
          <div className="sec-head">
            <h2>What's built.<br />What's <span>coming.</span></h2>
          </div>
          <OverallProgress />
        </div>

        <div className="roadmap-legend">
          <div className="rl-label">Feature area</div>
          <div className="rl-label rl-label--c">Status</div>
          <div className="rl-label rl-label--c">Items</div>
          <div className="rl-label" />
        </div>

        <div className="roadmap-table">
          {Roadmap_Content.map((card, i) => (
            <FeatureRow key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
