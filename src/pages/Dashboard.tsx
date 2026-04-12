import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/currency";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: invoices = [] } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("invoices").select("total, status").limit(1000);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("expenses").select("amount").limit(1000);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("payments").select("amount, date").order("date", { ascending: false }).limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers_count"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("id").limit(1000);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const totalRevenue = invoices.reduce((s, i) => s + (i.total ?? 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount ?? 0), 0);
  const netIncome = totalRevenue - totalExpenses;
  const pendingInvoices = invoices.filter(i => i.status === "pending" || i.status === "draft").length;

  return (
    <AppLayout>
      <PageHeader title="Dashboard" description="Financial overview" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} changeType="positive" icon={TrendingUp} />
        <StatCard title="Total Expenses" value={formatCurrency(totalExpenses)} changeType="negative" icon={TrendingDown} />
        <StatCard title="Net Income" value={formatCurrency(netIncome)} changeType={netIncome >= 0 ? "positive" : "negative"} icon={Receipt} />
        <StatCard title="Cash Balance" value={formatCurrency(netIncome)} changeType="neutral" icon={Wallet} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr><td colSpan={2} className="p-6 text-center text-muted-foreground text-sm">No payments yet</td></tr>
                    ) : payments.map((p, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono text-xs text-muted-foreground">{p.date}</td>
                        <td className="p-3 text-right font-mono">
                          <span className="text-success flex items-center justify-end gap-1">
                            <ArrowUpRight className="h-3 w-3" />
                            {formatCurrency(p.amount)}
                          </span>
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
                { label: "Pending Invoices", value: String(pendingInvoices), color: "bg-warning" },
                { label: "Total Customers", value: String(customers.length), color: "bg-primary" },
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
