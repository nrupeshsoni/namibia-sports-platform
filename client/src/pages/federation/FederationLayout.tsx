import { useLocation, Link } from "wouter";
import { ChevronLeft, Loader2, Home, Calendar, Users, User, Newspaper, Radio } from "lucide-react";
import type { FederationContextValue } from "@/contexts/FederationContext";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { FederationProvider } from "@/contexts/FederationContext";
import FederationHome from "./FederationHome";
import FederationEvents from "./FederationEvents";
import FederationClubs from "./FederationClubs";
import FederationAthletes from "./FederationAthletes";
import FederationNews from "./FederationNews";
import FederationStreams from "./FederationStreams";

const TABS = [
  { path: "", label: "Home", icon: Home },
  { path: "events", label: "Events", icon: Calendar },
  { path: "clubs", label: "Clubs", icon: Users },
  { path: "athletes", label: "Athletes", icon: User },
  { path: "news", label: "News", icon: Newspaper },
  { path: "streams", label: "Streams", icon: Radio },
] as const;

function getCurrentTab(pathname: string, slug: string): string {
  const base = `/federation/${slug}`;
  if (pathname === base || pathname === `${base}/`) return "";
  const rest = pathname.slice(base.length).replace(/^\//, "");
  const segment = rest.split("/")[0];
  return TABS.some((t) => t.path === segment) ? segment : "";
}

function FederationShell(props: { slug: string }) {
  const { slug } = props;
  const [location] = useLocation();
  const federationQuery = trpc.federations.getBySlug.useQuery({ slug });

  const federation = federationQuery.data ?? null;
  const isLoading = federationQuery.isLoading;
  const is404 = !isLoading && !federation;
  const currentTab = getCurrentTab(location, slug);

  if (isLoading) {
    return <FederationLayoutSkeleton slug={slug} />;
  }

  if (is404) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-serif mb-4">Federation Not Found</h1>
        <p className="text-gray-400 mb-6">The federation &quot;{slug}&quot; could not be found.</p>
        <Link href="/">
          <button
            className="px-6 py-3 rounded-xl text-white font-medium"
            style={{
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))",
            }}
          >
            Back to Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <FederationProvider
      value={{
        federation: federation as FederationContextValue["federation"],
        slug,
        isLoading: false,
        is404: false,
      }}
    >
      <FederationLayoutInner federation={federation!} slug={slug} currentTab={currentTab} />
    </FederationProvider>
  );
}

/** Federation shape from federations.getBySlug */
interface FederationData {
  id: number;
  name: string;
  abbreviation: string | null;
  type: string;
  description: string | null;
  logo: string | null;
  backgroundImage: string | null;
  slug?: string | null;
}

function FederationLayoutInner({
  federation,
  slug,
  currentTab,
}: {
  federation: FederationData;
  slug: string;
  currentTab: string;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Banner - Glassmorphism */}
      <header
        className="relative overflow-hidden"
        style={{
          background: federation.backgroundImage
            ? `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%), url(${federation.backgroundImage})`
            : "linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(10, 10, 10, 0.95))",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(1px)",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <button
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
                style={{ backdropFilter: "blur(10px)" }}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back</span>
              </button>
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              {federation.logo ? (
                <img
                  src={federation.logo}
                  alt={federation.name}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <span className="text-3xl font-serif text-white/80">
                  {federation.abbreviation || federation.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-white mb-2 tracking-wide">
                {federation.name}
              </h1>
              {federation.description && (
                <p className="text-gray-300 text-sm md:text-base max-w-2xl line-clamp-2">
                  {federation.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation - Glass */}
      <nav
        className="sticky top-0 z-40 border-b"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 py-2">
            {TABS.map((tab) => {
              const href = tab.path ? `/federation/${slug}/${tab.path}` : `/federation/${slug}`;
              const isActive = currentTab === tab.path;
              const Icon = tab.icon;
              return (
                <Link key={tab.path || "home"} href={href}>
                  <button
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      isActive ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(220, 38, 38, 0.4))"
                        : "rgba(255, 255, 255, 0.05)",
                      border: isActive ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid transparent",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="container mx-auto px-4 py-8">
        {currentTab === "" && <FederationHome />}
        {currentTab === "events" && <FederationEvents />}
        {currentTab === "clubs" && <FederationClubs />}
        {currentTab === "athletes" && <FederationAthletes />}
        {currentTab === "news" && <FederationNews />}
        {currentTab === "streams" && <FederationStreams />}
      </main>
    </div>
  );
}

function FederationLayoutSkeleton({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-32 mb-6 bg-white/10" />
        <div className="flex gap-6">
          <Skeleton className="w-24 h-24 rounded-2xl bg-white/10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-10 w-64 bg-white/10" />
            <Skeleton className="h-4 w-full max-w-md bg-white/10" />
            <Skeleton className="h-4 w-full max-w-sm bg-white/10" />
          </div>
        </div>
      </header>
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-xl bg-white/10" />
          ))}
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      </main>
    </div>
  );
}

export default FederationShell;
