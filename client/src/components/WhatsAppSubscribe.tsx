/**
 * WhatsApp subscribe UI — get notifications for events, news, streams.
 * Used on federation pages and optionally globally.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Check, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeUp } from "@/lib/animations";

const SUBSCRIPTION_OPTIONS = [
  { id: "events", label: "Events" },
  { id: "news", label: "News" },
  { id: "streams", label: "Live Streams" },
  { id: "all", label: "All" },
] as const;

type Props = {
  federationId?: number;
  federationName?: string;
  compact?: boolean;
};

export default function WhatsAppSubscribe({ federationId, federationName, compact = false }: Props) {
  const [phone, setPhone] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<readonly string[]>(["events"]);
  const [submitted, setSubmitted] = useState(false);

  const subscribeMut = trpc.whatsapp.subscribe.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  function toggleType(id: string) {
    if (id === "all") {
      setSelectedTypes(["all"]);
      return;
    }
    const next = selectedTypes.filter((t) => t !== "all" && t !== id);
    if (selectedTypes.includes(id)) {
      setSelectedTypes(next.length > 0 ? next : ["events"]);
    } else {
      setSelectedTypes([...next, id]);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim() || selectedTypes.length === 0) return;
    subscribeMut.mutate({
      phone: phone.trim(),
      federationId,
      types: selectedTypes as ("events" | "news" | "streams" | "all")[],
    });
  }

  if (submitted) {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-3 p-4 rounded-xl"
        style={{
          background: "rgba(16, 185, 129, 0.15)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
        }}
      >
        <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
        <div>
          <p className="text-white font-medium">Subscribed!</p>
          <p className="text-sm text-gray-400">
            You'll receive WhatsApp updates{federationName ? ` for ${federationName}` : ""}.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="p-5 rounded-2xl space-y-4"
      style={{
        background: "rgba(37, 211, 102, 0.08)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(37, 211, 102, 0.2)",
      }}
    >
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-green-400" />
        <h3 className="text-white font-medium">
          {compact ? "WhatsApp updates" : `Get ${federationName ? `${federationName} ` : ""}updates on WhatsApp`}
        </h3>
      </div>
      <input
        type="tel"
        placeholder="+264 81 123 4567"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
        required
      />
      {!compact && (
        <div className="flex flex-wrap gap-2">
          {SUBSCRIPTION_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleType(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedTypes.includes(opt.id)
                  ? "bg-green-500/30 text-green-100 border border-green-500/50"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:border-green-500/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
      <button
        type="submit"
        disabled={subscribeMut.isPending}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-medium text-white disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
      >
        {subscribeMut.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Subscribe"
        )}
      </button>
    </motion.form>
  );
}
