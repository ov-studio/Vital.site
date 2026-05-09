'use client';
import './index.css';
import { useState } from 'react';
import { Roadmap_Content, type FeatureStatus, type RoadmapCard } from '@/configs/roadmap';

/* ── helpers ─────────────────────────────────────────────── */
const STATUS_WEIGHT: Record<FeatureStatus, number> = {
  completed: 1,
  partial:   0.5,
  pending:   0,
};

function cardPct(card: RoadmapCard): number {
  if (!card.items.length) return 0;
  return Math.round(
    (card.items.reduce((s, i) => s + STATUS_WEIGHT[i.status], 0) / card.items.length) * 100
  );
}

function cardStatus(card: RoadmapCard): FeatureStatus {
  const pct = cardPct(card);
  return pct === 100 ? 'completed' : pct > 0 ? 'partial' : 'pending';
}

type Category = { label: string; cards: RoadmapCard[] };

function groupByCategory(cards: RoadmapCard[]): Category[] {
  const map = new Map<string, RoadmapCard[]>();
  for (const card of cards) {
    const key = card.category ?? 'General';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(card);
  }
  return Array.from(map.entries()).map(([label, cards]) => ({ label, cards }));
}

/* ── feature card ─────────────────────────────────────────
   IMPORTANT: defined at module level so React never remounts
   it just because a parent re-renders.
──────────────────────────────────────────────────────────── */
function FeatureCard({ card }: { card: RoadmapCard }) {
  const [open, setOpen] = useState(false);
  const pct    = cardPct(card);
  const status = cardStatus(card);

  return (
    <div className={`rcard rcard--${status}${open ? ' rcard--open' : ''}`}>

      {/* clickable header */}
      <div
        className="rcard-body"
        onClick={() => setOpen(o => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
      >
        <div className="rcard-header">
          <div className="rcard-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d={card.icon} fill="currentColor" />
            </svg>
          </div>

          <div className="rcard-info">
            <span className="rcard-name">{card.label}</span>
            <span className="rcard-desc">{card.desc}</span>
            
            {/* top progress bar */}
            <span className="rcard-bar">
              <span className="rcard-bar-fill" style={{ width: `${pct}%` }} />
            </span>
          </div>

          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
            className={`rchevron${open ? ' rchevron--up' : ''}`}>
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* expanded items — keyed by card.id so state never leaks */}
      {open && card.items.length > 0 && (
        <div className="rcard-items">
          {card.items.map((item, i) => (
            <div key={i} className={`ritem ritem--${item.status}`}>
              <span className="ritem-dot" />
              <span className="ritem-label">{item.label}</span>
              <span className="ritem-tag">
                {item.status === 'completed' ? 'Done'
                  : item.status === 'partial' ? 'In progress'
                  : 'Planned'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── category section ────────────────────────────────────── */
function CategorySection({ cat, index }: { cat: Category; index: number }) {
  return (
    <div className="rcategory" style={{ '--ci': index } as React.CSSProperties}>
      <div className="rcategory-head">
        <span className="rcategory-label">{cat.label}</span>
      </div>

      <div className="rcategory-grid">
        {/* key by card.id, never by index */}
        {cat.cards.map(card => (
          <FeatureCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

/* ── main export ─────────────────────────────────────────── */
export function RoadmapGrid() {
  const categories = groupByCategory(Roadmap_Content);

  return (
    <section id="roadmap">
      <div className="sw">
        <div className="roadmap-head">
          <div className="slabel">Roadmap</div>
          <div className="sec-head">
            <h2>What we've achieved.<br />What's <span>coming.</span></h2>
          </div>
        </div>

        <div className="roadmap-body">
          {categories.map((cat, i) => (
            <CategorySection key={cat.label} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
