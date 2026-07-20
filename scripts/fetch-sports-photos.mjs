/**
 * Download sport-correct hero/cover photos into client/public/sports/
 * Sources: Wikimedia Commons (CC / public domain) + copy existing namibia-* assets.
 * Run: node scripts/fetch-sports-photos.mjs
 */
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "client", "public", "sports");

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
        timeout: 45000,
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

function isImage(buf, code, ct) {
  if (code !== 200 || buf.length < 8000) return false;
  if (/html|text\/|xml/i.test(ct)) return false;
  const head = buf.slice(0, 16);
  const jpg = head[0] === 0xff && head[1] === 0xd8;
  const png = head[0] === 0x89 && head[1] === 0x50;
  const webp = buf.slice(0, 4).toString("ascii") === "RIFF";
  return jpg || png || webp;
}

/** Commons Special:FilePath → stable download (thumb when width set) */
function commons(file, width = 1280) {
  const enc = encodeURIComponent(file.replace(/ /g, "_"));
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${enc}?width=${width}`;
}

/**
 * Curated sport-correct photos. Prefer Namibia-specific when available.
 * License notes tracked in docs/research/federation_photos_batch.md
 */
const downloads = [
  // Majors — Namibia-specific where possible
  ["namibia-rugby-action.jpg", commons("2023 Rugby World Cup – New Zealand vs Namibia – 1.jpg", 1600)],
  ["athletics.jpg", commons("Athletics competition at the 2015 Military World Games.jpg", 1280)],
  ["netball.jpg", commons("Netball game.jpg", 1280)],
  ["volleyball.jpg", commons("Volleyball match.jpg", 1280)],
  ["tennis.jpg", commons("Tennis ball machine.jpg", 1280)],
  ["tennis-action.jpg", commons("Maria Sharapova at the 2015 Australian Open.jpg", 1280)],
  ["cycling.jpg", commons("Road bicycle racing.jpg", 1280)],
  ["football.jpg", commons("Association football.svg", 1280)], // may fail (svg) — fallback below
  ["football-action.jpg", commons("Football iu 1996.jpg", 1280)],
  ["cricket-action.jpg", commons("Cricket match.jpg", 1280)],
  ["hockey-field.jpg", commons("Field hockey game.jpg", 1280)],
  ["basketball-action.jpg", commons("Basketball game.jpg", 1280)],
  ["swimming-action.jpg", commons("Swimming competition.jpg", 1280)],
  ["boxing-action.jpg", commons("Boxing 2012 Olympics.jpg", 1280)],
  ["rugby.jpg", commons("Rugby union scrum.jpg", 1280)],
  // Other sports with broken local paths
  ["archery.jpg", commons("Archery competition.jpg", 1280)],
  ["badminton.jpg", commons("Badminton.jpg", 1280)],
  ["baseball.jpg", commons("Baseball swing.jpg", 1280)],
  ["beach-volleyball.jpg", commons("Beach volleyball.jpg", 1280)],
  ["billiards-action.jpg", commons("Snooker.jpg", 1280)],
  ["bodybuilding.jpg", commons("Bodybuilding.jpg", 1280)],
  ["bowls.jpg", commons("Lawn bowls.jpg", 1280)],
  ["canoeing.jpg", commons("Canoeing.jpg", 1280)],
  ["chess-tournament.jpg", commons("Chess tournament.jpg", 1280)],
  ["climbing.jpg", commons("Sport climbing.jpg", 1280)],
  ["darts-action.jpg", commons("Darts.jpg", 1280)],
  ["equestrian.jpg", commons("Show jumping.jpg", 1280)],
  ["fencing.jpg", commons("Fencing competition.jpg", 1280)],
  ["fishing.jpg", commons("Angling.jpg", 1280)],
  ["frisbee.jpg", commons("Ultimate frisbee.jpg", 1280)],
  ["futsal.jpg", commons("Futsal.jpg", 1280)],
  ["golf.jpg", commons("Golf swing.jpg", 1280)],
  ["gymnastics.jpg", commons("Artistic gymnastics.jpg", 1280)],
  ["handball.jpg", commons("Handball.jpg", 1280)],
  ["horse-racing.jpg", commons("Horse racing.jpg", 1280)],
  ["ice-hockey.jpg", commons("Ice hockey.jpg", 1280)],
  ["judo.jpg", commons("Judo.jpg", 1280)],
  ["karate.jpg", commons("Karate.jpg", 1280)],
  ["korfball.jpg", commons("Korfball.jpg", 1280)],
  ["lacrosse.jpg", commons("Lacrosse.jpg", 1280)],
  ["motorsport.jpg", commons("Motorsport.jpg", 1280)],
  ["mountaineering.jpg", commons("Mountaineering.jpg", 1280)],
  ["orienteering.jpg", commons("Orienteering.jpg", 1280)],
  ["pentathlon.jpg", commons("Modern pentathlon.jpg", 1280)],
  ["petanque.jpg", commons("Pétanque.jpg", 1280)],
  ["powerlifting.jpg", commons("Powerlifting.jpg", 1280)],
  ["rollerskating-action.jpg", commons("Inline skating.jpg", 1280)],
  ["rowing.jpg", commons("Rowing sport.jpg", 1280)],
  ["sailing.jpg", commons("Sailing.jpg", 1280)],
  ["shooting.jpg", commons("Shooting sport.jpg", 1280)],
  ["skateboarding-action.jpg", commons("Skateboarding.jpg", 1280)],
  ["softball.jpg", commons("Softball.jpg", 1280)],
  ["squash.jpg", commons("Squash (sport).jpg", 1280)],
  ["surfing.jpg", commons("Surfing.jpg", 1280)],
  ["table-tennis.jpg", commons("Table tennis.jpg", 1280)],
  ["taekwondo.jpg", commons("Taekwondo.jpg", 1280)],
  ["triathlon.jpg", commons("Triathlon.jpg", 1280)],
  ["weightlifting.jpg", commons("Olympic weightlifting.jpg", 1280)],
  ["wrestling.jpg", commons("Wrestling.jpg", 1280)],
  ["martial-arts.jpg", commons("Martial arts.jpg", 1280)],
  ["dance-sport.jpg", commons("Ballroom dance.jpg", 1280)],
  ["esports.jpg", commons("Esports.jpg", 1280)],
  ["padel.jpg", commons("Padel.jpg", 1280)],
  ["waterski.jpg", commons("Water skiing.jpg", 1280)],
  ["kickboxing.jpg", commons("Kickboxing.jpg", 1280)],
  ["muaythai.jpg", commons("Muay Thai.jpg", 1280)],
];

/** Fallbacks when primary Commons title fails */
const fallbacks = {
  "football.jpg": commons("Soccer game in Denver.jpg", 1280),
  "tennis.jpg": commons("Tennis court.jpg", 1280),
  "tennis-action.jpg": commons("Tennis.jpg", 1280),
  "netball.jpg": commons("Netball.jpg", 1280),
  "athletics.jpg": commons("Sprint start.jpg", 1280),
  "volleyball.jpg": commons("Volleyball.jpg", 1280),
  "cycling.jpg": commons("Cycle racing.jpg", 1280),
  "hockey-field.jpg": commons("Field hockey.jpg", 1280),
  "handball.jpg": commons("Team handball.jpg", 1280),
  "futsal.jpg": commons("Indoor soccer.jpg", 1280),
  "archery.jpg": commons("Archery.jpg", 1280),
  "fencing.jpg": commons("Fencing.jpg", 1280),
  "gymnastics.jpg": commons("Gymnastics.jpg", 1280),
  "rowing.jpg": commons("Rowing (sport).jpg", 1280),
  "motorsport.jpg": commons("Auto racing.jpg", 1280),
  "esports.jpg": commons("Electronic sports.jpg", 1280),
  "dance-sport.jpg": commons("Dancesport.jpg", 1280),
  "petanque.jpg": commons("Petanque.jpg", 1280),
  "squash.jpg": commons("Squash sport.jpg", 1280),
  "wrestling.jpg": commons("Greco-Roman wrestling.jpg", 1280),
  "boxing-action.jpg": commons("Amateur boxing.jpg", 1280),
  "swimming-action.jpg": commons("Competitive swimming.jpg", 1280),
  "basketball-action.jpg": commons("Basketball.jpg", 1280),
  "cricket-action.jpg": commons("Cricket.jpg", 1280),
  "namibia-rugby-action.jpg": commons("Namibia NT 2015 RWC New Zealand.jpg", 1600),
  "korfball.jpg": commons("Korfbal.jpg", 1280),
  "frisbee.jpg": commons("Ultimate (sport).jpg", 1280),
  "billiards-action.jpg": commons("Pool (cue sports).jpg", 1280),
  "pentathlon.jpg": commons("Modern Pentathlon.jpg", 1280),
  "orienteering.jpg": commons("Foot orienteering.jpg", 1280),
  "climbing.jpg": commons("Rock climbing.jpg", 1280),
  "horse-racing.jpg": commons("Thoroughbred racing.jpg", 1280),
  "ice-hockey.jpg": commons("Ice hockey game.jpg", 1280),
  "padel.jpg": commons("Padel tennis.jpg", 1280),
  "waterski.jpg": commons("Waterskiing.jpg", 1280),
  "muaythai.jpg": commons("Muay thai.jpg", 1280),
  "kickboxing.jpg": commons("Kick boxing.jpg", 1280),
  "martial-arts.jpg": commons("Mixed martial arts.jpg", 1280),
  "darts-action.jpg": commons("Dartboard.jpg", 1280),
  "chess-tournament.jpg": commons("Chess.jpg", 1280),
  "fishing.jpg": commons("Recreational fishing.jpg", 1280),
  "softball.jpg": commons("Softball game.jpg", 1280),
  "skateboarding-action.jpg": commons("Street skateboarding.jpg", 1280),
  "rollerskating-action.jpg": commons("Roller skating.jpg", 1280),
  "shooting.jpg": commons("Olympic shooting.jpg", 1280),
  "sailing.jpg": commons("Yacht racing.jpg", 1280),
  "canoeing.jpg": commons("Canoe sprint.jpg", 1280),
  "equestrian.jpg": commons("Equestrianism.jpg", 1280),
  "bodybuilding.jpg": commons("Bodybuilder.jpg", 1280),
  "powerlifting.jpg": commons("Deadlift.jpg", 1280),
  "weightlifting.jpg": commons("Weightlifting.jpg", 1280),
  "table-tennis.jpg": commons("Ping pong.jpg", 1280),
  "taekwondo.jpg": commons("Taekwon-Do.jpg", 1280),
  "triathlon.jpg": commons("Ironman Triathlon.jpg", 1280),
  "golf.jpg": commons("Golf.jpg", 1280),
  "bowls.jpg": commons("Bowls (sport).jpg", 1280),
  "lacrosse.jpg": commons("Men's lacrosse.jpg", 1280),
  "baseball.jpg": commons("Baseball.jpg", 1280),
  "badminton.jpg": commons("Badminton game.jpg", 1280),
  "beach-volleyball.jpg": commons("Beach Volleyball.jpg", 1280),
  "judo.jpg": commons("Judo throw.jpg", 1280),
  "karate.jpg": commons("Karate sparring.jpg", 1280),
  "mountaineering.jpg": commons("Alpine climbing.jpg", 1280),
};

async function downloadOne(file, url) {
  const { code, buf, ct } = await fetchBuf(url);
  if (!isImage(buf, code, ct)) return { ok: false, code, len: buf.length, ct };
  fs.writeFileSync(path.join(dir, file), buf);
  return { ok: true, len: buf.length };
}

function copyLocal(srcName, destName) {
  const src = path.join(dir, srcName);
  const dest = path.join(dir, destName);
  if (!fs.existsSync(src)) return false;
  if (fs.existsSync(dest) && fs.statSync(dest).size > 8000) return true;
  fs.copyFileSync(src, dest);
  return true;
}

// Seed from known-good local Namibia assets
const localCopies = [
  ["namibia-football.jpg", "football.jpg"],
  ["namibia-cricket.jpg", "cricket.jpg"],
  ["namibia-hockey.jpg", "hockey.jpg"],
  ["namibia-basketball.jpg", "basketball.jpg"],
  ["namibia-swimming.jpg", "swimming.jpg"],
  ["namibia-boxing.jpg", "boxing.jpg"],
  ["namibia-football.jpg", "namibia-football.jpg"], // noop ensure present
];

for (const [src, dest] of localCopies) {
  const ok = copyLocal(src, dest);
  console.log(`copy ${src} → ${dest}: ${ok ? "OK" : "MISS"}`);
}

const results = { ok: [], fail: [] };

for (const [file, url] of downloads) {
  const dest = path.join(dir, file);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 20000 && !file.includes("action") && file !== "namibia-rugby-action.jpg") {
    // Keep existing solid local files; still refresh tiny rugby later
    if (["football.jpg", "cricket.jpg", "hockey.jpg", "basketball.jpg", "swimming.jpg", "boxing.jpg"].includes(file)) {
      console.log(`skip existing ${file}`);
      results.ok.push(file);
      continue;
    }
  }
  try {
    let r = await downloadOne(file, url);
    if (!r.ok && fallbacks[file]) {
      console.log(`retry ${file}…`);
      r = await downloadOne(file, fallbacks[file]);
    }
    if (r.ok) {
      console.log(`OK  ${file} (${r.len})`);
      results.ok.push(file);
    } else {
      console.log(`FAIL ${file} code=${r.code} len=${r.len} ct=${r.ct}`);
      results.fail.push(file);
    }
  } catch (e) {
    console.log(`ERR  ${file}: ${e.message}`);
    results.fail.push(file);
  }
}

console.log(`\nDone: ${results.ok.length} ok, ${results.fail.length} fail`);
if (results.fail.length) console.log("Failed:", results.fail.join(", "));
