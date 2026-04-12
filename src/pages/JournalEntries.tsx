import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function JournalEntries() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ entry_number: "", description: "", total_debit: "", total_credit: "" });

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["journal_entries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("journal_entries").insert({
        entry_number: form.entry_number,
        description: form.description || null,
        total_debit: form.total_debit ? parseFloat(form.total_debit) : 0,
        total_credit: form.total_credit ? parseFloat(form.total_credit) : 0,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal_entries"] });
      setOpen(false);
      setForm({ entry_number: "", description: "", total_debit: "", total_credit: "" });
      toast.success("Journal entry created");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <AppLayout>
      <PageHeader
        title="Journal Entries"
        description="Record and manage journal entries"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Entry</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Journal Entry</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div><Label>Entry Number</Label><Input value={form.entry_number} onChange={e => setForm(f => ({ ...f, entry_number: e.target.value }))} placeholder="JE-001" /></div>
                <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Office supplies purchase" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Total Debit</Label><Input type="number" value={form.total_debit} onChange={e => setForm(f => ({ ...f, total_debit: e.target.value }))} placeholder="0.00" /></div>
                  <div><Label>Total Credit</Label><Input type="number" value={form.total_credit} onChange={e => setForm(f => ({ ...f, total_credit: e.target.value }))} placeholder="0.00" /></div>
                </div>
                <Button onClick={() => createMutation.mutate()} disabled={!form.entry_number || createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Create Entry
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
                    <th className="text-left p-3 font-medium text-muted-foreground">Entry #</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Description</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Debit</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b"><td colSpan={6} className="p-3"><Skeleton className="h-5 w-full" /></td></tr>
                    ))
                  ) : entries.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No journal entries yet. Click "New Entry" to get started.</td></tr>
                  ) : (
                    entries.map((entry) => (
                      <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono text-xs font-semibold">{entry.entry_number}</td>
                        <td className="p-3 font-mono text-xs text-muted-foreground">{entry.date}</td>
                        <td className="p-3">{entry.description || "—"}</td>
                        <td className="p-3">
                          <Badge variant={entry.status === "posted" ? "default" : "secondary"}>{entry.status}</Badge>
                        </td>
                        <td className="p-3 text-right font-mono">${(entry.total_debit ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className="p-3 text-right font-mono">${(entry.total_credit ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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
