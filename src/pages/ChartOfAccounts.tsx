import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const typeColors: Record<string, string> = {
  Asset: "bg-primary/10 text-primary",
  Liability: "bg-destructive/10 text-destructive",
  Equity: "bg-accent/10 text-accent",
  Revenue: "bg-success/10 text-success",
  Expense: "bg-warning/10 text-warning",
};

const accountTypes = ["Asset", "Liability", "Equity", "Revenue", "Expense"];
const subTypes: Record<string, string[]> = {
  Asset: ["Current Asset", "Fixed Asset", "Other Asset"],
  Liability: ["Current Liability", "Long-term Liability"],
  Equity: ["Equity", "Retained Earnings"],
  Revenue: ["Operating Revenue", "Other Revenue"],
  Expense: ["Operating Expense", "Cost of Goods Sold", "Other Expense"],
};

export default function ChartOfAccounts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", type: "Asset", sub_type: "", description: "" });

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .order("code");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("accounts").insert({
        code: form.code,
        name: form.name,
        type: form.type,
        sub_type: form.sub_type || null,
        description: form.description || null,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setOpen(false);
      setForm({ code: "", name: "", type: "Asset", sub_type: "", description: "" });
      toast.success("Account created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const getNormalSide = (type: string) =>
    ["Asset", "Expense"].includes(type) ? "Debit" : "Credit";

  return (
    <AppLayout>
      <PageHeader
        title="Chart of Accounts"
        description="Manage your general ledger accounts"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Account</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Code</Label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="1000" /></div>
                  <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Cash" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v, sub_type: "" }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{accountTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Subtype</Label>
                    <Select value={form.sub_type} onValueChange={v => setForm(f => ({ ...f, sub_type: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>{(subTypes[form.type] || []).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                <Button onClick={() => createMutation.mutate()} disabled={!form.code || !form.name || createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Create Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Code</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Account Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Subtype</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Normal</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b"><td colSpan={6} className="p-3"><Skeleton className="h-5 w-full" /></td></tr>
                    ))
                  ) : accounts.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No accounts yet. Click "Add Account" to get started.</td></tr>
                  ) : (
                    accounts.map((acc) => (
                      <tr key={acc.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                        <td className="p-3 font-mono text-xs font-semibold">{acc.code}</td>
                        <td className="p-3 font-medium">{acc.name}</td>
                        <td className="p-3">
                          <Badge variant="secondary" className={typeColors[acc.type] || ""}>{acc.type}</Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">{acc.sub_type || "—"}</td>
                        <td className="p-3 text-muted-foreground">{getNormalSide(acc.type)}</td>
                        <td className="p-3 text-right font-mono font-medium">
                          ${(acc.balance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
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
