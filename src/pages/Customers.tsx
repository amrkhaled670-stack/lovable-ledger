import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

const customers = [
  { id: 1, name: "Acme Corporation", email: "billing@acme.com", phone: "(555) 100-2000", balance: 0, status: "Active" },
  { id: 2, name: "TechStart Inc.", email: "accounts@techstart.io", phone: "(555) 200-3000", balance: 8750.00, status: "Active" },
  { id: 3, name: "Global Services Ltd.", email: "finance@globalserv.com", phone: "(555) 300-4000", balance: 4200.00, status: "Active" },
  { id: 4, name: "Metro Consulting", email: "pay@metroconsult.com", phone: "(555) 400-5000", balance: 6300.00, status: "Overdue" },
  { id: 5, name: "Bright Solutions", email: "ar@brightsol.com", phone: "(555) 500-6000", balance: 0, status: "Active" },
  { id: 6, name: "Summit Digital", email: "hello@summitdigital.co", phone: "(555) 600-7000", balance: 9400.00, status: "Active" },
];

export default function Customers() {
  return (
    <AppLayout>
      <PageHeader
        title="Customers"
        description="Manage your customer directory"
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Customer</Button>}
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((cust) => (
            <Card key={cust.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold">{cust.name}</h3>
                  <Badge variant={cust.status === "Active" ? "default" : "destructive"} className="text-[10px]">
                    {cust.status}
                  </Badge>
                </div>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span>{cust.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>{cust.phone}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Outstanding Balance</span>
                  <span className={`font-mono font-semibold text-sm ${cust.balance > 0 ? 'text-warning' : 'text-success'}`}>
                    ${cust.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </AppLayout>
  );
}
