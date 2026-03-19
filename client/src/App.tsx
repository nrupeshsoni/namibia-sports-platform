import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import AIChatAssistant from "@/components/AIChatAssistant";
import OfflineBanner from "@/components/OfflineBanner";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Events from "./pages/Events";
import News from "./pages/News";
import Live from "./pages/Live";
import Admin from "./pages/Admin";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import FederationRoute from "./pages/federation/FederationRoute";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/events" component={Events} />
      <Route path="/news/:slug" component={News} />
      <Route path="/news" component={News} />
      <Route path="/live" component={Live} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin" component={Admin} />
      <Route path="/federation/:slug" component={FederationRoute} />
      <Route path="/federation/:slug/events" component={FederationRoute} />
      <Route path="/federation/:slug/clubs" component={FederationRoute} />
      <Route path="/federation/:slug/athletes" component={FederationRoute} />
      <Route path="/federation/:slug/news" component={FederationRoute} />
      <Route path="/federation/:slug/streams" component={FederationRoute} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

const HIDE_NAV_PATHS = ["/login", "/register", "/admin"];

function App() {
  const [location] = useLocation();
  const showMobileNav = !HIDE_NAV_PATHS.some((p) => location === p || location.startsWith(p + "/"));

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <OfflineBanner />
            <Toaster />
            <main className={showMobileNav ? "pb-[72px] md:pb-0" : ""}>
              <Router />
            </main>
            <AIChatAssistant />
            <PWAInstallBanner />
            <MobileBottomNav />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
