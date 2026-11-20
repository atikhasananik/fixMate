# FixMate Repository Instructions

## Project State

FixMate is an App Router Next.js frontend for a role-based repair marketplace. The repository already has public pages, authentication UI, role dashboards, and shared component primitives, but backend-backed features are still being integrated.

- Current runtime: Next.js 16.4.6, React 19.3, TypeScript strict mode, Tailwind CSS v4, React Compiler.
- Package manager: npm. Use `package-lock.json`; do not add or switch to yarn/pnpm/bun workflows.
- Import alias: `@/*` maps to `src/*`.
- MongoDB, BetterAuth, and an Express service API are implemented for identity and service data, while several dashboard features still use local sample/in-memory state.
- Do not introduce a planned package solely because a design document mentions it. Keep dependencies aligned with `package.json`.

## Build, Lint, and Validation

- Install dependencies: `npm install`
- Development server: `npm run dev`
- Production build: `npm run build`
- Full lint: `npm run lint`
- Lint one file: `npx eslint src/app/path/page.tsx`
- Typecheck: `npx tsc --noEmit`

There is no test runner or configured test script. Do not invent `npm test` or claim a test suite passes. For focused validation, run the relevant ESLint command and `npx tsc --noEmit`; use `npm run build` for the main end-to-end check.

The development server may regenerate the Next.js agent rule block in `AGENTS.md`. Keep that block committed and do not remove it.

## Architecture

- `src/app/` contains route groups and App Router layouts/pages:
  - `(site)` supplies the public navbar and site shell.
  - `(auth)` supplies sign-in/sign-up pages.
  - `dashboard` supplies the shared authenticated dashboard shell.
  - `dashboard/customer`, `dashboard/technician`, and `dashboard/admin` enforce role-specific layouts.
- `src/components/` contains feature components and the reusable UI primitives under `components/ui/`.
- `src/lib/` contains auth helpers, navigation/role rules, dashboard state, API helpers, service mappers, and validation.
- `src/types/type.ts` is the central location for shared application and component prop types.
- `src/proxy.ts` performs optimistic dashboard/session-cookie redirects. Private pages must still call `getDashboardSession()` or `requireDashboardRole()` because the proxy is not authorization.

Authentication uses BetterAuth in `src/lib/auth.ts` and the auth API route at `src/app/api/auth/[...all]/route.ts`. MongoDB session/user storage is configured through the Mongo adapter. The server allow-list must remain in `before` user creation: only `customer` and `technician` may be self-assigned, and tampered `admin` roles normalize to `customer`.

Service listings currently cross two data boundaries:

- The Express API helpers in `src/lib/Action/api/` call `NEXT_PUBLIC_SERVER_API` for create, read, update, and delete operations.
- Public and technician service pages fetch server-side and map raw API documents through `src/lib/service-mappers.ts`.
- Dashboard listing/bookings/users use the client-side `DashboardStoreProvider` and `src/lib/dashboard-data.ts` as sample/in-memory state. Mutations only last until reload until MongoDB-backed dashboard collections replace it.

Role guards and redirects are centralized in `src/lib/dashboard-session.ts` and `src/lib/nav.ts`. Dashboard navigation is role-derived from `DASHBOARD_NAV` in `src/lib/dashboard-nav.ts`.

## Next.js 16 Conventions

- Read the relevant guide in `node_modules/next/dist/docs/` before unfamiliar App Router APIs. This installed Next.js version differs from older Next.js conventions.
- Prefer generated route prop types such as `PageProps<"/services">` and `LayoutProps<"/dashboard">`; do not reintroduce handwritten params types when a route has generated types.
- React Compiler is enabled. Write plain components and do not add `useMemo` or `useCallback` reflexively.
- Server layouts/pages can use `next/headers`, `next/navigation`, and the BetterAuth server API. Mark interactive components with `"use client"`.
- Keep `next.config.ts` Turbopack CSS rules intact; Tailwind v4 CSS loading depends on `@tailwindcss/turbopack`.

## Styling and Component Conventions

- Tailwind v4 is source-of-truth styling. Do not add `tailwind.config.*` or a PostCSS config.
- Theme tokens and dark-mode variables live in `src/app/globals.css`. Fonts are Roboto and Roboto Mono from `next/font`.
- Use `theme.md` for palette, card/button geometry, and status badge colors. Use `colorpalette.md` for fixed brand and semantic color values. Use `animation.md` only when motion is intentionally needed; `framer-motion` is not installed yet.
- Preserve the existing status visuals through `StatusBadge` in `src/components/dashboard/shared/status-badge.tsx`. Do not create one-off status badge classes.
- Reuse primitives from `src/components/ui/` and shared dashboard shells from `src/components/dashboard/shared/` before creating parallel components.
- Add new Tailwind theme tokens to `globals.css` rather than introducing separate config files.

## Forms and Data Mapping

- Share form state and payload types from `src/types/type.ts`; service create/edit mappings belong in `src/lib/service-payload.ts`.
- `buildServiceData()` derives technician identity and fixed listing defaults from the session. It should not allow the form to manufacture technician identity or availability state.
- `buildServiceFields()` returns editable listing fields and resets edited listings to `approvalStatus: "pending"`.
- `toTechnicianService()` is the normalizer for raw Express service documents. Its `serviceMode` normalization is API label to UI value, and `basePrice` must be rendered as a number.
- Validate with the repository helpers in `src/lib/validation.ts`; keep server-side auth password and form password rules in sync.
- ImgBB uploads run in the browser through `src/lib/imgbb.ts` and require `NEXT_PUBLIC_IMGBB_API`. Never put server-only credentials in `NEXT_PUBLIC_*` variables.

## Environment

- `.env*` files are ignored. Do not read or reproduce secret values in code, diffs, logs, or documentation.
- Browser-visible variables use `NEXT_PUBLIC_*`:
  - `NEXT_PUBLIC_SERVER_API`
  - `NEXT_PUBLIC_IMGBB_API`
  - `NEXT_PUBLIC_BETTER_AUTH_URL` or `BETTER_AUTH_URL`, according to the auth client/server setup
- MongoDB and provider secrets remain server-side variables such as `MONGODB_URI`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`.
