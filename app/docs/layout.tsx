import './doc.css';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import * as component_overlay from '@/components/overlay';
import * as component_social from '@/components/social';
import * as component_sidebar from '@/components/sidebar';
import * as component_clientshell from '@/components/clientshell';


export default function Layout({ children }: LayoutProps<'/docs'>) {
  const { nav, ...base } = baseOptions();

  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay vignette={false}/>
      <DocsLayout
        {...base}
        nav={{
          ...nav,
          mode: 'top',
          children: (
            <div className="nav-social">
              <component_social.Social/>
              <component_sidebar.SidebarToggle/>
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
    </component_clientshell.ClientShell>
  );
}