import { Link, useParams } from "wouter";
import { Calendar, ChevronLeft, MapPin, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";

function formatDate(date: Date | string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-NA", { day: "numeric", month: "short", year: "numeric" });
}

export default function EventDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const query = trpc.events.getBySlug.useQuery({ slug });
  if (query.isLoading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="animate-pulse w-24 h-24 rounded-2xl bg-white/10" /></div>;
  if (!query.data) return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-serif mb-4">Event Not Found</h1>
      <Link href="/events"><button className="px-6 py-3 rounded-xl bg-red-600 text-white">Back to Events</button></Link>
    </div>
  );
  const ev = query.data;
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white container mx-auto px-4 py-8">
      <Link href="/events"><button className="flex items-center gap-2 mb-6"><ChevronLeft className="w-5 h-5" />Back to Events</button></Link>
      <div className="rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <h1 className="text-3xl font-serif mb-4">{ev.name}</h1>
        <p className="text-gray-300 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" />{formatDate(ev.startDate)}{ev.endDate ? ` – ${formatDate(ev.endDate)}` : ""}</p>
        {ev.location && <p className="text-gray-300 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" />{ev.location}{ev.region ? `, ${ev.region}` : ""}</p>}
        {ev.federationSlug && <Link href={`/federation/${ev.federationSlug}/events`}><span className="inline-flex items-center gap-2 text-sm text-red-300"><Users className="w-4 h-4" />{ev.federationName ?? "Federation"}</span></Link>}
        {ev.description && <p className="mt-6 text-gray-300 whitespace-pre-wrap">{ev.description}</p>}
      </div>
    </div>
  );
}
