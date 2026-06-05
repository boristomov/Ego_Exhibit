import { useEffect, useRef } from "react";
import { ArrowRight, Cpu, Hand } from "lucide-react";
import type { TaskEntry, TasksManifest } from "../lib/tasks";
import { navigate } from "../hooks/useHashRoute";

const TRAINING = [
  "Deliberate, slow hand motion sustained throughout each demonstration.",
  "Avoidance of complex finger sequences that complicate policy learning.",
  "Smooth approach, grasp and release without unnecessary mid-task adjustments.",
  "Consistent posture and limb positioning across operators.",
  "Task checklists and reference videos standardize execution across sites.",
  "Objects kept visible to the stereo rig during manipulation.",
];

/**
 * Full-height home "company" section. A 4-row scrolling comb of real task
 * previews fills the viewport as a living (purely decorative) backdrop, with the
 * in-house footprint headline + stats up top and the capture-discipline / QA
 * panels below.
 */
export function Highlights({ manifest }: { manifest: TasksManifest | null }) {
  const list = manifest?.tasks ?? [];

  // Four interlocking rows: each is the full set rotated to a different offset
  // so the comb stays varied and wide enough to scroll seamlessly.
  const rotate = (offset: number): TaskEntry[] =>
    list.length ? [...list.slice(offset), ...list.slice(0, offset)] : [];
  const step = Math.max(1, Math.floor(list.length / 4));
  const rows = [rotate(0), rotate(step), rotate(step * 2), rotate(step * 3)];
  // Marquee speeds in px/s (per row), driven by JS for reliable motion.
  const speeds = [72, 94, 58, 82];

  return (
    <section
      id="highlights"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-24 md:h-[100svh] md:py-0 md:pt-24"
    >
      {/* Decorative task comb backdrop (fills the section) */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 flex flex-col justify-center gap-3 [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          {rows.map((row, i) => (
            <MosaicRow
              key={i}
              tasks={row.length ? row : list}
              speed={speeds[i]}
            />
          ))}
        </div>
        {/* Readability scrims — pass pointer events through to the comb tiles */}
        <div className="pointer-events-none absolute inset-0 bg-bg/55" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(95%_75%_at_0%_0%,rgba(8,9,14,0.9),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
      </div>

      {/* Content — non-interactive areas let the comb behind stay hoverable */}
      <div className="container-wide pointer-events-none relative z-10 flex w-full flex-col gap-6 md:gap-8">
        {/* Footprint stats */}
        <div className="reveal flex flex-wrap items-stretch gap-2.5 md:gap-3">
          <StatChip value="70+" label="Staff trained to collect & annotate" sub="no outsourcing" />
          <StatChip value="1 : 5" label="QA / lead-to-worker ratio" />
          <StatChip value="20+" label="Sites in the network" accent />
          <StatChip value="2,000+" label="Hours / month objective" accent />
        </div>

        {/* Headline */}
        <div className="reveal max-w-[64ch]" style={{ transitionDelay: "90ms" }}>
          <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.04] tracking-tight">
            An in-house data engine,{" "}
            <span className="brand-grad">ready to adapt to your training workflow.</span>
          </h2>
          <p className="mt-3 max-w-[62ch] text-text-muted">
            Tell us the tasks, environments and capture profile you need — our
            in-house teams shape the task mix, annotations and data format to
            match your dataset preferences and VLA training requirements.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => navigate("dataset")}
              className="btn-secondary pointer-events-auto"
            >
              See it on the pilot dataset <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Capture discipline + QA panels */}
        <div className="reveal grid gap-4 lg:grid-cols-5">
          <div className="rounded-2xl border border-border bg-panel/65 p-5 backdrop-blur-md md:p-6 lg:col-span-3">
            <div className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
              <Hand size={11} className="text-accent-bright" /> Care to task execution
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-text">
              Demonstrations engineered for policy learning.
            </h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {TRAINING.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2.5 text-[0.82rem] leading-relaxed text-text-muted"
                >
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-bright" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-to-br from-cyan/15 via-panel/50 to-accent/15 p-5 backdrop-blur-md md:p-6 lg:col-span-2">
            <div className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
              <Cpu size={11} className="text-cyan" /> Capture QA
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-text">
              Sub-1% frame drop target.
            </h3>
            <p className="mt-3 text-[0.84rem] leading-relaxed text-text-muted">
              Fewer than 10 frame drops per 1,000 in the optimized workflow.
              Stable 1080p / 30 fps with a live operator preview; timing,
              exposure, motion blur and depth continuity reviewed every session.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniStat value="<1%" label="Frame drop target" />
              <MiniStat value="ZED Neural" label="Depth mode" />
              <MiniStat value="1080p" label="RGB" />
              <MiniStat value="30 fps" label="Aligned RGB-D" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MosaicRow({
  tasks,
  speed,
}: {
  tasks: TaskEntry[];
  speed: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  // JS-driven marquee: continuously translate the track left, wrapping at half
  // its width (the content is duplicated) for a seamless right-to-left flow.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let raf = 0;
    let last = performance.now();
    let offset = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current) {
        offset += speed * dt;
        const half = el.scrollWidth / 2;
        if (half > 0 && offset >= half) offset -= half;
        el.style.transform = `translate3d(${-offset}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed, tasks.length]);

  if (!tasks.length) return null;
  // Duplicate the set so the wrap-around loop is seamless.
  const items = [...tasks, ...tasks];
  return (
    <div className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex w-max gap-2.5 will-change-transform"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {items.map((t, i) => (
          <MosaicTile key={`${t.slug}-${i}`} entry={t} />
        ))}
      </div>
    </div>
  );
}

function MosaicTile({ entry }: { entry: TaskEntry }) {
  const ref = useRef<HTMLVideoElement>(null);
  const base = import.meta.env.BASE_URL;

  const play = () => {
    const v = ref.current;
    if (!v) return;
    if (v.readyState < 2) v.load();
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };
  const stop = () => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <button
      type="button"
      onClick={() => navigate("dataset")}
      onMouseEnter={play}
      onMouseLeave={stop}
      aria-label="Open the pilot dataset"
      className="group/tile relative aspect-video w-48 flex-shrink-0 overflow-hidden rounded-md border border-border-strong/40 bg-black/80 transition duration-500 hover:border-accent/70 hover:shadow-glow sm:w-56 md:w-64"
    >
      <video
        ref={ref}
        src={`${base}videos/tasks/${entry.slug}.mp4`}
        poster={`${base}videos/posters/tasks/${entry.slug}.jpg`}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover opacity-90 transition duration-700 group-hover/tile:scale-[1.05] group-hover/tile:opacity-100"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80 transition group-hover/tile:opacity-40" />
    </button>
  );
}

function StatChip({
  value,
  label,
  sub,
  accent = false,
}: {
  value: string;
  label: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="flex min-w-[7.5rem] flex-1 flex-col justify-center rounded-2xl border border-border bg-panel/70 px-4 py-3 backdrop-blur-md md:px-5 md:py-4">
      <div className="flex items-baseline gap-2">
        <span className="text-[clamp(1.6rem,2.8vw,2.6rem)] font-semibold leading-none tracking-tight text-text">
          {value}
        </span>
        {sub && (
          <span className={`text-[0.72rem] font-medium ${accent ? "text-cyan" : "text-accent-bright"}`}>
            {sub}
          </span>
        )}
      </div>
      <div className="mt-1.5 text-[0.66rem] uppercase tracking-[0.16em] text-text-muted">
        {label}
      </div>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-bg-elev/70 px-3 py-2">
      <div className="text-[0.95rem] font-semibold tabular-nums text-text">
        {value}
      </div>
      <div className="mt-0.5 text-[0.6rem] uppercase tracking-[0.16em] text-text-muted">
        {label}
      </div>
    </div>
  );
}
