import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { MapPin, Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Warehouses() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", description: "" });

  const { data: warehouses = [], isLoading } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("warehouses").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("warehouses").insert({
        name: form.name,
        location: form.location || null,
        description: form.description || null,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      setOpen(false);
      setForm({ name: "", location: "", description: "" });
      toast.success(t("warehouses.createdSuccess"));
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <AppLayout>
      <PageHeader
        title={t("warehouses.title")}
        description={t("warehouses.description")}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("warehouses.addWarehouse")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("warehouses.newWarehouse")}</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div><Label>{t("warehouses.name")}</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t("warehouses.namePlaceholder")} /></div>
                <div><Label>{t("warehouses.location")}</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder={t("warehouses.locationPlaceholder")} /></div>
                <div><Label>{t("warehouses.description")}</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                <Button onClick={() => createMutation.mutate()} disabled={!form.name || createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}{t("warehouses.createWarehouse")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-lg" />)}
          </div>
        ) : warehouses.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">{t("warehouses.noWarehouses")}</CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warehouses.map((w) => (
              <Card key={w.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-1">{w.name}</h3>
                  {w.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />{w.location}
                    </div>
                  )}
                  {w.description && <p className="text-xs text-muted-foreground">{w.description}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}
