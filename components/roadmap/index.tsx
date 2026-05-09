'use client';
import './index.css';
import { Roadmap_Content, type FeatureStatus, type RoadmapCard } from '@/configs/roadmap';

/* ── helpers ─────────────────────────────────────────────── */
const STATUS_WEIGHT: Record<FeatureStatus, number> = {
  completed: 1,
  partial: 0.5,
  pending: 0,
};

function overallPct(cards: RoadmapCard[]): number {
  const all = cards.flatMap(c => c.items);
  if (!all.length) return 0;
  return Math.round(
    (all.reduce((s, i) => s + STATUS_WEIGHT[i.status], 0) / all.length) * 100
  );
}

/* ── stat dot ────────────────────────────────────────────── */
function StatDot({ status }: { status: FeatureStatus | null }) {
  if (!status) return <div className="rrow-cell"><span className="rstat rstat--empty" /></div>;
  const cls =
    status === 'completed' ? 'rstat--done'
    : status === 'partial' ? 'rstat--partial'
    : 'rstat--pending';
  return (
    <div className="rrow-cell">
      <span className={`rstat ${cls}`} />
    </div>
  );
}

/* ── single feature row ──────────────────────────────────── */
function FeatureRow({ card }: { card: RoadmapCard }) {
  const done    = card.items.filter(i => i.status === 'completed').length;
  const partial = card.items.filter(i => i.status === 'partial').length;
  const pending = card.items.filter(i => i.status === 'pending').length;
  const total   = card.items.length;

  // Derive single "representative" status for each column
  // done col: how many completed; partial col: how many partial; pending col: how many pending
  // We show a dot per column representing that category's presence
  const doneStatus: FeatureStatus | null    = done    > 0 ? 'completed' : null;
  const partialStatus: FeatureStatus | null = partial > 0 ? 'partial'   : null;
  const pendingStatus: FeatureStatus | null = pending > 0 ? 'pending'   : null;

  const pct = total ? Math.round(
    (card.items.reduce((s, i) => s + STATUS_WEIGHT[i.status], 0) / total) * 100
  ) : 0;

  return (
    <div className="rrow">
      <div className="rrow-category">
        <div className="rrow-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d={card.icon} fill="currentColor" />
          </svg>
        </div>
        <div className="rrow-text">
          <span className="rrow-name">{card.label}</span>
          <span className="rrow-desc">{card.desc}</span>
        </div>
      </div>

      <StatDot status={doneStatus} />
      <StatDot status={partialStatus} />
      <StatDot status={pendingStatus} />

      {/* hover accent bar sized by completion % */}
      <span className="rrow-bar" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ── overall progress ────────────────────────────────────── */
function OverallProgress() {
  const all     = Roadmap_Content.flatMap(c => c.items);
  const total   = all.length;
  const done    = all.filter(i => i.status === 'completed').length;
  const partial = all.filter(i => i.status === 'partial').length;
  const pending = all.filter(i => i.status === 'pending').length;
  const pct     = overallPct(Roadmap_Content);

  return (
    <div className="roadmap-progress">
      <div className="roadmap-progress-bar">
        <div className="roadmap-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="roadmap-progress-label">{pct}%</span>
      <div className="roadmap-progress-counts">
        <span className="rcount rcount--done">{done} done</span>
        <span className="rcount rcount--partial">{partial} partial</span>
        <span className="rcount rcount--pending">{pending} pending</span>
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

        {/* Column legend */}
        <div className="roadmap-legend">
          <div className="roadmap-legend-label">Feature area</div>
          <div className="roadmap-legend-label roadmap-legend-label--center">Done</div>
          <div className="roadmap-legend-label roadmap-legend-label--center">Partial</div>
          <div className="roadmap-legend-label roadmap-legend-label--center">Pending</div>
        </div>

        {/* Feature rows */}
        <div className="roadmap-table">
          {Roadmap_Content.map(card => (
            <FeatureRow key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
