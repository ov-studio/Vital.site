import * as config_home         from '@/configs/home';
import * as component_atom_icon from '@/components/atoms/icon';
import './index.css';

export function Platforms() {
  return (
    <div className="platforms">
      <ul className="platforms-list">
        {config_home.Platforms.map((p) => {
          const Icon = component_atom_icon.icon[p.id];
          return (
            <li key={p.id} className={`platforms-item${p.soon ? ' platforms-item--soon' : ''}`}>
              <Icon className="platforms-icon"/>
              <span className="platforms-name">{p.label}</span>
              {p.soon && <span className="platforms-soon">Soon</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
