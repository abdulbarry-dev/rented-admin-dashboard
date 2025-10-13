This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Dependencies

This project depends on several runtime and development packages. Below is a concise explanation of each dependency in `package.json` and why we use it.

### Runtime dependencies

- `next` — The Next.js framework powering the app (routing, SSR/SSG, build tooling).
- `react`, `react-dom` — React library and DOM renderer used by Next.js.
- `@tanstack/react-query` — Data-fetching, caching and synchronization library for server state.
- `@tanstack/react-query-devtools` — Developer tools for inspecting `react-query` cache and queries.
- `axios` — Promise-based HTTP client for calling APIs.
- `react-hook-form` — Lightweight form state management library for React.
- `@hookform/resolvers` — Integration adapters (resolvers) for `react-hook-form` to use schema validators like `zod`.
- `zod` — Type-safe schema validation used to validate and parse user/input data.
- `next-auth` — Authentication library for Next.js (provider support, sessions).
- `next-themes` — Theme (dark/light) management for Next.js apps.
- `react-hot-toast` — Minimal toast notification library for user feedback.
- `recharts` — Simple charting library for React used to render graphs and visualizations.
- `lucide-react` — An icon component library used for UI icons.
- `date-fns` — Small, modular date utility functions for parsing/formatting dates.
- `numeral` — Number and currency formatting utilities.
- `js-cookie` — Browser cookie helper for setting and reading cookies.
- `clsx` — Utility for conditionally joining classNames.
- `class-variance-authority` — Small utility to manage and compose className variants (useful with Tailwind).
- `tailwind-merge` — Safely merge Tailwind CSS className strings without duplication/conflicts.
- `zustand` — Simple and lightweight global state management.

### Development dependencies

- `typescript` — Adds TypeScript support and type checking.
- `@types/*` packages (`@types/node`, `@types/react`, `@types/react-dom`, `@types/js-cookie`, `@types/numeral`) — Type definitions for various runtime libs.
- `tailwindcss`, `postcss`, `autoprefixer`, `@tailwindcss/postcss` — Tailwind CSS and PostCSS toolchain for utility-first styling.
- `eslint`, `eslint-config-next`, `@eslint/eslintrc`, `eslint-config-prettier` — Linting and recommended ESLint configs for Next.js and formatting compatibility.
- `prettier`, `prettier-plugin-tailwindcss` — Code formatter and Tailwind-specific formatting plugin.

If you'd like, I can expand this section with example usage of the main libraries (for example, a short `react-query` example, `react-hook-form` usage, or how authentication is wired with `next-auth`).
