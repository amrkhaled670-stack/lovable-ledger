import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartFilters } from "@/components/SmartFilters";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

const expensesData = [
  { id: 1, date: "2026-04-08", description: "Office Supplies", category: "Office", amount: 450.00 },
  { id: 2, date: "2026-04-06", description: "Monthly Rent", category: "Rent", amount: 3200.00 },
  { id: 3, date: "2026-04-04", description: "Electricity Bill", category: "Utilities", amount: 285.00 },
  { id: 4, date: "2026-04-03", description: "Employee Salaries", category: "Salaries", amount: 5200.00 },
  { id: 5, date: "2026-04-01", description: "Internet Service", category: "Utilities", amount: 120.00 },
];

export default function Expenses() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return expensesData;
    return expensesData.filter((e) =>
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <AppLayout>
      <PageHeader
        title={t("expenses.title")}
        description={t("expenses.description")}
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("expenses.addExpense")}</Button>}
      />
      <SmartFilters searchValue={search} onSearchChange={setSearch} onClear={() => setSearch("")} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("expenses.date")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("expenses.description_label")}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t("expenses.category")}</th>
                    <th className="text-end p-3 font-medium text-muted-foreground">{t("expenses.amount")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs text-muted-foreground">{e.date}</td>
                      <td className="p-3">{e.description}</td>
                      <td className="p-3"><Badge variant="secondary">{e.category}</Badge></td>
                      <td className="p-3 text-end font-mono font-medium">${e.amount.toFixed(2)}</td>
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
