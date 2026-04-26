import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { t } = useTranslation();
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotMode) {
      setLoading(true);
      const { error } = await resetPassword(email);
      setLoading(false);
      if (error) {
        toast({ variant: "destructive", title: t("auth.errorTitle"), description: error.message });
      } else {
        toast({ title: t("auth.resetEmailSent") });
        setForgotMode(false);
      }
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: t("auth.errorTitle"), description: t("auth.loginError") });
    } else {
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
          <CardTitle className="text-xl">{forgotMode ? t("auth.forgotPassword") : t("auth.loginTitle")}</CardTitle>
          <CardDescription>{forgotMode ? t("auth.resetPasswordSubtitle") : t("auth.loginSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {!forgotMode && (
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "..." : forgotMode ? t("auth.resetPassword") : t("auth.login")}
            </Button>
          </form>

          {!forgotMode && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">{t("auth.orContinueWith")}</span></div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => signInWithGoogle()}>
                {t("auth.google")}
              </Button>
            </>
          )}

          <div className="mt-4 text-center text-sm space-y-1">
            <button type="button" onClick={() => setForgotMode(!forgotMode)} className="text-primary hover:underline text-xs">
              {forgotMode ? t("auth.login") : t("auth.forgotPassword")}
            </button>
            {!forgotMode && (
              <p className="text-muted-foreground">
                {t("auth.noAccount")}{" "}
                <Link to="/signup" className="text-primary hover:underline">{t("auth.signup")}</Link>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
