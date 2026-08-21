import * as config_site                from '@/configs/site';
import * as component_atom_tabtrap     from '@/components/atoms/tabtrap';
import * as lib_api_url                from '@/lib/api_url';
import * as next                       from 'next';
import * as fumadocs_provider_next     from 'fumadocs-ui/provider/next';
import { Geist, Geist_Mono, Rajdhani } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist'
});

const geist_mono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist-mono'
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani'
});

export const metadata: next.Metadata = {
  metadataBase: new URL(lib_api_url.get_frontend_url()),
  title: {
    template: `%s - ${config_site.info.name}`,
    default: config_site.info.name,
  },
  description: config_site.info.description,
  openGraph: {
    title: config_site.info.name,
    description: config_site.info.description,
    siteName: config_site.info.name,
    type: 'website',
    images: [{ url: lib_api_url.get_api_url('/og'), width: 1000, height: 300 }]
  }
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geist_mono.variable} ${rajdhani.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-sans">
        <component_atom_tabtrap.TabTrap/>
        <fumadocs_provider_next.RootProvider
          theme={{ enabled: true, forcedTheme: 'dark' }}
          search={{ options: { type: 'static' } }}
        >
          {children}
        </fumadocs_provider_next.RootProvider>
      </body>
    </html>
  );
}
