import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/currency";

export default function GeneralLedger() {
  const { user } = useAuth();

  const { data: lines = [], isLoading } = useQuery({
    queryKey: ["general_ledger"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_entry_lines")
        .select("*, journal_entries(entry_number, date, description), accounts(name)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <AppLayout>
      <PageHeader title="General Ledger" description="Complete record of all financial transactions" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Ref</th>
                    <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Description</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Account</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Debit</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b"><td colSpan={6} className="p-3"><Skeleton className="h-5 w-full" /></td></tr>
                    ))
                  ) : lines.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No ledger entries yet. Create journal entries to populate.</td></tr>
                  ) : (
                    lines.map((line) => (
                      <tr key={line.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono text-xs text-muted-foreground">{(line.journal_entries as any)?.date}</td>
                        <td className="p-3 font-mono text-xs font-semibold">{(line.journal_entries as any)?.entry_number}</td>
                        <td className="p-3 hidden sm:table-cell">{(line.journal_entries as any)?.description || "—"}</td>
                        <td className="p-3 text-muted-foreground">{(line.accounts as any)?.name || "—"}</td>
                        <td className="p-3 text-right font-mono">{(line.debit ?? 0) > 0 ? formatCurrency(line.debit ?? 0) : "—"}</td>
                        <td className="p-3 text-right font-mono">{(line.credit ?? 0) > 0 ? formatCurrency(line.credit ?? 0) : "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
