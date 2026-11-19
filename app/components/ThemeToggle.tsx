"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Archive state"
      className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase"
    >
      <button
        type="button"
        onClick={() => setTheme("yin")}
        aria-pressed={theme === "yin"}
        className={`transition-opacity duration-200 ${
          theme === "yin" ? "font-semibold text-foreground" : "text-archive-muted hover:text-foreground"
        }`}
      >
        Yin
      </button>
      <span aria-hidden="true" className="text-archive-muted">/</span>
      <button
        type="button"
        onClick={() => setTheme("yang")}
        aria-pressed={theme === "yang"}
        className={`transition-opacity duration-200 ${
          theme === "yang" ? "font-semibold text-foreground" : "text-archive-muted hover:text-foreground"
        }`}
      >
        Yang
      </button>
    </div>
  );
}
