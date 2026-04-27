import './doc.css';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={{
        collapsible: true,
        footer: <div className="p-2">My Custom Footer</div>,
      }}
    >
      {children}
    </DocsLayout>
  );
}