import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye } from "lucide-react";
import { motion } from "framer-motion";

const entries = [
  { id: "JE-001", date: "2026-04-08", description: "Office supplies purchase", status: "Posted", debit: 450.00, credit: 450.00 },
  { id: "JE-002", date: "2026-04-07", description: "Client payment received - Acme Corp", status: "Posted", debit: 12500.00, credit: 12500.00 },
  { id: "JE-003", date: "2026-04-06", description: "Monthly rent payment", status: "Posted", debit: 3200.00, credit: 3200.00 },
  { id: "JE-004", date: "2026-04-05", description: "Service revenue recognition", status: "Posted", debit: 8750.00, credit: 8750.00 },
  { id: "JE-005", date: "2026-04-04", description: "Utility bill payment", status: "Draft", debit: 285.00, credit: 285.00 },
  { id: "JE-006", date: "2026-04-03", description: "Salary payroll", status: "Posted", debit: 5200.00, credit: 5200.00 },
  { id: "JE-007", date: "2026-04-02", description: "Equipment depreciation", status: "Draft", debit: 375.00, credit: 375.00 },
];

export default function JournalEntries() {
  return (
    <AppLayout>
      <PageHeader
        title="Journal Entries"
        description="Record and manage journal entries"
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />New Entry</Button>}
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Entry #</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Description</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Debit</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Credit</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs font-semibold">{entry.id}</td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">{entry.date}</td>
                      <td className="p-3">{entry.description}</td>
                      <td className="p-3">
                        <Badge variant={entry.status === "Posted" ? "default" : "secondary"}>
                          {entry.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right font-mono">${entry.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right font-mono">${entry.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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
