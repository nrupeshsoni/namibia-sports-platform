import { useState } from "react";
import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useFederation } from "@/contexts/FederationContext";

export default function FederationStreams() {
  const { federation } = useFederation();
  const [selectedStreamId, setSelectedStreamId] = useState<number | null>(null);

  const streamsQuery = trpc.streams.list.useQuery({ federationId: federation?.id });
  const streams = streamsQuery.data ?? [];

  const liveStreams = streams.filter((s) => s.isLive);
  const upcomingStreams = streams.filter((s) => !s.isLive);
  const selectedStream = streams.find((s) => s.id === selectedStreamId);

  if (!federation) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Embedded player */}
      {selectedStream && (
        <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden aspect-video">
          <div
            className="w-full h-full"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {selectedStream.embedUrl ? (
              <iframe
                src={selectedStream.embedUrl}
                title={selectedStream.title}
                className="w-full h-full"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                <Radio className="w-16 h-16 mb-4" />
                <p>No embed URL available</p>
                {selectedStream.streamUrl && (
                  <a
                    href={selectedStream.streamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-red-400 hover:underline"
                  >
                    Watch externally →
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="p-4 flex items-center justify-between">
            <h3 className="text-white font-medium">{selectedStream.title}</h3>
            {selectedStream.isLive && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-xs font-bold uppercase tracking-wider">LIVE</span>
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Live streams */}
      {liveStreams.length > 0 && (
        <motion.section variants={fadeUp}>
          <h2 className="text-xl font-serif text-white mb-4">Live Now</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {liveStreams.map((stream) => (
              <button
                key={stream.id}
                onClick={() => setSelectedStreamId(stream.id)}
                className="p-4 rounded-xl text-left transition-all hover:scale-[1.01]"
                style={{
                  background: selectedStreamId === stream.id
                    ? "rgba(239, 68, 68, 0.2)"
                    : "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  border: selectedStreamId === stream.id
                    ? "1px solid rgba(239, 68, 68, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-xs font-bold uppercase tracking-wider">LIVE</span>
                </div>
                <h3 className="text-white font-medium">{stream.title}</h3>
              </button>
            ))}
          </div>
        </motion.section>
      )}

      {/* Upcoming schedule */}
      <motion.section variants={fadeUp}>
        <h2 className="text-xl font-serif text-white mb-4">Upcoming Streams</h2>
        <div className="space-y-4">
          {upcomingStreams.length === 0 ? (
            <p className="text-gray-500">No scheduled streams</p>
          ) : (
            upcomingStreams.map((stream) => (
              <button
                key={stream.id}
                onClick={() => setSelectedStreamId(stream.id)}
                className="w-full p-4 rounded-xl text-left transition-all hover:scale-[1.01]"
                style={{
                  background: selectedStreamId === stream.id
                    ? "rgba(59, 130, 246, 0.15)"
                    : "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  border: selectedStreamId === stream.id
                    ? "1px solid rgba(59, 130, 246, 0.4)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">{stream.title}</h3>
                  {stream.scheduledStart && (
                    <span className="text-sm text-gray-400">
                      {new Date(stream.scheduledStart).toLocaleString()}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}
