# FixMate — Solid Color Palette & Token System (`colorpalette.md`)

## 1. Preferred Core Theme: Royal Trust & Crisp Slate
For a repair and service marketplace, **Royal Blue** paired with **Solid Slate Neutrals** is the optimal choice. It communicates technical precision, reliability, and high-trust professionalism without visual clutter.

---

## 2. Solid Brand & Accent Colors
| Token Name | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `#2563EB` | `bg-blue-600` | Main CTA buttons, active links, brand logo icon |
| **Primary Hover** | `#1D4ED8` | `hover:bg-blue-700` | Hover state for primary buttons |
| **Primary Soft** | `#EFF6FF` | `bg-blue-50` | Subtle highlights, active sidebar background |
| **Secondary Accent** | `#0F172A` | `bg-slate-900` | Secondary dark pill buttons, strong badges |
| **Secondary Hover** | `#1E293B` | `hover:bg-slate-800` | Hover state for dark buttons |

---

## 3. Solid Surface & Neutral Colors

### Light Mode (Clean & Classic)
| Token Name | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Page Canvas** | `#F4F8FC` | `bg-background` | Main page background |
| **Card Surface** | `#FFFFFF` | `bg-white` | Service cards, dashboard widgets, modals |
| **Subtle Border** | `#DCE6F1` | `border-border` | Card outlines, table dividers, inputs |
| **Text Primary** | `#172033` | `text-foreground` | Main headings, titles, key numbers |
| **Text Secondary** | `#536176` | `text-muted-foreground` | Body copy, descriptions, captions |
| **Text Muted** | `#536176` | `text-muted-foreground` | Timestamps, placeholders |

### Dark Mode (Modern Obsidian)
| Token Name | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Page Canvas** | `#0B1120` | `bg-background` | Main dark page background |
| **Card Surface** | `#111827` | `bg-card` | Dark mode cards, sidebar, topbar |
| **Subtle Border** | `rgba(255,255,255,0.10)` | `border-border` | Dark mode borders and dividers |
| **Text Primary** | `#F8FAFC` | `text-slate-50` | Main headings in dark mode |
| **Text Secondary** | `#A4B1C4` | `text-muted-foreground` | Body descriptions in dark mode |

---

## 4. Semantic Job Status Colors (Consistent Across All Dashboards)
Every booking and approval badge must strictly follow these solid semantic pairs:

* **Requested / Pending:** 
  * Background: `#DBEAFE` (`bg-blue-100`) | Text: `#1D4ED8` (`text-blue-700`) | Border: `#BFDBFE` (`border-blue-200`)
* **Accepted:** 
  * Background: `#E0E7FF` (`bg-indigo-100`) | Text: `#4338CA` (`text-indigo-700`) | Border: `#C7D2FE` (`border-indigo-200`)
* **In Progress:** 
  * Background: `#FEF3C7` (`bg-amber-100`) | Text: `#B45309` (`text-amber-700`) | Border: `#FDE68A` (`border-amber-200`)
* **Completed / Approved:** 
  * Background: `#D1FAE5` (`bg-emerald-100`) | Text: `#047857` (`text-emerald-700`) | Border: `#A7F3D0` (`border-emerald-200`)
* **Paid:** 
  * Background: `#CCFBF1` (`bg-teal-100`) | Text: `#0F766E` (`text-teal-700`) | Border: `#99F6E4` (`border-teal-200`)
* **Rejected / Cancelled / Unpaid:** 
  * Background: `#FFE4E6` (`bg-rose-100`) | Text: `#BE123C` (`text-rose-700`) | Border: `#FECDD3` (`border-rose-200`)

---

## 5. CSS Custom Variables (Ready for `globals.css`)
```css
:root {
  --bg-canvas: #F8FAFC;
  --bg-card: #FFFFFF;
  --border-subtle: #E2E8F0;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --brand-primary: #2563EB;
  --brand-hover: #1D4ED8;
}

.dark {
  --bg-canvas: #0B1120;
  --bg-card: #111827;
  --border-subtle: #1F2937;
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --brand-primary: #3B82F6;
  --brand-hover: #2563EB;
}