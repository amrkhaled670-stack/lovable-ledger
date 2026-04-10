import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ChartOfAccounts from "./pages/ChartOfAccounts";
import JournalEntries from "./pages/JournalEntries";
import GeneralLedger from "./pages/GeneralLedger";
import TrialBalance from "./pages/TrialBalance";
import IncomeStatement from "./pages/IncomeStatement";
import BalanceSheet from "./pages/BalanceSheet";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Customers from "./pages/Customers";
import Expenses from "./pages/Expenses";
import Analytics from "./pages/Analytics";
import Inventory from "./pages/Inventory";
import Suppliers from "./pages/Suppliers";
import Warehouses from "./pages/Warehouses";
import PurchaseOrders from "./pages/PurchaseOrders";
import SettingsPage from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedApp({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<ProtectedApp><Dashboard /></ProtectedApp>} />
              <Route path="/accounts" element={<ProtectedApp><ChartOfAccounts /></ProtectedApp>} />
              <Route path="/journal" element={<ProtectedApp><JournalEntries /></ProtectedApp>} />
              <Route path="/ledger" element={<ProtectedApp><GeneralLedger /></ProtectedApp>} />
              <Route path="/trial-balance" element={<ProtectedApp><TrialBalance /></ProtectedApp>} />
              <Route path="/income-statement" element={<ProtectedApp><IncomeStatement /></ProtectedApp>} />
              <Route path="/balance-sheet" element={<ProtectedApp><BalanceSheet /></ProtectedApp>} />
              <Route path="/invoices" element={<ProtectedApp><Invoices /></ProtectedApp>} />
              <Route path="/payments" element={<ProtectedApp><Payments /></ProtectedApp>} />
              <Route path="/customers" element={<ProtectedApp><Customers /></ProtectedApp>} />
              <Route path="/expenses" element={<ProtectedApp><Expenses /></ProtectedApp>} />
              <Route path="/analytics" element={<ProtectedApp><Analytics /></ProtectedApp>} />
              <Route path="/inventory" element={<ProtectedApp><Inventory /></ProtectedApp>} />
              <Route path="/suppliers" element={<ProtectedApp><Suppliers /></ProtectedApp>} />
              <Route path="/warehouses" element={<ProtectedApp><Warehouses /></ProtectedApp>} />
              <Route path="/purchase-orders" element={<ProtectedApp><PurchaseOrders /></ProtectedApp>} />
              <Route path="/settings" element={<ProtectedApp><SettingsPage /></ProtectedApp>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
