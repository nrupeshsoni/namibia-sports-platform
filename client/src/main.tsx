import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      // Auth is a Supabase JWT in the Authorization header, not a cookie.
      //
      // The server (server/_core/context.ts) builds a per-request Supabase
      // client from the anon key with this exact header forwarded, so Postgres
      // RLS evaluates as the signed-in user. Without this header every request
      // is anonymous and all protected/admin procedures reject.
      //
      // getSession() reads from local storage and refreshes the token when it
      // is close to expiry, so this stays valid across long sessions. It is
      // resolved per request rather than captured once, because the token
      // rotates.
      //
      // `credentials: "include"` was dropped along with the old cookie-based
      // Manus/WebDev OAuth flow — there is no cookie to send.
      async fetch(input, init) {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        const headers = new Headers(init?.headers);
        if (token) headers.set("Authorization", `Bearer ${token}`);

        return globalThis.fetch(input, { ...(init ?? {}), headers });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
