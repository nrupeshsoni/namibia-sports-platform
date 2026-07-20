/**
 * Promote verified crests into client/public/logos/ and fetch AAN alt logo.
 */
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { URL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cand = path.join(__dirname, "../client/public/logos/_candidates");
const logos = path.join(__dirname, "../client/public/logos");

function get(url, redirects = 0) {
  return new Promise((resolve) => {
    if (redirects > 12) {
      return resolve({ status: 0, buf: Buffer.alloc(0), ct: "" });
    }
    const u = new URL(url);
    const lib = u.protocol === "http:" ? http : https;
    const req = lib.get(
      url,
      {
        headers: { "User-Agent": "Mozilla/5.0", Accept: "*/*" },
        timeout: 35000,
        rejectUnauthorized: false,
      },
      (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          return resolve(get(new URL(res.headers.location, url).href, redirects + 1));
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            buf: Buffer.concat(chunks),
            ct: res.headers["content-type"] || "",
          }),
        );
      },
    );
    req.on("error", (e) =>
      resolve({ status: 0, buf: Buffer.from(String(e)), ct: "" }),
    );
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: 0, buf: Buffer.from("timeout"), ct: "" });
    });
  });
}

const copies = [
  ["fencing-nff.png", "Namibia_Fencing_Federation_logo.png"],
  ["wrestling-nwf.jpg", "Namibian_Wrestling_Federation_logo.jpg"],
  ["archery-img-logo.png", "Archery_Association_of_Namibia_logo.png"],
  ["fb-padel.jpg", "Namibia_Padel_Tennis_Federation_logo.jpg"],
];

for (const [src, dest] of copies) {
  const from = path.join(cand, src);
  const to = path.join(logos, dest);
  if (!fs.existsSync(from)) {
    console.log("MISSING", src);
    continue;
  }
  fs.copyFileSync(from, to);
  console.log("COPIED", dest, fs.statSync(to).size);
}

// Prefer AAN logo copy if larger/better
const aanUrl =
  "https://web.archive.org/web/20181230063710im_/http://archerynamibia.org/images/aan_logos/logo%20copy.png";
const r = await get(aanUrl);
if (r.status === 200 && r.buf.length > 500 && !r.ct.includes("text/html")) {
  const alt = path.join(cand, "archery-aan-logo-copy.png");
  fs.writeFileSync(alt, r.buf);
  console.log("AAN copy", r.buf.length, r.ct);
  const current = path.join(logos, "Archery_Association_of_Namibia_logo.png");
  if (r.buf.length > fs.statSync(current).size) {
    fs.copyFileSync(alt, current);
    console.log("Promoted larger AAN logo");
  }
} else {
  console.log("AAN copy fail", r.status, r.buf.length, r.ct);
}

// Ensure NESA exists
const nesa = path.join(logos, "Namibia_Electronic_Sport_Association_logo.png");
console.log("NESA", fs.existsSync(nesa) ? fs.statSync(nesa).size : "missing");
