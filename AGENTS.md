<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# FixMate

Role-based on-demand repair platform. **The repo is still only the Next.js frontend scaffold** (`src/app/page.tsx` is create-next-app boilerplate). MongoDB, BetterAuth, Express, Stripe, ImgBB, Framer Motion, and DaisyUI/HeroUI are target design only — none are installed. Do not import them until they are added to `package.json`.

## Verified stack

- Next.js 16.4.6 App Router, React 19.3, TypeScript strict, Tailwind CSS v4, React Compiler enabled (`next.config.ts`).
- Import alias: `@/*` → `src/*`.
- Package manager: npm (`package-lock.json`). Ignore the yarn/pnpm/bun commands in `README.md`.
- No test runner, formatter, CI, or pre-commit config exists yet.

## Commands

- `npm run dev` — dev server on :3000. Also (re)writes the auto-generated block at the top of this file; commit it, don't delete it.
- `npm run build` — production build; the main end-to-end verification.
- `npm run lint` — `eslint` with no path, so it lints the whole repo. For one file: `npx eslint src/app/page.tsx`.
- `npx tsc --noEmit` — typecheck (there is no `typecheck` script).
- Tests: none configured. Don't invent `npm test`; run `npm run build` / `npx tsc --noEmit` instead.

## Next.js 16 specifics

- Installed Next.js is newer than most training data. Read `node_modules/next/dist/docs/01-app/01-getting-started/` (and the relevant API reference) before using unfamiliar APIs.
- Route prop types are generated globally — e.g. `LayoutProps<"/">` in `src/app/layout.tsx`. Use the generated `PageProps<...>`/`LayoutProps<...>` helpers instead of hand-written params types.
- Turbopack is the default dev/build bundler. `next.config.ts` routes `*.css` through `@tailwindcss/turbopack`; keep that rule or Tailwind styles break.
- React Compiler is on: write plain components, don't add `useMemo`/`useCallback` reflexively, and follow the Rules of React.

## Styling

- Tailwind v4 only: no `tailwind.config.*` and no PostCSS config. Tokens live in `src/app/globals.css` (`@import "tailwindcss"` + `@theme inline`); add new tokens there.
- Fonts are loaded with `next/font`: Roboto is the main sans/heading font (`--font-roboto`), Roboto Mono is used for code (`--font-roboto-mono`).
- `theme.md` is the source of truth for palette, card/button geometry, and status badge colors. `animation.md` defines motion variants.
- `framer-motion` is not installed; install it before using `animation.md` snippets. Tailwind transitions work today.
- `colorpalette.md` is for color palette .

## Target domain model (planned, not implemented)

- Roles: `customer`, `technician`, `admin`.
- Collections: `users` (extended via BetterAuth `additionalFields`), `services`, `bookings`, `payments`; BetterAuth owns its own session/account collections.
- Booking pipeline: `requested` → `accepted` → `in-progress` → `completed`; technician may `reject` and customer may `cancel` only while `requested`. Completion requires `finalAmount > 0`. `completed` + `unpaid` → Stripe Checkout → `paid`.
- Service listings require admin approval (`pending` / `approved` / `rejected`).
- Env: server secrets are unprefixed; browser-exposed values need `NEXT_PUBLIC_`. `.env*` is gitignored.
