import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartFilters } from "@/components/SmartFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Payments() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ payment_number: "", amount: "", method: "cash", reference: "", date: new Date().toISOString().slice(0, 10) });

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("payments").select("*, customers(name)").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("payments").insert({
        payment_number: form.payment_number,
        amount: parseFloat(form.amount),
        method: form.method,
        reference: form.reference || null,
        date: form.date,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setOpen(false);
      setForm({ payment_number: "", amount: "", method: "cash", reference: "", date: new Date().toISOString().slice(0, 10) });
      toast.success("Payment recorded");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = payments.filter((p) =>
    !search || p.payment_number.toLowerCase().includes(search.toLowerCase()) || (p.reference?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AppLayout>
      <PageHeader
        title="Payments"
        description="Track incoming and outgoing payments"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />Record Payment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
                <div><Label>Payment # *</Label><Input value={form.payment_number} onChange={(e) => setForm({ ...form, payment_number: e.target.value })} placeholder="PAY-001" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Amount *</Label><Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
                  <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
                </div>
                <div><Label>Method</Label>
                  <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Reference</Label><Input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} /></div>
                <Button onClick={() => createMutation.mutate()} disabled={!form.payment_number || !form.amount || createMutation.isPending}>
                  {createMutation.isPending ? "Saving..." : "Save Payment"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <SmartFilters searchValue={search} onSearchChange={setSearch} onClear={() => setSearch("")} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {isLoading ? <Skeleton className="h-64 rounded-xl" /> : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-start p-3 font-medium text-muted-foreground">Payment #</th>
                      <th className="text-start p-3 font-medium text-muted-foreground">Date</th>
                      <th className="text-start p-3 font-medium text-muted-foreground">Reference</th>
                      <th className="text-start p-3 font-medium text-muted-foreground">Customer</th>
                      <th className="text-start p-3 font-medium text-muted-foreground">Method</th>
                      <th className="text-end p-3 font-medium text-muted-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((pay) => (
                      <tr key={pay.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono text-xs font-semibold">{pay.payment_number}</td>
                        <td className="p-3 font-mono text-xs text-muted-foreground">{pay.date}</td>
                        <td className="p-3 text-xs">{pay.reference || "—"}</td>
                        <td className="p-3">{(pay.customers as any)?.name || "—"}</td>
                        <td className="p-3 text-muted-foreground capitalize">{pay.method?.replace("_", " ")}</td>
                        <td className="p-3 text-end font-mono font-medium">${pay.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No payments found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </AppLayout>
  );
}
