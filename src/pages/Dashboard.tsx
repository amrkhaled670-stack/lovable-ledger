import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

const recentTransactions = [
  { id: 1, date: "2026-04-08", description: "Office Supplies", debit: 450.00, credit: 0, account: "Office Expenses" },
  { id: 2, date: "2026-04-07", description: "Client Payment - Acme Corp", debit: 0, credit: 12500.00, account: "Accounts Receivable" },
  { id: 3, date: "2026-04-06", description: "Rent Payment", debit: 3200.00, credit: 0, account: "Rent Expense" },
  { id: 4, date: "2026-04-05", description: "Service Revenue", debit: 0, credit: 8750.00, account: "Service Revenue" },
  { id: 5, date: "2026-04-04", description: "Utility Bill", debit: 285.00, credit: 0, account: "Utilities Expense" },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <PageHeader title="Dashboard" description="Financial overview for April 2026" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Revenue" value="$124,580" change="+12.5% from last month" changeType="positive" icon={TrendingUp} />
        <StatCard title="Total Expenses" value="$67,320" change="+4.2% from last month" changeType="negative" icon={TrendingDown} />
        <StatCard title="Net Income" value="$57,260" change="+23.1% from last month" changeType="positive" icon={DollarSign} />
        <StatCard title="Cash Balance" value="$89,450" change="Updated today" changeType="neutral" icon={Wallet} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Description</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono text-xs text-muted-foreground">{tx.date}</td>
                        <td className="p-3">{tx.description}</td>
                        <td className="p-3 text-right font-mono">
                          {tx.debit > 0 ? (
                            <span className="text-destructive flex items-center justify-end gap-1">
                              <ArrowDownRight className="h-3 w-3" />
                              ${tx.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span className="text-success flex items-center justify-end gap-1">
                              <ArrowUpRight className="h-3 w-3" />
                              ${tx.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Accounts Receivable", value: "$34,200", color: "bg-primary" },
                { label: "Accounts Payable", value: "$12,800", color: "bg-destructive" },
                { label: "Pending Invoices", value: "8", color: "bg-warning" },
                { label: "Total Customers", value: "47", color: "bg-info" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${stat.color}`} />
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="font-mono font-semibold text-sm">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
