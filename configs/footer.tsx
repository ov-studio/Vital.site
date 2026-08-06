import * as config_site from '@/configs/site';

export const Footer_Flags = ['BH', 'TR', 'US', 'LT', 'NL', 'RU', 'GB', 'IE'];

export const Footer = [
  {
    heading: 'Sandbox',
    links: [
      { label: 'Vault',          href: '/vault'         },
      { label: 'Documentations', href: '/docs'          },
      { label: 'Roadmap',        href: '/roadmap'       },
      { label: 'Contributing',   href: '/docs/building' }
    ]
  },
  {
    heading: 'Resource',
    links: Object.values(config_site.info.git).map(({ user, repo }) => ({
      label: repo,
      href:  `https://github.com/${user}/${repo}`
    }))
  },
  {
    heading: 'Social',
    links: Object.entries(config_site.info.social).map(([key, { label, href }]) => ({
      label,
      href,
      icon: key
    }))
  },
];