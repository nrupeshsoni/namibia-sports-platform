/**
 * Follow-up crest probes + compress NESA.
 */
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { URL } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../client/public/logos/_candidates");
const logosDir = path.join(__dirname, "../client/public/logos");
fs.mkdirSync(outDir, { recursive: true });

function get(url, redirects = 0) {
  return new Promise((resolve) => {
    if (redirects > 12) {
      return resolve({ status: 0, buf: Buffer.alloc(0), ct: "", final: url });
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
            final: url,
          }),
        );
      },
    );
    req.on("error", (e) =>
      resolve({ status: 0, buf: Buffer.from(String(e)), ct: "", final: url }),
    );
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: 0, buf: Buffer.from("timeout"), ct: "", final: url });
    });
  });
}

async function save(name, url) {
  const r = await get(url);
  if (r.status === 200 && r.buf.length > 500 && !r.ct.includes("text/html")) {
    fs.writeFileSync(path.join(outDir, name), r.buf);
    console.log("OK", name, r.buf.length, r.ct);
    return true;
  }
  console.log("FAIL", name, r.status, r.buf.length, r.ct);
  return false;
}

async function dumpImgs(label, url) {
  const r = await get(url);
  console.log("===", label, r.status);
  if (r.status !== 200) return;
  const html = r.buf.toString("utf8");
  for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
    const src = m[1];
    if (/logo|crest|badge|namibia|federation|header|brand|files\//i.test(src)) {
      try {
        console.log(" IMG", new URL(src, url).href.slice(0, 220));
      } catch {
        /* ignore */
      }
    }
  }
}

async function main() {
  await dumpImgs(
    "archery-wb",
    "https://web.archive.org/web/20181230063710/http://archerynamibia.org/",
  );
  await dumpImgs(
    "archery-wb2",
    "https://web.archive.org/web/20160331121820/http://www.archerynamibia.org/",
  );
  await dumpImgs("canoe", "https://www.canoeicf.com/federation/namibia-canoeing-rowing-federation");
  await dumpImgs(
    "pent",
    "https://www.uipmworld.org/member-federation/namibian-modern-pentathlon-federation",
  );
  await dumpImgs("esports", "https://esportsnamibia.org/");

  const tries = [
    [
      "archery-tmpl-logo.png",
      "https://web.archive.org/web/20181230063710im_/http://archerynamibia.org/templates/as002032/images/logo.png",
    ],
    [
      "archery-stories-logo.png",
      "https://web.archive.org/web/20181230063710im_/http://archerynamibia.org/images/stories/logo.png",
    ],
    [
      "archery-img-logo.png",
      "https://web.archive.org/web/20160331121820im_/http://www.archerynamibia.org/img/logo.png",
    ],
    [
      "archery-assets-logo.png",
      "https://web.archive.org/web/20160331121820im_/http://www.archerynamibia.org/assets/images/logo.png",
    ],
    [
      "archery-favicon.png",
      "https://web.archive.org/web/20160331121820im_/http://www.archerynamibia.org/assets/images/favicon.png",
    ],
    ["fb-archery-old.jpg", "https://graph.facebook.com/archeryinnamibia/picture?type=large"],
    [
      "canoe1.png",
      "https://www.canoeicf.com/sites/default/files/styles/federation_logo/public/federations/namibia.png",
    ],
    [
      "canoe2.jpg",
      "https://www.canoeicf.com/sites/default/files/styles/medium/public/federation_logos/namibia.jpg",
    ],
    ["fb-softball.jpg", "https://graph.facebook.com/SoftballNamibia/picture?type=large"],
    ["fb-baseball.jpg", "https://graph.facebook.com/BaseballNamibia/picture?type=large"],
    ["fb-taekwondo.jpg", "https://graph.facebook.com/TaekwondoNamibia/picture?type=large"],
    ["fb-powerlifting.jpg", "https://graph.facebook.com/PowerliftingNamibia/picture?type=large"],
    ["fb-bodybuilding.jpg", "https://graph.facebook.com/BodybuildingNamibia/picture?type=large"],
    ["fb-surfing.jpg", "https://graph.facebook.com/SurfingNamibia/picture?type=large"],
    ["fb-jukskei.jpg", "https://graph.facebook.com/NamibiaJukskei/picture?type=large"],
    ["fb-padel.jpg", "https://graph.facebook.com/NamibiaPadel/picture?type=large"],
    ["fb-orienteering.jpg", "https://graph.facebook.com/NamibiaOrienteering/picture?type=large"],
  ];
  for (const [n, u] of tries) await save(n, u);

  // Compress NESA with sharp if available, else leave for manual
  const nesaSrc = path.join(outDir, "esports-nesa.png");
  const nesaDest = path.join(logosDir, "Namibia_Electronic_Sport_Association_logo.png");
  if (fs.existsSync(nesaSrc)) {
    try {
      const sharp = (await import("sharp")).default;
      await sharp(nesaSrc)
        .resize({ width: 512, height: 512, fit: "inside", withoutEnlargement: true })
        .png({ compressionLevel: 9, palette: true })
        .toFile(nesaDest);
      const sz = fs.statSync(nesaDest).size;
      console.log("COMPRESSED NESA", sz);
      if (sz > 500_000) {
        await sharp(nesaSrc)
          .resize({ width: 400, height: 400, fit: "inside" })
          .jpeg({ quality: 82 })
          .toFile(nesaDest.replace(/\.png$/, ".jpg"));
        console.log("JPEG fallback", fs.statSync(nesaDest.replace(/\.png$/, ".jpg")).size);
      }
    } catch (e) {
      console.log("sharp unavailable:", e.message);
      // try magick
      try {
        execSync(
          `magick "${nesaSrc}" -resize 512x512> -strip "${nesaDest}"`,
          { stdio: "inherit" },
        );
        console.log("magick NESA", fs.statSync(nesaDest).size);
      } catch (e2) {
        console.log("magick fail", e2.message);
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
