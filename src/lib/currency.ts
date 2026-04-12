import i18n from "@/i18n";

export function formatCurrency(amount: number): string {
  const lang = i18n.language;
  const symbol = lang === "ar" ? "ج.م" : "EGP";
  const formatted = amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return lang === "ar" ? `${formatted} ${symbol}` : `${symbol} ${formatted}`;
}

export function currencySymbol(): string {
  return i18n.language === "ar" ? "ج.م" : "EGP";
}
