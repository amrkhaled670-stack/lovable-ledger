import { useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

type Account = { id: string; code: string; name: string };
type Line = {
  id: string;
  account_id: string;
  debit: number | null;
  credit: number | null;
  journal_entry_id: string;
};
type Entry = {
  id: string;
  entry_number: string;
  date: string;
  description: string | null;
};

export default function AmericanJournal() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const { data: accounts = [], isLoading: loadingAccounts } = useQuery<Account[]>({
    queryKey: ["aj_accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("id, code, name")
        .order("code");
      if (error) throw error;
      return data as Account[];
    },
    enabled: !!user,
  });

  const { data: entries = [], isLoading: loadingEntries } = useQuery<Entry[]>({
    queryKey: ["aj_entries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("id, entry_number, date, description")
        .order("date", { ascending: true });
      if (error) throw error;
      return data as Entry[];
    },
    enabled: !!user,
  });

  const { data: lines = [], isLoading: loadingLines } = useQuery<Line[]>({
    queryKey: ["aj_lines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_entry_lines")
        .select("id, account_id, debit, credit, journal_entry_id");
      if (error) throw error;
      return data as Line[];
    },
    enabled: !!user,
  });

  const isLoading = loadingAccounts || loadingEntries || loadingLines;

  // Build matrix: rows = entries, columns = accounts (each split into Dr/Cr).
  // Also compute column totals + row totals.
  const { rows, columnTotals, grandDebit, grandCredit } = useMemo(() => {
    const linesByEntry = new Map<string, Line[]>();
    for (const l of lines) {
      const arr = linesByEntry.get(l.journal_entry_id) ?? [];
      arr.push(l);
      linesByEntry.set(l.journal_entry_id, arr);
    }

    const colTotals = new Map<string, { debit: number; credit: number }>();
    accounts.forEach((a) => colTotals.set(a.id, { debit: 0, credit: 0 }));

    let gDebit = 0;
    let gCredit = 0;

    const rows = entries.map((entry) => {
      const cells = new Map<string, { debit: number; credit: number }>();
      let rowDebit = 0;
      let rowCredit = 0;
      const entryLines = linesByEntry.get(entry.id) ?? [];
      for (const l of entryLines) {
        const cur = cells.get(l.account_id) ?? { debit: 0, credit: 0 };
        const d = Number(l.debit ?? 0);
        const c = Number(l.credit ?? 0);
        cur.debit += d;
        cur.credit += c;
        cells.set(l.account_id, cur);
        rowDebit += d;
        rowCredit += c;
        const ct = colTotals.get(l.account_id);
        if (ct) {
          ct.debit += d;
          ct.credit += c;
        }
      }
      gDebit += rowDebit;
      gCredit += rowCredit;
      return { entry, cells, rowDebit, rowCredit };
    });

    return { rows, columnTotals: colTotals, grandDebit: gDebit, grandCredit: gCredit };
  }, [accounts, entries, lines]);

  const formatCell = (n: number) => (n > 0 ? formatCurrency(n) : "—");

  return (
    <AppLayout>
      <PageHeader title={t("americanJournal.title")} description={t("americanJournal.description")} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th rowSpan={2} className="sticky left-0 bg-muted/50 z-10 border-b border-r p-2 text-left font-semibold text-muted-foreground whitespace-nowrap">
                      {t("americanJournal.date")}
                    </th>
                    <th rowSpan={2} className="border-b border-r p-2 text-left font-semibold text-muted-foreground whitespace-nowrap">
                      {t("americanJournal.entryNumber")}
                    </th>
                    <th rowSpan={2} className="border-b border-r p-2 text-left font-semibold text-muted-foreground min-w-[160px]">
                      {t("americanJournal.description_label")}
                    </th>
                    {accounts.map((a) => (
                      <th
                        key={a.id}
                        colSpan={2}
                        className="border-b border-r p-2 text-center font-semibold text-foreground whitespace-nowrap bg-primary/5"
                      >
                        <div className="font-mono text-[10px] text-muted-foreground">{a.code}</div>
                        <div>{a.name}</div>
                      </th>
                    ))}
                    <th colSpan={2} className="border-b border-r p-2 text-center font-semibold text-muted-foreground bg-accent/10">
                      {t("americanJournal.totals")}
                    </th>
                  </tr>
                  <tr className="bg-muted/30">
                    {accounts.map((a) => (
                      <>
                        <th key={`${a.id}-d`} className="border-b border-r p-1.5 text-right font-medium text-success/80 text-[10px] uppercase">
                          {t("americanJournal.debit")}
                        </th>
                        <th key={`${a.id}-c`} className="border-b border-r p-1.5 text-right font-medium text-destructive/80 text-[10px] uppercase">
                          {t("americanJournal.credit")}
                        </th>
                      </>
                    ))}
                    <th className="border-b border-r p-1.5 text-right font-medium text-success/80 text-[10px] uppercase">{t("americanJournal.debit")}</th>
                    <th className="border-b border-r p-1.5 text-right font-medium text-destructive/80 text-[10px] uppercase">{t("americanJournal.credit")}</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={3 + accounts.length * 2 + 2} className="p-3">
                          <Skeleton className="h-5 w-full" />
                        </td>
                      </tr>
                    ))
                  ) : entries.length === 0 || accounts.length === 0 ? (
                    <tr>
                      <td colSpan={3 + accounts.length * 2 + 2} className="p-8 text-center text-muted-foreground">
                        {t("americanJournal.noData")}
                      </td>
                    </tr>
                  ) : (
                    rows.map(({ entry, cells, rowDebit, rowCredit }) => (
                      <tr key={entry.id} className="hover:bg-muted/20 transition-colors">
                        <td className="sticky left-0 bg-background z-10 border-b border-r p-2 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                          {entry.date}
                        </td>
                        <td className="border-b border-r p-2 font-mono text-[11px] font-semibold whitespace-nowrap">
                          {entry.entry_number}
                        </td>
                        <td className="border-b border-r p-2 text-foreground/80">
                          {entry.description || "—"}
                        </td>
                        {accounts.map((a) => {
                          const cell = cells.get(a.id) ?? { debit: 0, credit: 0 };
                          return (
                            <>
                              <td
                                key={`${entry.id}-${a.id}-d`}
                                className={cn(
                                  "border-b border-r p-2 text-right font-mono text-[11px]",
                                  cell.debit > 0 && "text-success font-semibold bg-success/5"
                                )}
                              >
                                {formatCell(cell.debit)}
                              </td>
                              <td
                                key={`${entry.id}-${a.id}-c`}
                                className={cn(
                                  "border-b border-r p-2 text-right font-mono text-[11px]",
                                  cell.credit > 0 && "text-destructive font-semibold bg-destructive/5"
                                )}
                              >
                                {formatCell(cell.credit)}
                              </td>
                            </>
                          );
                        })}
                        <td className="border-b border-r p-2 text-right font-mono text-[11px] font-semibold bg-accent/5">
                          {formatCell(rowDebit)}
                        </td>
                        <td className="border-b border-r p-2 text-right font-mono text-[11px] font-semibold bg-accent/5">
                          {formatCell(rowCredit)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {!isLoading && entries.length > 0 && accounts.length > 0 && (
                  <tfoot>
                    <tr className="bg-primary/10 font-bold">
                      <td colSpan={3} className="sticky left-0 bg-primary/10 z-10 border-t border-r p-2 text-right uppercase text-[11px] tracking-wide">
                        {t("americanJournal.totals")}
                      </td>
                      {accounts.map((a) => {
                        const ct = columnTotals.get(a.id) ?? { debit: 0, credit: 0 };
                        return (
                          <>
                            <td key={`tot-${a.id}-d`} className="border-t border-r p-2 text-right font-mono text-[11px] text-success">
                              {formatCell(ct.debit)}
                            </td>
                            <td key={`tot-${a.id}-c`} className="border-t border-r p-2 text-right font-mono text-[11px] text-destructive">
                              {formatCell(ct.credit)}
                            </td>
                          </>
                        );
                      })}
                      <td className="border-t border-r p-2 text-right font-mono text-[11px] text-success">{formatCurrency(grandDebit)}</td>
                      <td className="border-t border-r p-2 text-right font-mono text-[11px] text-destructive">{formatCurrency(grandCredit)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}