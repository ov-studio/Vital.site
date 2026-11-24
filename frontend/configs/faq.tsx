import * as config_site from '@/configs/site';

export interface FAQItem {
  id:     string;
  q:      string;
  a:      string[];
}

export interface FAQSection {
  name:  string;
  items: FAQItem[];
}

export const FAQ: FAQSection[] = [
  {
    name: 'General',
    items: [
      {
        id: 'what-is',
        q: `What is ${config_site.info.name}?`,
        a: [
          `${config_site.info.name} is an open-source, high-performance sandbox built on Godot-Engine and powered by C++17 & Lua. It wraps Godot's internals and exposes them to Lua scripts, so you can build games, tools, and multiplayer experiences without ever touching the engine's source.`,
          `The project was initially started in 2022 by ${config_site.info.author} as a playground, and it has come a long way since then. What began as an experiment has grown into a full scripting platform with rendering, models, audio, networking, physics, and a web-based UI layer. It is still under active development, and every module, shipped or planned, is tracked publicly on the [roadmap](/roadmap).`,
        ]
      },
      {
        id: 'what-can-build',
        q: 'What can I build with it?',
        a: [
          'Anything you can script in Lua on top of Godot: gamemodes, multiplayer games, dedicated servers, tools, and libraries. Rendering, model handling, audio, networking, and a webview-based HTML/CSS/JS UI are all available from Lua.',
          'The [documentation](/docs) covers every API in detail, and the [Vault](/vault) hosts community-built scripts, gamemodes, tools, and libraries you can learn from or build on.',
        ]
      },
      {
        id: 'open-source',
        q: 'Is it free and open source?',
        a: [
          `Yes. ${config_site.info.name} is open source and free to use for personal, educational, and commercial work. The exact license terms live in the [repository](https://github.com/${config_site.info.git.sandbox.user}/${config_site.info.git.sandbox.repo}) and apply alongside our [Terms of Service](/tos).`,
          'Being open source also means the whole project is readable, buildable, and open to contributions from anyone.',
        ]
      },
      {
        id: 'platforms',
        q: 'Which platforms are supported?',
        a: [
          `Currently supported: ${config_site.info.seo.platforms.join(', ')}. Support for additional platforms is planned and tracked on the [roadmap](/roadmap). We only list a platform as supported once it actually works.`,
        ]
      },
      {
        id: 'docs',
        q: 'Where can I find documentation?',
        a: [
          'The [Documentations](/docs) section covers the full API reference, including every module, function, and enum, with syntax, parameter and return tables, and examples. It also includes [build instructions](/docs/building) if you want to compile the sandbox yourself.',
        ]
      }
    ]
  },

  {
    name: 'Masterlist',
    items: [
      {
        id: 'masterlist-whitelist',
        q: 'Why is there a whitelist for servers?',
        a: [
          'AI slop is taking over everywhere, and an open server list would quickly fill with low-effort, mass-produced servers that bury the ones people actually put work into. The whitelist exists to keep the masterlist fresh and worth browsing instead of turning it into a dumping ground.',
          'We highly prefer quality. We want the people who spend their time and effort creating a game to be the ones featured at the top, not whoever can spin up the most servers the fastest.',
        ]
      },
      {
        id: 'masterlist-approval',
        q: 'How are applications approved?',
        a: [
          'Every application is reviewed by the team and then either approved or rejected based on the quality of your game. Your game has to meet that bar to be eligible for listing. We look for real effort and care in what you have built.',
          'A rejection is not permanent, so you can improve your game and apply again.',
        ]
      },
      {
        id: 'masterlist-apply',
        q: 'How do I apply for listing?',
        a: [
          'Apply for a masterlist token through the [Workspace](/workspace). Once submitted, you can track the status of your application there and review its outcome as soon as it has been processed.',
        ]
      },
    ]
  },
  {
    name: 'Community',
    items: [
      {
        id: 'contribute',
        q: 'How can I contribute?',
        a: [
          `Start with the [contributing guide](/docs/building) in the documentation, which explains how to set up and build the project. From there you can open an issue or a pull request on [GitHub](${config_site.info.social.github.href}), whether it is a bug fix, a new feature, or a documentation improvement.`,
          `If you would like to discuss an idea before writing any code, join the [Discord](${config_site.info.social.discord.href}) and talk to the team first. We extremely value every human contribution, big or small.`,
        ]
      },
      {
        id: 'report',
        q: 'How do I report a bug, a security issue, or a concern?',
        a: [
          `Bugs and feature requests belong in the [GitHub issues](https://github.com/${config_site.info.git.sandbox.user}/${config_site.info.git.sandbox.repo}/issues) of the relevant repository, ideally with clear steps to reproduce.`,
          `For security issues or anything sensitive, please contact the team privately on [Discord](${config_site.info.social.discord.href}) instead of posting publicly, so it can be handled before it affects anyone.`,
        ]
      }
    ]
  },

  {
    name: 'AI Usage',
    items: [
      {
        id: 'ai-stance',
        q: `What is ${config_site.info.name}'s stance on AI?`,
        a: [
          'We are not anti-AI, but we are not AI fans either. We see it as a good side tool that helps speed up productivity, never as a replacement for people. We use it for coding assistance, bug hunting, and brainstorming.',
          `${config_site.info.name} is built by a dedicated human team and has been in development for years, long before modern AI tools existed. We value every human contribution far more than anything AI can produce.`,
        ]
      },
      {
        id: 'ai-code',
        q: 'Is the code written by AI?',
        a: [
          'No. All code is written and maintained manually by our team. AI may help us track down a bug or think through a problem, but every change is written, reviewed, and owned by a person who understands it.',
          'The architecture, the API design, and the decisions behind them are all human-made.',
        ]
      },
      {
        id: 'ai-assets',
        q: 'Do you use AI-generated art or assets?',
        a: [
          'No. We do not use AI-generated art, branding, or assets. Everything you see on the site and in the project is made by people.',
        ]
      },
      {
        id: 'ai-contributions',
        q: 'Can I use AI tools when contributing?',
        a: [
          'You may use AI as an assistant, but you are fully responsible for what you submit. You must understand, test, and be able to explain every change in your pull request.',
          'Low-effort, unreviewed, or bulk AI-generated submissions will be closed without further discussion.',
        ]
      },
      {
        id: 'ai-data',
        q: 'Is my data or my scripts used to train AI?',
        a: [
          `No. ${config_site.info.name} does not sell, share, or feed user data or user scripts into AI training.`,
          '[Vault](/vault) submissions remain under the license chosen by their authors.',
        ]
      }
    ]
  }
];
