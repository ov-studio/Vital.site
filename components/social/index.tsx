import './index.css';
import { Kofi_Icon, Github_Icon, Discord_Icon } from '@/components/atoms';

export function Social() {
    return (
        <div className="social">
            <a href="https://ko-fi.com/ovstudio" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Ko-fi">
                <Kofi_Icon className="social-icon"/>
            </a>
            <a href="https://github.com/ov-studio" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                <Github_Icon className="social-icon"/>
            </a>
            <a href="http://discord.gg/sVCnxPW" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Discord">
                <Discord_Icon className="social-icon"/>
            </a>
        </div>
    );
}