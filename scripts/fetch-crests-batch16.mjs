/**
 * Crest fetch pass — fencing/wrestling/esports + international MA logos.
 * Run: node scripts/fetch-crests-batch16.mjs
 */
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { URL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../client/public/logos/_candidates");
fs.mkdirSync(outDir, { recursive: true });

function get(url, redirects = 0) {
  return new Promise((resolve) => {
    if (redirects > 12) {
      return resolve({ status: 0, buf: Buffer.alloc(0), ct: "", final: url, headers: {} });
    }
    const u = new URL(url);
    const lib = u.protocol === "http:" ? http : https;
    const req = lib.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "*/*",
        },
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
            final: url,
            headers: res.headers,
          }),
        );
      },
    );
    req.on("error", (e) =>
      resolve({ status: 0, buf: Buffer.from(String(e)), ct: "", final: url, headers: {} }),
    );
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: 0, buf: Buffer.from("timeout"), ct: "", final: url, headers: {} });
    });
  });
}

function extFrom(ct, buf, name) {
  if (ct.includes("png") || (buf[0] === 0x89 && buf[1] === 0x50)) return ".png";
  if (ct.includes("jpeg") || ct.includes("jpg") || (buf[0] === 0xff && buf[1] === 0xd8))
    return ".jpg";
  if (ct.includes("webp")) return ".webp";
  if (ct.includes("svg") || buf.toString("utf8", 0, 200).includes("<svg")) return ".svg";
  if (ct.includes("gif")) return ".gif";
  const m = name.match(/\.(png|jpe?g|webp|svg|gif)$/i);
  return m ? m[0] : ".bin";
}

async function save(name, url) {
  const r = await get(url);
  if (r.status !== 200 || r.buf.length < 400) {
    console.log("FAIL", name, r.status, r.buf.length, r.ct);
    return null;
  }
  if (r.ct.includes("text/html")) {
    console.log("HTML", name, r.buf.length);
    return r;
  }
  const ext = extFrom(r.ct, r.buf, name);
  const base = name.replace(/\.(png|jpe?g|webp|svg|gif|bin)$/i, "");
  const fp = path.join(outDir, base + ext);
  fs.writeFileSync(fp, r.buf);
  console.log("OK", path.basename(fp), r.buf.length, r.ct, r.final.slice(0, 100));
  return fp;
}

function extractImgs(html, base) {
  const imgs = new Set();
  for (const m of html.matchAll(/(?:src|content|href)=["']([^"']+)["']/gi)) {
    try {
      imgs.add(new URL(m[1], base).href);
    } catch {
      /* ignore */
    }
  }
  return [...imgs];
}

async function main() {
  // World Archery MA logo endpoint (og:image on member page)
  await save("archery-wa-malogo", "https://extranet.worldarchery.sport/MALogos/?NOC=NAM");

  // Other international federation logo endpoints to try
  const intl = [
    ["iwf-list", "https://iwf.sport/weightlifting_/federations/"],
    ["bwf-ma", "https://bwfworldtour.com/"],
    ["uww-nam", "https://uww.org/about-uww/national-federation/namibia-wrestling-federation"],
    ["ihf-nam", "https://www.ihf.info/member-federations/namibia-handball-federation/5571"],
    ["wkf-africa", "https://www.wkf.net/structure-continental-unions-detail/5"],
    ["golf-page", "https://namibiagolffederation.webnode.page/"],
    ["archery-wb", "https://web.archive.org/web/20181230063710/http://archerynamibia.org/"],
    ["archery-wb2", "https://web.archive.org/web/20160412120000/http://www.archerynamibia.org/"],
    ["sailing-ws", "https://www.sailing.org/inside-world-sailing/organisation/members/"],
    ["esports", "https://esportsnamibia.org/"],
    ["canoe", "https://www.canoeicf.com/federation/namibia-canoeing-rowing-federation"],
    ["pentathlon", "https://www.uipmworld.org/member-federation/namibian-modern-pentathlon-federation"],
    ["fisu", "https://www.fisu.net/nusf/namibia/"],
  ];

  for (const [key, url] of intl) {
    const r = await get(url);
    console.log("===", key, r.status, r.final.slice(0, 90));
    if (r.status !== 200) continue;
    const html = r.buf.toString("utf8");
    const imgs = extractImgs(html, r.final);
    const hits = imgs.filter((i) =>
      /logo|crest|badge|namibia|nam\b|federation|MALogo|upload|files\/|wp-content|media/i.test(i),
    );
    hits.slice(0, 25).forEach((i) => console.log("  ", i.slice(0, 200)));
    const og =
      html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i) ||
      html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (og) console.log("  OG", og[1]);
  }

  // Known good assets already validated elsewhere — refresh local copies
  await save(
    "fencing-nff.png",
    "https://namibianfencing.com/wp-content/uploads/2025/07/NFF-150-150.png",
  );
  await save(
    "wrestling-nwf.jpg",
    "https://graph.facebook.com/NamibiaWrestlingFederation/picture?type=large",
  );
  await save("esports-nesa.png", "https://esportsnamibia.org/nesa_logo.png");

  // Try more FB / international
  const more = [
    ["fb-aan2.jpg", "https://graph.facebook.com/ArcheryAssociationOfNamibia/picture?type=large"],
    ["fb-wrestling.jpg", "https://graph.facebook.com/NamibiaWrestlingFederation/picture?type=large"],
    ["fb-fencing.jpg", "https://graph.facebook.com/fencingnamibia/picture?type=large"],
    // Common alternate page names from NNOC listings
    ["fb-handball3.jpg", "https://graph.facebook.com/NamibiaHandballFederationOfficial/picture?type=large"],
    ["fb-golf3.jpg", "https://graph.facebook.com/namibia.golf.federation/picture?type=large"],
    ["fb-boxing4.jpg", "https://graph.facebook.com/NamibiaBoxingBoard/picture?type=large"],
    ["fb-sailing3.jpg", "https://graph.facebook.com/NamibiaYachtingAssociation/picture?type=large"],
    ["fb-dance3.jpg", "https://graph.facebook.com/NamibiaDanceSportFederation/picture?type=large"],
    ["fb-wl3.jpg", "https://graph.facebook.com/namweightlifters/picture?type=large"],
    ["fb-badminton3.jpg", "https://graph.facebook.com/badmintonnamibiaofficial/picture?type=large"],
    ["fb-karate3.jpg", "https://graph.facebook.com/OfficialNamibiaKarateUnion/picture?type=large"],
    ["fb-horse2.jpg", "https://graph.facebook.com/NamibianHorseRacing/picture?type=large"],
  ];
  for (const [n, u] of more) await save(n, u);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
