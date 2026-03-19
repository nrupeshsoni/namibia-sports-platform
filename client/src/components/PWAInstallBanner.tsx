/**
 * PWA Install Banner — detects beforeinstallprompt and shows optional "Add to Home Screen" banner.
 * Dismissible; respects user preference (localStorage).
 */

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

const STORAGE_KEY = "pwa-install-dismissed";

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (dismissedAt) {
      const days = 7;
      if (Date.now() - Number(dismissedAt) < days * 24 * 60 * 60 * 1000) return;
    }

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
  }

  function handleDismiss() {
    setShowBanner(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  }

  if (!showBanner || isInstalled || !deferredPrompt) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[90] flex items-center justify-between gap-4 p-4 md:bottom-4 md:left-4 md:right-auto md:max-w-sm md:rounded-2xl"
      style={{
        background: "rgba(10, 10, 10, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        /* On mobile, sit above bottom nav (~56px + safe-area) */
        bottom: "calc(56px + env(safe-area-inset-bottom, 0px))",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
          style={{
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.3))",
          }}
        >
          <Download className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">Install Sports NA</p>
          <p className="text-xs text-gray-400">Add to home screen for quick access</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="min-h-[44px] min-w-[44px] rounded-xl px-4 py-2 text-sm font-medium text-white transition-all"
          style={{
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))",
          }}
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="min-h-[44px] min-w-[44px] rounded-xl p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
