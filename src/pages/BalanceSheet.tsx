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
import { useTranslation } from "react-i18next";

function LineItem({ label, amount, bold = false, indent = false }: { label: string; amount: number; bold?: boolean; indent?: boolean }) {
  return (
    <div className={`flex justify-between py-1.5 ${bold ? 'font-bold' : ''} ${indent ? 'ps-4' : ''}`}>
      <span className={bold ? '' : 'text-muted-foreground text-sm'}>{label}</span>
      <span className="font-mono text-sm">{formatCurrency(amount)}</span>
    </div>
  );
}

export default function BalanceSheet() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("accounts").select("name, type, sub_type, balance").order("code");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const assetAccounts = accounts.filter(a => a.type === "asset");
  const liabilityAccounts = accounts.filter(a => a.type === "liability");
  const equityAccounts = accounts.filter(a => a.type === "equity");

  const totalAssets = assetAccounts.reduce((s, a) => s + (a.balance ?? 0), 0);
  const totalLiabilities = liabilityAccounts.reduce((s, a) => s + (a.balance ?? 0), 0);
  const totalEquity = equityAccounts.reduce((s, a) => s + (a.balance ?? 0), 0);

  return (
    <AppLayout>
      <PageHeader title={t("balanceSheet.title")} description={t("balanceSheet.description")} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
        {isLoading ? <Skeleton className="h-64 rounded-xl" /> : (
          <Card>
            <CardHeader className="text-center border-b">
              <CardTitle className="text-lg">{t("balanceSheet.title")}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">{t("balanceSheet.assets")}</h3>
                {assetAccounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">{t("balanceSheet.noAssets")}</p>
                ) : assetAccounts.map((a) => <LineItem key={a.name} label={a.name} amount={a.balance ?? 0} indent />)}
                <Separator className="my-2" />
                <LineItem label={t("balanceSheet.totalAssets")} amount={totalAssets} bold />
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">{t("balanceSheet.liabilities")}</h3>
                {liabilityAccounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">{t("balanceSheet.noLiabilities")}</p>
                ) : liabilityAccounts.map((l) => <LineItem key={l.name} label={l.name} amount={l.balance ?? 0} indent />)}
                <Separator className="my-2" />
                <LineItem label={t("balanceSheet.totalLiabilities")} amount={totalLiabilities} bold />
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">{t("balanceSheet.equity")}</h3>
                {equityAccounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">{t("balanceSheet.noEquity")}</p>
                ) : equityAccounts.map((e) => <LineItem key={e.name} label={e.name} amount={e.balance ?? 0} indent />)}
                <Separator className="my-2" />
                <LineItem label={t("balanceSheet.totalEquity")} amount={totalEquity} bold />
              </div>
              <Separator />
              <LineItem label={t("balanceSheet.totalLiabilitiesEquity")} amount={totalLiabilities + totalEquity} bold />
            </CardContent>
          </Card>
        )}
      </motion.div>
    </AppLayout>
  );
}
