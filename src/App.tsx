import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import ApiKeys from "@/pages/ApiKeys";
import Swap from "@/pages/Swap";
import YieldFarming from "@/pages/YieldFarming";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";
import { Dashboard as DashboardLayout } from "@/components/layout/Dashboard";
import { ThemeProvider } from "@/hooks/use-theme";


function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/api-keys" component={ApiKeys} />
        <Route path="/swap" component={Swap} />
        <Route path="/yield" component={YieldFarming} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="stablecoin-dashboard-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
