import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Brand } from '@/components/brand';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div style={{ marginTop: '12px' }}>
          <Brand size="xs" variant="full" href="/#" />
        </div>
      )
    },
    themeSwitch: {
      enabled: false,
    },
  };
}