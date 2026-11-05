"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
type ResolvedTheme = Exclude<Theme, "system">;

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "theme";
const themeListeners = new Set<() => void>();
let inMemoryTheme: Theme | null = null;

function getThemeSnapshot(): Theme {
  if (inMemoryTheme !== null) return inMemoryTheme;
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    return savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : "system";
  } catch (error) {
    console.error("Unable to read the saved theme preference.", error);
    return "system";
  }
}

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    inMemoryTheme = null;
    for (const subscriber of themeListeners) subscriber();
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getServerThemeSnapshot(): Theme {
  return "system";
}

function getSystemSnapshot(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getServerSystemSnapshot(): ResolvedTheme {
  return typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

function subscribeToSystem(listener: () => void) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", listener);
  return () => mediaQuery.removeEventListener("change", listener);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const systemTheme = useSyncExternalStore(
    theme === "system" ? subscribeToSystem : () => () => {},
    getSystemSnapshot,
    getServerSystemSnapshot,
  );
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", resolvedTheme === "dark" ? "#171714" : "#faf9f6");
  }, [resolvedTheme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    inMemoryTheme = nextTheme;
    try {
      if (nextTheme === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch (error) {
      console.error("Unable to save the theme preference.", error);
    }

    for (const listener of themeListeners) listener();
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [resolvedTheme, setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider.");
  return context;
}
