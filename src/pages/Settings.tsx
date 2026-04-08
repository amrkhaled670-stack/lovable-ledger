import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AppLayout>
      <PageHeader title="Settings" description="Manage your accounting system preferences" />
      <div className="max-w-2xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Company Name</span>
              <span className="font-medium">AccuBooks Inc.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fiscal Year</span>
              <span className="font-medium">January - December</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Currency</span>
              <span className="font-medium">USD ($)</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Database and authentication powered by Lovable Cloud.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
