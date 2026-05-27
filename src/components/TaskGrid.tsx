import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Clock, Layers, MapPin, Play } from "lucide-react";
import type { TaskEntry } from "../lib/tasks";
import { formatDuration } from "../lib/tasks";

/**
 * A clean rectangular gallery — every tile the same shape — so the eye scans
 * the inventory rhythmically (Forma-style). On desktop, tiles stay quiet
 * (poster only, label hidden); hovering a tile starts its video and reveals
 * the label/metadata. On touch devices we fall back to in-view autoplay with
 * the label always visible, since there's no hover.
 */

export function TaskGrid({ tasks }: { tasks: TaskEntry[] }) {
  return (
    <section id="tasks" className="relative py-20 md:py-28">
      <div className="container-wide">
        <div className="reveal flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="label-eyebrow">Recording inventory</span>
            <h2 className="mt-3 max-w-[24ch] text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-tight tracking-tight">
              {tasks.length} task folders.{" "}
              <span className="brand-grad">One pipeline.</span>
            </h2>
            <p className="mt-3 max-w-[58ch] text-text-muted">
              Home-style and industrial manipulation tasks captured across
              kitchens, workshops, laundry rooms, desks and server rooms — each
              with hand and object preannotations ready for CVAT review.
            </p>
          </div>
          <div className="text-[0.72rem] uppercase tracking-[0.18em] text-text-dim">
            Hover any tile to preview · click for the full clip
          </div>
        </div>

        <div className="reveal mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {tasks.map((t) => (
            <TaskTile key={t.slug} entry={t} />
          ))}
        </div>

        <p className="reveal mt-10 max-w-[60ch] text-[0.85rem] text-text-muted">
          Diverse objects, lighting and workspaces. Operators trained for
          deliberate, slow motion without complex finger sequences — keeping
          demonstrations trainable for robotic policies.
        </p>
      </div>
    </section>
  );
}

function TaskTile({ entry }: { entry: TaskEntry }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLButtonElement>(null);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const [touch, setTouch] = useState(false);
  const [open, setOpen] = useState(false);

  const display =
    (entry as TaskEntry & { displayName?: string }).displayName || entry.task;
  const base = import.meta.env.BASE_URL;

  // Detect touch devices (no hover) once on mount.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: none)");
    const update = () => setTouch(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Only observe viewport on touch (to autoplay when scrolled into view).
  useEffect(() => {
    if (!touch || !wrapRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: "0px 0px 20% 0px", threshold: 0.35 },
    );
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, [touch]);

  // Drive playback: hover on desktop, in-view on touch.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const shouldPlay = touch ? inView : hovering;
    if (shouldPlay) {
      // Ensure first frame is ready then play. Catch the autoplay rejection
      // (some browsers reject the very first play() if the metadata hasn't
      // landed yet — load() forces it).
      if (v.readyState < 2) v.load();
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
      // Reset so the next hover starts from the top of the loop.
      v.currentTime = 0;
    }
  }, [hovering, inView, touch]);

  return (
    <>
      <button
        ref={wrapRef}
        type="button"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        aria-label={`Open ${display}`}
        className="group relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border-strong/60 bg-black text-left shadow-soft transition duration-500 hover:border-accent/70 hover:shadow-glow"
      >
        <video
          ref={videoRef}
          src={`${base}videos/tasks/${entry.slug}.mp4`}
          poster={`${base}videos/posters/tasks/${entry.slug}.jpg`}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-[1.04]"
        />

        {/* Idle gradient kept very light so the poster carries the tile */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 transition-opacity duration-500 group-hover:opacity-0" />

        {/* Always-visible micro-badge: episode count */}
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md border border-white/15 bg-black/55 px-1.5 py-0.5 text-[0.6rem] font-mono uppercase tracking-wider text-white/80 backdrop-blur transition group-hover:opacity-0">
          <Layers size={9} />
          {entry.episodes}
        </div>

        {/* Hover-only overlay: gradient + label + meta + play cue */}
        <div
          className={`pointer-events-none absolute inset-0 flex flex-col justify-end p-3 transition duration-500 md:p-4 ${
            touch ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/0" />

          <div className="relative">
            <div className="flex items-center gap-1 text-[0.62rem] uppercase tracking-[0.16em] text-white/70">
              <MapPin size={9} /> {entry.env}
            </div>
            <div className="mt-1.5 text-[0.95rem] font-semibold leading-tight text-white md:text-[1.02rem]">
              {display}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.65rem] text-white/70">
              <span className="inline-flex items-center gap-1">
                <Layers size={9} /> {entry.episodes} episodes
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={9} /> {formatDuration(entry.durationSec)}
              </span>
            </div>
          </div>
        </div>

        {/* Center play cue on hover (desktop only) */}
        {!touch && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition duration-500 group-hover:opacity-100">
            <div className="grid h-12 w-12 place-items-center rounded-full border border-white/70 bg-black/35 text-white backdrop-blur">
              <Play size={18} className="ml-0.5" />
            </div>
          </div>
        )}
      </button>

      {open && (
        <TaskModal entry={entry} display={display} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function TaskModal({
  entry,
  display,
  onClose,
}: {
  entry: TaskEntry;
  display: string;
  onClose: () => void;
}) {
  const base = import.meta.env.BASE_URL;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // Render via portal so the modal escapes any transformed ancestor
  // (e.g. the .reveal grid) — `position: fixed` would otherwise be
  // anchored to that ancestor's box, which throws the modal off-centre.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={display}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur"
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border-strong bg-bg-elev shadow-glow-strong"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-shrink-0 items-start justify-between gap-3 border-b border-border/70 px-5 py-3.5">
          <div className="min-w-0">
            <div className="text-[0.62rem] uppercase tracking-[0.18em] text-text-muted">
              {entry.env}
            </div>
            <div className="mt-0.5 text-[1.05rem] font-semibold text-text">{display}</div>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[0.72rem] text-text-muted">
              <span>{entry.episodes} episodes</span>
              <span className="text-text-dim">·</span>
              <span>{formatDuration(entry.durationSec)} captured</span>
              {entry.sessionId && (
                <>
                  <span className="text-text-dim">·</span>
                  <span className="font-mono">{entry.sessionId}</span>
                </>
              )}
            </div>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-md border border-border bg-panel hover:bg-panel-hover"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <video
          src={`${base}videos/tasks/${entry.slug}.mp4`}
          poster={`${base}videos/posters/tasks/${entry.slug}.jpg`}
          autoPlay
          controls
          loop
          playsInline
          className="block max-h-[calc(92vh-72px)] w-full bg-black object-contain"
        />
      </div>
    </div>,
    document.body,
  );
}
