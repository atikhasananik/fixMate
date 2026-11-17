<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# FixMate — AI Developer & Context Guide (`agents.md`)

## 1. Project Overview & Objective
**FixMate** is a full-stack, role-based on-demand repair service platform built for smartphones, home appliances, and electronic devices. It connects customers with verified technicians, providing a transparent step-by-step job tracking pipeline and a secure "pay-after-service" model.

* **Tech Stack:**
  * **Frontend:** Next.js (App Router), TypeScript/JavaScript, Tailwind CSS, DaisyUI / HeroUI / shadcn/ui.
  * **Backend:** Node.js, Express.js, TypeScript/JavaScript.
  * **Database & Auth:** MongoDB, BetterAuth (with MongoDB adapter & custom additional fields), JWT.
  * **Integrations:** Stripe Checkout & Webhook (Test Mode), ImgBB API (Image Uploads).
  * **Motion & Styling Docs:** Refer to `theme.md` (Design & UI/UX Guidelines) and `animation.md` (Framer Motion & Micro-interactions).

---

## 2. Stakeholders & Roles
1. **Customer (`customer`):** Browses/searches approved services, submits repair requests, tracks jobs, cancels unaccepted requests, pays via Stripe, and views transaction history.
2. **Technician (`technician`):** Adds/manages repair services (subject to Admin approval), accepts/rejects incoming requests, advances job status, sets final billing amounts upon completion.
3. **Admin (`admin`):** Moderates/approves service listings, manages user roles, monitors all platform bookings, reviews total revenue and transactions.

---

## 3. Database Architecture (4 Core Collections)
*Note: BetterAuth automatically manages its own session/account collections, but the user collection is extended using BetterAuth `additionalFields`.*

### A. `users` (Managed by BetterAuth + Admin)
* `_id` (ObjectId)
* `name` (String)
* `email` (String, Unique)
* `image` (String, ImgBB URL)
* `role` (String: `'customer' | 'technician' | 'admin'`, default: `'customer'`)
* `phone` (String)
* `area` (String)
* `bio` (String)

### B. `services` (Managed by Technicians & Admin)
* `_id` (ObjectId)
* `title` (String)
* `category` (String: `'Smartphone' | 'Laptop & PC' | 'AC' | 'Refrigerator' | 'TV' | 'Washing Machine' | 'Electrical'`)
* `description` (String)
* `image` (String, ImgBB URL)
* `basePrice` (Number)
* `estimatedDuration` (String)
* `serviceMode` (String: `'Home Visit' | 'Shop Drop-off'`)
* `serviceArea` (String)
* `technicianName` & `technicianEmail` (String)
* `approvalStatus` (String: `'pending' | 'approved' | 'rejected'`, default: `'pending'`)
* `isAvailable` (Boolean, default: `true`)
* `createdAt` (Date)

### C. `bookings` (Managed by Customers & Technicians)
* `_id` (ObjectId)
* `serviceId` (String)
* `serviceTitle`, `serviceImage`, `category` (Snapshots from service)
* `basePrice` (Number)
* `technicianName`, `technicianEmail` (String)
* `customerName`, `customerEmail`, `customerPhone` (String)
* `address` (String)
* `preferredDate` (Date)
* `problemDescription` (String)
* `status` (String: `'requested' | 'accepted' | 'rejected' | 'in-progress' | 'completed' | 'cancelled'`, default: `'requested'`)
* `finalAmount` (Number, set upon completion)
* `paymentStatus` (String: `'unpaid' | 'paid'`, default: `'unpaid'`)

### D. `payments` (Managed by Stripe Verification)
* `_id` (ObjectId)
* `bookingId` (String)
* `serviceTitle` (String)
* `customerName`, `customerEmail`, `technicianName`, `technicianEmail` (String)
* `amount` (Number)
* `currency` (String, `'usd'`)
* `transactionId` & `stripeSessionId` (String, Unique)
* `paymentStatus` (String, `'paid'`)
* `paidAt` (Date)

---

## 4. Job Status Pipeline & Business Rules
* **`requested`** ➔ Can be **`accepted`** or **`rejected`** by the technician, or **`cancelled`** by the customer. (Final branch if rejected/cancelled).
* **`accepted`** ➔ Can be moved to **`in-progress`** by the technician.
* **`in-progress`** ➔ Can be marked **`completed`** by the technician (must include `finalAmount` > 0).
* **`completed` + `unpaid`** ➔ Customer can initiate Stripe payment to transition to **`paid`**.

---

## 5. Route Structure & Access Control
* ** i will tell you 

---

## 6. Security & Middlewares Guidelines

* Frontend environment variables must be prefixed with appropriate keys ( `.env` for server secrets).

---

## 7. Design System & Animation Integration
* **UI/UX Design (`theme.md`):** Follow a classic, modern, and minimalist aesthetic. Maintain uniform card dimensions, clean neutral slates, royal blue primary buttons (`#2563EB`), and strict badge color standards across all dashboard roles.
* **Motion & Animations (`animation.md`):** Utilize `framer-motion` for page fades, staggered grid entrances, and modal popups. Apply Tailwind transitions (`transition-all duration-300`) for smooth button hover states and card elevations.
