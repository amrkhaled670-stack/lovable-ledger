import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const orders = [
  { id: "PO-001", supplier: "TechSupply Co.", date: "2026-04-01", status: "Received", total: 15600 },
  { id: "PO-002", supplier: "Office World", date: "2026-04-05", status: "Ordered", total: 3200 },
  { id: "PO-003", supplier: "Global Parts Inc.", date: "2026-04-08", status: "Draft", total: 8900 },
];

const statusColors: Record<string, string> = {
  Received: "bg-success/10 text-success border-success/20",
  Ordered: "bg-info/10 text-info border-info/20",
  Draft: "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function PurchaseOrders() {
  const { t } = useTranslation();
  return (
    <AppLayout>
      <PageHeader
        title={t("purchaseOrders.title")}
        description={t("purchaseOrders.description")}
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("purchaseOrders.newOrder")}</Button>}
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium text-muted-foreground">Order #</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">Supplier</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-end p-3 font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs font-semibold">{o.id}</td>
                      <td className="p-3">{o.supplier}</td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">{o.date}</td>
                      <td className="p-3"><Badge variant="outline" className={statusColors[o.status]}>{o.status}</Badge></td>
                      <td className="p-3 text-end font-mono font-medium">${o.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
