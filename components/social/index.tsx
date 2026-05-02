import { site } from '@/configs/site';
import { icons } from '@/components/atoms/icons';
import './index.css';

export function Social() {
    return (
        <div className="social">
            {Object.entries(site.social).map(([key, item]) => {
                const Icon = icons[key as keyof typeof icons];
                return (
                    <a key={key} href={item.href} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={item.label}>
                        {Icon && <Icon className="social-icon" />}
                    </a>
                );
            })}
        </div>
    );
}