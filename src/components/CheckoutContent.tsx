"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LangContext";
import { useProducts } from "../context/ProductsContext";
import { siteConfig } from "../data/siteConfig.js";
import { buildWhatsAppInvoice } from "../utils/buildWhatsAppInvoice";
import { formatPrice } from "../utils/formatPrice";
import { validateCheckout, type CheckoutFields } from "../utils/validators";
import { Icon } from "./Icon";
import { OrderSummary } from "./OrderSummary";
import { ProductLoadError } from "./ProductsStates";

type FieldName = keyof CheckoutFields;
type FieldErrors = Partial<Record<FieldName, "required" | "phone">>;

const emptyFields: CheckoutFields = {
  fullName: "",
  phone1: "",
  phone2: "",
  governorate: "",
  city: "",
  address: "",
};

export function CheckoutContent() {
  const { items, isHydrated, clearCart } = useCart();
  const { language, t } = useLanguage();
  const { products, error: productsError, retry } = useProducts();
  const pathname = usePathname();
  const [fields, setFields] = useState<CheckoutFields>(emptyFields);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<"validation" | "whatsapp" | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const errorMessage = (kind: "required" | "phone") =>
    kind === "phone" ? t.invalidPhone : t.required;

  // Clears the form, the errors and the success screen (invoice + order number).
  const resetCheckout = useCallback(() => {
    setFields(emptyFields);
    setNotes("");
    setErrors({});
    setFormError(null);
    setOrderNumber(null);
  }, []);

  // Fresh page every time you arrive, and everything is cleared when you leave.
  useEffect(() => {
    resetCheckout();
    return resetCheckout;
  }, [pathname, resetCheckout]);

  // Also reset when the browser restores this page with the Back/Forward button.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) resetCheckout();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [resetCheckout]);

  if (productsError) {
    return (
      <div className="mx-auto w-full max-w-[1380px] px-5 py-12 sm:px-8 lg:px-10">
        <ProductLoadError language={language} onRetry={retry} />
      </div>
    );
  }

  const updateField = (field: FieldName, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  };

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length) return;

    const nextErrors = validateCheckout(fields);
    // City and governorate inputs were removed, so never block the order on them.
    delete nextErrors.governorate;
    delete nextErrors.city;
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError("validation");
      requestAnimationFrame(() => {
        document.getElementById(Object.keys(nextErrors)[0])?.focus();
      });
      return;
    }

    const invoice = buildWhatsAppInvoice(items, { ...fields, notes }, language, products);
    const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(invoice.message)}`;
    const whatsappWindow = window.open(whatsappUrl, "_blank");
    if (!whatsappWindow) {
      setFormError("whatsapp");
      return;
    }

    whatsappWindow.opener = null;
    clearCart();
    setOrderNumber(invoice.orderNumber);
  };

  if (!isHydrated) {
    return (
      <div aria-busy="true" className="mx-auto min-h-[60vh] w-full max-w-[1380px] px-5 py-12 sm:px-8 lg:px-10">
        <div className="h-8 w-48 animate-pulse bg-[#e9e6df] dark:bg-[#343129]" />
        <div className="mt-8 h-64 animate-pulse bg-[#efede7] dark:bg-[#292821]" />
        <span className="sr-only">{t.checkoutTitle}</span>
      </div>
    );
  }

  if (orderNumber) {
    return (
      <section
        aria-live="polite"
        className="mx-auto flex min-h-[65vh] w-full max-w-2xl flex-col items-center justify-center px-5 py-16 text-center"
        role="status"
      >
        <span className="grid size-16 place-items-center rounded-full bg-[#e8eee4] text-[#316947] dark:text-[#9bd2ae]">
          <Icon className="size-7" name="check" />
        </span>
        <h1 className="mt-6 text-3xl font-medium tracking-[-0.05em]">{t.orderSent}</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-[#68645d] dark:text-[#c1bbaf]">{t.orderSentHint}</p>
        <p className="mt-5 rounded bg-[#f1efe9] dark:bg-[#292821] px-4 py-2 text-xs text-[#5d594f] dark:text-[#d3cec4]">
          {t.orderNumber}: <span className="font-semibold tabular-nums">{orderNumber}</span>
        </p>
        <Link
          className="mt-7 inline-flex min-h-12 items-center gap-2 rounded bg-[#24231f] dark:bg-[#343129] px-5 text-sm font-medium text-white transition-colors hover:bg-[#76511e] dark:hover:bg-[#5a482d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
          href="/products"
          onClick={resetCheckout}
        >
          {t.startOver}
          <Icon className="size-4 rtl:rotate-180" name="arrow" />
        </Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center px-5 py-16 text-center">
        <h1 className="text-2xl font-medium tracking-[-0.04em]">{t.continueToCheckout}</h1>
        <Link
          className="mt-6 inline-flex min-h-12 items-center rounded bg-[#24231f] dark:bg-[#343129] px-5 text-sm font-medium text-white transition-colors hover:bg-[#76511e] dark:hover:bg-[#5a482d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
          href="/products"
        >
          {t.continueShopping}
        </Link>
      </section>
    );
  }

  const inputClass =
    "min-h-12 w-full rounded-sm border border-[#dcd8cf] dark:border-[#403d35] bg-white dark:bg-[#201f1b] px-3 text-sm text-[#25231f] dark:text-[#f3f0e9] placeholder:text-[#6b675f] dark:placeholder:text-[#9b9589] focus:border-[#76511e] focus:outline-2 focus:outline-offset-1 focus:outline-[#a16207]";

  return (
    <div className="mx-auto w-full max-w-[1380px] px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
      <div className="mb-8 border-b border-[#e9e6df] dark:border-[#403d35] pb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777168] dark:text-[#c1bbaf]">{t.checkout}</p>
        <h1 className="mt-2 text-3xl font-medium tracking-[-0.05em] sm:text-4xl">{t.checkoutTitle}</h1>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <form className="min-w-0" id="checkout-details" noValidate onSubmit={submitOrder}>
          <h2 className="text-lg font-medium">{t.contactDetails}</h2>
          {formError && (
            <p className="mt-4 rounded border border-[#e3c9c5] dark:border-[#613b35] bg-[#fff8f6] dark:bg-[#3b2420] px-4 py-3 text-sm text-[#8b2f26] dark:text-[#f3b1a7]" role="alert">
              {formError === "validation" ? t.checkoutError : t.somethingWentWrong}
            </p>
          )}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium" htmlFor="fullName">{t.fullName} *</label>
              <input
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                aria-invalid={Boolean(errors.fullName)}
                autoComplete="name"
                className={inputClass}
                id="fullName"
                name="name"
                onChange={(event) => updateField("fullName", event.target.value)}
                placeholder={t.fullNamePlaceholder}
                required
                value={fields.fullName}
              />
              {errors.fullName && <p className="mt-1 text-xs text-[#a22c25] dark:text-[#f3b1a7]" id="fullName-error">{errorMessage(errors.fullName)}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="phone1">{t.phone1} *</label>
              <input
                aria-describedby={errors.phone1 ? "phone1-error" : undefined}
                aria-invalid={Boolean(errors.phone1)}
                autoComplete="tel"
                className={inputClass}
                id="phone1"
                inputMode="numeric"
                maxLength={11}
                name="tel"
                onChange={(event) => updateField("phone1", event.target.value)}
                placeholder={t.phonePlaceholder}
                required
                type="tel"
                value={fields.phone1}
              />
              {errors.phone1 && <p className="mt-1 text-xs text-[#a22c25] dark:text-[#f3b1a7]" id="phone1-error">{errorMessage(errors.phone1)}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="phone2">{t.phone2} *</label>
              <input
                aria-describedby={errors.phone2 ? "phone2-error" : undefined}
                aria-invalid={Boolean(errors.phone2)}
                autoComplete="tel"
                className={inputClass}
                id="phone2"
                inputMode="numeric"
                maxLength={11}
                name="tel-secondary"
                onChange={(event) => updateField("phone2", event.target.value)}
                placeholder={t.phonePlaceholder}
                required
                type="tel"
                value={fields.phone2}
              />
              {errors.phone2 && <p className="mt-1 text-xs text-[#a22c25] dark:text-[#f3b1a7]" id="phone2-error">{errorMessage(errors.phone2)}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium" htmlFor="address">{t.detailedAddress} *</label>
              <textarea
                aria-describedby={errors.address ? "address-error" : undefined}
                aria-invalid={Boolean(errors.address)}
                autoComplete="street-address"
                className={`${inputClass} min-h-24 py-3`}
                id="address"
                name="street-address"
                onChange={(event) => updateField("address", event.target.value)}
                placeholder={t.addressPlaceholder}
                required
                rows={3}
                value={fields.address}
              />
              {errors.address && <p className="mt-1 text-xs text-[#a22c25] dark:text-[#f3b1a7]" id="address-error">{errorMessage(errors.address)}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium" htmlFor="notes">{t.notes}</label>
              <textarea
                className={`${inputClass} min-h-20 py-3`}
                id="notes"
                maxLength={500}
                name="notes"
                onChange={(event) => setNotes(event.target.value)}
                placeholder={t.notesPlaceholder}
                rows={2}
                value={notes}
              />
            </div>
          </div>
        </form>

        <aside className="lg:sticky lg:top-28">
          <div className="border border-[#e8e4dc] dark:border-[#403d35] bg-white dark:bg-[#201f1b] p-5 sm:p-6">
            <h2 className="text-lg font-medium tracking-[-0.03em]">{t.orderSummary}</h2>
            <div className="mt-3 divide-y divide-[#eeece6] dark:divide-[#403d35]">
              {items.map((item) => {
                const product = products.find((entry) => entry.id === item.productId);
                if (!product) return null;
                return (
                  <article className="flex items-center gap-3 py-3" key={item.lineId}>
                    <div
                      aria-hidden="true"
                      className="size-3 shrink-0 rounded-full border border-black/15"
                      style={{ backgroundColor: item.color.hex }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-medium leading-5">
                        {item.quantity} × {product.name[language]}
                      </p>
                      <p className="text-[11px] text-[#6b675f] dark:text-[#c1bbaf]">
                        {t.size}: {item.size} · {item.color.name[language]}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs tabular-nums">
                      {formatPrice(item.quantity * product.price, language)}
                    </span>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="mt-4">
            <OrderSummary governorate={fields.governorate} items={items} />
          </div>
          <button
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#24231f] dark:bg-[#343129] px-5 text-sm font-medium text-white transition-colors hover:bg-[#76511e] dark:hover:bg-[#5a482d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
            form="checkout-details"
            type="submit"
          >
            <Icon className="size-[18px]" name="whatsapp" />
            {t.sendWhatsApp}
          </button>
          <Link
            className="mt-2 inline-flex min-h-11 items-center text-xs text-[#6b675f] dark:text-[#c1bbaf] underline underline-offset-4 hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-[#a16207]"
            href="/cart"
          >
            {t.cartTitle}
          </Link>
        </aside>
      </div>
    </div>
  );
}