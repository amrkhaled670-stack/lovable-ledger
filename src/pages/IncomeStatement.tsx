import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const revenue = [
  { name: "Service Revenue", amount: 124580.00 },
];

const expenses = [
  { name: "Rent Expense", amount: 38400.00 },
  { name: "Salaries Expense", amount: 20300.00 },
  { name: "Office Expenses", amount: 5200.00 },
  { name: "Utilities Expense", amount: 3420.00 },
];

const totalRevenue = revenue.reduce((s, r) => s + r.amount, 0);
const totalExpenses = expenses.reduce((s, r) => s + r.amount, 0);
const netIncome = totalRevenue - totalExpenses;

function LineItem({ label, amount, bold = false }: { label: string; amount: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between py-2 ${bold ? 'font-bold' : ''}`}>
      <span className={bold ? '' : 'text-muted-foreground'}>{label}</span>
      <span className="font-mono">${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
    </div>
  );
}

export default function IncomeStatement() {
  return (
    <AppLayout>
      <PageHeader title="Income Statement" description="For the period ending April 8, 2026" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
        <Card>
          <CardHeader className="text-center border-b">
            <CardTitle className="text-lg">AccuBooks Inc.</CardTitle>
            <p className="text-sm text-muted-foreground">Income Statement</p>
            <p className="text-xs text-muted-foreground">For the Period Ending April 8, 2026</p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">Revenue</h3>
              {revenue.map((r) => <LineItem key={r.name} label={r.name} amount={r.amount} />)}
              <Separator className="my-2" />
              <LineItem label="Total Revenue" amount={totalRevenue} bold />
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">Expenses</h3>
              {expenses.map((e) => <LineItem key={e.name} label={e.name} amount={e.amount} />)}
              <Separator className="my-2" />
              <LineItem label="Total Expenses" amount={totalExpenses} bold />
            </div>

            <Separator />
            <div className={`flex justify-between py-2 font-bold text-lg ${netIncome >= 0 ? 'text-success' : 'text-destructive'}`}>
              <span>Net Income</span>
              <span className="font-mono">${netIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
