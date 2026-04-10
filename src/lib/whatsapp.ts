export function shareViaWhatsApp(text: string) {
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
}

export function shareInvoiceWhatsApp(invoiceNumber: string, customer: string, amount: number, dueDate: string) {
  const message = `📄 Invoice ${invoiceNumber}\n👤 Customer: ${customer}\n💰 Amount: $${amount.toFixed(2)}\n📅 Due: ${dueDate}\n\nSent from AccuBooks`;
  shareViaWhatsApp(message);
}
