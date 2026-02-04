import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { site } from '@/site.config.ts';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: site.name,
    },
  };
}
