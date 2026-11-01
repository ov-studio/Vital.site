import * as config_home from '@/configs/home';
import './index.css';

export function Platforms() {
  return (
    <div className="platforms">
      <ul className="platforms-list">
        {config_home.Platforms.map(({ id, icon: Icon, label, soon }) => (
          <li key={id} className={`platforms-item${soon ? ' platforms-item--soon' : ''}`}>
            <Icon className="platforms-icon"/>
            <span className="platforms-name">{label}</span>
            {soon && <span className="platforms-soon">Soon</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
