# FixMate

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**A modern, role-based on-demand repair service marketplace built for customers, technicians, and administrators.**

Browse trusted repair services, create bookings, manage technician requests, track job progress, and handle completed-service payments from one connected platform.

</div>

---

## Table of Contents

- [Why FixMate?](#why-fixmate)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Role-Based Workspaces](#role-based-workspaces)
- [Booking Lifecycle](#booking-lifecycle)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Why FixMate?

Finding a reliable repair professional is often slow and fragmented. Customers may struggle to discover the right service, confirm availability, track a request, or understand the final payment state. At the same time, technicians need a focused workspace to publish listings and respond to jobs.

**FixMate solves this by bringing the complete repair journey into one role-aware platform:**

- A searchable public marketplace for repair categories and services
- Authenticated, server-validated customer and technician roles
- Structured booking requests and status tracking
- Dedicated dashboards for each user role
- Technician service management
- Backend-powered filtering and sorting
- Checkout support for completed bookings
- A consistent, accessible light/dark interface

> The project is a real two-system application: this repository provides the Next.js frontend and BetterAuth identity layer, while an Express/MongoDB service API provides listing, booking, and payment operations.

---

## Core Features

### Public Experience

- Responsive landing page with featured repair services
- Repair categories for smartphones, laptops, AC, refrigerators, TVs, washing machines, and electrical work
- Service discovery with search, category, mode, availability, and sorting
- Debounced search that updates URL parameters without interrupting typing
- Individual service detail pages
- Technician profiles and transparent service information
- About, FAQ, profile, sign-in, and sign-up pages
- Persistent light and dark themes
- Mobile navigation and responsive layouts

### Customer Workspace

- Personal dashboard with booking-related overview cards
- Create and submit booking requests
- View booking details and current status
- Cancel eligible requested bookings
- Review payment state
- Access completed-booking checkout
- Update profile information

### Technician Workspace

- Technician-specific overview dashboard
- Create repair service listings
- Upload listing images through ImgBB
- View and manage published services
- Inspect authenticated booking requests
- Filter requests by booking status
- Accept, reject, or advance active jobs
- Enter a final amount before completing a repair
- Update profile information

### Admin Workspace

- Admin overview and platform metrics
- User management view
- Service moderation view
- Booking management view
- Transaction and payment overview
- Role-derived navigation and server-side route guards

### Platform-wide

- BetterAuth email/password authentication
- Optional Google social sign-in
- MongoDB-backed users and sessions
- Server-side allow-listed role assignment
- Tampered `admin` signup roles normalize to `customer`
- Role-specific redirects and dashboard authorization
- Shared status badges and dashboard UI primitives
- API-side search, filter, and sort ownership
- Base UI and shadcn-style component primitives
- React 19 and Next.js React Compiler support

---

## Technology Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16.4.6, App Router |
| UI Library | React 19.3 |
| Language | TypeScript in strict mode |
| Styling | Tailwind CSS 4, Tailwind CSS custom theme tokens |
| Components | Base UI, shadcn-style reusable primitives |
| Authentication | BetterAuth |
| Identity Storage | MongoDB via `@better-auth/mongo-adapter` |
| Database Driver | MongoDB Node.js Driver |
| Service & Booking API | Express and MongoDB backend |
| Payments | Stripe Checkout session support through the Express API |
| Image Uploads | ImgBB browser upload integration |
| Charts | Recharts |
| Forms & Controls | React controlled fields, Base UI Select/Dialog/Navigation primitives |
| Icons | Lucide React |
| Dates & Formatting | `date-fns` plus shared formatting helpers |
| Fonts | Roboto and Roboto Mono through `next/font` |
| Package Manager | npm |

---

## Application Architecture

```text
Browser
  |
  | Public pages, authentication, role dashboards
  v
Next.js 16 Frontend
  |-- BetterAuth sessions in MongoDB
  |-- Server-side role guards
  |-- Service and booking API helpers
  |-- URL-based public and technician filters
  |
  | HTTP
  v
Express + MongoDB Service API
  |-- Service CRUD
  |-- Search, filtering, and sorting
  |-- Booking creation and status updates
  |-- Booking/payment lookup
  |-- Stripe Checkout session creation
```

The frontend uses server components for private and data-fetching pages where possible. Interactive controls, forms, dialogs, search behavior, and dashboard actions are isolated into client components.

> The service API is maintained as a separate Express repository at `~/Desktop/fixmate-server/index.js` and normally runs on port `5000`.

---

## Role-Based Workspaces

| Role | Dashboard | Main Capabilities |
|---|---|---|
| Customer | `/dashboard/customer` | Browse, book, cancel eligible requests, view payments, and update profile |
| Technician | `/dashboard/technician` | Create services, manage listings, process job requests, and update profile |
| Admin | `/dashboard/admin` | Manage users, services, bookings, transactions, and platform profile |

Role navigation and redirects are centralized in `src/lib/dashboard-nav.ts` and `src/lib/nav.ts`. Private dashboard pages also call server-side authentication guards; the route proxy is only a cookie-level redirect and is not authorization.

---

## Booking Lifecycle

```text
requested
   |
   +--> rejected
   |
   +--> accepted
          |
          +--> in-progress
                 |
                 +--> completed
                        |
                        +--> unpaid
                        |      |
                        |      +--> paid through Stripe Checkout
                        |
                        +--> final amount confirmed
```

- Customers may cancel a booking while it is still `requested`.
- Technicians may reject or progress assigned work through the request workflow.
- Completion requires a final amount greater than zero.
- Completed unpaid bookings can open a Stripe Checkout session.
- Public query parameters are forwarded to the Express API; the frontend does not re-filter or re-sort backend results.

---

## Folder Structure

```text
fixmate/
├── public/
│   ├── hero-technician.svg
│   └── static assets
├── src/
│   ├── app/
│   │   ├── (auth)/                 # Sign-in and sign-up routes
│   │   ├── (site)/                 # Public pages and checkout routes
│   │   │   ├── about/
│   │   │   ├── profile/
│   │   │   ├── services/
│   │   │   └── (payment)/checkout/
│   │   ├── api/auth/[...all]/      # BetterAuth API route
│   │   ├── dashboard/
│   │   │   ├── customer/
│   │   │   ├── technician/
│   │   │   ├── admin/
│   │   │   └── profile/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── auth/                   # Authentication UI
│   │   ├── booking/                # Booking request dialogs/actions
│   │   ├── checkout/               # Checkout payment UI
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   ├── customer/
│   │   │   ├── technician/
│   │   │   └── shared/
│   │   ├── home/                   # Landing page sections
│   │   ├── layout/                 # Navbar, footer, mobile navigation
│   │   ├── profile/
│   │   ├── services/
│   │   └── ui/                     # Shared Base UI primitives
│   ├── hooks/                      # Mobile and UI hooks
│   ├── lib/
│   │   ├── Action/api/             # Express API request helpers
│   │   ├── auth.ts                 # BetterAuth server configuration
│   │   ├── auth-client.ts
│   │   ├── dashboard-session.ts
│   │   ├── dashboard-nav.ts
│   │   ├── service-mappers.ts
│   │   ├── service-payload.ts
│   │   ├── services-query.ts
│   │   ├── bookings-query.ts
│   │   └── validation.ts
│   ├── types/
│   │   └── type.ts                 # Shared application types
│   └── proxy.ts                    # Next.js proxy/cookie redirects
├── theme.md                        # UI and component design rules
├── colorpalette.md                 # Solid brand and status palette
├── next.config.ts
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- MongoDB connection
- Express service API running locally or deployed
- Optional: Google OAuth credentials
- Optional: ImgBB API key

### 1. Clone the repository

```bash
git clone https://github.com/atikhasananik/fixMate.git
cd fixMate
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local` in the project root. The server variables must not be exposed as `NEXT_PUBLIC_*` values.

### 4. Start the Express API

If the backend repository is located at `~/Desktop/fixmate-server`, start it on port `5000`:

```bash
cd ~/Desktop/fixmate-server
nodemon index.js
```

Confirm it is listening:

```bash
curl http://localhost:5000
```

### 5. Start FixMate

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

```bash
# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/fixMate

# BetterAuth
BETTER_AUTH_URL=http://localhost:3000

# Express + MongoDB service API
NEXT_PUBLIC_SERVER_API=http://localhost:5000

# ImgBB browser uploads
NEXT_PUBLIC_IMGBB_API=your_imgbb_api_key

# Optional Google sign-in
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Browser-visible variables must use the `NEXT_PUBLIC_*` prefix. MongoDB and OAuth secrets should remain server-only.

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint across the project |
| `npx tsc --noEmit` | Run the TypeScript compiler without emitting files |

There is currently no test runner or `npm test` script.

---

## API Integration

The frontend integrates with the separate Express API through shared helpers in `src/lib/Action/api/`.

### Service endpoints

| Operation | Endpoint |
|---|---|
| All services | `GET /get-all-services` |
| Single service | `GET /get-single-service/:id` |
| Technician services | `GET /get-services/:email` |
| Create service | `POST /add-service` |
| Update service | `PUT /update-service/:id` |
| Delete service | `DELETE /delete-service/:id` |

### Booking endpoints

| Operation | Endpoint |
|---|---|
| Create booking | `POST /add-booking` |
| Customer bookings | `GET /get-bookings/:email` |
| Technician requests | `GET /get-booking-req/:email` |
| Booking lookup | `GET /get-booking/:id` |
| Update status | `POST /update-status*` or the matching backend status route |
| Create payment session | `POST /create-payment-intent` |

Public service filters and technician booking status filters are encoded into URL parameters and translated by shared query helpers. The API owns the actual search, filter, and sorting behavior.

---

## Roadmap

- [ ] Move remaining admin and overview data from mock state to Express/MongoDB
- [ ] Add persistent ratings and verified customer reviews
- [ ] Add technician availability calendars
- [ ] Add real-time booking notifications
- [ ] Add payment success reconciliation and webhook handling
- [ ] Expand automated validation and test coverage
- [ ] Add an admin moderation workflow for technician registrations
- [ ] Improve analytics and platform reporting

---

## Contributing

1. Fork the repository
2. Create a focused feature branch
3. Follow the existing App Router, role guard, API mapping, and Tailwind conventions
4. Run lint and TypeScript validation
5. Open a pull request with a clear summary and screenshots for UI changes

```bash
npx eslint src/app/path/to/file.tsx
npx tsc --noEmit
npm run build
```

---

## License

No license has been explicitly added to this repository. Add a `LICENSE` file before distributing FixMate as an open-source project.

---

<div align="center">

Built with Next.js, MongoDB, BetterAuth, and a role-aware repair marketplace architecture.

</div>
