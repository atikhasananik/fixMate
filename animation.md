# FixMate — Animation & Motion Design Guidelines (`animation.md`)

## 1. Animation Philosophy
FixMate aims for a **classic, modern, and high-performance** user experience. Animations should be subtle, purposeful, and never intrusive. They must enhance navigation flow, provide immediate micro-interaction feedback (buttons, cards, modals), and guide the user's eye smoothly through dashboard pipelines.

* **Primary Animation Library:** `framer-motion` (for React components, page reveals, modals, and staggered lists).
* **Secondary / Micro-interactions:** Tailwind CSS transition classes (`transition-all duration-300 ease-in-out`) for hover states, scale effects, and accordion toggles.
* **Rule of Thumb:** Keep durations short (`0.2s` to `0.4s`) to ensure the application feels lightning-fast.

---

## 2. Standard Motion Variants (Framer Motion)

### A. Fade In Up (Page Load / Section Entrance)
Used for heroes, feature grids, and dashboard cards to create a smooth entrance from bottom to top.
```javascript
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: "easeOut" } 
  }
};