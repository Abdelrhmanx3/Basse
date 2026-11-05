"use client";

import Link from "next/link";
import { useLanguage } from "../context/LangContext";

export function NotFoundContent() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-5 py-16 text-center">
      <span className="font-serif text-7xl font-medium tracking-[-0.08em] text-[#a16207] dark:text-[#d8b576]">404</span>
      <h1 className="mt-4 text-2xl font-medium tracking-[-0.04em]">{t.notFoundTitle}</h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-[#68645d] dark:text-[#c1bbaf]">{t.notFoundHint}</p>
      <Link
        className="mt-7 inline-flex min-h-12 items-center rounded bg-[#24231f] dark:bg-[#343129] px-5 text-sm font-medium text-white transition-colors hover:bg-[#76511e] dark:hover:bg-[#5a482d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
        href="/"
      >
        {t.backHome}
      </Link>
    </section>
  );
}
