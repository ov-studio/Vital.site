import * as config_site            from '@/configs/site';
import * as ui_brand               from '@/ui/brand';
import * as fumadocs_layout_shared from 'fumadocs-ui/layouts/shared';

export function baseOptions(): fumadocs_layout_shared.BaseLayoutProps {
  return {
    nav: {
      title: (
        <div style={{ marginTop: '12px' }}>
          <ui_brand.Brand name={config_site.info.name} size="xs" className="footer-brand-lock"/>
        </div>
      )
    },
    themeSwitch: {
      enabled: false
    }
  };
}