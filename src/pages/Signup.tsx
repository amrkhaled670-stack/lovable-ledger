import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const { t } = useTranslation();
  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, { full_name: fullName, company_name: companyName });
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: t("auth.errorTitle"), description: t("auth.signupError") });
    } else {
      toast({ title: t("auth.checkEmail") });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-14 w-14 rounded-xl bg-white ring-1 ring-border flex items-center justify-center mb-2 overflow-hidden">
            <img src="/phoenix-logo.png" alt="Phoenix" className="h-12 w-12 object-contain" width={56} height={56} />
          </div>
          <CardTitle className="text-xl">{t("auth.signupTitle")}</CardTitle>
          <CardDescription>{t("auth.signupSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t("auth.fullName")}</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">{t("auth.companyName")}</Label>
              <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "..." : t("auth.signup")}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">{t("auth.orContinueWith")}</span></div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => signInWithGoogle()}>
            {t("auth.google")}
          </Button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t("auth.hasAccount")}{" "}
            <Link to="/login" className="text-primary hover:underline">{t("auth.login")}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
