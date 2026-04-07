import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AccountProvider, useAccount } from "@/contexts/AccountContext";
import { lazy, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Per-route SEO metadata ──────────────────────────────────────────────────
const ROUTE_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "NorthVoy — Discover Your Ideal University Major",
    description: "Find your ideal university major in 5 minutes. NorthVoy matches high school students with 20+ majors, career paths, and universities across 60+ countries.",
  },
  "/questionnaire": {
    title: "University Major Quiz — NorthVoy",
    description: "Answer 9 questions about your interests, strengths, and goals to discover which university major fits you best. Free, instant results.",
  },
  "/results": {
    title: "Your Results — NorthVoy",
    description: "See your personalized university major matches, career paths, skill breakdowns, and university suggestions across 60+ countries.",
  },
  "/about": {
    title: "About NorthVoy — How It Works & Our Team",
    description: "Learn how NorthVoy's 9-question quiz helps students find their ideal university major. Meet the team and see how our matching engine works.",
  },
  "/compare": {
    title: "Compare University Majors — NorthVoy",
    description: "Compare up to 3 university majors side-by-side — skills, career paths, top countries, costs, and more. Free comparison tool by NorthVoy.",
  },
  "/turkiye": {
    title: "Turkey University Guide — NorthVoy",
    description: "Complete guide for studying in Turkey: top universities, YKS exam types, tuition fees, QS rankings, and scholarships for studying abroad.",
  },
  "/tracker": {
    title: "Application Tracker — NorthVoy",
    description: "Track your university applications and deadlines in one place. Manage statuses, notes, and never miss a deadline.",
  },
  "/auth": {
    title: "Sign In — NorthVoy",
    description: "Create a free NorthVoy account to save your results, track applications, and access all features.",
  },
  "/account": {
    title: "My Account — NorthVoy",
    description: "Manage your NorthVoy account settings, saved results, and preferences.",
  },
};

// GA4 page-view tracking + canonical tag + per-route meta updates for SPA
function usePageTracking() {
  const [location] = useLocation();
  useEffect(() => {
    // GA4 page-view tracking
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: location,
        page_location: window.location.href,
      });
    }

    // Per-route title & description
    const meta = ROUTE_META[location] ?? ROUTE_META["/"]!;
    document.title = meta.title;

    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute("content", meta.description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", meta.description);

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute("content", meta.title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute("content", meta.description);

    // Update canonical tag to match current route
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://northvoy.com" + (location === "/" ? "" : location);

    // Update og:url
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", "https://northvoy.com" + (location === "/" ? "" : location));
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
