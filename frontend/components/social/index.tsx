import * as config_site         from '@/configs/site';
import * as component_atom_icon from '@/components/atoms/icon';
import './index.css';

export function Social() {
  return (
    <div className="social">
      {Object.entries(config_site.info.social).map(([key, item]) => {
        if (item.hide_on_widget) return null;
        const Icon = component_atom_icon.icon[key as keyof typeof component_atom_icon.icon];
        if (!Icon) return null;
        
        return (
          <a key={key} href={item.href} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={item.label}>
            <Icon className="social-icon"/>
          </a>
        );
      })}
    </div>
  );
}