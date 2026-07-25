import { Link, useParams } from "wouter";
import { Building2, ChevronLeft, ExternalLink, MapPin, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { safeHttpsHref } from "@/lib/safeHref";

export default function ClubDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const query = trpc.clubs.getBySlug.useQuery({ slug });
  if (query.isLoading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="animate-pulse w-24 h-24 rounded-2xl bg-white/10" /></div>;
  if (!query.data) return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-serif mb-4">Club Not Found</h1>
      <Link href="/"><button className="px-6 py-3 rounded-xl bg-red-600 text-white">Back to Home</button></Link>
    </div>
  );
  const c = query.data;
  const websiteHref = safeHttpsHref(c.website);
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white container mx-auto px-4 py-8">
      <Link href={c.federationSlug ? `/federation/${c.federationSlug}/clubs` : "/"}><button className="flex items-center gap-2 mb-6"><ChevronLeft className="w-5 h-5" />Back</button></Link>
      <div className="rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex gap-4 items-start"><Building2 className="w-10 h-10 text-blue-300" /><div><h1 className="text-3xl font-serif">{c.name}</h1>
        {(c.city || c.region) && <p className="text-gray-300 flex items-center gap-2 mt-2"><MapPin className="w-4 h-4" />{[c.city, c.region].filter(Boolean).join(", ")}</p>}
        {c.federationSlug && <Link href={`/federation/${c.federationSlug}`}><span className="inline-flex items-center gap-2 text-sm text-red-300 mt-2"><Users className="w-4 h-4" />{c.federationName ?? "Federation"}</span></Link>}
        {websiteHref && <a href={websiteHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-300 mt-2"><ExternalLink className="w-4 h-4" />Website</a>}
        {c.description && <p className="mt-6 text-gray-300 whitespace-pre-wrap">{c.description}</p>}</div></div>
      </div>
    </div>
  );
}
