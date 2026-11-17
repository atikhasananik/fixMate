# FixMate — UI/UX Design & Theme Guidelines (`theme.md`)

## 1. Design Philosophy: Classic, Modern & Minimalistic
FixMate’s visual identity merges **clean corporate minimalism** with **modern dark-obsidian and clean-glass aesthetics**. The goal is to inspire absolute trust for high-value home and device repairs while maintaining a frictionless user experience for customers, technicians, and administrators.

* **Avoid:** Cluttered layouts, harsh neon gradients, or generic templates ("gobindo design").
* **Embrace:** Generous whitespace, razor-sharp alignment, subtle glassmorphism (`backdrop-blur-md`), and consistent card heights.

---

## 2. Color Palette
The color system relies on a neutral slate foundation paired with semantic status indicators.

### A. Core Neutrals & Surfaces
* **Background (Light):** `#F8FAFC` (Slate 50) / Pure White (`#FFFFFF`) for cards.
* **Background (Dark / Obsidian Mode):** `#0F172A` (Slate 900) with cards in `#1E293B` (Slate 800).
* **Text Primary:** `#0F172A` (Light mode) | `#F8FAFC` (Dark mode).
* **Text Muted:** `#64748B` (Slate 500).

### B. Brand Accent (Trust & Reliability)
* **Primary Brand (Action / Buttons / Active States):** `#2563EB` (Royal Blue / Tailwind `blue-600`)
* **Primary Hover:** `#1D4ED8` (`blue-700`)
* **Secondary Accent:** `#0EA5E9` (Sky Blue / Cyan accent for tech highlights)

### C. Status Badge Colors (Strictly Consistent Across All Dashboards)
* **Requested:** Blue (`bg-blue-100 text-blue-700 border-blue-200`)
* **Accepted:** Indigo (`bg-indigo-100 text-indigo-700 border-indigo-200`)
* **In Progress:** Amber / Warning (`bg-amber-100 text-amber-700 border-amber-200`)
* **Completed:** Green / Success (`bg-emerald-100 text-emerald-700 border-emerald-200`)
* **Paid:** Teal (`bg-teal-100 text-teal-700 border-teal-200`)
* **Rejected / Cancelled:** Red / Gray (`bg-rose-100 text-rose-700 border-rose-200`)

---

## 3. Typography & Headings
* **Font Family:** Inter, Plus Jakarta Sans, or Geist (Clean sans-serif with excellent legibility).
* **Hierarchy Guidelines:**
  * **Main Headings (H1):** Bold, tracking-tight, consistent font scale across public and dashboard landing pages.
  * **Subheadings (H2, H3):** Medium-weight, balanced line-height (`leading-relaxed`).
  * **Body Text:** Balanced paragraph spacing (`mb-4` or `space-y-2`), optimized for quick scannability.

---

## 4. Cards & Component Styling
* **Service Cards & Stats Cards:** 
  * Strict equal height and width in grid views (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
  * Border: `border border-slate-200 dark:border-slate-700`
  * Shadow: `shadow-sm hover:shadow-md transition-all duration-300`
  * Rounded Corners: `rounded-xl` or `rounded-2xl`
* **Images:** Uniform aspect ratios (`aspect-video` or `h-48 object-cover`) for all service banners and user avatars.
* **Buttons:** Consistent padding (`px-4 py-2.5 rounded-xl font-medium`), unified style matching the home page CTA.

---

## 5. Navigation & Layout Structure
* **Navbar:** Sticky top, backdrop blur effect, clean logo with a tool/wrench icon, smooth responsive collapse into a mobile hamburger menu.
* **Footer:** Modern multi-column layout, FixMate branding, concise tagline, legal/quick links, and official **X logo** (replacing the old Twitter bird).
* **Dashboard Layout:** Full-width responsive workspace featuring a collapsible sidebar, clean top bar with avatar profile dropdown, and reusable analytics stats cards.