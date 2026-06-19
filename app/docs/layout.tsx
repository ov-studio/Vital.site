import * as lib_source from '@/lib/source';
import * as lib_layout from '@/lib/layout.shared';
import * as component_overlay from '@/components/overlay';
import * as component_social from '@/components/social';
import * as component_sidebar from '@/components/sidebar';
import * as component_clientshell from '@/components/clientshell';
import * as fumadocs_layout_notebook from 'fumadocs-ui/layouts/notebook';
import '@/app/docs/layout.css';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const { nav, ...base } = lib_layout.baseOptions();

  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay vignette={false}/>
      <fumadocs_layout_notebook.DocsLayout
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
        tree={lib_source.source.getPageTree()}
        sidebar={{
          collapsible: true,
        }}
      >
        {children}
      </fumadocs_layout_notebook.DocsLayout>
    </component_clientshell.ClientShell>
  );
}