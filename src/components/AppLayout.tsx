import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useTheme } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Languages } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" dir={isRTL ? "rtl" : "ltr"}>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card px-3 sm:px-4 gap-2 shrink-0 z-20">
            <SidebarTrigger />
            <div className="flex-1" />
            <Button variant="ghost" size="icon" onClick={toggleLanguage} className="h-8 w-8 shrink-0">
              <Languages className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 shrink-0">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </header>
          <main className="flex-1 overflow-auto p-3 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
