/**
 * Offline banner — shows when navigator.onLine is false.
 */

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export default function OfflineBanner() {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] py-2 px-4 flex items-center justify-center gap-2 text-white text-sm font-medium"
      style={{
        background: "rgba(15, 23, 42, 0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <WifiOff className="w-4 h-4 flex-shrink-0" />
      You're offline. Some content may not be available.
    </div>
  );
}
