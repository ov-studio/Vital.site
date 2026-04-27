import './doc.css';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { SidebarToggle } from '@/components/docs-sidebar';
import { Social } from '@/components/social';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={{
        collapsible: true,
        banner: <SidebarToggle/>,
        footer: (
          <div style={{ justifyContent: 'flex-end', display: 'flex' }}>
            <Social/>
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}