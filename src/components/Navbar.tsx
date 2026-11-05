"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LangContext";
import { siteConfig } from "../data/siteConfig.js";
import { CartDrawer } from "./CartDrawer";
import { Icon } from "./Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCart();
  const { language, t } = useLanguage();
  const aboutHref = "/#about";
  const contactHref = "/#contact";

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a
        className="fixed start-3 top-3 z-[70] -translate-y-24 rounded bg-[#201f1c] px-4 py-3 text-sm text-white focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
        href="#main-content"
      >
        {language === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}
      </a>
      <header className="sticky top-0 z-40 border-b border-[#e9e6df] dark:border-[#403d35] bg-[#faf9f6] dark:bg-[#171714]/95 backdrop-blur">
        <div className="mx-auto flex min-h-[72px] w-full max-w-[1380px] items-center justify-between gap-2 px-4 sm:px-6 lg:min-h-[80px] lg:px-10">
          <Link
            aria-label={`${siteConfig.storeName[language]} — ${t.home}`}
            className="flex min-h-11 shrink-0 items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a16207]"
            href="/"
            onClick={closeMenu}
          >
            <span className="grid size-9 place-items-center rounded-full bg-[#24231f] dark:bg-[#343129] font-serif text-lg font-semibold tracking-[-0.08em] text-white">
              B
            </span>
            <span className="text-[15px] font-semibold tracking-[0.14em]">
              {siteConfig.storeName[language]}
            </span>
          </Link>

          <nav aria-label={language === "ar" ? "التنقل الرئيسي" : "Main navigation"} className="hidden items-center gap-8 text-[13px] font-medium lg:flex">
            <Link className="min-h-11 content-center transition-colors hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-[#a16207]" href="/" onClick={closeMenu}>
              {t.home}
            </Link>
            <Link className="min-h-11 content-center transition-colors hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-[#a16207]" href="/products" onClick={closeMenu}>
              {t.products}
            </Link>
            <Link className="min-h-11 content-center transition-colors hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-[#a16207]" href={aboutHref} onClick={closeMenu}>
              {t.about}
            </Link>
            <Link className="min-h-11 content-center transition-colors hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-[#a16207]" href={contactHref} onClick={closeMenu}>
              {t.contact}
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Link
              aria-label={t.wishlist}
              className="grid size-11 place-items-center rounded-full transition-colors hover:bg-[#efede7] dark:hover:bg-[#343129] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#a16207]"
              href="/products?favorites=1"
              title={t.wishlist}
            >
              <Icon className="size-[19px]" name="heart" />
            </Link>
            <button
              aria-label={`${t.cart}: ${itemCount}`}
              className="relative grid size-11 place-items-center rounded-full transition-colors hover:bg-[#efede7] dark:hover:bg-[#343129] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#a16207]"
              onClick={() => setCartOpen(true)}
              type="button"
            >
              <Icon className="size-[19px]" name="bag" />
              {itemCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute end-0 top-0 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-[#a16207] px-1 text-[10px] font-medium leading-none text-white"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
            <button
              aria-controls="mobile-navigation"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t.closeMenu : t.menu}
              className="grid size-11 place-items-center rounded-full transition-colors hover:bg-[#efede7] dark:hover:bg-[#343129] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#a16207] lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              <Icon className="size-[20px]" name={menuOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            className="border-t border-[#e9e6df] dark:border-[#403d35] bg-[#faf9f6] dark:bg-[#171714] px-4 py-3 sm:px-6 lg:hidden"
            id="mobile-navigation"
          >
            <nav
              aria-label={language === "ar" ? "التنقل الرئيسي" : "Main navigation"}
              className="mx-auto flex max-w-[1380px] flex-col divide-y divide-[#eeece6] dark:divide-[#403d35]"
            >
              {[
                [t.home, "/"],
                [t.products, "/products"],
                [t.about, aboutHref],
                [t.contact, contactHref],
              ].map(([label, href]) => (
                <Link
                  className="flex min-h-12 items-center text-sm font-medium hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-[#a16207]"
                  href={href}
                  key={href}
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              ))}
              <div className="flex min-h-14 items-center justify-between gap-4">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
