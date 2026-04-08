import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
              <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
              {change && (
                <p className={`text-xs font-medium ${
                  changeType === "positive" ? "text-success" :
                  changeType === "negative" ? "text-destructive" :
                  "text-muted-foreground"
                }`}>
                  {change}
                </p>
              )}
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
