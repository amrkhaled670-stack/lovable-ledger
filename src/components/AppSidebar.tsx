import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Landmark,
  Scale,
  BarChart3,
  Receipt,
  CreditCard,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Chart of Accounts", url: "/accounts", icon: BookOpen },
  { title: "Journal Entries", url: "/journal", icon: FileText },
  { title: "General Ledger", url: "/ledger", icon: Landmark },
  { title: "Trial Balance", url: "/trial-balance", icon: Scale },
];

const reportItems = [
  { title: "Income Statement", url: "/income-statement", icon: BarChart3 },
  { title: "Balance Sheet", url: "/balance-sheet", icon: BarChart3 },
];

const transactionItems = [
  { title: "Invoices", url: "/invoices", icon: Receipt },
  { title: "Payments", url: "/payments", icon: CreditCard },
  { title: "Customers", url: "/customers", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[10px] tracking-widest font-semibold">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.url)}
                tooltip={item.title}
              >
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="transition-colors"
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
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
              <h2 className="text-sm font-bold text-sidebar-foreground tracking-tight">AccuBooks</h2>
              <p className="text-[10px] text-sidebar-foreground/50">Accounting System</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Overview", mainItems)}
        {renderGroup("Reports", reportItems)}
        {renderGroup("Transactions", transactionItems)}
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <NavLink to="/settings" activeClassName="bg-sidebar-accent text-sidebar-primary">
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
