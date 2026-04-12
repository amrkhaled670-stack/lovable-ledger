export function shareViaWhatsApp(text: string) {
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
}

export function shareInvoiceWhatsApp(invoiceNumber: string, customer: string, amount: number, dueDate: string) {
  const formatted = amount.toLocaleString("en-US", { minimumFractionDigits: 2 });
  const message = `📄 Invoice ${invoiceNumber}\n👤 Customer: ${customer}\n💰 Amount: EGP ${formatted}\n📅 Due: ${dueDate}\n\nSent from AccuBooks`;
  shareViaWhatsApp(message);
}
