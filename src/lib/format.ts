import { format, parseISO } from "date-fns";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Single place to change the display currency once Stripe is configured. */
export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

/**
 * Formats money in the record's own currency and keeps cents, e.g. `$55.50`.
 * Falls back to the site-wide USD formatter when the code is unknown.
 */
export function formatMoney(amount: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return formatCurrency(amount);
  }
}

export function formatDate(value: string) {
  try {
    return format(parseISO(value), "MMM d, yyyy");
  } catch {
    return value;
  }
}
