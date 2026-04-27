import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Brand } from '@/components/brand';
import { SidebarToggle } from '@/components/docs-sidebar';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <Brand size="xs" variant="full" href="/#" />
          <SidebarToggle />
          <br /><br />
        </div>
      ),
    },
    themeSwitch: {
      enabled: false,
    },
  };
}