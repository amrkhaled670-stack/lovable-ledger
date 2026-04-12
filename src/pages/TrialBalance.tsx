import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/currency";

export default function TrialBalance() {
  const { user } = useAuth();

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("accounts").select("code, name, type, balance").order("code");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const rows = accounts.map(a => {
    const isDebitNormal = ["asset", "expense"].includes(a.type);
    const bal = a.balance ?? 0;
    return {
      code: a.code,
      name: a.name,
      debit: isDebitNormal ? bal : 0,
      credit: !isDebitNormal ? bal : 0,
    };
  });

  const totalDebit = rows.reduce((s, r) => s + r.debit, 0);
  const totalCredit = rows.reduce((s, r) => s + r.credit, 0);

  return (
    <AppLayout>
      <PageHeader title="Trial Balance" description="Verify debits equal credits" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {isLoading ? <Skeleton className="h-64 rounded-xl" /> : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[400px]">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium text-muted-foreground">Code</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Account</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Debit</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No accounts yet</td></tr>
                    ) : rows.map((row) => (
                      <tr key={row.code} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono text-xs font-semibold">{row.code}</td>
                        <td className="p-3">{row.name}</td>
                        <td className="p-3 text-right font-mono">{row.debit > 0 ? formatCurrency(row.debit) : ''}</td>
                        <td className="p-3 text-right font-mono">{row.credit > 0 ? formatCurrency(row.credit) : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                  {rows.length > 0 && (
                    <tfoot>
                      <tr className="bg-muted/50 font-bold">
                        <td className="p-3" colSpan={2}>Totals</td>
                        <td className="p-3 text-right font-mono">{formatCurrency(totalDebit)}</td>
                        <td className="p-3 text-right font-mono">{formatCurrency(totalCredit)}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </AppLayout>
  );
}
