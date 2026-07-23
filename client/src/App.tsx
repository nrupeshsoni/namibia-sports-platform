import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import OfflineBanner from "@/components/OfflineBanner";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import MobileBottomNav from "@/components/MobileBottomNav";
import { SearchCommandPalette } from "@/components/SearchCommandPalette";
import { isAiChatEnabled } from "@/lib/features";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Events from "./pages/Events";
import News from "./pages/News";
import Live from "./pages/Live";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import FederationRoute from "./pages/federation/FederationRoute";
import AthleteProfile from "./pages/athletes/AthleteProfile";
import { SeoHead } from "./components/SeoHead";

const Admin = lazy(() => import("./pages/Admin"));
const Map = lazy(() => import("./pages/Map"));
const AIChatAssistant = lazy(() => import("@/components/AIChatAssistant"));

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gray-400 text-sm">
      Loading…
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path="/athletes/:slug" component={AthleteProfile} />
        <Route path="/events" component={Events} />
        <Route path="/news/:slug" component={News} />
        <Route path="/news" component={News} />
        <Route path="/live" component={Live} />
        <Route path="/map" component={Map} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/admin" component={Admin} />
        <Route path="/federation/:slug" component={FederationRoute} />
        <Route path="/federation/:slug/admin" component={FederationRoute} />
        <Route path="/federation/:slug/admin/:section" component={FederationRoute} />
        <Route path="/federation/:slug/events" component={FederationRoute} />
        <Route path="/federation/:slug/clubs" component={FederationRoute} />
        <Route path="/federation/:slug/athletes" component={FederationRoute} />
        <Route path="/federation/:slug/news" component={FederationRoute} />
        <Route path="/federation/:slug/streams" component={FederationRoute} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
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
            <SeoHead />
            <OfflineBanner />
            <Toaster />
            <main className={showMobileNav ? "pb-[72px] md:pb-0" : ""}>
              <Router />
            </main>
            <SearchCommandPalette />
            {isAiChatEnabled() && (
              <Suspense fallback={null}>
                <AIChatAssistant />
              </Suspense>
            )}
            <PWAInstallBanner />
            <MobileBottomNav />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
