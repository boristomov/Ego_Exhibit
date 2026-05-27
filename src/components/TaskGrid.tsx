import { useEffect, useRef, useState } from "react";
import { Clock, Layers, MapPin, Play } from "lucide-react";
import type { TaskEntry } from "../lib/tasks";
import { formatDuration } from "../lib/tasks";

/**
 * Inspired by the Forma project grid: rhythmic rectangular boxes, each one
 * an autoplaying loop of the relevant task. Featured tiles span 2 columns;
 * the rest fill the rhythm. Plays on viewport-enter to keep bandwidth sane.
 */

// The first 5 tasks become "featured" (2-col); the rest are standard. This
// matches the catalogue PDF's emphasis ordering (episode count / duration).
const FEATURED = new Set(["wash-cooking-items", "fold-clothing", "change-drill-head", "organize-toolbox", "sweep-trash"]);

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
            Click any tile for the full demonstration
          </div>
        </div>

        <div className="reveal mt-10 grid auto-rows-[clamp(220px,28vw,360px)] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-6">
          {tasks.map((t) => (
            <TaskTile
              key={t.slug}
              entry={t}
              featured={FEATURED.has(t.slug)}
            />
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

function TaskTile({ entry, featured }: { entry: TaskEntry; featured: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [open, setOpen] = useState(false);
  const display = (entry as TaskEntry & { displayName?: string }).displayName || entry.task;

  useEffect(() => {
    const el = videoRef.current?.parentElement;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: "0px 0px 25% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView]);

  const size = featured
    ? "col-span-2 md:col-span-2 lg:col-span-3 row-span-1"
    : "col-span-2 md:col-span-2 lg:col-span-2 row-span-1";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative overflow-hidden rounded-xl border border-border-strong/60 bg-black text-left shadow-soft transition duration-500 hover:border-accent/60 hover:shadow-glow ${size}`}
      >
        <video
          ref={videoRef}
          src={`/videos/tasks/${entry.slug}.mp4`}
          poster={`/videos/posters/tasks/${entry.slug}.jpg`}
          muted
          loop
          playsInline
          preload="none"
          className="h-full w-full object-cover transition duration-1000 group-hover:scale-[1.04]"
        />

        {/* Gradient overlay for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/0" />

        {/* Top-right meta chip */}
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md border border-white/15 bg-black/55 px-1.5 py-0.5 text-[0.62rem] font-mono uppercase tracking-wider text-white/85 backdrop-blur">
          <Layers size={9} />
          {entry.episodes} ep
        </div>

        {/* Bottom block */}
        <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
          <div className="flex items-center gap-1 text-[0.62rem] uppercase tracking-[0.16em] text-white/60">
            <MapPin size={9} /> {entry.env}
          </div>
          <div
            className={`mt-1.5 font-semibold leading-tight text-white ${
              featured ? "text-[1.05rem] md:text-[1.2rem]" : "text-[0.92rem] md:text-[1rem]"
            }`}
          >
            {display}
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[0.65rem] text-white/70">
            <Clock size={9} />
            {formatDuration(entry.durationSec)} captured
          </div>
        </div>

        {/* Hover play hint */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
          <div className="grid h-12 w-12 place-items-center rounded-full border border-white/70 bg-black/40 text-white backdrop-blur">
            <Play size={18} className="ml-0.5" />
          </div>
        </div>
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
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={display}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur"
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-border-strong bg-bg-elev shadow-glow-strong"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border/70 px-5 py-3.5">
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
            className="grid h-9 w-9 place-items-center rounded-md border border-border bg-panel hover:bg-panel-hover"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <video
          src={`/videos/tasks/${entry.slug}.mp4`}
          poster={`/videos/posters/tasks/${entry.slug}.jpg`}
          autoPlay
          controls
          loop
          playsInline
          className="block w-full bg-black"
        />
      </div>
    </div>
  );
}
