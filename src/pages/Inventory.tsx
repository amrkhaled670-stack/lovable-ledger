import { useState, useMemo } from "react";
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
import { Plus, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

function getStockStatus(qty: number, min: number) {
  if (qty === 0) return "outOfStock";
  if (qty <= min) return "lowStock";
  return "inStock";
}

const statusStyles: Record<string, string> = {
  inStock: "bg-success/10 text-success border-success/20",
  lowStock: "bg-warning/10 text-warning border-warning/20",
  outOfStock: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Inventory() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ sku: "", name: "", quantity: "0", min_stock_level: "10", unit_price: "0", cost_price: "0" });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*, product_categories(name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("products").insert({
        sku: form.sku,
        name: form.name,
        quantity: parseInt(form.quantity),
        min_stock_level: parseInt(form.min_stock_level),
        unit_price: parseFloat(form.unit_price),
        cost_price: parseFloat(form.cost_price),
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
      setForm({ sku: "", name: "", quantity: "0", min_stock_level: "10", unit_price: "0", cost_price: "0" });
      toast.success("Product added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const status = getStockStatus(p.quantity ?? 0, p.min_stock_level ?? 10);
      const matchStatus = statusFilter === "all" || status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, products]);

  const lowStockCount = products.filter((p) => (p.quantity ?? 0) <= (p.min_stock_level ?? 10)).length;

  return (
    <AppLayout>
      <PageHeader
        title={t("inventory.title")}
        description={t("inventory.description")}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("inventory.addProduct")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("inventory.addProduct")}</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>{t("inventory.sku")} *</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="PRD-001" /></div>
                  <div><Label>{t("inventory.product")} *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>{t("inventory.quantity")}</Label><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
                  <div><Label>{t("inventory.minStock")}</Label><Input type="number" value={form.min_stock_level} onChange={(e) => setForm({ ...form, min_stock_level: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>{t("inventory.unitPrice")}</Label><Input type="number" step="0.01" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} /></div>
                  <div><Label>Cost Price</Label><Input type="number" step="0.01" value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: e.target.value })} /></div>
                </div>
                <Button onClick={() => createMutation.mutate()} disabled={!form.sku || !form.name || createMutation.isPending}>
                  {createMutation.isPending ? "Saving..." : "Save Product"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {lowStockCount > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 rounded-lg border border-warning/30 bg-warning/5 flex items-center gap-2 text-sm text-warning">
          <AlertTriangle className="h-4 w-4" />
          {t("inventory.lowStockAlert")} ({lowStockCount} items)
        </motion.div>
      )}

      <SmartFilters
        searchValue={search}
        onSearchChange={setSearch}
        statusOptions={["inStock", "lowStock", "outOfStock"]}
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
        onClear={() => { setSearch(""); setStatusFilter("all"); }}
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {isLoading ? <Skeleton className="h-64 rounded-xl" /> : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-start p-3 font-medium text-muted-foreground">{t("inventory.sku")}</th>
                      <th className="text-start p-3 font-medium text-muted-foreground">{t("inventory.product")}</th>
                      <th className="text-start p-3 font-medium text-muted-foreground">{t("inventory.category")}</th>
                      <th className="text-end p-3 font-medium text-muted-foreground">{t("inventory.quantity")}</th>
                      <th className="text-end p-3 font-medium text-muted-foreground">{t("inventory.minStock")}</th>
                      <th className="text-end p-3 font-medium text-muted-foreground">{t("inventory.unitPrice")}</th>
                      <th className="text-start p-3 font-medium text-muted-foreground">{t("inventory.status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => {
                      const status = getStockStatus(p.quantity ?? 0, p.min_stock_level ?? 10);
                      return (
                        <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="p-3 font-mono text-xs font-semibold">{p.sku}</td>
                          <td className="p-3 font-medium">{p.name}</td>
                          <td className="p-3 text-muted-foreground">{(p.product_categories as any)?.name || "—"}</td>
                          <td className="p-3 text-end font-mono">{p.quantity}</td>
                          <td className="p-3 text-end font-mono text-muted-foreground">{p.min_stock_level}</td>
                          <td className="p-3 text-end font-mono">${(p.unit_price ?? 0).toFixed(2)}</td>
                          <td className="p-3">
                            <Badge variant="outline" className={statusStyles[status]}>
                              {status === "lowStock" && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {t(`inventory.${status}`)}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">{t("common.noResults")}</td></tr>
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
