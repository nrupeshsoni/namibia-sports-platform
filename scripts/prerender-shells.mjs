#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist/public");
const INDEX = path.join(DIST, "index.html");
const ORIGIN = "https://sports.com.na";
const SITE = "sports.com.na";
const DEFAULT_IMAGE = ORIGIN + "/sports/football-action.jpg";
const SHELLS = [
  { path: "/", title: "Namibia Sports Platform", description: "Namibia's sports directory — federations, events, news, clubs, and athletes." },
  { path: "/news", title: "Namibia Sports News", description: "Latest news from Namibia's sports federations." },
  { path: "/events", title: "Sports Events in Namibia", description: "Competitions and tournaments across Namibian sports." },
  { path: "/federation/nfa", title: "Namibia Football Association", description: "Official NFA presence on sports.com.na." },
  { path: "/federation/nru", title: "Namibia Rugby Union", description: "Official NRU presence on sports.com.na." },
  { path: "/federation/cricket-namibia", title: "Cricket Namibia", description: "Official Cricket Namibia presence on sports.com.na." },
  { path: "/federation/athletics-namibia", title: "Athletics Namibia", description: "Official Athletics Namibia presence on sports.com.na." },
  { path: "/federation/namibia-netball", title: "Namibia Netball Federation", description: "Official Netball Namibia presence on sports.com.na." },
  { path: "/federation/nhu", title: "Namibia Hockey Union", description: "Official NHU presence on sports.com.na." },
  { path: "/federation/namibia-boxing", title: "Namibia Boxing Control Commission", description: "Official boxing presence on sports.com.na." },
  { path: "/federation/golf-namibia", title: "Golf Namibia", description: "Official Golf Namibia presence on sports.com.na." },
  { path: "/federation/namibia-basketball", title: "Namibia Basketball Federation", description: "Official basketball presence on sports.com.na." },
  { path: "/federation/swimming-namibia", title: "Namibia Aquatic Sports Federation", description: "Official aquatics presence on sports.com.na." },
];
function escapeHtml(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function injectMeta(html, shell){
  const title = shell.title.includes(SITE) ? shell.title : shell.title + " | " + SITE;
  const url = ORIGIN + (shell.path === "/" ? "/" : shell.path);
  const t=escapeHtml(title), d=escapeHtml(shell.description), u=escapeHtml(url), img=escapeHtml(DEFAULT_IMAGE);
  let out=html;
  out=out.replace(/<title>[^<]*<\/title>/i,"<title>"+t+"</title>");
  out=out.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,'<meta name="description" content="'+d+'" />');
  out=out.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,'<meta property="og:title" content="'+t+'" />');
  out=out.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,'<meta property="og:description" content="'+d+'" />');
  out=out.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,'<meta property="og:url" content="'+u+'" />');
  out=out.replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,'<meta property="og:image" content="'+img+'" />');
  out=out.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,'<meta name="twitter:title" content="'+t+'" />');
  out=out.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,'<meta name="twitter:description" content="'+d+'" />');
  out=out.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,'<meta name="twitter:image" content="'+img+'" />');
  if(/<link\s+rel="canonical"/i.test(out)) out=out.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,'<link rel="canonical" href="'+u+'" />');
  else out=out.replace("</head>",'    <link rel="canonical" href="'+u+'" />\n  </head>');
  return out;
}
function main(){
  if(!fs.existsSync(INDEX)){console.error("missing index.html");process.exit(1);}
  const template=fs.readFileSync(INDEX,"utf8");
  for(const shell of SHELLS){
    const html=injectMeta(template,shell);
    if(shell.path==="/") fs.writeFileSync(INDEX,html);
    else { const dir=path.join(DIST,shell.path.slice(1)); fs.mkdirSync(dir,{recursive:true}); fs.writeFileSync(path.join(dir,"index.html"),html); }
  }
  console.log("prerender-shells: wrote "+SHELLS.length);
}
main();
