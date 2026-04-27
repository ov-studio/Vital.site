'use client';
import { PanelLeft } from 'lucide-react';
import { useState } from 'react';
import './index.css';

export function SidebarToggle() {
    const [collapsed, setCollapsed] = useState(false);

    const toggle = () => {
        const sidebar = document.querySelector('#nd-sidebar') as HTMLElement;
        if (!sidebar) return;

        const next = !collapsed;
        setCollapsed(next);
        sidebar.setAttribute('data-collapsed', String(next));
    };

    return (
        <>
            {!collapsed && (
                <div className="sidebar-header-row">
                    <button className="sidebar-toggle-btn" onClick={toggle}>
                        <PanelLeft size={15} />
                    </button>
                </div>
            )}

            {collapsed && (
                <button
                    className="sidebar-expand-btn sidebar-expand-btn--fixed"
                    onClick={toggle}
                >
                    <PanelLeft size={15} />
                </button>
            )}
        </>
    );
}