import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "client", "public", "logos");

function fetchBuf(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("http:") ? http : https;
    const req = lib.get(
      url,
      {
        headers: { "User-Agent": "Mozilla/5.0", Accept: "image/*,*/*" },
        timeout: 35000,
        rejectUnauthorized: false,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects < 6) {
          res.resume();
          return fetchBuf(new URL(res.headers.location, url).href, redirects + 1).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({ code: res.statusCode ?? 0, buf: Buffer.concat(chunks), ct: String(res.headers["content-type"] || "") })
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

function okImage(buf, ct) {
  if (buf.length < 400 || /text\/html|application\/json/.test(ct)) return false;
  const a = buf.slice(0, 20).toString("ascii");
  if (/<!DOCTYPE|<html|Not found/i.test(a)) return false;
  return buf[0] === 0x89 || (buf[0] === 0xff && buf[1] === 0xd8) || a.startsWith("RIFF") || a.includes("<svg");
}

const tries = [
  // NSC Facebook page picture (public graph)
  ["nsc-graph", "Namibia_Sports_Commission_logo.jpg", "https://graph.facebook.com/NamSportComm/picture?type=large"],
  ["nsc-graph2", "Namibia_Sports_Commission_logo.jpg", "https://graph.facebook.com/v18.0/NamSportComm/picture?redirect=1&type=large"],
  // Fencing Facebook
  ["fencing-graph", "Namibia_Fencing_Federation_logo.jpg", "https://graph.facebook.com/FencingNamibia/picture?type=large"],
  // Volleyball FB
  ["volley-graph", "Namibia_Volleyball_FB.jpg", "https://graph.facebook.com/namibiavolleyball/picture?type=large"],
  // Basketball FB
  ["bball-graph", "Namibian_Basketball_Federation_logo.jpg", "https://graph.facebook.com/namibianbasketball/picture?type=large"],
  // Handball FB
  ["handball-graph", "Namibia_Handball_Federation_logo.jpg", "https://graph.facebook.com/100066592937124/picture?type=large"],
  // Boxing FB
  ["boxing-graph", "Namibia_Boxing_logo.jpg", "https://graph.facebook.com/BoxingNamibia/picture?type=large"],
  // Table tennis FB
  ["tt-graph", "Namibia_Table_Tennis_Association_logo.jpg", "https://graph.facebook.com/NamibiaTT/picture?type=large"],
  // Fencing site scrape helper URLs
  ["fencing-og", "Namibia_Fencing_Federation_logo.png", "https://namibianfencing.com/wp-content/uploads/2024/fencing-logo.png"],
  // World Archery / others via commons
  ["archery-wa", "Archery_Association_of_Namibia_logo.png", "https://web.archive.org/web/2018im_/http://www.archerynamibia.org/images/logo.gif"],
  // Powerlifting facebook group won't work
  ["niiha-check", "skip", "https://niiha.com/wp-content/uploads/2021/12/Logo-from-FB.jpg"],
];

for (const [label, file, url] of tries) {
  if (file === "skip") continue;
  try {
    const { code, buf, ct } = await fetchBuf(url);
    if (code !== 200 || !okImage(buf, ct)) {
      console.log(`${label}: FAIL ${code} ${buf.length} ${ct}`);
      continue;
    }
    fs.writeFileSync(path.join(dir, file), buf);
    console.log(`${label}: OK ${file} (${buf.length})`);
  } catch (e) {
    console.log(`${label}: ERR ${e.message}`);
  }
}
