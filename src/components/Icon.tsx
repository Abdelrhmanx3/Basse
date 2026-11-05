import type { ReactNode } from "react";

type IconName =
  | "bag"
  | "heart"
  | "menu"
  | "close"
  | "arrow"
  | "external"
  | "search"
  | "minus"
  | "plus"
  | "trash"
  | "whatsapp"
  | "check"
  | "sun"
  | "moon"
  | "monitor";

export function Icon({
  name,
  className = "size-5",
}: {
  name: IconName;
  className?: string;
}) {
  const paths: Record<IconName, ReactNode> = {
    bag: (
      <>
        <path d="M5 7.5h14l-1 13H6l-1-13Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
    heart: (
      <path d="M20.8 8.6c0 4.2-8.8 10-8.8 10S3.2 12.8 3.2 8.6A4.1 4.1 0 0 1 11 6.5a4.1 4.1 0 0 1 7.8 2.1Z" />
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    external: <path d="M7 17 17 7M8 7h9v9" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 4 4" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    plus: <path d="M12 5v14m-7-7h14" />,
    trash: (
      <>
        <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M20 11.5a8.4 8.4 0 0 1-12.4 7.4L4 20l1.2-3.5A8.4 8.4 0 1 1 20 11.5Z" />
        <path d="M8.5 8.5c.4 2.5 2.3 4.4 4.8 4.9l1.1-1.2 2 .9c.2.1.3.3.2.5-.3 1.2-1.3 1.8-2.5 1.6-3.8-.7-6.6-3.5-7.2-7.3-.2-1.2.4-2.2 1.5-2.5.3-.1.5 0 .6.2l.9 2-1.4.9Z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
      </>
    ),
    moon: <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />,
    monitor: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8m-4-4v4" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}
