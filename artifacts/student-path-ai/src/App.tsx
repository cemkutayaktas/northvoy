import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AccountProvider, useAccount } from "@/contexts/AccountContext";
import { lazy, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// GA4 page-view tracking + canonical tag update for SPA route changes
function usePageTracking() {
  const [location] = useLocation();
  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: location,
        page_location: window.location.href,
      });
    }
    // Update canonical tag to match current route
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      canonical.href = "https://northvoy.com" + (location === "/" ? "" : location);
    }
  }, [location]);
}

import { Navbar } from "@/components/layout/Navbar";

// Critical path — load eagerly
import Home from "@/pages/Home";
import Questionnaire from "@/pages/Questionnaire";
import Results from "@/pages/Results";

// Secondary pages — lazy-loaded to reduce initial bundle
const About = lazy(() => import("@/pages/About"));
const Auth = lazy(() => import("@/pages/Auth"));
const Account = lazy(() => import("@/pages/Account"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Compare = lazy(() => import("@/pages/Compare"));
const Tracker = lazy(() => import("@/pages/Tracker"));
const Turkiye = lazy(() => import("@/pages/Turkiye"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

const queryClient = new QueryClient();

function Router() {
  const { loading } = useAccount();
  usePageTracking();

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
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Suspense fallback={<PageLoader />}>
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
                <Route path="/turkiye" component={Turkiye} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </motion.div>
        </AnimatePresence>
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
