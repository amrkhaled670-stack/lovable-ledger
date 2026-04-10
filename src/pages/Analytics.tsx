import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const expenseData = [
  { name: "Rent", value: 38400, color: "hsl(217, 91%, 40%)" },
  { name: "Salaries", value: 20300, color: "hsl(152, 60%, 40%)" },
  { name: "Office", value: 5200, color: "hsl(38, 92%, 50%)" },
  { name: "Utilities", value: 3420, color: "hsl(0, 72%, 51%)" },
];

const monthlyData = [
  { month: "Jan", revenue: 28000, expenses: 18000, profit: 10000 },
  { month: "Feb", revenue: 32000, expenses: 20000, profit: 12000 },
  { month: "Mar", revenue: 35000, expenses: 16000, profit: 19000 },
  { month: "Apr", revenue: 29580, expenses: 13320, profit: 16260 },
];

export default function Analytics() {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <PageHeader title={t("analyticsPage.title")} description={t("analyticsPage.description")} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("analyticsPage.expenseBreakdown")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={expenseData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {expenseData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("analyticsPage.monthlyProfitLoss")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-muted-foreground" tick={{ fontSize: 12 }} />
                  <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="revenue" name={t("analyticsPage.revenue")} fill="hsl(152, 60%, 40%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name={t("analyticsPage.expenses")} fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name={t("analyticsPage.profit")} fill="hsl(217, 91%, 40%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
