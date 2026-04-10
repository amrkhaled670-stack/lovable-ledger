import jsPDF from "jspdf";
import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => jsPDF;
  }
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customer: string;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  companyName?: string;
}

export function generateInvoicePDF(data: InvoiceData) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.text(data.companyName || "AccuBooks", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("INVOICE", 14, 30);

  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(`Invoice #: ${data.invoiceNumber}`, 140, 22);
  doc.text(`Date: ${data.date}`, 140, 28);
  doc.text(`Due: ${data.dueDate}`, 140, 34);

  doc.setFontSize(11);
  doc.text("Bill To:", 14, 45);
  doc.setFontSize(10);
  doc.text(data.customer, 14, 51);

  doc.autoTable({
    startY: 60,
    head: [["Description", "Qty", "Unit Price", "Total"]],
    body: data.items.map((item) => [
      item.description,
      item.quantity.toString(),
      `$${item.unitPrice.toFixed(2)}`,
      `$${item.total.toFixed(2)}`,
    ]),
    theme: "striped",
    headStyles: { fillColor: [30, 64, 175], textColor: 255 },
    styles: { fontSize: 9 },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  doc.text(`Subtotal: $${data.subtotal.toFixed(2)}`, 140, finalY);
  doc.text(`Tax (${data.taxRate}%): $${data.taxAmount.toFixed(2)}`, 140, finalY + 6);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: $${data.total.toFixed(2)}`, 140, finalY + 14);

  doc.save(`${data.invoiceNumber}.pdf`);
}

export function generateReportPDF(title: string, headers: string[], rows: string[][], companyName?: string) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.text(companyName || "AccuBooks", 14, 20);

  doc.setFontSize(14);
  doc.text(title, 14, 30);

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 37);

  doc.autoTable({
    startY: 44,
    head: [headers],
    body: rows,
    theme: "grid",
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontSize: 9 },
    styles: { fontSize: 8 },
  });

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}
