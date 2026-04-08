import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const ledgerEntries = [
  { date: "2026-04-08", ref: "JE-001", description: "Office Supplies", account: "Office Expenses", debit: 450.00, credit: 0, balance: 5200.00 },
  { date: "2026-04-08", ref: "JE-001", description: "Office Supplies", account: "Cash", debit: 0, credit: 450.00, balance: 89450.00 },
  { date: "2026-04-07", ref: "JE-002", description: "Client Payment", account: "Cash", debit: 12500.00, credit: 0, balance: 89900.00 },
  { date: "2026-04-07", ref: "JE-002", description: "Client Payment", account: "Accounts Receivable", debit: 0, credit: 12500.00, balance: 34200.00 },
  { date: "2026-04-06", ref: "JE-003", description: "Rent Payment", account: "Rent Expense", debit: 3200.00, credit: 0, balance: 38400.00 },
  { date: "2026-04-06", ref: "JE-003", description: "Rent Payment", account: "Cash", debit: 0, credit: 3200.00, balance: 77400.00 },
  { date: "2026-04-05", ref: "JE-004", description: "Service Revenue", account: "Accounts Receivable", debit: 8750.00, credit: 0, balance: 46700.00 },
  { date: "2026-04-05", ref: "JE-004", description: "Service Revenue", account: "Service Revenue", debit: 0, credit: 8750.00, balance: 124580.00 },
];

export default function GeneralLedger() {
  return (
    <AppLayout>
      <PageHeader title="General Ledger" description="Complete record of all financial transactions" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Ref</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Description</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Account</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Debit</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Credit</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerEntries.map((entry, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs text-muted-foreground">{entry.date}</td>
                      <td className="p-3 font-mono text-xs font-semibold">{entry.ref}</td>
                      <td className="p-3">{entry.description}</td>
                      <td className="p-3 text-muted-foreground">{entry.account}</td>
                      <td className="p-3 text-right font-mono">{entry.debit > 0 ? `$${entry.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}</td>
                      <td className="p-3 text-right font-mono">{entry.credit > 0 ? `$${entry.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}</td>
                      <td className="p-3 text-right font-mono font-medium">${entry.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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
