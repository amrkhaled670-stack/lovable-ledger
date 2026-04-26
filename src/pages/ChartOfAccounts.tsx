import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import { useTranslation } from "react-i18next";

const typeColors: Record<string, string> = {
  asset: "bg-primary/10 text-primary",
  liability: "bg-destructive/10 text-destructive",
  equity: "bg-accent/10 text-accent",
  revenue: "bg-success/10 text-success",
  expense: "bg-warning/10 text-warning",
};

const accountTypes = ["asset", "liability", "equity", "revenue", "expense"];
const subTypeKeys: Record<string, { value: string; key: string }[]> = {
  asset: [
    { value: "Current Asset", key: "currentAsset" },
    { value: "Fixed Asset", key: "fixedAsset" },
    { value: "Other Asset", key: "otherAsset" },
  ],
  liability: [
    { value: "Current Liability", key: "currentLiability" },
    { value: "Long-term Liability", key: "longTermLiability" },
  ],
  equity: [
    { value: "Equity", key: "equity" },
    { value: "Retained Earnings", key: "retainedEarnings" },
  ],
  revenue: [
    { value: "Operating Revenue", key: "operatingRevenue" },
    { value: "Other Revenue", key: "otherRevenue" },
  ],
  expense: [
    { value: "Operating Expense", key: "operatingExpense" },
    { value: "Cost of Goods Sold", key: "cogs" },
    { value: "Other Expense", key: "otherExpense" },
  ],
};

export default function ChartOfAccounts() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", type: "asset", sub_type: "", description: "" });

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("accounts").select("*").order("code");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("accounts").insert({
        code: form.code,
        name: form.name,
        type: form.type,
        sub_type: form.sub_type || null,
        description: form.description || null,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setOpen(false);
      setForm({ code: "", name: "", type: "asset", sub_type: "", description: "" });
      toast.success(t("accounts.createdSuccess"));
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const getNormalSide = (type: string) =>
    ["asset", "expense"].includes(type) ? t("accounts.debit") : t("accounts.credit");

  return (
    <AppLayout>
      <PageHeader
        title={t("accounts.title")}
        description={t("accounts.description")}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("accounts.addAccount")}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-lg">
              <DialogHeader><DialogTitle>{t("accounts.newAccount")}</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>{t("accounts.code")}</Label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="1000" /></div>
                  <div><Label>{t("accounts.name")}</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>{t("accounts.type")}</Label>
                    <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v, sub_type: "" }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{accountTypes.map(at => <SelectItem key={at} value={at}>{t(`accounts.types.${at}`)}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("accounts.subtype")}</Label>
                    <Select value={form.sub_type} onValueChange={v => setForm(f => ({ ...f, sub_type: v }))}>
                      <SelectTrigger><SelectValue placeholder={t("accounts.selectSubtype")} /></SelectTrigger>
                      <SelectContent>{(subTypeKeys[form.type] || []).map(s => <SelectItem key={s.value} value={s.value}>{t(`accounts.subtypes.${s.key}`)}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>{t("accounts.description")}</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                <Button onClick={() => createMutation.mutate()} disabled={!form.code || !form.name || createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}{t("accounts.createAccount")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("accounts.code")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("accounts.accountName")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("accounts.type")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground hidden sm:table-cell">{t("accounts.subtype")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground hidden md:table-cell">{t("accounts.normal")}</th>
                    <th className="text-end p-3 font-medium text-muted-foreground">{t("accounts.balance")}</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b"><td colSpan={6} className="p-3"><Skeleton className="h-5 w-full" /></td></tr>
                    ))
                  ) : accounts.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">{t("accounts.noAccounts")}</td></tr>
                  ) : (
                    accounts.map((acc) => (
                      <tr key={acc.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                        <td className="p-3 font-mono text-xs font-semibold">{acc.code}</td>
                        <td className="p-3 font-medium">{acc.name}</td>
                        <td className="p-3">
                          <Badge variant="secondary" className={typeColors[acc.type] || ""}>{t(`accounts.types.${acc.type}`, acc.type)}</Badge>
                        </td>
                        <td className="p-3 text-muted-foreground hidden sm:table-cell">{acc.sub_type || t("common.dash")}</td>
                        <td className="p-3 text-muted-foreground hidden md:table-cell">{getNormalSide(acc.type)}</td>
                        <td className="p-3 text-right font-mono font-medium">
                          {formatCurrency(acc.balance ?? 0)}
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
