import { Route, Switch } from "wouter";
import LoginPage from "./pages/LoginPage";
import CakesPage from "./pages/CakesPage";
import CakeDetailPage from "./pages/CakeDetailPage";
import SavedLettersPage from "./pages/SavedLettersPage";
import NotFound from "./pages/NotFound";
import { useAuthState } from "./hooks/useAuth";

function Router() {
  const { isAuthenticated } = useAuthState();

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/">
        {isAuthenticated ? <CakesPage /> : <LoginPage />}
      </Route>
      <Route path="/cakes" component={CakesPage} />
      <Route path="/cake/:shareToken" component={CakeDetailPage} />
      <Route path="/saved-letters" component={SavedLettersPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <Router />
  );
}

export default App;
