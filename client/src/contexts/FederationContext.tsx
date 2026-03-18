import { createContext, useContext, type ReactNode } from "react";

/** Federation shape from tRPC federations.getBySlug */
export interface FederationContextValue {
  federation: {
    id: number;
    name: string;
    abbreviation: string | null;
    type: string;
    description: string | null;
    logo: string | null;
    backgroundImage: string | null;
    slug: string | null;
    [key: string]: unknown;
  } | null;
  slug: string;
  isLoading: boolean;
  is404: boolean;
}

const FederationContext = createContext<FederationContextValue | null>(null);

export function FederationProvider({
  value,
  children,
}: {
  value: FederationContextValue;
  children: ReactNode;
}) {
  return (
    <FederationContext.Provider value={value}>
      {children}
    </FederationContext.Provider>
  );
}

export function useFederation(): FederationContextValue {
  const ctx = useContext(FederationContext);
  if (!ctx) {
    throw new Error("useFederation must be used within FederationProvider");
  }
  return ctx;
}
