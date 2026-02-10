import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { site } from '@/site.config';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: site.name,
    },
  };
}
