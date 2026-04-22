import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CakeProvider } from "./contexts/CakeContext";
import Home from "./pages/Home";
import CustomizePage from "./pages/CustomizePage";
import CakePage from "./pages/CakePage";
import SavedLettersPage from "./pages/SavedLettersPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/customize" component={CustomizePage} />
      <Route path="/cake/:id" component={CakePage} />
      <Route path="/saved-letters" component={SavedLettersPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <CakeProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CakeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
