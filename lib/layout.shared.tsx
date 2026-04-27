import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Brand } from '@/components/brand';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Brand size="xs" variant="full" href="/#" />
          <br /><br />
        </>
      ),
    },
    themeSwitch: {
      enabled: false,
    },
  };
}