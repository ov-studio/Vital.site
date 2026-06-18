# Vital.site

Official documentation and resource hub for [Vital.sandbox](https://github.com/ov-studio/Vital.sandbox) — covering API references, scripting guides, and everything needed to build with confidence.

Vital.site is built on Next.js and powered by Fumadocs, providing a fast, searchable, and version-aware documentation experience. All content is authored in MDX, keeping docs close to the codebase and easy to contribute to.

## Getting Started

Clone the repository and install dependencies, then start the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally. Changes to MDX files and components hot-reload automatically.

## Structure

| Path | Description |
|---|---|
| `app/(home)` | Landing page and top-level routes |
| `app/docs` | Documentation layout and MDX pages |
| `content/docs` | MDX source files for all documentation |
| `components` | Shared UI components |
| `lib` | Content source adapter and shared utilities |
| `configs` | Site-wide configuration files |

## Contributing

Documentation improvements, corrections, and new guides are welcome. If you find an error, a missing API, or an outdated example, opening a pull request is the fastest way to get it fixed. For larger structural changes or new documentation sections, open an issue first to align on scope and approach before investing time in a draft.

All content lives under `content/docs` as MDX files and follows the existing frontmatter and heading conventions. Keep examples minimal, accurate, and tied to real engine behavior.
