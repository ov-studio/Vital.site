import * as fumadocs_layout_shared from 'fumadocs-ui/layouts/shared';
import * as component_brand from '@/components/brand';

export function baseOptions(): fumadocs_layout_shared.BaseLayoutProps {
  return {
    nav: {
      title: (
        <div style={{ marginTop: '12px' }}>
          <component_brand.Brand size="xs" variant="full" href="/#"/>
        </div>
      )
    },
    themeSwitch: {
      enabled: false,
    },
  };
}