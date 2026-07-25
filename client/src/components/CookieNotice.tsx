import { useEffect, useState } from "react";
import { Link } from "wouter";

const STORAGE_KEY = "cookie_notice_dismissed";

/** Minimal first-party storage notice (theme / UI prefs). */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);
  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* */ }
    setVisible(false);
  };
  if (!visible) return null;
  return (
    <div
      role="dialog"
      aria-label="Cookie and storage notice"
      className="fixed bottom-[72px] md:bottom-4 left-4 right-4 z-[60] mx-auto max-w-lg rounded-2xl p-4 shadow-lg md:left-auto"
      style={{ background: "var(--drawer-bg)", border: "1px solid var(--chrome-border)", color: "var(--chrome-fg)", backdropFilter: "blur(16px)" }}
    >
      <p className="text-sm leading-relaxed" style={{ color: "var(--chrome-muted)" }}>
        We use essential browser storage for your theme preference and UI settings — not advertising cookies. See our{" "}
        <Link href="/privacy"><a className="underline underline-offset-2" style={{ color: "var(--chrome-fg)" }}>Privacy Policy</a></Link>.
      </p>
      <button type="button" onClick={dismiss} className="mt-3 min-h-[44px] w-full rounded-xl px-4 text-sm font-medium text-white" style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.9), rgba(220,38,38,0.9))" }}>
        Got it
      </button>
    </div>
  );
}
