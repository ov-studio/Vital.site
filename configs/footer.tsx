import { site } from '@/configs/site';

export const Footer_Flags = ['BH', 'TR', 'US', 'LT', 'NL', 'RU', 'GB', 'IE'];
export const Footer_Content = [
  {
    heading: 'Sandbox',
    links: [
      { label: 'Documentations', href: '/docs' },
      { label: 'Roadmap', href: '#' },
      { label: 'Changelog', href: '#' },
      { label: 'Contributing', href: '/docs/building' },
    ],
  },
  {
    heading: 'Resource',
    links: [
      { label: `${site.git.site.repo}`, href: `https://github.com/${site.git.site.user}/${site.git.site.repo}` },
      { label: `${site.git.kit.repo}`, href: `https://github.com/${site.git.kit.user}/${site.git.kit.repo}` },
      { label: `${site.git.sandbox.repo}`, href: `https://github.com/${site.git.sandbox.user}/${site.git.sandbox.repo}` },
    ],
  },
  {
    heading: 'Social',
    links: [
      site.social.kofi,
      site.social.github,
      site.social.discord,
      site.social.youtube
    ],
  },
];