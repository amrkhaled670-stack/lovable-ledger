import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye } from "lucide-react";
import { motion } from "framer-motion";

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
  return (
    <AppLayout>
      <PageHeader
        title="Invoices"
        description="Manage customer invoices"
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />New Invoice</Button>}
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Invoice #</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Due Date</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs font-semibold">{inv.id}</td>
                      <td className="p-3">{inv.customer}</td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">{inv.date}</td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">{inv.due}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={statusColors[inv.status]}>{inv.status}</Badge>
                      </td>
                      <td className="p-3 text-right font-mono font-medium">${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-center">
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      </td>
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
