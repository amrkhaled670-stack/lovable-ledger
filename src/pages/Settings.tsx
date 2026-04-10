import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  return (
    <AppLayout>
      <PageHeader title={t("settings.title")} description={t("settings.description")} />
      <div className="max-w-2xl space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">{t("settings.companyInfo")}</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{t("settings.companyName")}</span><span className="font-medium">AccuBooks Inc.</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("settings.fiscalYear")}</span><span className="font-medium">January - December</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("settings.currency")}</span><span className="font-medium">USD ($)</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">{t("settings.appearance")}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t("settings.theme")}: {theme === "dark" ? t("settings.dark") : t("settings.light")}</Label>
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t("settings.language")}: {i18n.language === "ar" ? t("settings.arabic") : t("settings.english")}</Label>
              <Switch checked={i18n.language === "ar"} onCheckedChange={toggleLanguage} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">{t("settings.system")}</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground"><p>{t("settings.systemInfo")}</p></CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
