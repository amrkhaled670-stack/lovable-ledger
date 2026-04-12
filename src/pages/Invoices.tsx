import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SmartFilters } from "@/components/SmartFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { Plus, Eye, FileDown, MessageCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { generateInvoicePDF } from "@/lib/pdf";
import { shareInvoiceWhatsApp } from "@/lib/whatsapp";
import { formatCurrency } from "@/lib/currency";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  paid: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
  draft: "bg-muted text-muted-foreground",
};

export default function Invoices() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ invoice_number: "", customer_name: "", due_date: "", amount: "" });

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("invoices").select("*, customers(name)").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const createMutation = useMutation({
    mutationFn: async () => {
      const amount = parseFloat(form.amount) || 0;
      const { error } = await supabase.from("invoices").insert({
        invoice_number: form.invoice_number,
        customer_id: selectedCustomerId || null,
        due_date: form.due_date || null,
        total: amount,
        subtotal: amount,
        status: "draft",
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setOpen(false);
      setForm({ invoice_number: "", customer_name: "", due_date: "", amount: "" });
      setSelectedCustomerId("");
      toast.success("Invoice created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const customerName = (inv.customers as any)?.name || "";
      const matchSearch = !search || customerName.toLowerCase().includes(search.toLowerCase()) || inv.invoice_number.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || inv.status === statusFilter;
      const invDate = new Date(inv.date);
      const matchFrom = !dateFrom || invDate >= dateFrom;
      const matchTo = !dateTo || invDate <= dateTo;
      return matchSearch && matchStatus && matchFrom && matchTo;
    });
  }, [invoices, search, statusFilter, dateFrom, dateTo]);

  const handlePDF = (inv: typeof invoices[0]) => {
    generateInvoicePDF({
      invoiceNumber: inv.invoice_number,
      date: inv.date,
      dueDate: inv.due_date || "",
      customer: (inv.customers as any)?.name || "—",
      items: [{ description: "Services", quantity: 1, unitPrice: inv.total ?? 0, total: inv.total ?? 0 }],
      subtotal: inv.subtotal ?? 0,
      taxRate: inv.tax_rate ?? 0,
      taxAmount: inv.tax_amount ?? 0,
      total: inv.total ?? 0,
    });
  };

  const handleWhatsApp = (inv: typeof invoices[0]) => {
    shareInvoiceWhatsApp(inv.invoice_number, (inv.customers as any)?.name || "", inv.total ?? 0, inv.due_date || "");
  };

  return (
    <AppLayout>
      <PageHeader
        title={t("invoices.title")}
        description={t("invoices.description")}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("invoices.newInvoice")}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-lg">
              <DialogHeader><DialogTitle>New Invoice</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>Invoice #</Label><Input value={form.invoice_number} onChange={e => setForm(f => ({ ...f, invoice_number: e.target.value }))} placeholder="INV-001" /></div>
                  <div>
                    <Label>Customer</Label>
                    <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                      <SelectTrigger><SelectValue placeholder="Select customer..." /></SelectTrigger>
                      <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>Due Date</Label><Input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} /></div>
                  <div><Label>Amount</Label><Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" /></div>
                </div>
                <Button onClick={() => createMutation.mutate()} disabled={!form.invoice_number || createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Create Invoice
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <SmartFilters
        searchValue={search}
        onSearchChange={setSearch}
        statusOptions={["paid", "pending", "overdue", "draft"]}
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
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("invoices.invoiceNumber")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground hidden sm:table-cell">{t("invoices.customer")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground hidden md:table-cell">{t("invoices.date")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground hidden md:table-cell">{t("invoices.dueDate")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("invoices.status")}</th>
                    <th className="text-end p-3 font-medium text-muted-foreground">{t("invoices.amount")}</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">{t("invoices.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-b"><td colSpan={7} className="p-3"><Skeleton className="h-5 w-full" /></td></tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">{t("common.noResults")}</td></tr>
                  ) : (
                    filtered.map((inv) => (
                      <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono text-xs font-semibold">{inv.invoice_number}</td>
                        <td className="p-3 hidden sm:table-cell">{(inv.customers as any)?.name || "—"}</td>
                        <td className="p-3 font-mono text-xs text-muted-foreground hidden md:table-cell">{inv.date}</td>
                        <td className="p-3 font-mono text-xs text-muted-foreground hidden md:table-cell">{inv.due_date || "—"}</td>
                        <td className="p-3"><Badge variant="outline" className={statusColors[inv.status] || ""}>{inv.status}</Badge></td>
                        <td className="p-3 text-end font-mono font-medium text-xs sm:text-sm">{formatCurrency(inv.total ?? 0)}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-0.5">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title={t("common.view")}><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handlePDF(inv)} title={t("invoices.exportPDF")}><FileDown className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleWhatsApp(inv)} title={t("invoices.shareWhatsApp")}><MessageCircle className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))
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
