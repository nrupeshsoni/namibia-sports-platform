import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import fs from "fs";
import path from "path";
import { defineConfig, type Plugin } from "vite";

/** Strip logo research scratch from dist so Vite publicDir never ships it. */
function excludeLogoCandidates(): Plugin {
  return {
    name: "exclude-logo-candidates",
    closeBundle() {
      const dir = path.resolve(import.meta.dirname, "dist/public/logos/_candidates");
      fs.rmSync(dir, { recursive: true, force: true });
    },
  };
}

const plugins = [
  react(),
  tailwindcss(),
  excludeLogoCandidates(),
  VitePWA({
    registerType: "autoUpdate",
    manifest: {
      name: "Namibia Sports Platform",
      short_name: "Sports NA",
      description: "The definitive national sports platform for Namibia",
      theme_color: "#EF4444",
      background_color: "#0a0a0a",
      display: "standalone",
      start_url: "/",
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    workbox: {
      // Precache app shell + icon assets only; large public jpg/png use runtimeCaching.
      globPatterns: [
        "**/*.{js,css,html,ico,svg,woff2}",
        "icons/*.png",
      ],
      navigateFallback: "/index.html",
      // NavigationRoute only matches mode:navigate — tRPC fetch is unaffected —
      // but without a denylist, address-bar / offline navigations to /api/* get
      // precached index.html (HTML-for-JSON). Live sw.js had no denylist (2026-07-25).
      navigateFallbackDenylist: [/^\/api(?:\/|$)/],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
          handler: "CacheFirst",
          options: { cacheName: "images", expiration: { maxEntries: 100, maxAgeSeconds: 86400 * 30 } },
        },
        {
          urlPattern: /\/(?:sports|logos|athletes|venues|coaches|events)\/.+\.(?:png|jpg|jpeg|webp|svg)$/i,
          handler: "CacheFirst",
          options: { cacheName: "public-images", expiration: { maxEntries: 200, maxAgeSeconds: 86400 * 30 } },
        },
      ],
    },
  }),
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
