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
import { useRouter } from "next/navigation";
import { translations } from "../i18n/translations.js";

export type Language = "ar" | "en";

type LanguageContextValue = {
  language: Language;
  direction: "rtl" | "ltr";
  t: (typeof translations)["en"];
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "basse-language";
const listeners = new Set<() => void>();
let inMemoryLanguage: Language | null = null;

function getSavedLanguage() {
  if (inMemoryLanguage) return inMemoryLanguage;
  try {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    return savedLanguage === "ar" || savedLanguage === "en" ? savedLanguage : null;
  } catch (error) {
    console.error("Unable to read the saved language preference.", error);
    return null;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    inMemoryLanguage = null;
    for (const subscriber of listeners) subscriber();
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getServerSnapshot() {
  return null;
}

function saveLanguageCookie(language: Language) {
  try {
    document.cookie = `store-language=${language}; path=/; max-age=31536000; samesite=lax`;
  } catch (error) {
    console.error("Unable to save the server language preference.", error);
  }
}

export function LangProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage: Language;
}) {
  const router = useRouter();
  const savedLanguage = useSyncExternalStore(
    subscribe,
    getSavedLanguage,
    getServerSnapshot,
  );
  const language = savedLanguage ?? initialLanguage;
  const direction: "rtl" | "ltr" = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    if (language !== initialLanguage) {
      saveLanguageCookie(language);
      router.refresh();
    }
  }, [direction, initialLanguage, language, router]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    inMemoryLanguage = nextLanguage;
    try {
      localStorage.setItem(STORAGE_KEY, nextLanguage);
    } catch (error) {
      console.error("Unable to save the language preference.", error);
    }

    saveLanguageCookie(nextLanguage);

    for (const listener of listeners) listener();
  }, []);

  const value = useMemo(
    () => ({ language, direction, t: translations[language], setLanguage }),
    [direction, language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LangProvider.");
  return context;
}
