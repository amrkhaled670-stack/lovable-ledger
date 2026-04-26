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
import { useTranslation } from "react-i18next";
import { Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors: Record<string, string> = {
  received: "bg-success/10 text-success border-success/20",
  ordered: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  draft: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function PurchaseOrders() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ order_number: "", supplier_id: "", total: "" });

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["purchase_orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_orders")
        .select("*, suppliers(name)")
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("suppliers").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("purchase_orders").insert({
        order_number: form.order_number,
        supplier_id: form.supplier_id || null,
        total: form.total ? parseFloat(form.total) : 0,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase_orders"] });
      setOpen(false);
      setForm({ order_number: "", supplier_id: "", total: "" });
      toast.success(t("purchaseOrders.createdSuccess"));
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <AppLayout>
      <PageHeader
        title={t("purchaseOrders.title")}
        description={t("purchaseOrders.description")}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("purchaseOrders.newOrder")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("purchaseOrders.newPurchaseOrder")}</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div><Label>{t("purchaseOrders.orderNumberLabel")}</Label><Input value={form.order_number} onChange={e => setForm(f => ({ ...f, order_number: e.target.value }))} placeholder={t("purchaseOrders.orderNumberPlaceholder")} /></div>
                <div>
                  <Label>{t("purchaseOrders.supplier")}</Label>
                  <Select value={form.supplier_id} onValueChange={v => setForm(f => ({ ...f, supplier_id: v }))}>
                    <SelectTrigger><SelectValue placeholder={t("purchaseOrders.selectSupplier")} /></SelectTrigger>
                    <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>{t("purchaseOrders.total")}</Label><Input type="number" value={form.total} onChange={e => setForm(f => ({ ...f, total: e.target.value }))} placeholder="0.00" /></div>
                <Button onClick={() => createMutation.mutate()} disabled={!form.order_number || createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}{t("purchaseOrders.createOrder")}
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
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("purchaseOrders.orderNumber")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("purchaseOrders.supplier")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("purchaseOrders.date")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("purchaseOrders.status")}</th>
                    <th className="text-end p-3 font-medium text-muted-foreground">{t("purchaseOrders.total")}</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="border-b"><td colSpan={5} className="p-3"><Skeleton className="h-5 w-full" /></td></tr>
                    ))
                  ) : orders.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">{t("purchaseOrders.noOrders")}</td></tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono text-xs font-semibold">{o.order_number}</td>
                        <td className="p-3">{(o.suppliers as any)?.name || t("common.dash")}</td>
                        <td className="p-3 font-mono text-xs text-muted-foreground">{o.date}</td>
                        <td className="p-3"><Badge variant="outline" className={statusColors[o.status] || ""}>{t(`purchaseOrders.statuses.${o.status}`, o.status)}</Badge></td>
                        <td className="p-3 text-end font-mono font-medium">{(o.total ?? 0).toLocaleString()}</td>
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
