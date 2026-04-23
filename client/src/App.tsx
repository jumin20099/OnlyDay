import { Route, Switch } from "wouter";
import LoginPage from "./pages/LoginPage";
import CakesPage from "./pages/CakesPage";
import CakeDetailPage from "./pages/CakeDetailPage";
import CakeShareResultPage from "./pages/CakeShareResultPage";
import SavedLettersPage from "./pages/SavedLettersPage";
import NotFound from "./pages/NotFound";
import { useAuthState } from "./hooks/useAuth";
import { Toaster } from "sonner";

function Router() {
  const { isAuthenticated } = useAuthState();

  return (
    <>
      <Toaster position="top-center" richColors />
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/">
          {isAuthenticated ? <CakesPage /> : <LoginPage />}
        </Route>
        <Route path="/cakes">{isAuthenticated ? <CakesPage /> : <LoginPage />}</Route>
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
