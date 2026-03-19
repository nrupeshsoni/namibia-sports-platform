"use client";

import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { trpc } from "@/lib/trpc";
import {
  Building2,
  Calendar,
  Newspaper,
  Users,
  User,
  Loader2,
} from "lucide-react";

/** Global search command palette triggered by Cmd+K / Ctrl+K */
export function SearchCommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data, isLoading, isFetching } = trpc.search.global.useQuery(
    { query },
    { enabled: open && query.length >= 2 }
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        if (!open) setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const navigateAndClose = useCallback(
    (path: string) => {
      setLocation(path);
      setOpen(false);
      setQuery("");
    },
    [setLocation]
  );

  const federations = data?.federations ?? [];
  const events = data?.events ?? [];
  const news = data?.news ?? [];
  const clubs = data?.clubs ?? [];
  const athletes = data?.athletes ?? [];

  const hasResults =
    federations.length > 0 ||
    events.length > 0 ||
    news.length > 0 ||
    clubs.length > 0 ||
    athletes.length > 0;

  return (
    <CommandDialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQuery("");
      }}
      title="Global Search"
      description="Search federations, events, news, clubs, and athletes"
      className="max-w-2xl [&_[data-slot=command]]:bg-[rgba(10,10,10,0.95)] [&_[data-slot=command]]:backdrop-blur-[20px] [&_[data-slot=command]]:border [&_[data-slot=command]]:border-white/10"
    >
      <CommandInput
        placeholder="Search federations, events, news, clubs, athletes..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[400px]">
        {query.length < 2 && (
          <div className="py-8 text-center text-gray-400 text-sm">
            Type at least 2 characters to search
          </div>
        )}
        {query.length >= 2 && isLoading && (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        )}
        {query.length >= 2 && !isLoading && !hasResults && !isFetching && (
          <CommandEmpty>No results found</CommandEmpty>
        )}
        {query.length >= 2 && hasResults && (
          <>
            {federations.length > 0 && (
              <CommandGroup heading="Federations">
                {federations.map((f) => {
                  const slug = f.slug ?? `fed-${f.id}`;
                  return (
                    <CommandItem
                      key={`fed-${f.id}`}
                      value={`federation-${f.id}`}
                      onSelect={() => navigateAndClose(`/federation/${slug}`)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{f.name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
            {events.length > 0 && (
              <CommandGroup heading="Events">
                {events.map((e) => (
                  <CommandItem
                    key={`evt-${e.id}`}
                    value={`event-${e.id}`}
                    onSelect={() =>
                      navigateAndClose(`/events${e.slug ? `?slug=${e.slug}` : ""}`)
                    }
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{e.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {news.length > 0 && (
              <CommandGroup heading="News">
                {news.map((n) => (
                  <CommandItem
                    key={`news-${n.id}`}
                    value={`news-${n.id}`}
                    onSelect={() => navigateAndClose(`/news/${n.slug}`)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Newspaper className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{n.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {clubs.length > 0 && (
              <CommandGroup heading="Clubs">
                {clubs.map((c) =>
                  c.federationSlug ? (
                    <CommandItem
                      key={`club-${c.id}`}
                      value={`club-${c.id}`}
                      onSelect={() =>
                        navigateAndClose(
                          `/federation/${c.federationSlug}/clubs`
                        )
                      }
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{c.name}</span>
                    </CommandItem>
                  ) : (
                    <CommandItem
                      key={`club-${c.id}`}
                      value={`club-${c.id}`}
                      className="flex items-center gap-3 opacity-75"
                    >
                      <Users className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{c.name}</span>
                    </CommandItem>
                  )
                )}
              </CommandGroup>
            )}
            {athletes.length > 0 && (
              <CommandGroup heading="Athletes">
                {athletes.map((a) => {
                  const fullName = `${a.firstName} ${a.lastName}`;
                  return a.federationSlug ? (
                    <CommandItem
                      key={`ath-${a.id}`}
                      value={`athlete-${a.id}`}
                      onSelect={() =>
                        navigateAndClose(
                          `/federation/${a.federationSlug}/athletes`
                        )
                      }
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-green-400 shrink-0" />
                      <span>{fullName}</span>
                    </CommandItem>
                  ) : (
                    <CommandItem
                      key={`ath-${a.id}`}
                      value={`athlete-${a.id}`}
                      className="flex items-center gap-3 opacity-75"
                    >
                      <User className="w-4 h-4 text-green-400 shrink-0" />
                      <span>{fullName}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
