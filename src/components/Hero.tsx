import { ArrowRight, Mail } from "lucide-react";
import { HeroPeel, PEEL_FRAME, PEEL_FRAME_VIDEO } from "./HeroPeel";
import { navigate } from "../hooks/useHashRoute";

/**
 * Peel hero. Two looping demos stacked behind a draggable diagonal seam.
 *
 * Desktop: full-screen with absolute overlays — task names in the top corners,
 * headline bottom-left and CTAs bottom-right on a diagonal.
 * Mobile: a clean vertical stack — headline, a landscape peel band that diffuses
 * into the texture, then the CTAs — so the landscape clips read naturally on a
 * narrow screen instead of being cropped to a strip.
 */
export function Hero() {
  const base = import.meta.env.BASE_URL;
  const videoTop = {
    src: `${base}videos/hero/fold-clothing.mp4`,
    poster: `${base}videos/posters/fold-clothing.jpg`,
  };
  const videoBottom = {
    src: `${base}videos/hero/organize-cords.mp4`,
    poster: `${base}videos/posters/organize-cords.jpg`,
  };

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] w-full flex-col justify-center gap-5 overflow-hidden bg-bg px-5 pb-8 pt-20 md:block md:h-[100svh] md:min-h-0 md:gap-0 md:px-0 md:pb-0 md:pt-0"
    >
      {/* Purple squared texture from the main page, wrapping the inset video on
          every side so the clip can diffuse into it. */}
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-[-8%] -z-10 h-[55%] bg-[radial-gradient(ellipse_60%_50%_at_50%_25%,rgba(124,58,237,0.32),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[50%] bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(124,58,237,0.26),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-[45%] bg-[radial-gradient(ellipse_55%_60%_at_0%_50%,rgba(124,58,237,0.24),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-[45%] bg-[radial-gradient(ellipse_55%_60%_at_100%_50%,rgba(124,58,237,0.22),transparent_70%)]"
        aria-hidden
      />

      {/* Mobile-only headline (above the band) */}
      <div className="reveal relative z-20 w-full min-w-0 md:hidden">
        <h1 className="text-[clamp(1.9rem,7.5vw,2.7rem)] font-semibold leading-[1.02] tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)]">
          Egocentric data for{" "}
          <span className="brand-grad">humanoid manipulation</span> policies.
        </h1>
        <p className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-white/80">
          Production-grade RGB-D capture, robotics-native MCAP streams and
          supervised annotation on real human demonstrations.
        </p>
      </div>

      {/* Peel surface — landscape band in flow on mobile, absolute frame on desktop */}
      <div className="relative z-10 mx-auto aspect-[16/10] w-full min-w-0 max-w-[34rem] md:absolute md:z-auto md:mx-0 md:aspect-auto md:w-auto md:max-w-none md:left-[17.75%] md:right-[17.75%] md:top-[19.5%] md:bottom-[17%]">
        <HeroPeel top={videoTop} bottom={videoBottom} />
      </div>

      {/* Mobile-only CTAs (below the band) */}
      <div className="reveal relative z-20 flex w-full min-w-0 flex-col gap-3 md:hidden">
        <button
          type="button"
          onClick={() => navigate("dataset")}
          className="w-full justify-center !py-3.5 !text-[0.92rem] btn-primary"
        >
          Explore full dataset <ArrowRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => navigate("home", "contact")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-black/40 py-3.5 text-[0.92rem] font-medium text-white backdrop-blur transition active:scale-[0.98]"
        >
          <Mail size={15} /> Talk to the team
        </button>
      </div>

      {/* Task names — aligned to the video, desktop only */}
      <div
        className={`pointer-events-none absolute ${PEEL_FRAME_VIDEO} reveal z-20 hidden md:block`}
        style={{ transitionDelay: "260ms" }}
      >
        <div className="absolute left-0 top-0 p-6 md:p-12">
          <TaskTag label="Fold Clothing" tagline="Soft-object manipulation" dot="bg-accent-bright" />
        </div>
        <div className="absolute right-0 top-0 p-6 md:p-12">
          <TaskTag label="Organize Cords" tagline="Fine-motor sorting" dot="bg-cyan" align="right" />
        </div>
      </div>

      {/* Headline (bottom-left) + CTAs (bottom-right) — desktop only */}
      <div className={`pointer-events-none absolute ${PEEL_FRAME} z-20 hidden md:block`}>
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* Headline */}
            <div className="reveal relative isolate max-w-[112ch] md:max-w-[62%]">
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-14 -left-14 -right-24 -top-32 -z-10 bg-[radial-gradient(78%_82%_at_16%_88%,rgba(0,0,0,0.94),rgba(0,0,0,0.55)_46%,rgba(0,0,0,0.2)_66%,transparent_82%)] blur-xl"
              />
              <h1 className="text-[clamp(2rem,5.4vw,4.8rem)] font-semibold leading-[0.98] tracking-tight text-white drop-shadow-[0_2px_22px_rgba(0,0,0,0.75)]">
                Egocentric data for{" "}
                <span className="brand-grad">humanoid manipulation</span> policies.
              </h1>
              <p className="mt-4 max-w-[58ch] text-[clamp(0.92rem,1.4vw,1.12rem)] leading-relaxed text-white/85 drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)]">
                Production-grade RGB-D capture, robotics-native MCAP streams and
                supervised annotation on real human demonstrations.
              </p>
            </div>

            {/* CTAs */}
            <div
              className="reveal pointer-events-auto flex w-full flex-shrink-0 items-center gap-3 md:w-auto md:justify-end"
              style={{ transitionDelay: "140ms" }}
            >
              <button
                type="button"
                onClick={() => navigate("dataset")}
                className="flex-1 justify-center !px-5 !py-3 !text-[0.9rem] btn-primary md:flex-none md:!px-6"
              >
                Explore full dataset <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => navigate("home", "contact")}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/30 bg-black/40 px-5 py-3 text-[0.9rem] font-medium text-white backdrop-blur transition hover:border-white/70 hover:bg-black/55 md:flex-none md:px-6"
              >
                <Mail size={15} /> Talk to the team
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TaskTag({
  label,
  tagline,
  dot,
  align = "left",
}: {
  label: string;
  tagline: string;
  dot: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <div
        className={`flex items-center gap-2 ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        <span className={`h-2 w-2 flex-shrink-0 rounded-full ${dot}`} />
        <span className="text-[0.95rem] font-semibold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] md:text-[1.1rem]">
          {label}
        </span>
      </div>
      <div className="mt-1 text-[0.62rem] uppercase tracking-[0.16em] text-white/75 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] md:text-[0.66rem]">
        {tagline}
      </div>
    </div>
  );
}
