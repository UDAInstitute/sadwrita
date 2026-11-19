"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ArchiveTheme = "yin" | "yang";

type ThemeContextValue = {
  theme: ArchiveTheme;
  toggleTheme: () => void;
  setTheme: (theme: ArchiveTheme) => void;
};

const storageKey = "sadwrita-theme";
const themeChangeEvent = "sadwrita-theme-change";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function isArchiveTheme(
  value: string | null | undefined,
): value is ArchiveTheme {
  return value === "yin" || value === "yang";
}

function getServerThemeSnapshot(): ArchiveTheme {
  return "yin";
}

function getThemeSnapshot(): ArchiveTheme {
  if (typeof document === "undefined") {
    return "yin";
  }

  const theme = document.documentElement.dataset.theme;
  return isArchiveTheme(theme) ? theme : "yin";
}

function subscribeToTheme(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== storageKey) {
      return;
    }

    const theme = isArchiveTheme(event.newValue) ? event.newValue : "yin";
    document.documentElement.dataset.theme = theme;
    onStoreChange();
  };

  window.addEventListener(themeChangeEvent, onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(themeChangeEvent, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const setTheme = useCallback((nextTheme: ArchiveTheme) => {
    document.documentElement.dataset.theme = nextTheme;

    try {
      window.localStorage.setItem(storageKey, nextTheme);
    } catch (error) {
      console.error("Unable to save SADWRITA's archive theme preference.", error);
    }

    window.dispatchEvent(new Event(themeChangeEvent));
  }, []);

  const toggleTheme = useCallback(() => {
    const currentTheme = document.documentElement.dataset.theme;
    setTheme(currentTheme === "yang" ? "yin" : "yang");
  }, [setTheme]);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }
  return context;
}
