import { site } from '@/site.config';

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
      { label: 'Vital.sandbox', href: 'https://github.com/ov-studio/Vital.sandbox' },
      { label: 'Vital.kit', href: `https://github.com/${site.git.kit.user}/${site.git.kit.repo}` },
    ],
  },
  {
    heading: 'Social',
    links: [
      { label: 'Ko-fi', href: 'https://ko-fi.com/ovstudio' },
      { label: 'GitHub', href: 'https://github.com/ov-studio' },
      { label: 'Discord', href: 'http://discord.gg/sVCnxPW' }
    ],
  },
];