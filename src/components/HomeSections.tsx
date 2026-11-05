import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "../data/siteConfig.js";
import type { Language } from "../context/LangContext";
import { translations } from "../i18n/translations.js";
import { formatPrice } from "../utils/formatPrice";
import { Icon } from "./Icon";

export function HeroSection({ language }: { language: Language }) {
  const t = translations[language];

  return (
    <section className="mx-auto grid w-full max-w-[1380px] items-center gap-9 px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-20">
      <div className="max-w-xl">
        <p className="inline-flex min-h-8 items-center gap-2 rounded-full border border-[#e5e0d5] dark:border-[#403d35] px-3 text-[11px] font-medium text-[#625d53] dark:text-[#c1bbaf]">
          <span className="size-1.5 rounded-full bg-[#8d6a32]" />
          {t.heroEyebrow}
        </p>
        <h1 className="mt-6 max-w-[620px] text-5xl font-medium leading-[1.04] tracking-[-0.055em] text-[#201f1c] dark:text-[#f3f0e9] text-balance sm:text-6xl lg:text-[76px] lg:leading-[1.02]">
          {t.heroTitle}
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-7 text-[#666158] dark:text-[#c1bbaf] sm:text-base sm:leading-8">
          {t.heroDescription}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-[#24231f] dark:bg-[#343129] px-5 text-sm font-medium text-white transition-colors hover:bg-[#76511e] dark:hover:bg-[#5a482d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
            href="/products"
          >
            {t.discoverCollection}
            <Icon className="size-4 rtl:rotate-180" name="arrow" />
          </Link>
          <Link
            className="inline-flex min-h-12 items-center rounded px-4 text-sm font-medium text-[#48453f] dark:text-[#e2ded6] transition-colors hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
            href="#about"
          >
            {t.about}
          </Link>
        </div>
        <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#e8e4dc] dark:border-[#403d35] pt-4 text-[11px] text-[#6f6b64] dark:text-[#c1bbaf]">
          <span className="inline-flex items-center gap-2">
            <Icon className="size-4 text-[#8b6b37] dark:text-[#d8b576]" name="check" />
            {t.qualityTitle}
          </span>
          <span className="inline-flex items-center gap-2">
            <Icon className="size-4 text-[#8b6b37] dark:text-[#d8b576]" name="check" />
            {t.whatsappTitle}
          </span>
        </div>
      </div>
<div className="relative mx-auto aspect-[4/4.2] w-full max-w-[640px] overflow-hidden bg-[#e9e4da] dark:bg-[#292821] lg:aspect-[1.1/1]">
  <Image
    alt={t.heroImageAlt}
    className="object-cover object-top"
    fill
    priority
    sizes="(max-width: 1024px) 100vw, 55vw"
    src="/data/home-section.jpeg"
  />

        <div className="absolute inset-0 bg-gradient-to-t from-[#17130d]/45 via-transparent to-transparent" />
        <p className="absolute bottom-5 start-5 max-w-[70%] text-sm font-medium leading-6 text-white sm:bottom-7 sm:start-7 sm:text-base">
          {language === "ar" ? "تفاصيل بسيطة. حضور لا يُنسى." : "Quiet details. A feeling that stays."}
        </p>
        <span className="absolute bottom-5 end-5 rounded-full bg-[#faf9f6] dark:bg-[#171714]/90 px-3 py-1.5 text-[10px] tracking-wide text-[#302b24] dark:text-[#f3f0e9] sm:bottom-7 sm:end-7">
          {siteConfig.storeName[language]}
        </span>
      </div>
    </section>
  );
}

export function OfferBanner({ language }: { language: Language }) {
  const t = translations[language];

  return (
    <section className="mx-auto w-full max-w-[1380px] px-5 py-9 sm:px-8 sm:py-12 lg:px-10">
      <div className="relative overflow-hidden bg-[#e8e3d8] dark:bg-[#292821] px-6 py-9 sm:px-10 sm:py-11 lg:px-14">
        <div className="relative z-[1] max-w-lg">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#68583c] dark:text-[#c1bbaf]">
            {t.freeShippingBanner}
          </p>
          <h2 className="mt-2 text-3xl font-medium tracking-[-0.045em] text-[#25231e] dark:text-[#f3f0e9] sm:text-4xl">
            {t.freeShippingBanner}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#625c51] dark:text-[#c1bbaf]">
            {t.freeShippingDetail.replace(
              "{amount}",
              formatPrice(siteConfig.freeShippingThreshold, language),
            )}
          </p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded border border-[#5d513c] dark:border-[#c1a66f] px-4 text-xs font-medium text-[#332f27] dark:text-[#f3f0e9] transition-colors hover:bg-[#24231f] dark:hover:bg-[#343129] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76511e]"
            href="/products"
          >
            {t.shopNow}
            <Icon className="size-4 rtl:rotate-180" name="arrow" />
          </Link>
        </div>
        <span aria-hidden="true" className="absolute -end-8 -top-20 size-64 rounded-full border border-[#c6baa4] dark:border-[#514d43] sm:-end-1 sm:size-80" />
        <span aria-hidden="true" className="absolute -end-1 -top-12 size-52 rounded-full border border-[#c6baa4] dark:border-[#514d43] sm:end-10 sm:size-64" />
        <span aria-hidden="true" className="absolute end-10 top-8 size-36 rounded-full bg-[#bca980]/40 sm:end-28 sm:top-10 sm:size-44" />
      </div>
    </section>
  );
}

export function TrustSection({ language }: { language: Language }) {
  const t = translations[language];
  const benefits = [
    { icon: "heart" as const, title: t.qualityTitle, description: t.qualityDescription },
    {
      icon: "arrow" as const,
      title: t.shippingTitle,
      description: t.shippingDescription.replace(
        "{amount}",
        formatPrice(siteConfig.freeShippingThreshold, language),
      ),
    },
    { icon: "whatsapp" as const, title: t.whatsappTitle, description: t.whatsappDescription },
  ];

  return (
    <section className="bg-[#f5f3ed] dark:bg-[#201f1b]">
      <div className="mx-auto w-full max-w-[1380px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="mb-8 max-w-lg">
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#777168] dark:text-[#c1bbaf]">
            {t.aboutEyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-medium tracking-[-0.045em] text-[#201f1c] dark:text-[#f3f0e9] sm:text-4xl">
            {t.whyTitle}
          </h2>
        </div>
        <div className="grid gap-7 sm:grid-cols-3 sm:gap-6">
          {benefits.map((benefit, index) => (
            <article
              className="border-t border-[#ddd8ce] dark:border-[#403d35] pt-5"
              key={benefit.title}
            >
              <span className="grid size-10 place-items-center rounded-full border border-[#d7d0c2] dark:border-[#403d35] text-[#72582d] dark:text-[#d8b576]">
                <Icon className="size-[18px]" name={benefit.icon} />
              </span>
              <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.1em] text-[#817a6d] dark:text-[#c1bbaf]">
                0{index + 1}
              </p>
              <h3 className="mt-1 text-base font-medium text-[#282620] dark:text-[#f3f0e9]">{benefit.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-[#67635b] dark:text-[#c1bbaf]">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection({ language }: { language: Language }) {
  const t = translations[language];
  const reviews = [
    [t.reviewOne, t.reviewOneName],
    [t.reviewTwo, t.reviewTwoName],
    [t.reviewThree, t.reviewThreeName],
  ];

  return (
    <section className="mx-auto w-full max-w-[1380px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
      <div className="mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#777168] dark:text-[#c1bbaf]">
          {t.reviewsEyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-medium tracking-[-0.045em] text-[#201f1c] dark:text-[#f3f0e9] sm:text-4xl">
          {t.reviewsTitle}
        </h2>
        <p className="mt-2 text-xs leading-5 text-[#777168] dark:text-[#c1bbaf]">{t.reviewDisclaimer}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map(([review, name]) => (
          <blockquote
            className="flex min-h-44 flex-col border border-[#e8e4dc] dark:border-[#403d35] bg-white dark:bg-[#201f1b]/60 p-5 sm:p-6"
            key={name}
          >
            <span aria-label={language === "ar" ? "٥ من ٥ نجوم" : "5 out of 5 stars"} className="text-sm tracking-[0.16em] text-[#9a7330] dark:text-[#d8b576]" role="img">
              ★★★★★
            </span>
            <p className="mt-4 flex-1 text-sm leading-6 text-[#504c45] dark:text-[#e2ded6]">“{review}”</p>
            <footer className="mt-4 text-xs font-medium text-[#37342e] dark:text-[#f3f0e9]">{name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

export function AboutSection({ language }: { language: Language }) {
  const t = translations[language];

  return (
    <section className="mx-auto grid w-full max-w-[1380px] gap-6 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-[0.8fr_1.2fr] md:gap-16 lg:px-10" id="about">
      <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#777168] dark:text-[#c1bbaf]">
        {t.aboutEyebrow}
      </p>
      <div className="max-w-2xl">
        <h2 className="text-3xl font-medium leading-tight tracking-[-0.05em] text-[#201f1c] dark:text-[#f3f0e9] sm:text-4xl">
          {t.aboutTitle}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#67635b] dark:text-[#c1bbaf] sm:text-base sm:leading-8">
          {t.aboutDescription}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span>{t.contactPrompt}</span>
          <Link className="inline-flex min-h-11 items-center gap-1 font-medium text-[#76511e] dark:text-[#d8b576] underline decoration-[#c4b28d] underline-offset-4 hover:text-[#24231f] dark:hover:text-[#f3f0e9] focus-visible:outline-2 focus-visible:outline-[#a16207]" href="#contact">
            {t.contactUs}
            <Icon className="size-4 rtl:rotate-180" name="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ContactSection({ language }: { language: Language }) {
  const t = translations[language];
  return (
    <section className="bg-[#24231f] dark:bg-[#343129]" id="contact">
      <div className="mx-auto flex w-full max-w-[1380px] flex-col justify-between gap-5 px-5 py-10 sm:flex-row sm:items-center sm:px-8 sm:py-12 lg:px-10">
        <h2 className="max-w-lg text-2xl font-medium tracking-[-0.04em] text-white sm:text-3xl">
          {t.contactPrompt}
        </h2>
        <Link
          className="inline-flex min-h-12 w-fit items-center gap-2 rounded bg-[#f5f3ed] dark:bg-[#201f1b] px-5 text-sm font-medium text-[#24231f] dark:text-[#f3f0e9] transition-colors hover:bg-[#e7dec9] dark:hover:bg-[#5a482d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          href={`https://wa.me/${siteConfig.whatsappNumber}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon className="size-[18px]" name="whatsapp" />
          {t.contactUs}
        </Link>
      </div>
    </section>
  );
}
