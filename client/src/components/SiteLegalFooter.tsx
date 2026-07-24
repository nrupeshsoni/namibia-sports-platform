/**
 * Compact legal footer for public hub pages (News, Live, Map, etc.).
 * Keeps Privacy / Terms discoverable sitewide without duplicating Home chrome.
 */
export function SiteLegalFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="py-8 mt-12 text-center"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      <p className="text-sm text-gray-600">© {year} Namibia Sports Platform</p>
      <p className="text-xs text-gray-600 mt-2">
        <a href="/privacy" className="hover:text-white transition-colors">
          Privacy Policy
        </a>
        <span className="mx-2 text-gray-700">·</span>
        <a href="/terms" className="hover:text-white transition-colors">
          Terms of Use
        </a>
      </p>
      <p className="text-xs text-gray-700 mt-1">
        Designed & Developed by{" "}
        <a href="https://thedome.com.na" className="text-red-600 hover:text-red-500">
          The Dome Technologies
        </a>{" "}
        &{" "}
        <a href="https://facilit8.com.na" className="text-red-600 hover:text-red-500">
          Facilit8 Namibia
        </a>
      </p>
    </footer>
  );
}
