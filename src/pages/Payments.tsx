import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartFilters } from "@/components/SmartFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/currency";
import { useTranslation } from "react-i18next";

export default function Payments() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ payment_number: "", amount: "", method: "cash", reference: "", date: new Date().toISOString().slice(0, 10) });

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("payments").select("*, customers(name)").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("payments").insert({
        payment_number: form.payment_number,
        amount: parseFloat(form.amount),
        method: form.method,
        reference: form.reference || null,
        date: form.date,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setOpen(false);
      setForm({ payment_number: "", amount: "", method: "cash", reference: "", date: new Date().toISOString().slice(0, 10) });
      toast.success(t("payments.createdSuccess"));
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = payments.filter((p) =>
    !search || p.payment_number.toLowerCase().includes(search.toLowerCase()) || (p.reference?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AppLayout>
      <PageHeader
        title={t("payments.title")}
        description={t("payments.description")}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("payments.recordPayment")}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-lg">
              <DialogHeader><DialogTitle>{t("payments.recordPayment")}</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
                <div><Label>{t("payments.paymentNumberLabel")} *</Label><Input value={form.payment_number} onChange={(e) => setForm({ ...form, payment_number: e.target.value })} placeholder={t("payments.paymentNumberPlaceholder")} /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>{t("payments.amount")} *</Label><Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
                  <div><Label>{t("payments.date")}</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
                </div>
                <div><Label>{t("payments.method")}</Label>
                  <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">{t("payments.methods.cash")}</SelectItem>
                      <SelectItem value="bank_transfer">{t("payments.methods.bank_transfer")}</SelectItem>
                      <SelectItem value="credit_card">{t("payments.methods.credit_card")}</SelectItem>
                      <SelectItem value="check">{t("payments.methods.check")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>{t("payments.reference")}</Label><Input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} /></div>
                <Button onClick={() => createMutation.mutate()} disabled={!form.payment_number || !form.amount || createMutation.isPending}>
                  {createMutation.isPending ? t("common.saving") : t("payments.savePayment")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <SmartFilters searchValue={search} onSearchChange={setSearch} onClear={() => setSearch("")} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {isLoading ? <Skeleton className="h-64 rounded-xl" /> : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-start p-3 font-medium text-muted-foreground">{t("payments.paymentNumber")}</th>
                      <th className="text-start p-3 font-medium text-muted-foreground hidden sm:table-cell">{t("payments.date")}</th>
                      <th className="text-start p-3 font-medium text-muted-foreground hidden md:table-cell">{t("payments.reference")}</th>
                      <th className="text-start p-3 font-medium text-muted-foreground hidden md:table-cell">{t("payments.customer")}</th>
                      <th className="text-start p-3 font-medium text-muted-foreground">{t("payments.method")}</th>
                      <th className="text-end p-3 font-medium text-muted-foreground">{t("payments.amount")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((pay) => (
                      <tr key={pay.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono text-xs font-semibold">{pay.payment_number}</td>
                        <td className="p-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">{pay.date}</td>
                        <td className="p-3 text-xs hidden md:table-cell">{pay.reference || t("common.dash")}</td>
                        <td className="p-3 hidden md:table-cell">{(pay.customers as any)?.name || t("common.dash")}</td>
                        <td className="p-3 text-muted-foreground">{pay.method ? t(`payments.methods.${pay.method}`) : t("common.dash")}</td>
                        <td className="p-3 text-end font-mono font-medium">{formatCurrency(pay.amount)}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">{t("payments.noPayments")}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </AppLayout>
  );
}
