import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/currency";

export default function Analytics() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: expenses = [], isLoading: loadingExp } = useQuery({
    queryKey: ["expenses_analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("amount, description, expense_categories(name)")
        .limit(500);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: invoices = [], isLoading: loadingInv } = useQuery({
    queryKey: ["invoices_analytics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("invoices").select("total, date").limit(500);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const isLoading = loadingExp || loadingInv;

  // Group expenses by category
  const catMap = new Map<string, number>();
  const colors = ["hsl(217,91%,40%)", "hsl(152,60%,40%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)", "hsl(280,60%,50%)"];
  expenses.forEach(e => {
    const cat = (e.expense_categories as any)?.name || "Uncategorized";
    catMap.set(cat, (catMap.get(cat) || 0) + (e.amount ?? 0));
  });
  const expenseData = Array.from(catMap.entries()).map(([name, value], i) => ({
    name, value, color: colors[i % colors.length],
  }));

  const totalRevenue = invoices.reduce((s, i) => s + (i.total ?? 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount ?? 0), 0);

  return (
    <AppLayout>
      <PageHeader title={t("analyticsPage.title")} description={t("analyticsPage.description")} />
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("analyticsPage.expenseBreakdown")}</CardTitle>
              </CardHeader>
              <CardContent>
                {expenseData.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t("analyticsPage.noExpenseData")}</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={expenseData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {expenseData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("analyticsPage.summary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">{t("analyticsPage.revenue")}</span>
                  <span className="font-mono font-semibold">{formatCurrency(totalRevenue)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">{t("analyticsPage.expenses")}</span>
                  <span className="font-mono font-semibold">{formatCurrency(totalExpenses)}</span>
                </div>
                <div className={`flex justify-between py-2 font-bold text-lg ${totalRevenue - totalExpenses >= 0 ? "text-success" : "text-destructive"}`}>
                  <span>{t("analyticsPage.profit")}</span>
                  <span className="font-mono">{formatCurrency(totalRevenue - totalExpenses)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AppLayout>
  );
}
