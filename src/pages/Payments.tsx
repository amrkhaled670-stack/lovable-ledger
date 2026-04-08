import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const payments = [
  { id: "PAY-001", date: "2026-04-07", reference: "INV-001", customer: "Acme Corporation", method: "Bank Transfer", amount: 12500.00, status: "Completed" },
  { id: "PAY-002", date: "2026-04-05", reference: "INV-005", customer: "Bright Solutions", method: "Credit Card", amount: 3100.00, status: "Completed" },
  { id: "PAY-003", date: "2026-04-04", reference: "Rent", customer: "Landlord Inc.", method: "Bank Transfer", amount: 3200.00, status: "Completed" },
  { id: "PAY-004", date: "2026-04-03", reference: "Payroll", customer: "—", method: "Direct Deposit", amount: 5200.00, status: "Completed" },
  { id: "PAY-005", date: "2026-04-08", reference: "INV-002", customer: "TechStart Inc.", method: "Check", amount: 8750.00, status: "Pending" },
];

export default function Payments() {
  return (
    <AppLayout>
      <PageHeader
        title="Payments"
        description="Track incoming and outgoing payments"
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />Record Payment</Button>}
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Payment #</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Reference</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Method</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((pay) => (
                    <tr key={pay.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs font-semibold">{pay.id}</td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">{pay.date}</td>
                      <td className="p-3 text-xs">{pay.reference}</td>
                      <td className="p-3">{pay.customer}</td>
                      <td className="p-3 text-muted-foreground">{pay.method}</td>
                      <td className="p-3">
                        <Badge variant={pay.status === "Completed" ? "default" : "secondary"}>{pay.status}</Badge>
                      </td>
                      <td className="p-3 text-right font-mono font-medium">${pay.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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
