import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type ThemeToggleProps = {
  className?: string;
  /** Use light-on-dark chrome (hero banners, photo overlays). */
  onMedia?: boolean;
};

/**
 * Accessible sun/moon control for light ↔ dark. Hidden when ThemeProvider
 * is mounted with `switchable={false}`.
 */
export function ThemeToggle({ className = "", onMedia = false }: ThemeToggleProps) {
  const { theme, toggleTheme, switchable } = useTheme();

  if (!switchable || !toggleTheme) return null;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-all duration-300 touch-target ${className}`}
      style={{
        color: onMedia ? "#ffffff" : "var(--chrome-fg)",
        background: onMedia ? "rgba(255,255,255,0.12)" : "var(--chrome-btn-bg)",
      }}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
