import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartFilters } from "@/components/SmartFilters";
import { useTranslation } from "react-i18next";
import { Plus, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const products = [
  { sku: "PRD-001", name: "Laptop Dell XPS 15", category: "Electronics", quantity: 3, minStock: 5, unitPrice: 1299.00, costPrice: 950.00 },
  { sku: "PRD-002", name: "Office Chair Ergonomic", category: "Furniture", quantity: 15, minStock: 5, unitPrice: 449.00, costPrice: 280.00 },
  { sku: "PRD-003", name: "Wireless Keyboard", category: "Electronics", quantity: 0, minStock: 10, unitPrice: 79.99, costPrice: 35.00 },
  { sku: "PRD-004", name: "Monitor 27\" 4K", category: "Electronics", quantity: 8, minStock: 5, unitPrice: 549.00, costPrice: 380.00 },
  { sku: "PRD-005", name: "Standing Desk", category: "Furniture", quantity: 2, minStock: 3, unitPrice: 699.00, costPrice: 420.00 },
  { sku: "PRD-006", name: "Printer Ink Cartridge", category: "Supplies", quantity: 45, minStock: 20, unitPrice: 29.99, costPrice: 12.00 },
  { sku: "PRD-007", name: "USB-C Hub", category: "Electronics", quantity: 1, minStock: 10, unitPrice: 59.99, costPrice: 22.00 },
];

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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const status = getStockStatus(p.quantity, p.minStock);
      const matchStatus = statusFilter === "all" || status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const lowStockCount = products.filter((p) => p.quantity <= p.minStock).length;

  return (
    <AppLayout>
      <PageHeader
        title={t("inventory.title")}
        description={t("inventory.description")}
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("inventory.addProduct")}</Button>}
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
                    const status = getStockStatus(p.quantity, p.minStock);
                    return (
                      <tr key={p.sku} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono text-xs font-semibold">{p.sku}</td>
                        <td className="p-3 font-medium">{p.name}</td>
                        <td className="p-3 text-muted-foreground">{p.category}</td>
                        <td className="p-3 text-end font-mono">{p.quantity}</td>
                        <td className="p-3 text-end font-mono text-muted-foreground">{p.minStock}</td>
                        <td className="p-3 text-end font-mono">${p.unitPrice.toFixed(2)}</td>
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
      </motion.div>
    </AppLayout>
  );
}
