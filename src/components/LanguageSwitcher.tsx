"use client";

import { useLanguage } from "../context/LangContext";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      aria-label={t.language}
      className="flex min-h-11 items-center gap-1 text-xs font-medium"
      role="group"
    >
      <button
        aria-pressed={language === "ar"}
        className={`min-h-11 min-w-10 rounded px-2 transition-colors hover:bg-[#f0eee8] dark:hover:bg-[#343129] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207] ${language === "ar" ? "text-[#76511e] dark:text-[#d8b576]" : "text-[#73706a] dark:text-[#c1bbaf]"}`}
        lang="ar"
        onClick={() => setLanguage("ar")}
        type="button"
      >
        AR
      </button>
      <span aria-hidden="true" className="text-[#c8c3b9]">|</span>
      <button
        aria-pressed={language === "en"}
        className={`min-h-11 min-w-10 rounded px-2 transition-colors hover:bg-[#f0eee8] dark:hover:bg-[#343129] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207] ${language === "en" ? "text-[#76511e] dark:text-[#d8b576]" : "text-[#73706a] dark:text-[#c1bbaf]"}`}
        lang="en"
        onClick={() => setLanguage("en")}
        type="button"
      >
        EN
      </button>
    </div>
  );
}
