import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const trialData = [
  { code: "1000", name: "Cash", debit: 89450.00, credit: 0 },
  { code: "1100", name: "Accounts Receivable", debit: 34200.00, credit: 0 },
  { code: "1200", name: "Inventory", debit: 15600.00, credit: 0 },
  { code: "1500", name: "Equipment", debit: 45000.00, credit: 0 },
  { code: "2000", name: "Accounts Payable", debit: 0, credit: 12800.00 },
  { code: "2100", name: "Notes Payable", debit: 0, credit: 25000.00 },
  { code: "3000", name: "Owner's Equity", debit: 0, credit: 100000.00 },
  { code: "3100", name: "Retained Earnings", debit: 0, credit: 46450.00 },
  { code: "4000", name: "Service Revenue", debit: 0, credit: 124580.00 },
  { code: "5000", name: "Rent Expense", debit: 38400.00, credit: 0 },
  { code: "5100", name: "Utilities Expense", debit: 3420.00, credit: 0 },
  { code: "5200", name: "Office Expenses", debit: 5200.00, credit: 0 },
  { code: "5300", name: "Salaries Expense", debit: 20300.00, credit: 0 },
  { code: "5400", name: "Depreciation Expense", debit: 57260.00, credit: 0 },
];

const totalDebit = trialData.reduce((sum, r) => sum + r.debit, 0);
const totalCredit = trialData.reduce((sum, r) => sum + r.credit, 0);

export default function TrialBalance() {
  return (
    <AppLayout>
      <PageHeader title="Trial Balance" description="As of April 8, 2026" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Code</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Account</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Debit</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {trialData.map((row) => (
                    <tr key={row.code} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs font-semibold">{row.code}</td>
                      <td className="p-3">{row.name}</td>
                      <td className="p-3 text-right font-mono">{row.debit > 0 ? `$${row.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : ''}</td>
                      <td className="p-3 text-right font-mono">{row.credit > 0 ? `$${row.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : ''}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/50 font-bold">
                    <td className="p-3" colSpan={2}>Totals</td>
                    <td className="p-3 text-right font-mono">${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-right font-mono">${totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
