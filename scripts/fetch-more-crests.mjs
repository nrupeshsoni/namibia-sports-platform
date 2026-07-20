/**
 * Download verified federation crests into client/public/logos/
 * Uses alternate hosts when primary DNS/TLS fails.
 */
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "client", "public", "logos");
fs.mkdirSync(dir, { recursive: true });

function fetchBuf(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("http:") ? http : https;
    const req = lib.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
        timeout: 35000,
        rejectUnauthorized: false,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects < 6) {
          const next = new URL(res.headers.location, url).href;
          res.resume();
          return fetchBuf(next, redirects + 1).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({
            code: res.statusCode ?? 0,
            buf: Buffer.concat(chunks),
            ct: String(res.headers["content-type"] || ""),
          })
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

function looksLikeImage(buf, ct) {
  if (buf.length < 400) return false;
  const head = buf.slice(0, 24);
  const ascii = head.toString("ascii");
  if (/<!DOCTYPE|<html|<HTML|^{|Not found/i.test(ascii)) return false;
  if (ct.includes("text/html") || ct.includes("application/json")) return false;
  // PNG / JPEG / GIF / WEBP / SVG
  if (head[0] === 0x89 && head[1] === 0x50) return true;
  if (head[0] === 0xff && head[1] === 0xd8) return true;
  if (head[0] === 0x47 && head[1] === 0x49) return true;
  if (ascii.startsWith("RIFF") || ascii.includes("WEBP")) return true;
  if (ascii.includes("<svg") || ascii.includes("<?xml")) return true;
  if (ct.startsWith("image/")) return true;
  return false;
}

/** @type {Array<[string, string, string]>} label, file, url */
const attempts = [
  // --- P0: NSC ---
  ["nsc-archive", "Namibia_Sports_Commission_logo.png", "https://web.archive.org/web/2023/https://nsc.org.na/wp-content/uploads/logo.png"],
  ["nsc-archive2", "Namibia_Sports_Commission_logo.png", "https://web.archive.org/web/20240101000000im_/https://nsc.org.na/wp-content/uploads/2020/logo.png"],
  ["nsc-fb-cdn", "Namibia_Sports_Commission_logo.jpg", "https://scontent.xx.fbcdn.net/v/t39.30808-1/placeholder"],
  ["nsc-gov", "Namibia_Sports_Commission_logo.png", "https://web.archive.org/web/2022/http://www.namibiasport.gov.na/images/logo.png"],

  // --- P0: Volleyball ---
  ["volley-archive", "Namibia_Volleyball_Federation_logo.jpg", "https://web.archive.org/web/2022im_/https://www.namibiavolleyball.org/images/NVF.jpg"],
  ["volley-archive2", "Namibia_Volleyball_Federation_logo.jpg", "https://web.archive.org/web/20210601000000im_/https://www.namibiavolleyball.org/images/NVF.jpg"],
  ["volley-wp", "Namibia_Volleyball_Federation_logo.webp", "https://web.archive.org/web/2023im_/https://www.namibiavolleyball.org/wp-content/uploads/2022/02/NVF-logo-1.webp"],
  ["volley-direct", "Namibia_Volleyball_Federation_logo.jpg", "https://www.namibiavolleyball.org/images/NVF.jpg"],

  // --- P0: Chess ---
  ["chess-fide", "Namibia_Chess_Federation_logo.png", "https://ratings.fide.com/img/logos/NAM.gif"],
  ["chess-fide2", "Namibia_Chess_Federation_logo.png", "https://ratings.fide.com/img/logos/fed/NAM.gif"],
  ["chess-archive", "Namibia_Chess_Federation_logo.png", "https://web.archive.org/web/2023im_/https://namibiachessfederation.com/wp-content/uploads/2023/08/cropped-index-modified.png"],
  ["chess-archive2", "Namibia_Chess_Federation_logo.png", "https://web.archive.org/web/2023im_/https://usercontent.one/wp/namibiachessfederation.com/wp-content/uploads/2023/08/cropped-index-modified-115x115.png"],

  // --- P0: Judo ---
  ["judo-archive", "Namibian_Judo_Federation_logo.png", "https://web.archive.org/web/2023im_/https://njf.com.na/images/logo-wide.png"],
  ["judo-archive2", "Namibian_Judo_Federation_logo.png", "https://web.archive.org/web/20220101000000im_/https://njf.com.na/images/logo.png"],
  ["judo-ijf", "Namibian_Judo_Federation_logo.png", "https://www.ijf.org/assets/img/countries/nam.png"],

  // --- Batch: Tennis, Fencing, Karate, Table Tennis, Golf, Shooting, Wrestling, Basketball ---
  ["tennis", "Namibia_Tennis_Association_logo.png", "https://cdn.filepicker.io/api/file/XzuncjQjYGuVoVCjzkAi"],
  ["tennis2", "Namibia_Tennis_Association_logo.png", "https://tennisnamibia.sportyhq.com/uploads/clubs/1/logo.png"],
  ["tennis3", "Namibia_Tennis_Association_logo.png", "https://web.archive.org/web/2023im_/https://tennisnamibia.sportyhq.com/uploads/clubs/1/logo.png"],

  ["fencing-fb", "Namibia_Fencing_Federation_logo.png", "https://web.archive.org/web/2023/https://namibianfencing.com/wp-content/uploads/logo.png"],
  ["fencing2", "Namibia_Fencing_Federation_logo.png", "https://namibianfencing.com/wp-content/uploads/2021/logo.png"],
  ["fencing3", "Namibia_Fencing_Federation_logo.png", "https://namibianfencing.com/logo.png"],

  ["karate", "Karate_Namibia_logo.png", "https://www.naku.com.na/images/logo.png"],
  ["karate2", "Karate_Namibia_logo.png", "https://naku.com.na/images/logo.png"],
  ["karate3", "Karate_Namibia_logo.png", "https://web.archive.org/web/2023im_/https://www.naku.com.na/images/logo.png"],
  ["karate4", "Karate_Namibia_logo.png", "https://web.archive.org/web/2022im_/http://www.naku.com.na/images/header-logo.png"],

  ["tt", "Namibia_Table_Tennis_Association_logo.png", "https://namtta.leaguerepublic.com/images/logo.png"],
  ["tt2", "Namibia_Table_Tennis_Association_logo.png", "https://web.archive.org/web/2023/https://namtta.leaguerepublic.com/images/custom/logo.png"],

  ["golf", "Namibia_Golf_Federation_logo.png", "https://namibiagolffederation.webnode.page/_files/200000000-logo.png"],
  ["golf2", "Namibia_Golf_Federation_logo.png", "https://web.archive.org/web/2011/http://www.namibiagolffederation.webnode.com/files/logo.png"],

  ["shooting", "Shooting_Namibia_logo.png", "https://www.nhrsa.com/wp-content/uploads/logo.png"],
  ["shooting2", "Shooting_Namibia_logo.png", "https://www.nhrsa.com/images/logo.png"],
  ["shooting3", "Shooting_Namibia_logo.png", "https://web.archive.org/web/2023im_/https://www.nhrsa.com/wp-content/uploads/logo.png"],

  ["wrestling", "Namibia_Wrestling_Federation_logo.png", "https://uww.org/sites/default/files/styles/federation_logo/public/federations/namibia.png"],
  ["wrestling2", "Namibia_Wrestling_Federation_logo.png", "https://unitedworldwrestling.org/sites/default/files/2020-01/namibia.png"],

  ["basketball", "Namibian_Basketball_Federation_logo.png", "https://www.fiba.basketball/api/img/nationalfederations/NAM.png"],
  ["basketball2", "Namibian_Basketball_Federation_logo.png", "https://www.fiba.basketball/images/flag/NAM.png"],
  ["basketball3", "Namibian_Basketball_Federation_logo.png", "https://www.fiba.basketball/-/media/Images/FederationLogos/NAM.png"],

  ["archery", "Archery_Association_of_Namibia_logo.png", "https://web.archive.org/web/2020/http://www.archerynamibia.org/images/logo.png"],
  ["archery2", "Archery_Association_of_Namibia_logo.png", "https://worldarchery.sport/sites/default/files/styles/federation_logo/public/federations/namibia.png"],

  ["badminton", "Namibia_Badminton_Federation_logo.png", "https://bwfbadminton.com/wp-content/uploads/2019/03/NAM.png"],
  ["badminton2", "Namibia_Badminton_Federation_logo.png", "https://extranet.bwf.sport/docs/flags/NAM.png"],

  ["weightlifting", "Weightlifting_Namibia_logo.png", "https://iwf.sport/wp-content/uploads/flags/NAM.png"],
  ["weightlifting2", "Weightlifting_Namibia_logo.png", "https://www.iwf.net/wp-content/uploads/2017/01/NAM.png"],

  ["sailing", "Sailing_Namibia_logo.png", "https://www.sailing.org/tools/documents/namibia.png"],
  ["sailing2", "Sailing_Namibia_logo.png", "https://www.sailing.org/easydata/files/flags/NAM.gif"],

  ["boxing", "Namibia_Boxing_logo.png", "https://www.iba.sport/wp-content/uploads/flags/NAM.png"],
  ["boxing2", "Namibia_Boxing_logo.png", "https://www.aiba.org/wp-content/uploads/flags/NAM.png"],

  // Research CSV known-good URLs
  ["tt-csv", "Namibia_Table_Tennis_Association_logo.png", "https://namtta.leaguerepublic.com/images/custom/club_logo.png"],
  ["niiha-reuse", "skip", "https://niiha.com/wp-content/uploads/2021/12/Logo-from-FB.jpg"],
];

const saved = new Map(); // file -> {label, url, size}

for (const [label, file, url] of attempts) {
  if (file === "skip") continue;
  if (saved.has(file)) continue; // already have a good one
  try {
    const { code, buf, ct } = await fetchBuf(url);
    if (code !== 200 || !looksLikeImage(buf, ct)) {
      console.log(`${label}: FAIL code=${code} len=${buf.length} ct=${ct}`);
      continue;
    }
    // Prefer < 500KB; if larger, still save if under 1.5MB (compress later)
    if (buf.length > 1_500_000) {
      console.log(`${label}: FAIL too large ${buf.length}`);
      continue;
    }
    fs.writeFileSync(path.join(dir, file), buf);
    saved.set(file, { label, url, size: buf.length });
    console.log(`${label}: OK ${file} (${buf.length}) <- ${url}`);
  } catch (e) {
    console.log(`${label}: ERR ${e.message}`);
  }
}

console.log("\n=== SAVED THIS RUN ===");
for (const [file, meta] of saved) {
  console.log(`${file}\t${meta.size}\t${meta.label}\t${meta.url}`);
}
console.log(`count=${saved.size}`);
