import { RootProvider } from 'fumadocs-ui/provider/next';
import { Geist, Geist_Mono, Rajdhani } from 'next/font/google';
import { site } from '@/site.config';

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist'
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist-mono'
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani'
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${rajdhani.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-sans">
        <RootProvider theme={{ enabled: true, forcedTheme: 'dark' }}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: `${site.name} - %s`,
    default: `${site.name}`,
  },
  description: 'Built for creators. Engineered for production.',
};