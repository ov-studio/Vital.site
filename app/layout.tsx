import * as config_site from '@/configs/site';
import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Geist, Geist_Mono, Rajdhani } from 'next/font/google';

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

export const metadata: Metadata = {
  title: {
    template: `%s - ${config_site.info.name}`,
    default: config_site.info.name,
  },
  description: config_site.info.description,

  openGraph: {
    title: config_site.info.name,
    description: config_site.info.description,
    siteName: config_site.info.name,
    type: 'website'
  }
};

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