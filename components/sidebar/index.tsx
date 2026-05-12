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
        <button className="sidebar-toggle-btn" onClick={toggle}>
            <PanelLeft size={18}/>
        </button>
    );
}