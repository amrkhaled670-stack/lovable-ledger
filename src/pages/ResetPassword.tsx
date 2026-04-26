import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const { t } = useTranslation();
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: t("auth.errorTitle"), description: error.message });
    } else {
      toast({ title: t("auth.passwordUpdated") });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-14 w-14 rounded-xl bg-white ring-1 ring-border flex items-center justify-center mb-2 overflow-hidden">
            <img src="/phoenix-logo.png" alt="Phoenix" className="h-12 w-12 object-contain" width={56} height={56} />
          </div>
          <CardTitle className="text-xl">{t("auth.resetPassword")}</CardTitle>
          <CardDescription>{t("auth.resetPasswordSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t("auth.newPassword")}</Label>
              <Input id="newPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "..." : t("auth.updatePassword")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
