import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "client", "public", "logos");

function fetchBuf(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("http:") ? http : https;
    const req = lib.get(
      url,
      {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SportsPlatformBot/1.0)" },
        timeout: 30000,
        rejectUnauthorized: false,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects < 5) {
          const next = new URL(res.headers.location, url).href;
          res.resume();
          return fetchBuf(next, redirects + 1).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({ code: res.statusCode ?? 0, buf: Buffer.concat(chunks), ct: res.headers["content-type"] })
        );
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
  });
}

function saveIfImage(label, file, buf, code) {
  const head = buf.slice(0, 32).toString("ascii");
  if (code !== 200 || buf.length < 400 || /<!DOCTYPE|<html/i.test(head)) {
    console.log(`${label}: FAIL code=${code} len=${buf.length}`);
    return false;
  }
  fs.writeFileSync(path.join(dir, file), buf);
  console.log(`${label}: OK ${file} (${buf.length})`);
  return true;
}

const downloads = [
  ["https://www.namibiavolleyball.org/images/NVF.jpg", "Namibia_Volleyball_Federation_logo.jpg", "volley"],
  ["https://www.namibiavolleyball.org/images/Favicon.ico", "volley_favicon.ico", "volley-ico"],
  ["https://namparalympics.org.na/", null, "para-html"],
  ["https://www.namibiavolleyball.org/", null, "volley-html"],
  ["https://nsc.org.na/", null, "nsc-html"],
  ["https://msyns.gov.na/", null, "msyns-html"],
  ["https://www.ijf.org/country/namibia", null, "judo-html"],
  ["https://ratings.fide.com/profile.phtml?event=13200000", null, "chess-html"],
];

for (const [url, file, label] of downloads) {
  try {
    const { code, buf, ct } = await fetchBuf(url);
    if (file) {
      saveIfImage(label, file, buf, code);
      continue;
    }
    const body = buf.toString("utf8");
    const imgs = [...body.matchAll(/src=["']([^"']+\.(?:png|jpg|jpeg|webp|svg|gif|ico))["']/gi)].map((m) => m[1]);
    const og = [...body.matchAll(/property=["']og:image["']\s+content=["']([^"']+)["']/gi)].map((m) => m[1]);
    const all = [...new Set([...imgs, ...og])].slice(0, 25);
    console.log(`\n== ${label} ${url} ${code} ${ct}`);
    console.log(all.join("\n") || "(no images)");
  } catch (e) {
    console.log(`${label}: ERR ${e.message}`);
  }
}
