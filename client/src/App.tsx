import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import CakesPage from "./pages/CakesPage";
import CakeDetailPage from "./pages/CakeDetailPage";
import CakeShareResultPage from "./pages/CakeShareResultPage";
import SavedLettersPage from "./pages/SavedLettersPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";
import { trackPageView } from "./lib/analytics";
import { DesktopGuard } from "./components/product/DesktopGuard";

function AnalyticsTracker() {
  const [location] = useLocation();
  useEffect(() => {
    trackPageView(location);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <AnalyticsTracker />
      <Toaster position="top-center" richColors />
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={LandingPage} />
        <Route path="/cakes" component={CakesPage} />
        <Route path="/cake/:shareToken/result" component={CakeShareResultPage} />
        <Route path="/cake/:shareToken" component={CakeDetailPage} />
        <Route path="/saved-letters" component={SavedLettersPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/about" component={AboutPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <DesktopGuard>
      <Router />
    </DesktopGuard>
  );
}

export default App;
