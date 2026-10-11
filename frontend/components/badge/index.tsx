'use client';
import './index.css';

const LABELS: Record<string, string> = {
  shared:     'Shared',
  client:     'Client',
  server:     'Server',
  deprecated: 'Deprecated',
};

export function Badge({ type }: { type: string }) {
  const key = type.toLowerCase();
  const label = LABELS[key];
  if (!label) return null;

  return (
    <span className={`docs-badge docs-badge--${key}`}>
      {label}
    </span>
  );
}
