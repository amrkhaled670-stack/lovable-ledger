import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const assets = {
  current: [
    { name: "Cash", amount: 89450.00 },
    { name: "Accounts Receivable", amount: 34200.00 },
    { name: "Inventory", amount: 15600.00 },
  ],
  fixed: [
    { name: "Equipment", amount: 45000.00 },
  ],
};

const liabilities = {
  current: [
    { name: "Accounts Payable", amount: 12800.00 },
  ],
  longTerm: [
    { name: "Notes Payable", amount: 25000.00 },
  ],
};

const equity = [
  { name: "Owner's Equity", amount: 100000.00 },
  { name: "Retained Earnings", amount: 46450.00 },
];

const totalCurrentAssets = assets.current.reduce((s, a) => s + a.amount, 0);
const totalFixedAssets = assets.fixed.reduce((s, a) => s + a.amount, 0);
const totalAssets = totalCurrentAssets + totalFixedAssets;
const totalCurrentLiab = liabilities.current.reduce((s, l) => s + l.amount, 0);
const totalLongTermLiab = liabilities.longTerm.reduce((s, l) => s + l.amount, 0);
const totalLiabilities = totalCurrentLiab + totalLongTermLiab;
const totalEquity = equity.reduce((s, e) => s + e.amount, 0);

function LineItem({ label, amount, bold = false, indent = false }: { label: string; amount: number; bold?: boolean; indent?: boolean }) {
  return (
    <div className={`flex justify-between py-1.5 ${bold ? 'font-bold' : ''} ${indent ? 'pl-4' : ''}`}>
      <span className={bold ? '' : 'text-muted-foreground text-sm'}>{label}</span>
      <span className="font-mono text-sm">${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
    </div>
  );
}

export default function BalanceSheet() {
  return (
    <AppLayout>
      <PageHeader title="Balance Sheet" description="As of April 8, 2026" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
        <Card>
          <CardHeader className="text-center border-b">
            <CardTitle className="text-lg">AccuBooks Inc.</CardTitle>
            <p className="text-sm text-muted-foreground">Balance Sheet</p>
            <p className="text-xs text-muted-foreground">As of April 8, 2026</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">Assets</h3>
              <p className="text-xs font-medium text-muted-foreground mt-2 mb-1">Current Assets</p>
              {assets.current.map((a) => <LineItem key={a.name} label={a.name} amount={a.amount} indent />)}
              <LineItem label="Total Current Assets" amount={totalCurrentAssets} bold />
              <p className="text-xs font-medium text-muted-foreground mt-3 mb-1">Fixed Assets</p>
              {assets.fixed.map((a) => <LineItem key={a.name} label={a.name} amount={a.amount} indent />)}
              <LineItem label="Total Fixed Assets" amount={totalFixedAssets} bold />
              <Separator className="my-2" />
              <LineItem label="Total Assets" amount={totalAssets} bold />
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">Liabilities</h3>
              <p className="text-xs font-medium text-muted-foreground mt-2 mb-1">Current Liabilities</p>
              {liabilities.current.map((l) => <LineItem key={l.name} label={l.name} amount={l.amount} indent />)}
              <LineItem label="Total Current Liabilities" amount={totalCurrentLiab} bold />
              <p className="text-xs font-medium text-muted-foreground mt-3 mb-1">Long-term Liabilities</p>
              {liabilities.longTerm.map((l) => <LineItem key={l.name} label={l.name} amount={l.amount} indent />)}
              <Separator className="my-2" />
              <LineItem label="Total Liabilities" amount={totalLiabilities} bold />
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">Equity</h3>
              {equity.map((e) => <LineItem key={e.name} label={e.name} amount={e.amount} indent />)}
              <Separator className="my-2" />
              <LineItem label="Total Equity" amount={totalEquity} bold />
            </div>

            <Separator />
            <LineItem label="Total Liabilities & Equity" amount={totalLiabilities + totalEquity} bold />
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
