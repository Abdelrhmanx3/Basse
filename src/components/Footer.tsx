"use client";

import Link from "next/link";
import { siteConfig } from "../data/siteConfig.js";
import { useLanguage } from "../context/LangContext";
import { Icon } from "./Icon";

export function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="border-t border-[#e9e6df] dark:border-[#403d35] bg-[#f5f3ed] dark:bg-[#201f1b]">
      <div className="mx-auto grid w-full max-w-[1380px] gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.3fr_0.8fr_1fr] md:gap-12 md:px-10 md:py-14">
        <div>
          <Link
            className="inline-flex min-h-11 items-center rounded-sm text-lg font-semibold tracking-[0.15em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a16207]"
            href="/"
          >
            {siteConfig.storeName[language]}
          </Link>
          <p className="mt-2 max-w-xs text-sm leading-6 text-[#68655e] dark:text-[#c1bbaf]">{t.footerLine}</p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#504c45] dark:text-[#e2ded6]">
            {t.quickLinks}
          </h2>
          <nav aria-label={t.quickLinks} className="mt-3 flex flex-col items-start">
            <Link className="min-h-10 content-center text-sm text-[#68655e] dark:text-[#c1bbaf] hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-[#a16207]" href="/products">
              {t.products}
            </Link>
            <Link className="min-h-10 content-center text-sm text-[#68655e] dark:text-[#c1bbaf] hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-[#a16207]" href="/#about">
              {t.about}
            </Link>
            <Link className="min-h-10 content-center text-sm text-[#68655e] dark:text-[#c1bbaf] hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-[#a16207]" href="/#contact">
              {t.contact}
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#504c45] dark:text-[#e2ded6]">
            {t.help}
          </h2>
          <div className="mt-3 flex flex-col items-start">
            <a
              className="inline-flex min-h-11 items-center gap-2 text-sm text-[#68655e] dark:text-[#c1bbaf] hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-[#a16207]"
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon className="size-4" name="whatsapp" />
              {t.whatsapp}
            </a>
            <a
              className="inline-flex min-h-11 items-center text-sm text-[#68655e] dark:text-[#c1bbaf] hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-[#a16207]"
              href="https://www.instagram.com/_basee_?obrf=ZXgzaDUzb2p2NTdj"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t.instagram}
              <Icon className="ms-1 size-4" name="external" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-[#e6e3dc] dark:border-[#403d35]">
        <p className="mx-auto w-full max-w-[1380px] px-5 py-4 text-xs text-[#6b675f] dark:text-[#c1bbaf] sm:px-8 md:px-10">
          © {new Date().getFullYear()} {siteConfig.storeName[language]}. {t.allRights}
        </p>
      </div>
    </footer>
  );
}
