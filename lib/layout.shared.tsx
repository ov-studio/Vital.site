import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Brand } from '@/components/brand';
import { SidebarToggle } from '@/components/docs-sidebar';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Brand size="xs" variant="full" href="/#"/>,
      children: (
        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <SidebarToggle/>
          <br/><br/>
        </div>
      ),
    },
    themeSwitch: {
      enabled: false,
    },
  };
}