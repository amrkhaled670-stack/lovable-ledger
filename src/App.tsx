import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/accounts" element={<ChartOfAccounts />} />
          <Route path="/journal" element={<JournalEntries />} />
          <Route path="/ledger" element={<GeneralLedger />} />
          <Route path="/trial-balance" element={<TrialBalance />} />
          <Route path="/income-statement" element={<IncomeStatement />} />
          <Route path="/balance-sheet" element={<BalanceSheet />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
