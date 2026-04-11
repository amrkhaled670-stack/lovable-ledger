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
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Expenses() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ description: "", amount: "", date: new Date().toISOString().slice(0, 10) });

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("expenses").select("*, expense_categories(name, color)").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("expenses").insert({
        description: form.description,
        amount: parseFloat(form.amount),
        date: form.date,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setOpen(false);
      setForm({ description: "", amount: "", date: new Date().toISOString().slice(0, 10) });
      toast.success(t("expenses.addExpense") + " ✓");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = expenses.filter((e) =>
    !search || e.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <PageHeader
        title={t("expenses.title")}
        description={t("expenses.description")}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("expenses.addExpense")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("expenses.addExpense")}</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
                <div><Label>{t("expenses.description_label")} *</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>{t("expenses.amount")} *</Label><Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
                  <div><Label>{t("expenses.date")}</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
                </div>
                <Button onClick={() => createMutation.mutate()} disabled={!form.description || !form.amount || createMutation.isPending}>
                  {createMutation.isPending ? "Saving..." : "Save Expense"}
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
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-start p-3 font-medium text-muted-foreground">{t("expenses.date")}</th>
                      <th className="text-start p-3 font-medium text-muted-foreground">{t("expenses.description_label")}</th>
                      <th className="text-start p-3 font-medium text-muted-foreground">{t("expenses.category")}</th>
                      <th className="text-end p-3 font-medium text-muted-foreground">{t("expenses.amount")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e) => (
                      <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono text-xs text-muted-foreground">{e.date}</td>
                        <td className="p-3">{e.description}</td>
                        <td className="p-3">
                          {(e.expense_categories as any)?.name ? (
                            <Badge variant="secondary">{(e.expense_categories as any).name}</Badge>
                          ) : <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="p-3 text-end font-mono font-medium">${e.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">{t("common.noResults")}</td></tr>
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
