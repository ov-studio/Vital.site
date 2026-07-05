import * as config_site from '@/configs/site';

export const Footer_Flags = ['BH', 'TR', 'US', 'LT', 'NL', 'RU', 'GB', 'IE'];

export const Footer = [
  {
    heading: 'Sandbox',
    links: [
      { label: 'Documentations', href: '/docs' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Contributing', href: '/docs/building' },
      { label: 'Terms of Service', href: '/tos' }
    ]
  },
  {
    heading: 'Resource',
    links: [
      { label: `${config_site.info.git.site.repo}`, href: `https://github.com/${config_site.info.git.site.user}/${config_site.info.git.site.repo}` },
      { label: `${config_site.info.git.sandbox.repo}`, href: `https://github.com/${config_site.info.git.sandbox.user}/${config_site.info.git.sandbox.repo}` },
      { label: `${config_site.info.git.kit.repo}`, href: `https://github.com/${config_site.info.git.kit.user}/${config_site.info.git.kit.repo}` },
      { label: `${config_site.info.git.vault.repo}`, href: `https://github.com/${config_site.info.git.vault.user}/${config_site.info.git.vault.repo}` }
    ]
  },
  {
    heading: 'Social',
    links: Object.entries(config_site.info.social).map(([key, item]) => ({
      label: item.label,
      href: item.href,
      icon: key
    }))
  },
];