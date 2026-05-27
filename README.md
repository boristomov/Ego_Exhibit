# Ego Exhibit

Marketing site for the **Thoth AI egocentric pilot dataset** — built to share with humanoid-robotics partners at summits and in client conversations. Separate from the operations dashboard (`Ego_Dashboard`) so the URL is clean and the page can be linked directly without exposing internal tooling.

## What's on the page

- **Hero (100vh)** — two annotation demo videos autoplaying, with a single-statement headline + CTAs.
- **By the numbers** — 327 episodes / 17 task folders / 5 h+ pilot duration plus the capture spec (1080p / 30 fps, ZED Neural depth, &lt;1% frame drop target) and the scaling band (Pilot → Phase 1 → Phase 2 → Phase 3).
- **Task grid (Forma-inspired)** — one autoplaying tile per task with episode counts, environment label and duration. Tap any tile to open the full preview.
- **Pipeline** — Record → Process → Inspect → Annotate → Deliver, with per-session deliverables and the MCAP topic map.
- **Operations & quality** — 50+ trained annotators, 1:5 QA ratio, 5 active sites, weekly feedback loop, motion-discipline rules and capture QA target.
- **Contact** — direct mailto cards for Boris Tomov and Pedro Alves.

## Stack

React + Vite + TypeScript + Tailwind. Static build, deployed to GitHub Pages. The dashboard's `catalogue.json` is consulted at preview-build time only; the deployed exhibit needs zero runtime AWS access.

## Local development

```bash
npm install
npm run dev               # http://localhost:5173
npm run build && npm run preview
```

## Refreshing task videos

The task tiles play short 5-second loops generated from real session MP4s. To
rebuild them (e.g. after new tasks land in the dashboard catalogue):

```bash
npm run build-previews
```

This:

1. Fetches `https://boristomov.github.io/Ego_Dashboard/catalogue.json`.
2. Picks one representative session per task (preferring fully-delivered ones).
3. Downloads the signed MP4, transcodes a 5 s / 720p / no-audio clip with `ffmpeg`.
4. Saves the JPG poster and writes `public/tasks.json`.

Requires `ffmpeg` on `PATH`. The resulting MP4s are checked into the repo.

## Deployment

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to `main`. One-time setup:

1. Create the repo on GitHub (`Ego_Exhibit`).
2. Enable Pages → Source: **GitHub Actions**.
3. Push `main` — the workflow does the rest.

The site URL will be `https://<your-handle>.github.io/Ego_Exhibit/`. For a
custom domain (e.g. `pilot.aithoth.com`), drop a `CNAME` file into `public/`
and configure DNS — `VITE_BASE` defaults to `/` so the path layout works
out-of-the-box.

## Project layout

```
public/
  favicon.svg
  tasks.json                            # task manifest (generated)
  videos/
    hero/{fold-clothing,organize-cords}.mp4
    posters/{fold-clothing,organize-cords}.jpg
    tasks/<slug>.mp4                    # 17 short autoplay loops
    posters/tasks/<slug>.jpg            # poster frames
src/
  App.tsx                               # page composition
  components/{Nav,Hero,Stats,TaskGrid,PipelineSection,QualitySection,Contact,Footer}.tsx
  hooks/useReveal.ts                    # IntersectionObserver fade-in
  lib/tasks.ts                          # manifest types + duration formatters
scripts/
  build-task-previews.mjs               # one-time video transcode script
```
