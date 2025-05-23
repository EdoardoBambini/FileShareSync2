import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Onboarding from "@/pages/Onboarding";
import ContentTypeSelection from "@/pages/ContentTypeSelection";
import ContentInput from "@/pages/ContentInput";
import ContentOutput from "@/pages/ContentOutput";
import Account from "@/pages/Account";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/content-type" component={ContentTypeSelection} />
          <Route path="/content-input" component={ContentInput} />
          <Route path="/content-output" component={ContentOutput} />
          <Route path="/account" component={Account} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
