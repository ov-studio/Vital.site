'use client';
import * as ui_iconbutton from '@/ui/iconbutton';
import * as react         from 'react';
import * as lucide        from 'lucide-react';
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
    <ui_iconbutton.IconButton
      className="sidebar-toggle-btn"
      icon={lucide.PanelLeft}
      iconProps={{ size: 18, strokeWidth: 2.2 }}
      onClick={toggle}
      title="Toggle sidebar"
    />
  );
}