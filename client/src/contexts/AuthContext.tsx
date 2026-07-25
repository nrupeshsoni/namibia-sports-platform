import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AuthContextValue {
  user: SupabaseUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  /**
   * `needsEmailConfirmation` is true when Supabase created the account but
   * returned no session (mailer autoconfirm is off). The caller must not treat
   * that as being signed in.
   */
  signUp: (
    email: string,
    password: string,
    name?: string,
    options?: { termsAccepted?: boolean }
  ) => Promise<{ error: Error | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ?? null };
  }, []);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      name?: string,
      options?: { termsAccepted?: boolean }
    ) => {
      const acceptedAt = new Date().toISOString();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // The project's global Site URL serves 15+ products, so the
          // confirmation link has to be told where to come back to.
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            ...(name ? { full_name: name } : {}),
            ...(options?.termsAccepted
              ? {
                  terms_accepted_at: acceptedAt,
                  privacy_accepted_at: acceptedAt,
                }
              : {}),
          },
        },
      });
      return {
        error: error ?? null,
        needsEmailConfirmation: !error && data.session === null,
      };
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    return { error: error ?? null };
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
