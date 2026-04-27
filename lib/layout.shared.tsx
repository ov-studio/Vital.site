import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Brand } from '@/components/brand';
import { SidebarToggle } from '@/components/sidebar';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div style={{ marginTop: '12px' }}>
          <Brand size="xs" variant="full" href="/#" />
        </div>
      ),
      children: (
        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginTop: '12px' }}>
          <SidebarToggle/>
        </div>
      ),
    },
    themeSwitch: {
      enabled: false,
    },
  };
}