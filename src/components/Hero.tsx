import { ArrowRight, Activity } from "lucide-react";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden pt-14 md:pt-16"
    >
      {/* Animated background gradient + grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-[-12%] -z-10 h-[60%] bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(124,58,237,0.35),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[60%] bg-[radial-gradient(ellipse_70%_50%_at_70%_60%,rgba(34,211,238,0.18),transparent_70%)]"
        aria-hidden
      />

      <div className="container-wide flex flex-1 flex-col">
        {/* Text block */}
        <div className="flex flex-1 flex-col justify-center pt-10 md:pt-14">
          <div className="reveal">
            <span className="label-eyebrow">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400" />
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Pilot batch live · v1.0
            </span>
          </div>

          <h1 className="reveal mt-4 max-w-[18ch] text-[clamp(2.4rem,6vw,5.4rem)] font-semibold leading-[0.98] tracking-tight md:max-w-none">
            Egocentric data for{" "}
            <span className="brand-grad">humanoid manipulation</span> policies.
          </h1>

          <p className="reveal mt-5 max-w-[60ch] text-[clamp(0.95rem,1.4vw,1.18rem)] leading-relaxed text-text-muted">
            Production-grade RGB-D capture, robotics-native MCAP streams,
            millisecond-level timing, and supervised annotation —
            engineered to train VLA models on real human demonstrations.
            Five active sites already running the workflow. Designed to scale
            from pilot to thousands of hours per month.
          </p>

          <div className="reveal mt-7 flex flex-wrap items-center gap-3">
            <a href="#tasks" className="btn-primary">
              Explore the dataset <ArrowRight size={15} />
            </a>
            <a
              href="https://boristomov.github.io/Ego_Dashboard/"
              target="_blank"
              rel="noopener"
              className="btn-secondary"
            >
              <Activity size={14} /> Live operations dashboard
            </a>
          </div>

          <div className="reveal mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[0.7rem] uppercase tracking-[0.18em] text-text-dim">
            <span>1080p / 30 fps RGB-D</span>
            <span className="hidden h-1 w-1 rounded-full bg-text-dim sm:block" />
            <span>ZED Neural depth</span>
            <span className="hidden h-1 w-1 rounded-full bg-text-dim sm:block" />
            <span>MCAP container</span>
            <span className="hidden h-1 w-1 rounded-full bg-text-dim sm:block" />
            <span>Glove-optional</span>
          </div>
        </div>

        {/* Video band — two synced annotation demos */}
        <div className="reveal mb-8 mt-10 grid grid-cols-1 gap-4 md:mb-10 md:mt-12 md:grid-cols-2 md:gap-5">
          <HeroVideo
            src="/videos/hero/fold-clothing.mp4"
            poster="/videos/posters/fold-clothing.jpg"
            label="Fold Clothing"
            tagline="Soft-object manipulation · CVAT preannotations"
            accent="violet"
          />
          <HeroVideo
            src="/videos/hero/organize-cords.mp4"
            poster="/videos/posters/organize-cords.jpg"
            label="Organize Cords"
            tagline="Fine-motor sorting · hand & object tracking"
            accent="cyan"
          />
        </div>
      </div>

      {/* Bottom hairline */}
      <div className="container-wide pb-4">
        <div className="hairline" />
      </div>
    </section>
  );
}

function HeroVideo({
  src,
  poster,
  label,
  tagline,
  accent,
}: {
  src: string;
  poster: string;
  label: string;
  tagline: string;
  accent: "violet" | "cyan";
}) {
  const ring =
    accent === "violet"
      ? "ring-1 ring-accent/30 shadow-[0_0_80px_-30px_rgba(124,58,237,0.7)]"
      : "ring-1 ring-cyan/30 shadow-[0_0_80px_-30px_rgba(34,211,238,0.7)]";
  const dot = accent === "violet" ? "bg-accent-bright" : "bg-cyan";
  return (
    <div
      className={`group relative aspect-video w-full overflow-hidden rounded-xl border border-border-strong/70 bg-black ${ring}`}
    >
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 md:p-4">
        <div className="flex items-center gap-2.5">
          <span className={`relative inline-flex h-2 w-2`}>
            <span className={`absolute inset-0 animate-ping rounded-full ${dot} opacity-70`} />
            <span className={`relative inline-block h-2 w-2 rounded-full ${dot}`} />
          </span>
          <div>
            <div className="text-[0.85rem] font-semibold leading-tight text-white">
              {label}
            </div>
            <div className="text-[0.66rem] uppercase tracking-wider text-white/70">
              {tagline}
            </div>
          </div>
        </div>
        <span className="rounded-md border border-white/20 bg-black/40 px-2 py-0.5 text-[0.6rem] font-mono uppercase tracking-wider text-white/80 backdrop-blur">
          live
        </span>
      </div>
    </div>
  );
}
