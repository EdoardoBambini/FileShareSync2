import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import CookieConsent from "@/components/CookieConsent";
import AgeVerification from "@/components/AgeVerification";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Onboarding from "@/pages/Onboarding";
import ContentTypeSelection from "@/pages/ContentTypeSelection";
import ContentInput from "@/pages/ContentInput";
import ContentOutput from "@/pages/ContentOutput";
import ContentSuggestion from "@/pages/ContentSuggestion";
import Subscribe from "@/pages/Subscribe";
import Account from "@/pages/Account";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
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
          <Route path="/content-suggestion" component={ContentSuggestion} />
          <Route path="/content-type" component={ContentTypeSelection} />
          <Route path="/content-input" component={ContentInput} />
          <Route path="/content-output" component={ContentOutput} />
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/account" component={Account} />
        </>
      )}
      {/* Pagine legali accessibili a tutti */}
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          {/* Compliance Components */}
          <AgeVerification />
          <CookieConsent />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
