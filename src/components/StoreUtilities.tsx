"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "../data/siteConfig.js";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LangContext";
import { Icon } from "./Icon";

export function RouteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return null;
}

export function ToastViewport() {
  const { notification, dismissNotification } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    if (!notification) return;
    const timer = window.setTimeout(dismissNotification, 3200);
    return () => window.clearTimeout(timer);
  }, [dismissNotification, notification]);

  if (!notification) return null;

  return (
    <div className="fixed inset-x-4 bottom-5 z-[80] flex justify-center sm:inset-x-auto sm:end-6 sm:w-auto">
      <div
        aria-atomic="true"
        aria-live="polite"
        className="flex min-h-12 w-full max-w-sm items-center gap-3 rounded bg-[#24231f] dark:bg-[#343129] px-4 py-2.5 text-sm text-white shadow-xl sm:w-auto"
        role="status"
      >
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white dark:bg-[#201f1b]/15 text-[#d7c28d]">
          <Icon className="size-4" name="check" />
        </span>
        <span className="flex-1">{t[notification.message]}</span>
        <button
          aria-label={t.closeMenu}
          className="grid size-9 shrink-0 place-items-center rounded hover:bg-white dark:hover:bg-[#201f1b]/10 focus-visible:outline-2 focus-visible:outline-white"
          onClick={dismissNotification}
          type="button"
        >
          <Icon className="size-4" name="close" />
        </button>
      </div>
    </div>
  );
}

export function FloatingWhatsApp() {
  const { language, t } = useLanguage();

  return (
    <a
      aria-label={t.whatsapp}
      className="fixed bottom-4 end-4 z-30 grid size-12 place-items-center rounded-full bg-[#216b4a] text-white shadow-lg transition-colors hover:bg-[#195c3e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207] sm:bottom-6 sm:end-6"
      href={`https://wa.me/${siteConfig.whatsappNumber}`}
      rel="noopener noreferrer"
      target="_blank"
      title={language === "ar" ? "واتساب" : "WhatsApp"}
    >
      <Icon className="size-[22px]" name="whatsapp" />
    </a>
  );
}
