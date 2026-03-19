/**
 * Mobile bottom navigation bar — visible on small screens only (md:hidden).
 * Provides quick access to Events, News, Live, Federations, Home.
 */

import { Link, useLocation } from "wouter";
import { Home, Calendar, Newspaper, Radio, Users } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "Live", href: "/live", icon: Radio },
  { label: "Federations", href: "/#federations", icon: Users },
] as const;

const HIDE_NAV_PATHS = ["/login", "/register", "/admin"];

export default function MobileBottomNav() {
  const [location] = useLocation();
  const hide = HIDE_NAV_PATHS.some((p) => location === p || location.startsWith(p + "/"));

  if (hide) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? location === "/"
              : item.href === "/#federations"
                ? location === "/" // Federations scrolls to #federations on home
                : location.startsWith(item.href.split("?")[0]);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={`flex min-h-[56px] min-w-[56px] flex-col items-center justify-center gap-0.5 px-2 py-2 transition-colors ${
                  isActive ? "text-red-400" : "text-gray-400"
                }`}
                style={{ minHeight: "calc(56px + env(safe-area-inset-bottom, 0px) / 2)" }}
              >
                <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
