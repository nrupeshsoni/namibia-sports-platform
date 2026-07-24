import { useLocation } from "wouter";
import ErrorBoundary from "@/components/ErrorBoundary";
import FederationShell from "./FederationLayout";

/** Wrapper that extracts slug from path and renders FederationShell */
export default function FederationRoute() {
  const [location] = useLocation();
  const match = location.match(/^\/federation\/([^/]+)/);
  const slug = match ? match[1] : "";

  if (!slug) {
    return null; // Will be caught by 404
  }

  return (
    <ErrorBoundary>
      <FederationShell slug={slug} />
    </ErrorBoundary>
  );
}
