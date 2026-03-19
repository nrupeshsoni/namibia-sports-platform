import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Calendar,
  Users,
  User,
  Newspaper,
  Radio,
  Shield,
  ChevronLeft,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ADMIN_TABS = [
  { path: "", label: "Dashboard", icon: LayoutDashboard },
  { path: "events", label: "Events", icon: Calendar },
  { path: "clubs", label: "Clubs", icon: Users },
  { path: "athletes", label: "Athletes", icon: User },
  { path: "news", label: "News", icon: Newspaper },
  { path: "streams", label: "Streams", icon: Radio },
] as const;

function getAdminSection(pathname: string, slug: string): string {
  const base = `/federation/${slug}/admin`;
  if (pathname === base || pathname === `${base}/`) return "";
  if (!pathname.startsWith(base + "/")) return "";
  const rest = pathname.slice(base.length).replace(/^\//, "");
  return rest.split("/")[0] ?? "";
}

interface FedAdminLayoutProps {
  slug: string;
  federationId: number;
  federationName: string;
  children: React.ReactNode;
}

export function FedAdminLayout({
  slug,
  federationId,
  federationName,
  children,
}: FedAdminLayoutProps) {
  const [location] = useLocation();
  const currentSection = getAdminSection(location, slug);

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <header
        className="relative border-b"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          className="container mx-auto px-4 py-4"
          style={{ paddingTop: "calc(1rem + env(safe-area-inset-top, 0px))" }}
        >
          <div className="flex items-center gap-4">
            <Link href={`/federation/${slug}`}>
              <button
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
                style={{ backdropFilter: "blur(10px)" }}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back to {federationName}</span>
              </button>
            </Link>
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-8">
        <aside
          className="w-full md:w-56 flex-shrink-0"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 16,
            padding: "1rem",
          }}
        >
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {ADMIN_TABS.map((tab) => {
              const href = tab.path
                ? `/federation/${slug}/admin/${tab.path}`
                : `/federation/${slug}/admin`;
              const isActive = currentSection === tab.path;
              const Icon = tab.icon;
              return (
                <Link key={tab.path || "dashboard"} href={href}>
                  <button
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all w-full md:w-auto text-left ${
                      isActive ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(220, 38, 38, 0.4))"
                        : "transparent",
                      border: isActive ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid transparent",
                    }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {tab.label}
                  </button>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

export function FedAdminLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-10 w-48 bg-white/10" />
        </div>
      </header>
      <div className="container mx-auto px-4 py-6 flex gap-8">
        <Skeleton className="w-56 h-64 rounded-2xl bg-white/10 flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-96 w-full rounded-2xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}
