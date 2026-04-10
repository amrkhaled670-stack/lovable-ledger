import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartFilters } from "@/components/SmartFilters";
import { useTranslation } from "react-i18next";
import { Plus, Eye, FileDown, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { generateInvoicePDF } from "@/lib/pdf";
import { shareInvoiceWhatsApp } from "@/lib/whatsapp";

const invoices = [
  { id: "INV-001", customer: "Acme Corporation", date: "2026-04-01", due: "2026-04-30", amount: 12500.00, status: "Paid" },
  { id: "INV-002", customer: "TechStart Inc.", date: "2026-04-03", due: "2026-05-03", amount: 8750.00, status: "Pending" },
  { id: "INV-003", customer: "Global Services Ltd.", date: "2026-04-05", due: "2026-05-05", amount: 4200.00, status: "Pending" },
  { id: "INV-004", customer: "Metro Consulting", date: "2026-03-20", due: "2026-04-20", amount: 6300.00, status: "Overdue" },
  { id: "INV-005", customer: "Bright Solutions", date: "2026-03-15", due: "2026-04-15", amount: 3100.00, status: "Paid" },
  { id: "INV-006", customer: "Summit Digital", date: "2026-04-07", due: "2026-05-07", amount: 9400.00, status: "Draft" },
];

const statusColors: Record<string, string> = {
  Paid: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Overdue: "bg-destructive/10 text-destructive border-destructive/20",
  Draft: "bg-muted text-muted-foreground",
};

export default function Invoices() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch = !search || inv.customer.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || inv.status === statusFilter;
      const invDate = new Date(inv.date);
      const matchFrom = !dateFrom || invDate >= dateFrom;
      const matchTo = !dateTo || invDate <= dateTo;
      return matchSearch && matchStatus && matchFrom && matchTo;
    });
  }, [search, statusFilter, dateFrom, dateTo]);

  const handlePDF = (inv: typeof invoices[0]) => {
    generateInvoicePDF({
      invoiceNumber: inv.id,
      date: inv.date,
      dueDate: inv.due,
      customer: inv.customer,
      items: [{ description: "Professional Services", quantity: 1, unitPrice: inv.amount, total: inv.amount }],
      subtotal: inv.amount,
      taxRate: 0,
      taxAmount: 0,
      total: inv.amount,
    });
  };

  const handleWhatsApp = (inv: typeof invoices[0]) => {
    shareInvoiceWhatsApp(inv.id, inv.customer, inv.amount, inv.due);
  };

  return (
    <AppLayout>
      <PageHeader
        title={t("invoices.title")}
        description={t("invoices.description")}
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("invoices.newInvoice")}</Button>}
      />
      <SmartFilters
        searchValue={search}
        onSearchChange={setSearch}
        statusOptions={["Paid", "Pending", "Overdue", "Draft"]}
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onClear={() => { setSearch(""); setStatusFilter("all"); setDateFrom(undefined); setDateTo(undefined); }}
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("invoices.invoiceNumber")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("invoices.customer")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("invoices.date")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("invoices.dueDate")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("invoices.status")}</th>
                    <th className="text-end p-3 font-medium text-muted-foreground">{t("invoices.amount")}</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">{t("invoices.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv) => (
                    <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs font-semibold">{inv.id}</td>
                      <td className="p-3">{inv.customer}</td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">{inv.date}</td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">{inv.due}</td>
                      <td className="p-3"><Badge variant="outline" className={statusColors[inv.status]}>{inv.status}</Badge></td>
                      <td className="p-3 text-end font-mono font-medium">${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" title={t("common.view")}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handlePDF(inv)} title={t("invoices.exportPDF")}><FileDown className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleWhatsApp(inv)} title={t("invoices.shareWhatsApp")}><MessageCircle className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">{t("common.noResults")}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
