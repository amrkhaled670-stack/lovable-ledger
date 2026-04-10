import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

const warehouses = [
  { id: 1, name: "Main Warehouse", location: "New York, NY", description: "Primary storage facility" },
  { id: 2, name: "West Coast Hub", location: "Los Angeles, CA", description: "Distribution center" },
];

export default function Warehouses() {
  const { t } = useTranslation();
  return (
    <AppLayout>
      <PageHeader title={t("warehouses.title")} description={t("warehouses.description")} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {warehouses.map((w) => (
            <Card key={w.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-1">{w.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />{w.location}
                </div>
                <p className="text-xs text-muted-foreground">{w.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </AppLayout>
  );
}
