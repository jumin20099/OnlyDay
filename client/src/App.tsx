import { Route, Switch } from "wouter";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import CakesPage from "./pages/CakesPage";
import CakeDetailPage from "./pages/CakeDetailPage";
import CakeShareResultPage from "./pages/CakeShareResultPage";
import SavedLettersPage from "./pages/SavedLettersPage";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";

function Router() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={LandingPage} />
        <Route path="/cakes" component={CakesPage} />
        <Route path="/cake/:shareToken/result" component={CakeShareResultPage} />
        <Route path="/cake/:shareToken" component={CakeDetailPage} />
        <Route path="/saved-letters" component={SavedLettersPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <Router />
  );
}

export default App;
