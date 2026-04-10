import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Plus, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

const suppliers = [
  { id: 1, name: "TechSupply Co.", email: "orders@techsupply.com", phone: "(555) 111-2222", country: "USA" },
  { id: 2, name: "Office World", email: "sales@officeworld.com", phone: "(555) 333-4444", country: "UK" },
  { id: 3, name: "Global Parts Inc.", email: "info@globalparts.com", phone: "(555) 555-6666", country: "Germany" },
];

export default function Suppliers() {
  const { t } = useTranslation();
  return (
    <AppLayout>
      <PageHeader
        title={t("suppliers.title")}
        description={t("suppliers.description")}
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("suppliers.addSupplier")}</Button>}
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((s) => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2">{s.name}</h3>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Mail className="h-3 w-3" />{s.email}</div>
                  <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{s.phone}</div>
                  <p className="text-xs">{s.country}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </AppLayout>
  );
}
