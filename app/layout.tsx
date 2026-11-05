import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { AppProviders } from "@/src/context/CartContext";
import { Footer } from "@/src/components/Footer";
import { Navbar } from "@/src/components/Navbar";
import { FloatingWhatsApp, RouteEffects, ToastViewport } from "@/src/components/StoreUtilities";
import { siteConfig } from "@/src/data/siteConfig.js";
import { translations } from "@/src/i18n/translations.js";
import { getServerLanguage } from "@/src/utils/getServerLanguage";
import "./globals.css";

export const instant = false;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  const t = translations[language];
  const title = `${siteConfig.storeName[language]} | ${t.heroEyebrow}`;

  return {
    title,
    description: t.heroDescription,
    applicationName: siteConfig.storeName[language],
    // Tab icon: public/logo.jpeg
    icons: {
      icon: [{ url: "/logo.jpeg", type: "image/jpeg" }],
      shortcut: "/logo.jpeg",
      apple: "/logo.jpeg",
    },
    openGraph: {
      title,
      description: t.heroDescription,
      siteName: siteConfig.storeName[language],
      locale: language === "ar" ? "ar_EG" : "en_EG",
      alternateLocale: language === "ar" ? "en_EG" : "ar_EG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: t.heroDescription,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const initialLanguage = await getServerLanguage();

  return (
    <html
      lang={initialLanguage}
      dir={initialLanguage === "ar" ? "rtl" : "ltr"}
      className={`${inter.variable} ${cairo.variable} min-h-full font-sans antialiased rtl:font-arabic`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#faf9f6" />
        <script
          suppressHydrationWarning
          type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
          dangerouslySetInnerHTML={{
            __html: `(() => {
              let saved = null;
              try { saved = localStorage.getItem("theme"); } catch (error) {
                console.error("Unable to read the saved theme preference.", error);
              }
              const dark = saved === "dark" || (saved !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
              document.documentElement.classList.toggle("dark", dark);
              document.documentElement.style.colorScheme = dark ? "dark" : "light";
              document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#171714" : "#faf9f6");
            })();`,
          }}
        />
      </head>
      <body className="min-h-dvh bg-[#faf9f6] text-[#201f1c] dark:bg-[#171714] dark:text-[#f3f0e9]">
        <AppProviders initialLanguage={initialLanguage}>
          <RouteEffects />
          <Navbar />
          <main className="min-h-[50vh] outline-none" id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <FloatingWhatsApp />
          <ToastViewport />
        </AppProviders>
      </body>
    </html>
  );
}