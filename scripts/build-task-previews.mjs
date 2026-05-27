#!/usr/bin/env node
// Builds short autoplay previews for the task grid by:
//   1) Reading the live dashboard catalogue.json.
//   2) Picking one representative session per task folder (preferring sessions
//      that are fully delivered and have a working signed MP4 URL).
//   3) Downloading the MP4 and transcoding to a tiny 5-second muted loop
//      (~250-400 KB) at 480p.
//   4) Saving the JPG poster (from the dashboard's already-baked thumbs) so
//      the box paints instantly before the video starts.
//   5) Writing public/tasks.json — the manifest the React UI consumes.
//
// Run once when adding/refreshing the exhibit; the resulting MP4s are checked
// into the repo so the deploy needs no live S3 access.

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const DASHBOARD_BASE =
  process.env.DASHBOARD_BASE || "https://boristomov.github.io/Ego_Dashboard";
const CLIP_SECONDS = Number(process.env.CLIP_SECONDS || 5);
const TASKS_DIR = path.join(REPO_ROOT, "public", "videos", "tasks");
const POSTERS_DIR = path.join(REPO_ROOT, "public", "videos", "posters", "tasks");

// Curated order + display copy. Pulled from the dataset catalogue PDF.
const TASKS = [
  { task: "Wash dirty cooking and dining items", slug: "wash-cooking-items", env: "Kitchen / sink" },
  { task: "Organize a toolbox", slug: "organize-toolbox", env: "Workshop / workbench" },
  { task: "Organize pencils_ markers and pens", slug: "organize-stationery", env: "Desk / office", displayName: "Organize pencils, markers and pens" },
  { task: "Transfer clothes from washing machine to the dryer", slug: "transfer-clothes", env: "Laundry" },
  { task: "Sweep trash in a dustpan and empty it out in a bin", slug: "sweep-trash", env: "Floor / bin area" },
  { task: "Cook a tortilla", slug: "cook-tortilla", env: "Kitchen / stovetop" },
  { task: "Extract 3D Printed Item and Clean Print Bed", slug: "3d-print", env: "Maker space", displayName: "Extract 3D-printed item and clean print bed" },
  { task: "Insert new batteries in device", slug: "batteries", env: "Desk / device setup" },
  { task: "Fold Clothing", slug: "fold-clothing", env: "Home / laundry surface" },
  { task: "Load Dishwasher", slug: "load-dishwasher", env: "Kitchen / dishwasher" },
  { task: "Change drill head attachment", slug: "change-drill-head", env: "Workshop / tools" },
  { task: "Organize Audio Equipment", slug: "audio-equipment", env: "Audio / gear" },
  { task: "Organize cords and adapters", slug: "organize-cords", env: "Desk / electronics" },
  { task: "Set up a microphone stand with a microphone", slug: "microphone-stand", env: "Audio setup" },
  { task: "Unbutton a shirt", slug: "unbutton-shirt", env: "Clothing close-up" },
  { task: "Clean Restroom with toilet brush", slug: "clean-restroom", env: "Restroom" },
  { task: "Plug in ethernet cord in server rack", slug: "ethernet", env: "Server rack" },
];

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit", ...opts });
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exit ${code}`))));
  });
}

async function fetchToFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  await fsp.mkdir(path.dirname(dest), { recursive: true });
  const buf = Buffer.from(await res.arrayBuffer());
  await fsp.writeFile(dest, buf);
  return buf.length;
}

function pickSession(catalogueSessions, taskName) {
  const candidates = catalogueSessions.filter(
    (s) => s.taskName === taskName && (s.urls || {}).mp4,
  );
  if (!candidates.length) return null;
  // Prefer delivered (mp4 + mcap + zip), then longest, then most recent.
  candidates.sort((a, b) => {
    const aFull =
      !!(a.urls.mp4 && a.urls.mcap && a.urls.zip) ? 1 : 0;
    const bFull =
      !!(b.urls.mp4 && b.urls.mcap && b.urls.zip) ? 1 : 0;
    if (aFull !== bFull) return bFull - aFull;
    const aDur = a.metadata?.durationSec ?? 0;
    const bDur = b.metadata?.durationSec ?? 0;
    if (aDur !== bDur) return bDur - aDur;
    return (b.sessionId || "").localeCompare(a.sessionId || "");
  });
  return candidates[0];
}

async function main() {
  await fsp.mkdir(TASKS_DIR, { recursive: true });
  await fsp.mkdir(POSTERS_DIR, { recursive: true });

  console.log(`[previews] fetching catalogue from ${DASHBOARD_BASE}/catalogue.json`);
  const cat = await (await fetch(`${DASHBOARD_BASE}/catalogue.json`)).json();
  const manifest = await (await fetch(`${DASHBOARD_BASE}/thumbs-manifest.json`)).json().catch(() => ({}));
  console.log(`[previews] catalogue has ${cat.sessions.length} sessions`);

  // Roll up counts and total duration per task across the whole catalogue.
  const taskStats = new Map();
  for (const s of cat.sessions) {
    let r = taskStats.get(s.taskName);
    if (!r) {
      r = { episodes: 0, durationSec: 0 };
      taskStats.set(s.taskName, r);
    }
    r.episodes += 1;
    if (s.metadata?.durationSec) r.durationSec += s.metadata.durationSec;
  }

  const out = [];
  for (const cfg of TASKS) {
    const stats = taskStats.get(cfg.task) || { episodes: 0, durationSec: 0 };
    const pick = pickSession(cat.sessions, cfg.task);
    if (!pick) {
      console.warn(`[previews]   ! no session with MP4 for "${cfg.task}"`);
      out.push({ ...cfg, episodes: stats.episodes, durationSec: stats.durationSec });
      continue;
    }
    const tmpSrc = path.join("/tmp", `ego_src_${cfg.slug}.mp4`);
    const tmpOut = path.join(TASKS_DIR, `${cfg.slug}.mp4`);
    const posterOut = path.join(POSTERS_DIR, `${cfg.slug}.jpg`);

    console.log(
      `[previews] ${cfg.task} → session ${pick.sessionId} (${stats.episodes} ep, ${(stats.durationSec / 60).toFixed(1)} min)`,
    );

    // Poster (from baked dashboard thumbs).
    const manifestKey = `${pick.taskName}/${pick.sessionId}`;
    const thumbRel = manifest[manifestKey];
    if (thumbRel) {
      try {
        await fetchToFile(`${DASHBOARD_BASE}/thumbs/${thumbRel}`, posterOut);
      } catch (e) {
        console.warn(`[previews]   poster fetch failed: ${e.message}`);
      }
    }

    // MP4 → trim, scale, re-encode.
    try {
      const bytes = await fetchToFile(pick.urls.mp4, tmpSrc);
      console.log(`[previews]   downloaded ${(bytes / 1024 / 1024).toFixed(1)} MB`);

      // Use a clip from ~25% into the recording to skip any setup motion.
      const startSec = Math.max(
        1,
        Math.min(15, Math.floor((pick.metadata?.durationSec || 30) * 0.2)),
      );
      await run("ffmpeg", [
        "-y",
        "-ss", String(startSec),
        "-i", tmpSrc,
        "-t", String(CLIP_SECONDS),
        "-vf", "scale=720:-2,fps=24",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "30",
        "-profile:v", "high",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-an",
        tmpOut,
      ]);
      await fsp.unlink(tmpSrc).catch(() => {});
      const sz = fs.statSync(tmpOut).size;
      console.log(`[previews]   encoded ${(sz / 1024).toFixed(0)} KB → ${path.relative(REPO_ROOT, tmpOut)}`);
    } catch (e) {
      console.warn(`[previews]   ! encode failed: ${e.message}`);
    }

    out.push({
      ...cfg,
      episodes: stats.episodes,
      durationSec: stats.durationSec,
      sessionId: pick.sessionId,
    });
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    totalSessions: cat.sessions.length,
    totalDurationSec: Array.from(taskStats.values()).reduce((a, t) => a + t.durationSec, 0),
    totalTasks: taskStats.size,
    tasks: out,
  };
  await fsp.writeFile(
    path.join(REPO_ROOT, "public", "tasks.json"),
    JSON.stringify(summary, null, 2),
  );
  console.log(`[previews] wrote public/tasks.json (${out.length} tasks)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
