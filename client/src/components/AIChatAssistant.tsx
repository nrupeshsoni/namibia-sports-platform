/**
 * Floating AI chat assistant for Namibia Sports Platform.
 * Cmd+K or click to open. Uses ai.chatAssistant.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

type Message = { role: "user" | "assistant"; content: string };

export default function AIChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const chatMut = trpc.ai.chatAssistant.useMutation({
    onSuccess: (reply) => {
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || chatMut.isPending) return;
      const msg = input.trim();
      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: msg }]);
      chatMut.mutate({
        message: msg,
        history: messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      });
    },
    [input, messages, chatMut]
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-lg transition-transform hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
          color: "white",
        }}
        aria-label="Open AI assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-md max-h-[80vh] rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: "rgba(17,17,17,0.98)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="text-white font-medium flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-red-400" />
                  Sports Assistant
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[50vh]">
                {messages.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-8">
                    Ask about Namibian sports, federations, events, or athletes.
                  </p>
                )}
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="max-w-[85%] px-4 py-2 rounded-2xl text-sm"
                      style={
                        m.role === "user"
                          ? {
                              background: "rgba(239,68,68,0.2)",
                              border: "1px solid rgba(239,68,68,0.3)",
                              color: "#fff",
                            }
                          : {
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "#e5e7eb",
                            }
                      }
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {chatMut.isPending && (
                  <div className="flex justify-start">
                    <div
                      className="px-4 py-2 rounded-2xl flex items-center gap-2"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      <span className="text-gray-400 text-sm">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Namibian sports..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    disabled={chatMut.isPending}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || chatMut.isPending}
                    className="p-2.5 rounded-xl disabled:opacity-50 transition-opacity"
                    style={{
                      background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                      color: "white",
                    }}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
