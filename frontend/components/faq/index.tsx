'use client';
import * as config_pages from '@/configs/pages';
import * as config_faq   from '@/configs/faq';
import * as ui_page      from '@/ui/page';
import * as ui_pagehead  from '@/ui/pagehead';
import * as ui_divider   from '@/ui/divider';
import * as lib_anchor   from '@/lib/anchor';
import * as react        from 'react';
import './index.css';

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function render_text(text: string): react.ReactNode[] {
  const nodes: react.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) nodes.push(text.slice(last, idx));
    const external = /^https?:\/\//.test(m[2]);
    nodes.push(
      <a
        key={idx}
        href={m[2]}
        className="fcard-link"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >{m[1]}</a>
    );
    last = idx + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function FAQCard({ item }: { item: config_faq.FAQItem }) {
  const [open, setOpen] = react.useState(false);

  react.useEffect(() => {
    const sync = () => { if (window.location.hash === `#${item.id}`) setOpen(true); };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [item.id]);

  return (
    <div id={item.id} className={`fcard${open ? ' fcard--open' : ''}`}>
      <div
        className="fcard-head"
        onClick={() => setOpen(o => !o)}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onKeyDown={e => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          setOpen(o => !o);
        }}
      >
        <span className="fcard-q">{item.q}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          className={`fchevron${open ? ' fchevron--up' : ''}`}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="fcard-wrap">
        <div className="fcard-answer">
          {item.a.map((p, i) => <p key={i} className="fcard-p">{render_text(p)}</p>)}
        </div>
      </div>
    </div>
  );
}

function SectionBlock({ section, index }: { section: config_faq.FAQSection; index: number }) {
  const anchor = lib_anchor.to_anchor(section.name);
  return (
    <div id={anchor} className="fcategory" style={{ '--ci': index } as React.CSSProperties}>
      <ui_divider.Divider>
        <a className="sec-title" href={`#${anchor}`}># {section.name}</a>
      </ui_divider.Divider>
      <div className="fcategory-list">
        {section.items.map(item => <FAQCard key={item.id} item={item}/>)}
      </div>
    </div>
  );
}

export function FAQ() {
  return (
    <ui_page.Page id="faq">
      <ui_pagehead.PageHead
        label="FAQ"
        title={<>Questions,<br/>Concerns & <span>Answers</span></>}
        intro={config_pages.pages.faq.description}
        introClassName="faq-intro"
      />

      <div className="faq-body">
        {config_faq.FAQ.map((section, i) => (
          <SectionBlock key={section.name} section={section} index={i}/>
        ))}
      </div>
    </ui_page.Page>
  );
}
