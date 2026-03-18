import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Radio, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function Live() {
  const streamsQuery = trpc.streams.list.useQuery({
    federationId: undefined,
    isLive: true,
  });
  const allStreamsQuery = trpc.streams.list.useQuery({
    federationId: undefined,
  });

  const liveStreams = streamsQuery.data ?? [];
  const allStreams = allStreamsQuery.data ?? [];

  type StreamItem = { id: number; title: string; embedUrl?: string | null; streamUrl?: string | null; platformType: string; isLive: boolean; thumbnailUrl?: string | null };
  const [selectedStream, setSelectedStream] = useState<StreamItem | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <button
              className="flex items-center gap-2 text-white hover:bg-white/10 transition-colors p-2 rounded-xl"
              style={{ backdropFilter: "blur(10px)" }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </Link>
          <h1 className="text-white text-2xl font-serif tracking-[0.3em]">LIVE</h1>
          <div className="w-24" />
        </div>
      </header>

      <div className="pt-24 pb-20">
        <section className="relative h-40 md:h-56 w-full overflow-hidden mb-12">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 to-black/80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-sm font-bold uppercase tracking-wider">
                Live Now
              </span>
            </span>
          </div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
            <Radio className="w-14 h-14 mb-2" />
            <h1 className="text-4xl md:text-5xl font-serif mb-2 tracking-wider">
              LIVE STREAMS
            </h1>
            <p className="text-lg font-light">{liveStreams.length} streaming now</p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {streamsQuery.isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}

          {selectedStream !== null ? (
            <div className="mb-8">
              <button
                onClick={() => setSelectedStream(null)}
                className="text-gray-400 hover:text-white mb-4 text-sm"
              >
                ← Back to grid
              </button>
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {selectedStream.embedUrl ? (
                  <iframe
                    src={selectedStream.embedUrl}
                    title={selectedStream.title}
                    className="w-full aspect-video"
                    allowFullScreen
                  />
                ) : (
                  <div
                    className="aspect-video flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  >
                    <a
                      href={selectedStream.streamUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 rounded-xl text-white font-medium"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))",
                      }}
                    >
                      Watch on {selectedStream.platformType}
                    </a>
                  </div>
                )}
                <div className="p-4 flex items-center gap-2">
                  {selectedStream.isLive ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-red-400 text-xs font-bold uppercase">LIVE</span>
                    </span>
                  ) : null}
                  <span className="text-white font-medium">{selectedStream.title}</span>
                </div>
              </div>
            </div>
          ) : null}

          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {!streamsQuery.isLoading &&
              allStreams.map((stream) => (
                <motion.div
                  key={stream.id}
                  variants={fadeUp}
                  onClick={() => setSelectedStream(stream)}
                  className="rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02]"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="relative aspect-video">
                    {stream.thumbnailUrl ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${stream.thumbnailUrl})` }}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(0,0,0,0.5)" }}
                      >
                        <Radio className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40" />
                    {stream.isLive && (
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-600/90">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-white text-xs font-bold uppercase">LIVE</span>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2 text-white font-medium truncate">
                      {stream.title}
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>

          {!streamsQuery.isLoading && allStreams.length === 0 && (
            <div className="text-center py-20">
              <Radio className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-2xl font-serif text-gray-400 mb-2">No Streams Scheduled</h3>
              <p className="text-gray-500">Check back when events go live</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
