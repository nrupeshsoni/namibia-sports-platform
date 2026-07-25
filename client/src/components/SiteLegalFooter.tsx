/** Compact legal footer for public hub pages. */
export function SiteLegalFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-8 mt-12 text-center" style={{ borderTop: "1px solid var(--chrome-border)" }}>
      <p className="text-sm" style={{ color: "var(--chrome-muted)" }}>© {year} Namibia Sports Platform</p>
      <p className="text-xs mt-2" style={{ color: "var(--chrome-muted)" }}>
        <a href="/privacy" style={{ color: "var(--chrome-fg)" }}>Privacy Policy</a>
        <span className="mx-2" aria-hidden>·</span>
        <a href="/terms" style={{ color: "var(--chrome-fg)" }}>Terms of Use</a>
      </p>
      <p className="text-xs mt-1" style={{ color: "var(--chrome-muted)" }}>
        Designed & Developed by{" "}
        <a href="https://thedome.com.na" className="text-red-500 hover:text-red-400">The Dome Technologies</a>
        {" "}&{" "}
        <a href="https://facilit8.com.na" className="text-red-500 hover:text-red-400">Facilit8 Namibia</a>
      </p>
    </footer>
  );
}
