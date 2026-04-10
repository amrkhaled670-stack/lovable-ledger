import {
  LayoutDashboard, BookOpen, FileText, Landmark, Scale, BarChart3, Receipt,
  CreditCard, Users, Settings, LogOut, Package, Truck, Warehouse, ShoppingCart,
  PieChart, DollarSign,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const mainItems = [
    { title: t("nav.dashboard"), url: "/", icon: LayoutDashboard },
    { title: t("nav.chartOfAccounts"), url: "/accounts", icon: BookOpen },
    { title: t("nav.journalEntries"), url: "/journal", icon: FileText },
    { title: t("nav.generalLedger"), url: "/ledger", icon: Landmark },
    { title: t("nav.trialBalance"), url: "/trial-balance", icon: Scale },
  ];

  const reportItems = [
    { title: t("nav.incomeStatement"), url: "/income-statement", icon: BarChart3 },
    { title: t("nav.balanceSheet"), url: "/balance-sheet", icon: BarChart3 },
    { title: t("nav.analytics"), url: "/analytics", icon: PieChart },
  ];

  const transactionItems = [
    { title: t("nav.invoices"), url: "/invoices", icon: Receipt },
    { title: t("nav.payments"), url: "/payments", icon: CreditCard },
    { title: t("nav.customers"), url: "/customers", icon: Users },
    { title: t("nav.expenses"), url: "/expenses", icon: DollarSign },
  ];

  const inventoryItems = [
    { title: t("nav.products"), url: "/inventory", icon: Package },
    { title: t("nav.suppliers"), url: "/suppliers", icon: Truck },
    { title: t("nav.warehouses"), url: "/warehouses", icon: Warehouse },
    { title: t("nav.purchaseOrders"), url: "/purchase-orders", icon: ShoppingCart },
  ];

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[10px] tracking-widest font-semibold">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                <NavLink to={item.url} end={item.url === "/"} className="transition-colors" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Landmark className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-sm font-bold text-sidebar-foreground tracking-tight">{t("app.name")}</h2>
              <p className="text-[10px] text-sidebar-foreground/50">{t("app.subtitle")}</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup(t("nav.overview"), mainItems)}
        {renderGroup(t("nav.reports"), reportItems)}
        {renderGroup(t("nav.transactions"), transactionItems)}
        {renderGroup(t("nav.inventory"), inventoryItems)}
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={t("nav.settings")}>
              <NavLink to="/settings" activeClassName="bg-sidebar-accent text-sidebar-primary">
                <Settings className="h-4 w-4" />
                {!collapsed && <span>{t("nav.settings")}</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={t("nav.logout")} onClick={signOut}>
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>{t("nav.logout")}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
