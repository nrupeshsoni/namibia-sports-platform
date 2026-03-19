/**
 * WhatsApp Business API webhook.
 * Handles: GET (Meta verification), POST (incoming messages).
 * Configure callback URL in Meta Developer Console.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN") ?? "sports-platform-verify";

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return new Response(challenge ?? "", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }
    return new Response("Forbidden", { status: 403 });
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (body.object !== "whatsapp_business_account") {
        return new Response("Not a WhatsApp event", { status: 400 });
      }

      for (const entry of body.entry ?? []) {
        for (const change of entry.changes ?? []) {
          if (change.value?.messages) {
            for (const msg of change.value.messages) {
              const from = msg.from;
              const text = msg.text?.body?.toLowerCase?.() ?? "";

              // Handle subscribe/unsubscribe commands
              if (text.includes("subscribe") || text.includes("unsubscribe")) {
                // Could call tRPC or DB here to process. For now, acknowledge.
                console.log(`WhatsApp message from ${from}: ${text}`);
              }
            }
          }
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("[whatsapp-webhook]", e);
      return new Response("Internal error", { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});
