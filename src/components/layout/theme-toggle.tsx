"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export const THEME_STORAGE_KEY = "fixmate-theme";

export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const nextIsDark = !root.classList.contains("dark");

    root.classList.toggle("dark", nextIsDark);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextIsDark ? "dark" : "light");
    } catch {
      // Storage can be unavailable in private browsing; the toggle still works.
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className="rounded-full"
    >
      <Sun className="hidden size-[1.1rem] dark:block" aria-hidden="true" />
      <Moon className="size-[1.1rem] dark:hidden" aria-hidden="true" />
    </Button>
  );
}
