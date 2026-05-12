import './doc.css';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { Overlay } from '@/components/overlay';
import { Social } from '@/components/social';
import { ClientShell } from '@/components/clientshell';

import { SidebarToggle } from '@/components/sidebar';


export default function Layout({ children }: LayoutProps<'/docs'>) {
  const { nav, ...base } = baseOptions();

  return (
    <ClientShell>
      <Overlay vignette={false} />
      <DocsLayout
        {...base}
        nav={{
          ...nav,
          mode: 'top',
          children: (
            <div className="nav-social">
              <Social />
              <SidebarToggle />
          </div>
          )
        }}
        tree={source.getPageTree()}
        sidebar={{
          collapsible: true,
        }}
      >
        {children}
      </DocsLayout>
    </ClientShell>
  );
}