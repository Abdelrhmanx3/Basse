"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useLanguage } from "../context/LangContext";
import { useTheme } from "../context/ThemeContext";
import { Icon } from "./Icon";

const themeOptions = [
  { value: "light", icon: "sun", label: { en: "Light", ar: "فاتح" } },
  { value: "dark", icon: "moon", label: { en: "Dark", ar: "داكن" } },
  { value: "system", icon: "monitor", label: { en: "System", ar: "النظام" } },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = themeOptions.find((option) => option.value === theme) ?? themeOptions[2];

  // Close when clicking or tabbing outside the menu.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onFocusIn = (event: FocusEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open]);

  // Move focus to the selected item when the menu opens.
  useEffect(() => {
    if (!open) return;
    const index = themeOptions.findIndex((option) => option.value === theme);
    itemRefs.current[index >= 0 ? index : 0]?.focus();
  }, [open, theme]);

  const closeAndFocusTrigger = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const index = items.indexOf(document.activeElement as HTMLButtonElement);

    if (event.key === "Escape") {
      event.preventDefault();
      closeAndFocusTrigger();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(index + 1) % items.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1]?.focus();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${t.theme}: ${current.label[language]}`}
        className="grid size-11 place-items-center rounded-full text-[#48453f] transition-colors hover:bg-[#efede7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207] dark:text-[#e2ded6] dark:hover:bg-[#343129]"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onTriggerKeyDown}
        ref={triggerRef}
        type="button"
      >
        <Icon className="size-[18px]" name={current.icon} />
      </button>

      {open && (
        <div
          aria-label={t.theme}
          className="absolute end-0 top-full z-50 mt-2 w-44 overflow-hidden rounded border border-[#e8e4dc] bg-white py-1 shadow-lg dark:border-[#403d35] dark:bg-[#201f1b]"
          onKeyDown={onMenuKeyDown}
          role="menu"
        >
          {themeOptions.map((option, index) => {
            const selected = theme === option.value;
            return (
              <button
                aria-checked={selected}
                className={`flex min-h-11 w-full items-center gap-3 px-3 text-start text-sm transition-colors hover:bg-[#f5f3ed] focus-visible:bg-[#f5f3ed] focus-visible:outline-none dark:hover:bg-[#292821] dark:focus-visible:bg-[#292821] ${
                  selected
                    ? "font-medium text-[#76511e] dark:text-[#d8b576]"
                    : "text-[#48453f] dark:text-[#e2ded6]"
                }`}
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  closeAndFocusTrigger();
                }}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                role="menuitemradio"
                tabIndex={-1}
                type="button"
              >
                <Icon className="size-[18px] shrink-0" name={option.icon} />
                <span className="flex-1">{option.label[language]}</span>
                {selected && <Icon className="size-4 shrink-0" name="check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}