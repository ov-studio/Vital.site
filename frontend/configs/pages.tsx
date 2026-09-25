import * as config_site from '@/configs/site';

export const pages = {
  tos: {
    title: 'Terms of Service',
    description: `Terms and conditions governing your use of ${config_site.info.name} and its associated services`
  },

  benchmarks: {
    title: 'Benchmarks',
    description: 'Live benchmark results from the latest Vital.benchmark output'
  },

  vault: {
    title: 'Vault',
    description: 'Community-built scripts, gamemodes, tools, and libraries for Vital.sandbox'
  },

  roadmap: {
    title: 'Roadmap',
    description: 'Complete breakdown of every feature in the sandbox; shipped, in-progress and planned'
  },

  studio: {
    title: 'Studio',
    description: 'Open Graph images, neon logos, and channel banners using the real Brand component.'
  },

  workspace: {
    title: 'Workspace',
    description: 'Apply for masterlist tokens, track application status, and review requests'
  }
} as const;

export type PageKey = keyof typeof pages;
