'use client';
import './index.css';
import { useState, useRef, useEffect } from 'react';
import { Roadmap_Section, type FeatureStatus, type RoadmapCard, type RoadmapSection } from '@/configs/roadmap';

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

function FeatureCard({ card }: { card: RoadmapCard }) {
  const [open, setOpen]     = useState(false);
  const innerRef            = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const pct    = cardPct(card);
  const status = cardStatus(card);

  useEffect(() => {
    if (innerRef.current) setHeight(innerRef.current.scrollHeight);
  }, [card.items]);

  return (
    <div className={`rcard rcard--${status}${open ? ' rcard--open' : ''}`}>
      <div
        className="rcard-body"
        onClick={() => setOpen(o => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
      >
        <div className="rcard-header">
          <div className="rcard-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d={card.icon} fill="currentColor"/>
            </svg>
            <span className="rcard-icon-ring"/>
          </div>

          <div className="rcard-info">
            <span className="rcard-name">{card.label}</span>
            <span className="rcard-desc">{card.desc}</span>
          </div>

          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
            className={`rchevron${open ? ' rchevron--up' : ''}`}>
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="rcard-bar-row">
          <div className="rcard-bar-track">
            <div className="rcard-bar-track-fill" style={{ width: `${pct}%` }}/>
          </div>
          <span className="rcard-pct">{pct > 0 ? `${pct}%` : '—'}</span>
        </div>
      </div>

      {card.items.length > 0 && (
        <div
          className="rcard-items-wrap"
          style={{ maxHeight: open ? `${height}px` : '0px' }}
        >
          <div ref={innerRef} className="rcard-items">
            {card.items.map((item, i) => (
              <div key={i} className={`ritem ritem--${item.status}`}>
                <span className="ritem-dot"/>
                <span className="ritem-label">{item.label}</span>
                <span className="ritem-tag">
                  {item.status === 'completed' ? 'Completed' : item.status === 'partial'  ? 'WIP' : 'Planned'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function toAnchor(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function SectionBlock({ section, index }: { section: RoadmapSection; index: number }) {
  const COLS = 3;
  const columns: RoadmapCard[][] = Array.from({ length: COLS }, () => []);
  section.cards.forEach((card, i) => columns[i % COLS].push(card));

  return (
    <div id={toAnchor(section.name)} className="rcategory" style={{ '--ci': index } as React.CSSProperties}>
      <div className="rcategory-head">
        <a className="rcategory-label" href={`#${toAnchor(section.name)}`}># {section.name}</a>
      </div>

      <div className="rcategory-cols">
        {columns.map((col, ci) => (
          <div key={ci} className="rcategory-col">
            {col.map(card => (
              <FeatureCard key={card.id} card={card}/>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RoadmapGrid() {
  return (
    <section id="roadmap">
      <div className="sw">
        <div className="roadmap-head">
          <div className="sec-head">
            <h2>What's built,<br/>What's <span>coming?</span></h2>
          </div>
          <div className="roadmap-intro">
           — Complete breakdown of every feature in the sandbox; shipped, in-progress and planned —
          </div>
        </div>

        <div className="roadmap-body">
          {Roadmap_Section.map((section, i) => (
            <SectionBlock key={section.name} section={section} index={i}/>
          ))}
        </div>
      </div>
    </section>
  );
}
