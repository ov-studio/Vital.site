import { ImageResponse } from 'next/og';
import { site } from '@/configs/site';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';
export const size = { width: 1000, height: 325 };
export const contentType = 'image/png';

const bg = 'hsl(250, 25%, 2%)';
const blue = 'hsl(220, 95%, 76%)';
const dim = 'hsl(220, 10%, 70%)';
const rule = 'hsl(220, 18%, 9%)';

export default async function OGImage() {
    const [rajdhani, logosvg] = await Promise.all([
        readFile(join(process.cwd(), 'public/font/Rajdhani-Bold.ttf')),
        readFile(join(process.cwd(), 'public/logo.svg')),
    ]);

    const logo = logosvg.toString().replace(/\.cls-1\s*\{\s*fill:\s*#fff;\s*\}/g, `.cls-1 { fill: ${blue}; }`);
    const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logo).toString('base64')}`;

    return new ImageResponse(
        (
            <div style={{
                background: bg,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}>
                {/* grid bg */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `linear-gradient(${rule} 1px, transparent 1px), linear-gradient(90deg, ${rule} 1px, transparent 1px)`,
                    backgroundSize: '48px 48px',
                    opacity: 0.8,
                    display: 'flex',
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                        <img src={logoSrc} width={100} />
                        <span style={{
                            fontFamily: 'Rajdhani, sans-serif',
                            fontWeight: 700,
                            fontSize: 70,
                            letterSpacing: '0.06em',
                            color: blue,
                            lineHeight: 1,
                            paddingTop: '0.1em',
                        }}>
                            {site.name}
                        </span>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginTop: '34px',
                        fontSize: 16,
                        fontFamily: 'Rajdhani, sans-serif',
                        fontWeight: 600,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                    }}>
                        <span style={{ color: 'hsl(220, 10%, 55%)' }}>Script It.</span>
                        <span style={{ color: 'hsl(220, 10%, 22%)', fontWeight: 300 }}>—</span>
                        <span style={{ color: 'hsl(0, 0%, 97%)' }}>Ship It.</span>
                        <span style={{ color: 'hsl(220, 10%, 22%)', fontWeight: 300 }}>—</span>
                        <span style={{ color: 'hsl(220, 10%, 55%)' }}>Limitless.</span>
                    </div>
                </div>
            </div>
        ),
        { ...size, fonts: [{ name: 'Rajdhani', data: rajdhani, weight: 700, style: 'normal' }] }
    );
}