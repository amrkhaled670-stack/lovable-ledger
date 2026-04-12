import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/currency";

function LineItem({ label, amount, bold = false }: { label: string; amount: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between py-2 ${bold ? 'font-bold' : ''}`}>
      <span className={bold ? '' : 'text-muted-foreground'}>{label}</span>
      <span className="font-mono">{formatCurrency(amount)}</span>
    </div>
  );
}

export default function IncomeStatement() {
  const { user } = useAuth();

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("accounts").select("name, type, balance").order("code");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const revenueAccounts = accounts.filter(a => a.type === "revenue");
  const expenseAccounts = accounts.filter(a => a.type === "expense");
  const totalRevenue = revenueAccounts.reduce((s, a) => s + (a.balance ?? 0), 0);
  const totalExpenses = expenseAccounts.reduce((s, a) => s + (a.balance ?? 0), 0);
  const netIncome = totalRevenue - totalExpenses;

  return (
    <AppLayout>
      <PageHeader title="Income Statement" description="Revenue and expenses summary" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
        {isLoading ? <Skeleton className="h-64 rounded-xl" /> : (
          <Card>
            <CardHeader className="text-center border-b">
              <CardTitle className="text-lg">Income Statement</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">Revenue</h3>
                {revenueAccounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">No revenue accounts</p>
                ) : revenueAccounts.map((r) => <LineItem key={r.name} label={r.name} amount={r.balance ?? 0} />)}
                <Separator className="my-2" />
                <LineItem label="Total Revenue" amount={totalRevenue} bold />
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">Expenses</h3>
                {expenseAccounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">No expense accounts</p>
                ) : expenseAccounts.map((e) => <LineItem key={e.name} label={e.name} amount={e.balance ?? 0} />)}
                <Separator className="my-2" />
                <LineItem label="Total Expenses" amount={totalExpenses} bold />
              </div>
              <Separator />
              <div className={`flex justify-between py-2 font-bold text-lg ${netIncome >= 0 ? 'text-success' : 'text-destructive'}`}>
                <span>Net Income</span>
                <span className="font-mono">{formatCurrency(netIncome)}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </AppLayout>
  );
}
