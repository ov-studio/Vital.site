import './doc.css';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { Overlay } from '@/components/overlay';
import { Social } from '@/components/social';
import { ClientShell } from '@/components/clientshell';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <ClientShell>
      <Overlay />
      <DocsLayout
        tree={source.getPageTree()}
        {...baseOptions()}
        sidebar={{
          collapsible: true,
          footer: (
            <div style={{ justifyContent: 'flex-end', display: 'flex' }}>
              <Social />
            </div>
          ),
      }}>
        {children}
      </DocsLayout>
    </ClientShell>
  );
}