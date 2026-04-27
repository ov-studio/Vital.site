'use client';

import { PanelLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

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
            {/* Inside sidebar - collapse button */}
            {!collapsed && (
                <div className="sidebar-header-row">
                    <button className="sidebar-toggle-btn" onClick={toggle}>
                        <PanelLeft size={15} />
                    </button>
                </div>
            )}

            {/* Outside sidebar - expand button, fixed position */}
            {collapsed && (
                <button
                    className="sidebar-expand-btn"
                    onClick={toggle}
                    style={{
                        position: 'fixed',
                        top: '1rem',
                        left: '1rem',
                        zIndex: 9999,
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px',
                        border: '1px solid hsl(220, 18%, 12%)',
                        background: 'hsl(250, 25%, 6%)',
                        color: 'hsl(220, 10%, 60%)',
                        cursor: 'pointer',
                    }}
                >
                    <PanelLeft size={15} />
                </button>
            )}
        </>
    );
}