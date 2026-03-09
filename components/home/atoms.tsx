import type { FeatureItem } from '@/configs/types';
import './atoms.css';

export function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FeatureCard({ n, title, desc, icon, wide }: FeatureItem) {
  return (
    <div className="fc" style={wide ? { gridColumn: 'span 3' } : undefined}>
      <div className="fc-top">
        <div className="fc-num">{n}</div>
        <div className="fc-ico">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">{icon}</svg>
        </div>
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="fc-bar" />
    </div>
  );
}
