import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const accounts = [
  { code: "1000", name: "Cash", type: "Asset", subtype: "Current Asset", balance: 89450.00, normal: "Debit" },
  { code: "1100", name: "Accounts Receivable", type: "Asset", subtype: "Current Asset", balance: 34200.00, normal: "Debit" },
  { code: "1200", name: "Inventory", type: "Asset", subtype: "Current Asset", balance: 15600.00, normal: "Debit" },
  { code: "1500", name: "Equipment", type: "Asset", subtype: "Fixed Asset", balance: 45000.00, normal: "Debit" },
  { code: "2000", name: "Accounts Payable", type: "Liability", subtype: "Current Liability", balance: 12800.00, normal: "Credit" },
  { code: "2100", name: "Notes Payable", type: "Liability", subtype: "Long-term Liability", balance: 25000.00, normal: "Credit" },
  { code: "3000", name: "Owner's Equity", type: "Equity", subtype: "Equity", balance: 100000.00, normal: "Credit" },
  { code: "3100", name: "Retained Earnings", type: "Equity", subtype: "Equity", balance: 46450.00, normal: "Credit" },
  { code: "4000", name: "Service Revenue", type: "Revenue", subtype: "Operating Revenue", balance: 124580.00, normal: "Credit" },
  { code: "5000", name: "Rent Expense", type: "Expense", subtype: "Operating Expense", balance: 38400.00, normal: "Debit" },
  { code: "5100", name: "Utilities Expense", type: "Expense", subtype: "Operating Expense", balance: 3420.00, normal: "Debit" },
  { code: "5200", name: "Office Expenses", type: "Expense", subtype: "Operating Expense", balance: 5200.00, normal: "Debit" },
  { code: "5300", name: "Salaries Expense", type: "Expense", subtype: "Operating Expense", balance: 20300.00, normal: "Debit" },
];

const typeColors: Record<string, string> = {
  Asset: "bg-primary/10 text-primary",
  Liability: "bg-destructive/10 text-destructive",
  Equity: "bg-accent/10 text-accent",
  Revenue: "bg-success/10 text-success",
  Expense: "bg-warning/10 text-warning",
};

export default function ChartOfAccounts() {
  return (
    <AppLayout>
      <PageHeader
        title="Chart of Accounts"
        description="Manage your general ledger accounts"
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Account</Button>}
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Code</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Account Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Subtype</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Normal</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr key={acc.code} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="p-3 font-mono text-xs font-semibold">{acc.code}</td>
                      <td className="p-3 font-medium">{acc.name}</td>
                      <td className="p-3">
                        <Badge variant="secondary" className={typeColors[acc.type]}>{acc.type}</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">{acc.subtype}</td>
                      <td className="p-3 text-muted-foreground">{acc.normal}</td>
                      <td className="p-3 text-right font-mono font-medium">
                        ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
