'use client';
import * as react from 'react';
import * as lucide from 'lucide-react';
import './index.css';

export function SidebarToggle() {
  const [collapsed, setCollapsed] = react.useState(false);

  const toggle = () => {
    const sidebar = document.querySelector('#nd-sidebar') as HTMLElement;
    if (!sidebar) return;
    const next = !collapsed;
    setCollapsed(next);
    sidebar.setAttribute('data-collapsed', String(next));
  };

  return (
    <button className="sidebar-toggle-btn" onClick={toggle}>
      <lucide.PanelLeft size={18}/>
    </button>
  );
}