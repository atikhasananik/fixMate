<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# FixMate

Role-based on-demand repair platform. This repo is the Next.js 16 App Router frontend; the service/booking API is a **separate Express + MongoDB repo** at `~/Desktop/fixmate-server/index.js` (port 5000, run under `nodemon`). MongoDB and BetterAuth are installed and handle auth here. Stripe and Framer Motion are **not** installed.

## Commands

- `npm run dev` — dev server on :3000. Also (re)writes the auto-generated block at the top of this file; commit it, don't delete it.
- `npm run build` — production build; the main end-to-end verification.
- `npm run lint` — `eslint` with no path, so it lints the whole repo. For one file: `npx eslint src/app/page.tsx`.
- `npx tsc --noEmit` — typecheck (there is no `typecheck` script).
- Tests: none configured. Don't invent `npm test`; run `npm run build` / `npx tsc --noEmit` instead.

## Service listing API (backend owns search / filter / sort)

`GET http://localhost:5000/get-all-services` — the public service listing. **All searching, filtering and sorting happens here.** The frontend must not `.filter()` or `.sort()` service data: `src/app/(site)/services/page.tsx` forwards the URL query string via `buildServiceApiQuery()` (`src/lib/services-query.ts`) and renders the response as-is. The toolbar only writes params; `buildServicesSearchParams()` preserves unrelated params and drops defaults.

| Param | Values | Server behaviour |
|---|---|---|
| `search` | free text | Case-insensitive regex over **`title`, `description`, `serviceArea` and `category`** (OR). Input is regex-escaped, so `.*` matches literally and never throws. |
| `category` | `Smartphone`, `Laptop & PC`, `AC`, `Refrigerator`, `TV`, `Washing Machine`, `Electrical` | Exact match on `category`. |
| `mode` | `home-visit`, `shop-drop-off` | Mapped to the stored labels `Home Visit` / `Shop Drop-off`. Unknown values are ignored. |
| `availability` | `available`, `unavailable` | `isAvailable: true` / `false`. |
| `sort` | `newest` (default), `oldest`, `price-asc`, `price-desc`, `title-asc` | Whitelisted map; unknown values fall back to `newest`. Never pass raw input to `.sort()`. |

- Filters combine with AND; `search` is OR across its fields. No params → every service.
- **Search is intentionally case-insensitive** (`new RegExp(escaped, "i")`). Don't "fix" it to be case-sensitive, and keep the escaping when adding fields.
- Backend edits need that server to reload: `nodemon` watches the file, but only if it owns port 5000 — kill any stray `node index.js` first (`ss -ltnp | grep :5000`).
- Related endpoints in the same file: `/get-single-service/:id`, `/get-services/:email`, `/add-service`, `/update-service/:id`, `/delete-service/:id`, bookings (`/add-booking`, `/get-bookings/:email`, `/get-booking-req/:email`, `/update-status*`).

### Search box behaviour (don't regress)

- The search field debounces **300 ms** (`SEARCH_DEBOUNCE_MS` in `src/components/services/services-toolbar.tsx`); selects and "Clear all" apply immediately. The API is only called after the user pauses typing.
- The input's local state is the source of truth. URL prop changes are adopted only when they are **not** the echo of the value just pushed (`previousUrlSearch` / `pushedSearch`). Do not reintroduce a `urlSearch !== lastPushedSearch` render-time reset — it compares a just-pushed value against the still-stale URL and wipes characters on every debounce.
- Keep the toolbar mounted across query navigations: `src/app/(site)/services/page.tsx` renders `<ServicesToolbar>` **outside** an in-page `<Suspense>` and there is intentionally **no** `src/app/(site)/services/loading.tsx`. A route-level `loading.tsx` replaces the whole page segment immediately on navigation, which unmounts the input, drops focus, and clears typed text. The results (count + grid) suspend behind the in-page boundary instead.

## Next.js 16 specifics

- Installed Next.js is newer than most training data. Read `node_modules/next/dist/docs/01-app/01-getting-started/` (and the relevant API reference) before using unfamiliar APIs.
- Route prop types are generated globally — e.g. `LayoutProps<"/">` in `src/app/layout.tsx`. Use the generated `PageProps<...>`/`LayoutProps<...>` helpers instead of hand-written params types. `searchParams`/`params` are Promises — `await` them.
- Turbopack is the default dev/build bundler. `next.config.ts` routes `*.css` through `@tailwindcss/turbopack`; keep that rule or Tailwind styles break.
- React Compiler is on: write plain components, don't add `useMemo`/`useCallback` reflexively, and follow the Rules of React.
- `src/proxy.ts` is Next 16's middleware replacement (not `middleware.ts`). It only checks for a session cookie and is **not** authorization — private pages still call `getDashboardSession()` / `requireDashboardRole()`.

## Styling

- Tailwind v4 only: no `tailwind.config.*` and no PostCSS config. Tokens live in `src/app/globals.css` (`@import "tailwindcss"` + `@theme inline`); add new tokens there.
- shadcn/ui style is `base-nova`: primitives are built on **Base UI** (`@base-ui/react`), not Radix. Don't add Radix or copy Radix-based shadcn snippets.
- `cn` is imported from the **`"cn"` package**, not `@/lib/utils`.
- Fonts are loaded with `next/font`: Roboto is the main sans/heading font (`--font-roboto`), Roboto Mono is used for code (`--font-roboto-mono`).
- `theme.md` is the source of truth for palette, card/button geometry, and status badge colors. `animation.md` defines motion variants.
- `framer-motion` is not installed; install it before using `animation.md` snippets. Tailwind transitions work today.
- `colorpalette.md` is for color palette.

## Domain model

- Roles: `customer`, `technician`, `admin` (`src/types/type.ts`, `src/lib/nav.ts`).
- Collections: `services`, `bookings`, `payments`, `users` (BetterAuth owns session/account collections).
- Booking pipeline: `requested` → `accepted` → `in-progress` → `completed`; technician may `reject`, customer may `cancel` only while `requested`. Completion requires `finalAmount > 0`. `completed` + `unpaid` → Stripe Checkout → `paid` (Stripe not wired yet).
- Service listings carry `approvalStatus` (`pending` / `approved` / `rejected`); the public `/services` page currently lists every service the API returns.
- Env: server secrets are unprefixed; browser-exposed values need `NEXT_PUBLIC_`. `.env*` is gitignored.
