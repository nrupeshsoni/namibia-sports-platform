/**
 * Product feature flags for beta UX honesty.
 * Live route (`/live`) always works; primary-nav visibility is gated separately.
 * Incomplete integrations default off until explicitly enabled via VITE_ env.
 */

/**
 * Force-show Live in primary nav regardless of stream inventory.
 * Default: unset/false — nav uses {@link useShowLiveNav} inventory check instead.
 */
export function isLiveNavForced(): boolean {
  return import.meta.env.VITE_SHOW_LIVE_NAV === "true";
}

/**
 * Show WhatsApp subscribe CTA on federation home.
 * Default: unset/false — integration incomplete for public beta.
 */
export function isWhatsAppSubscribeEnabled(): boolean {
  return import.meta.env.VITE_SHOW_WHATSAPP_SUBSCRIBE === "true";
}

/**
 * Show floating AI chat assistant (Cmd+K).
 * Default: unset/false — integration incomplete for public beta.
 */
export function isAiChatEnabled(): boolean {
  return import.meta.env.VITE_SHOW_AI_CHAT === "true";
}

/**
 * Show the "Continue with Google" buttons on login/register.
 * Default: unset/false — the Google provider is disabled on the Supabase
 * project, so the button can only ever return "Unsupported provider". Enabling
 * the provider is a project-level decision (it is shared with other products);
 * flip this flag only once it is actually on.
 */
export function isGoogleAuthEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_GOOGLE_AUTH === "true";
}
