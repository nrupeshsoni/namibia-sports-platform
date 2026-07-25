import { useState } from "react";
import { Link } from "wouter";
import { Brain, Calendar, Loader2, Newspaper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminFederationFilter } from "@/pages/admin/AdminFederationFilter";
import { safeHttpsHref } from "@/lib/safeHref";
import { trpc } from "@/lib/trpc";

type SuggestionRow = {
  title: string;
  summary: string;
  date?: string | null;
  sourceUrl?: string | null;
  confidence: number;
  federationHint?: string | null;
  federationId: number | null;
};

/**
 * Platform Admin — Content Sync (Intelligence).
 * AI returns research leads; Create Draft always writes unpublished rows.
 */
export function AdminContentSyncPanel() {
  const [federationId, setFederationId] = useState<number | null>(null);
  const [kind, setKind] = useState<"news" | "events" | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionRow[]>([]);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draftMsg, setDraftMsg] = useState<string | null>(null);

  const statusQuery = trpc.contentSync.status.useQuery();
  const utils = trpc.useUtils();

  const suggestNews = trpc.contentSync.suggestNews.useMutation({
    onSuccess: (data) => {
      setKind("news");
      setSuggestions(data.suggestions);
      setDisclaimer(data.disclaimer);
      setProvider(data.provider);
      setError(null);
      setDraftMsg(null);
    },
    onError: (err) => setError(err.message),
  });

  const suggestEvents = trpc.contentSync.suggestEvents.useMutation({
    onSuccess: (data) => {
      setKind("events");
      setSuggestions(data.suggestions);
      setDisclaimer(data.disclaimer);
      setProvider(data.provider);
      setError(null);
      setDraftMsg(null);
    },
    onError: (err) => setError(err.message),
  });

  const createNewsDraft = trpc.contentSync.createNewsDraft.useMutation({
    onSuccess: (data) => {
      setDraftMsg(`News draft #${data.id} created (unpublished). Review under News.`);
      utils.adminStats.counts.invalidate();
    },
    onError: (err) => setError(err.message),
  });

  const createEventDraft = trpc.contentSync.createEventDraft.useMutation({
    onSuccess: (data) => {
      const note = data.startDatePlaceholder
        ? " (placeholder start date — correct before publish)"
        : "";
      setDraftMsg(`Event draft #${data.id} created (unpublished)${note}. Review under Events.`);
      utils.adminStats.counts.invalidate();
    },
    onError: (err) => setError(err.message),
  });

  const batchZeroNews = trpc.contentSync.batchDraftZeroNews.useMutation({
    onSuccess: (data) => {
      const n = data.created.length;
      const skip = data.skipped.length;
      setDraftMsg(
        `Zero-news batch: ${n} unpublished draft${n === 1 ? "" : "s"} created` +
          (skip ? `; ${skip} skipped` : "") +
          (data.remainingZeroNews > 0
            ? `. ~${data.remainingZeroNews} federations still have zero published news — run again after review.`
            : ". No zero-news federations remain.")
      );
      setProvider(data.provider);
      setDisclaimer(data.disclaimer);
      setError(null);
      utils.adminStats.counts.invalidate();
    },
    onError: (err) => setError(err.message),
  });

  const busy =
    suggestNews.isPending ||
    suggestEvents.isPending ||
    createNewsDraft.isPending ||
    createEventDraft.isPending ||
    batchZeroNews.isPending;

  const status = statusQuery.data;
  const available = status?.available === true;

  const createDraft = (row: SuggestionRow) => {
    setError(null);
    const fedId = row.federationId ?? federationId;
    if (fedId == null) {
      setError("Pick a federation (or choose one whose name matches the suggestion) before creating a draft.");
      return;
    }
    const suggestion = {
      title: row.title,
      summary: row.summary,
      date: row.date ?? null,
      sourceUrl: row.sourceUrl ?? null,
      confidence: row.confidence,
      federationHint: row.federationHint ?? null,
    };
    if (kind === "events") {
      createEventDraft.mutate({ federationId: fedId, suggestion });
    } else {
      createNewsDraft.mutate({ federationId: fedId, suggestion });
    }
  };

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl p-6 space-y-3"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="flex items-start gap-3">
          <Brain className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-medium text-white">Content Sync</h2>
            <p className="text-sm text-gray-400 mt-1 max-w-3xl">
              AI research assist for federation news topics and event candidates.
              Suggestions are leads only — Create Draft always saves unpublished
              content. Verified publish stays human.
            </p>
          </div>
        </div>

        {statusQuery.isLoading ? (
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Checking AI availability…
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="outline" className="border-white/20 text-gray-300">
              {status?.provider === "workers-ai"
                ? "Cloudflare Workers AI"
                : status?.provider === "anthropic"
                  ? "Anthropic"
                  : "No AI provider"}
            </Badge>
            <Badge
              variant="outline"
              className={
                available
                  ? "border-emerald-500/40 text-emerald-400"
                  : "border-amber-500/40 text-amber-400"
              }
            >
              {available ? "Ready" : "Unavailable"}
            </Badge>
            <span className="text-gray-500">{status?.message}</span>
          </div>
        )}

        {!available && status && (
          <p className="text-sm text-amber-200/90">
            {status.manualCmsHint}{" "}
            <Link href="/admin" className="underline text-amber-300 hover:text-amber-200">
              Stay in Admin
            </Link>{" "}
            and use the News / Events tabs.
          </p>
        )}
      </div>

      <AdminFederationFilter
        value={federationId}
        onChange={setFederationId}
        label="Federation scope (All = multi-federation leads)"
      />

      <div className="flex flex-wrap gap-3">
        <Button
          className="gap-2 bg-red-600 hover:bg-red-700 text-white"
          disabled={!available || busy}
          onClick={() =>
            suggestNews.mutate({ federationId: federationId ?? undefined })
          }
        >
          {suggestNews.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Newspaper className="h-4 w-4" />
          )}
          Suggest news topics
        </Button>
        <Button
          className="gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/15"
          disabled={!available || busy}
          onClick={() =>
            suggestEvents.mutate({ federationId: federationId ?? undefined })
          }
        >
          {suggestEvents.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Calendar className="h-4 w-4" />
          )}
          Find event candidates
        </Button>
        <Button
          className="gap-2 bg-amber-700/80 hover:bg-amber-700 text-white"
          disabled={!available || busy}
          onClick={() => batchZeroNews.mutate({ maxFederations: 17 })}
          title="Creates unpublished AI drafts for federations with zero published news. Never auto-publishes."
        >
          {batchZeroNews.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Draft zero-news federations
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        Zero-news batch: one AI call → up to 17 unpublished news drafts. Review under News before
        publish. Rate-limited (3 runs / 10 min).
      </p>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      {draftMsg && (
        <p className="text-sm text-emerald-400" role="status">
          {draftMsg}
        </p>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Sparkles className="h-4 w-4 text-amber-400" />
            {kind === "events" ? "Event candidates" : "News topics"}
            {provider ? ` · ${provider}` : ""}
          </div>
          {disclaimer && (
            <p className="text-xs text-amber-200/80">{disclaimer}</p>
          )}
          <ul className="space-y-3">
            {suggestions.map((row, i) => {
              const sourceHref = safeHttpsHref(row.sourceUrl);
              return (
              <li
                key={`${row.title}-${i}`}
                className="rounded-xl p-4 space-y-2"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-medium">{row.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{row.summary}</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                      {row.date && <span>Date: {row.date}</span>}
                      {row.federationHint && (
                        <span>Fed hint: {row.federationHint}</span>
                      )}
                      <span>Confidence: {Math.round(row.confidence * 100)}%</span>
                      {sourceHref && (
                        <a
                          href={sourceHref}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-400 hover:underline truncate max-w-xs"
                        >
                          Source
                        </a>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-amber-600/90 hover:bg-amber-600 text-white shrink-0"
                    disabled={busy}
                    onClick={() => createDraft(row)}
                  >
                    Create draft
                  </Button>
                </div>
              </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
