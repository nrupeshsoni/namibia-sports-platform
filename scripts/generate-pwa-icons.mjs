#!/usr/bin/env node
/**
 * Generates PWA icons (192x192, 512x512) from client/public/icons/icon.svg
 * Run: node scripts/generate-pwa-icons.mjs
 * Requires: npm install --save-dev sharp
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.resolve(__dirname, "../client/public/icons");
const svgPath = path.join(iconsDir, "icon.svg");

async function main() {
  try {
    const sharp = (await import("sharp")).default;
    const svg = fs.readFileSync(svgPath);

    for (const size of [192, 512]) {
      const outPath = path.join(iconsDir, `icon-${size}.png`);
      await sharp(svg)
        .resize(size, size)
        .png()
        .toFile(outPath);
      console.log(`Generated ${outPath}`);
    }
    console.log("PWA icons generated successfully.");
  } catch (err) {
    console.error("Failed to generate icons:", err.message);
    console.error("Run: npm install --save-dev sharp");
    process.exit(1);
  }
}

main();
