import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AccountProvider, useAccount } from "@/contexts/AccountContext";

import { Navbar } from "@/components/layout/Navbar";

import Home from "@/pages/Home";
import Questionnaire from "@/pages/Questionnaire";
import Results from "@/pages/Results";
import About from "@/pages/About";
import Auth from "@/pages/Auth";
import Account from "@/pages/Account";
import ResetPassword from "@/pages/ResetPassword";
import Compare from "@/pages/Compare";
import Tracker from "@/pages/Tracker";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  const { loading } = useAccount();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/questionnaire" component={Questionnaire} />
          <Route path="/results" component={Results} />
          <Route path="/about" component={About} />
          <Route path="/auth" component={Auth} />
          <Route path="/account" component={Account} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/compare" component={Compare} />
          <Route path="/tracker" component={Tracker} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AccountProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster position="top-right" richColors closeButton />
            </TooltipProvider>
          </QueryClientProvider>
        </AccountProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
