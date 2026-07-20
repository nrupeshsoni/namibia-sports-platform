/**
 * Pass 2: download sport heroes from resolved Commons URLs + Unsplash (license OK).
 * Delays between requests to avoid 429. Run: node scripts/fetch-sports-photos-pass2.mjs
 */
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "client", "public", "sports");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fetchBuf(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("http:") ? http : https;
    const req = lib.get(
      url,
      {
        headers: {
          "User-Agent": "NamibiaSportsPlatform/1.0 (sports.com.na; federation photo enrichment)",
          Accept: "image/*,*/*",
        },
        timeout: 60000,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects < 8) {
          const next = new URL(res.headers.location, url).href;
          res.resume();
          return fetchBuf(next, redirects + 1).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({ code: res.statusCode ?? 0, buf: Buffer.concat(chunks), ct: res.headers["content-type"] ?? "" })
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

function isImage(buf, code) {
  if (code !== 200 || buf.length < 8000) return false;
  const head = buf.slice(0, 16);
  return (
    (head[0] === 0xff && head[1] === 0xd8) ||
    (head[0] === 0x89 && head[1] === 0x50) ||
    buf.slice(0, 4).toString("ascii") === "RIFF"
  );
}

const unsplash = (id, w = 1280) => `https://images.unsplash.com/${id}?w=${w}&q=80`;

/** Direct URLs only — Commons upload.* or Unsplash */
const jobs = [
  // Majors (sport-correct)
  ["athletics.jpg", unsplash("photo-1461896836934-ffe607ba8211")], // track starter
  ["athletics-alt.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/100_metres.jpg/1280px-100_metres.jpg"],
  ["cycling.jpg", unsplash("photo-1541625602330-2277a4c46182")],
  ["netball.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Netball.jpg/1280px-Netball.jpg"],
  ["volleyball.jpg", unsplash("photo-1612872087720-bb876e2e67d1")],
  ["tennis.jpg", unsplash("photo-1554068865-24cecd4e34b8")],
  ["hockey-field.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Field_hockey_at_the_2012_Summer_Olympics.jpg/1280px-Field_hockey_at_the_2012_Summer_Olympics.jpg"],
  ["basketball-action.jpg", unsplash("photo-1546519638-68e109498ffc")],
  ["swimming-action.jpg", unsplash("photo-1519315901367-f34ff9154487")],
  ["boxing-action.jpg", unsplash("photo-1549719386-74dfcbf7dbed")],
  ["rugby.jpg", unsplash("photo-1544298621-77b0abb8a8b1")],
  ["football-action.jpg", unsplash("photo-1574629810360-7efbbe195018")],
  ["cricket-action.jpg", unsplash("photo-1531415074968-036ba1b575da")],
  ["golf.jpg", unsplash("photo-1535131749006-b7f58c99034b")],
  ["badminton.jpg", unsplash("photo-1626224583764-f87db24ac4ea")],
  ["judo.jpg", unsplash("photo-1555597673-b21d5c935865")],
  ["martial-arts.jpg", unsplash("photo-1555597673-b21d5c935865")],
  ["triathlon.jpg", unsplash("photo-1530549387789-4c1017266635")],
  ["table-tennis.jpg", unsplash("photo-1609710228159-0fa9bd7c0827")],
  ["squash.jpg", unsplash("photo-1541534741688-6078c6bfb5c5")],
  ["handball.jpg", unsplash("photo-1554290712-e640351074bd")],
  ["taekwondo.jpg", unsplash("photo-1598518619776-eae3f8a34eac")],
  ["wrestling.jpg", unsplash("photo-1565711561500-49678a10a63f")],
  ["bowls.jpg", unsplash("photo-1558618666-fcd25c85cd64")],
  ["fencing.jpg", unsplash("photo-1562771379-eafdca7a493d")], // fencing/sport hall — verify later; prefer null if wrong
  // Commons-resolved
  ["baseball.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Baseball.jpg/1280px-Baseball.jpg"],
  ["bodybuilding.jpg", "https://upload.wikimedia.org/wikipedia/commons/0/04/Bodybuilder.jpg"],
  ["chess-tournament.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Chess_pieces.jpg/1280px-Chess_pieces.jpg"],
  ["fishing.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Angling.jpg/1280px-Angling.jpg"],
  ["darts-action.jpg", "https://upload.wikimedia.org/wikipedia/commons/5/5b/Darts.jpg"],
  ["horse-racing.jpg", "https://upload.wikimedia.org/wikipedia/commons/e/ec/Horse_racing.jpg"],
  ["motorsport.jpg", "https://upload.wikimedia.org/wikipedia/commons/c/c0/Motorsport.jpg"],
  ["mountaineering.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mountaineering.jpg/1280px-Mountaineering.jpg"],
  ["orienteering.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Orienteering.jpg/1280px-Orienteering.jpg"],
  ["equestrian.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Show_jumping.jpg/1280px-Show_jumping.jpg"],
  ["dance-sport.jpg", "https://upload.wikimedia.org/wikipedia/commons/f/f0/Ballroom_dance.jpg"],
  ["rollerskating-action.jpg", "https://upload.wikimedia.org/wikipedia/commons/1/1e/Inline_skating.jpg"],
  ["martial-arts-mma.jpg", "https://upload.wikimedia.org/wikipedia/commons/3/34/Mixed_martial_arts.jpg"],
  ["powerlifting.jpg", "https://upload.wikimedia.org/wikipedia/commons/c/c8/Powerlifting.jpg"],
  ["petanque.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/P%C3%A9tanque.jpg/1280px-P%C3%A9tanque.jpg"],
  ["skateboarding-action.jpg", "https://upload.wikimedia.org/wikipedia/commons/a/ae/Skateboarding.jpg"],
  ["softball.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Softball.jpg/1280px-Softball.jpg"],
  ["surfing.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Surfing.jpg/1280px-Surfing.jpg"],
  ["waterski.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Water_skiing.jpg/1280px-Water_skiing.jpg"],
  ["kickboxing.jpg", "https://upload.wikimedia.org/wikipedia/commons/0/03/Kickboxing.jpg"],
  ["muaythai.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Muay_Thai.jpg/1280px-Muay_Thai.jpg"],
  // More Unsplash sport-correct
  ["beach-volleyball.jpg", unsplash("photo-1612872087720-bb876e2e67d1")],
  ["gymnastics.jpg", unsplash("photo-1562771379-eafdca7a493d")],
  ["rowing.jpg", unsplash("photo-1517649763962-0c623066013b")], // rowing/kayak water sport
  ["sailing.jpg", unsplash("photo-1505118380757-91f5f5632de0")],
  ["climbing.jpg", unsplash("photo-1522163182402-834f871fd851")],
  ["canoeing.jpg", unsplash("photo-1517649763962-0c623066013b")],
  ["futsal.jpg", unsplash("photo-1574629810360-7efbbe195018")],
  ["frisbee.jpg", unsplash("photo-1566576721346-d77f8ecf4d66")],
  ["ice-hockey.jpg", unsplash("photo-1515703407324-5f769793f2b0")],
  ["lacrosse.jpg", unsplash("photo-1566576721346-d77f8ecf4d66")], // may be wrong — leave null if fails visual
  ["billiards-action.jpg", unsplash("photo-1575550959106-5a7defe28b56")],
  ["weightlifting.jpg", unsplash("photo-1517836357463-d25dfeac3438")],
  ["archery.jpg", unsplash("photo-1518611012118-696072aa579a")],
  ["shooting.jpg", unsplash("photo-1595590424280-db88851fc87c")],
  ["esports.jpg", unsplash("photo-1542751371-adc38448a05e")],
  ["padel.jpg", unsplash("photo-1554068865-24cecd4e34b8")], // tennis-like court — annotate as interim
  ["korfball.jpg", unsplash("photo-1546519638-68e109498ffc")], // basketball-like — prefer null over wrong
  ["pentathlon.jpg", unsplash("photo-1461896836934-ffe607ba8211")],
];

const ok = [];
const fail = [];
const skipped = [];

for (const [file, url] of jobs) {
  const dest = path.join(dir, file);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 30000) {
    // Refresh tiny volleyball from earlier bad download
    if (file === "volleyball.jpg" && fs.statSync(dest).size < 80000) {
      // re-download
    } else if (!["athletics.jpg", "fencing.jpg", "korfball.jpg", "lacrosse.jpg", "padel.jpg"].includes(file)) {
      console.log(`skip ${file}`);
      skipped.push(file);
      continue;
    }
  }
  try {
    const { code, buf } = await fetchBuf(url);
    if (!isImage(buf, code)) {
      console.log(`FAIL ${file} code=${code} len=${buf.length}`);
      fail.push(file);
    } else {
      fs.writeFileSync(dest, buf);
      console.log(`OK   ${file} (${buf.length})`);
      ok.push(file);
    }
  } catch (e) {
    console.log(`ERR  ${file}: ${e.message}`);
    fail.push(file);
  }
  await sleep(1200);
}

console.log(`\nOK ${ok.length} | skip ${skipped.length} | fail ${fail.length}`);
if (fail.length) console.log("Failed:", fail.join(", "));
