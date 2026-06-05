import { Flag, Rocket, TrendingUp, Sparkles } from "lucide-react";

const PHASES = [
  {
    icon: Flag,
    phase: "Pilot",
    headline: "S3 review batch",
    detail: "Acceptance criteria sign-off on the live example dataset.",
    metric: "10+ h",
    metricLabel: "captured",
  },
  {
    icon: Rocket,
    phase: "Phase 1",
    headline: "200 hrs / month",
    detail: "Delivered within 30 days of sign-off using the same footprint.",
    metric: "≤ 30 d",
    metricLabel: "to ramp",
    emphasized: true,
  },
  {
    icon: TrendingUp,
    phase: "Phase 2",
    headline: "1,000 hrs / month",
    detail: "Multi-site steady state with locked QA cadence.",
    metric: "1,000",
    metricLabel: "hrs / mo",
  },
  {
    icon: Sparkles,
    phase: "Phase 3",
    headline: "2,000 hrs / month",
    detail: "AI-assisted annotation (SAM2-style) compounding throughput.",
    metric: "2,000",
    metricLabel: "hrs / mo",
  },
];

export function Roadmap() {
  return (
    <section
      id="roadmap"
      className="relative flex min-h-[100svh] flex-col justify-center py-24 md:h-[100svh] md:py-0"
    >
      <div className="container-wide">
        <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[60ch]">
            <span className="label-eyebrow">Scale roadmap</span>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-tight tracking-tight">
              From pilot to{" "}
              <span className="brand-grad">2,000&nbsp;hrs / month.</span>
            </h2>
            <p className="mt-3 text-text-muted">
              The operational footprint that produced the pilot — trained
              annotators, a 1:5 QA ratio and five active sites — is what ramps
              capacity into the thousands of hours.
            </p>
          </div>
        </div>

        <div className="reveal mt-10">
          {/* Mobile: vertical timeline. Desktop: horizontal rail. */}
          <div className="relative grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-4">
            <div
              className="pointer-events-none absolute left-[1.05rem] top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-border-strong to-transparent md:left-0 md:right-0 md:top-7 md:bottom-auto md:h-px md:w-auto md:bg-gradient-to-r"
              aria-hidden
            />
            {PHASES.map((p) => (
              <div key={p.phase} className="group relative flex gap-4 md:flex-col md:gap-0">
                <div
                  className={`relative z-10 grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl border transition duration-300 group-hover:scale-105 group-hover:border-accent-bright group-hover:text-accent-bright group-hover:shadow-glow md:h-14 md:w-14 ${
                    p.emphasized
                      ? "border-accent/60 bg-accent/15 text-accent-bright shadow-glow"
                      : "border-border-strong bg-bg-elev text-text-muted"
                  }`}
                >
                  <p.icon size={18} className="transition-transform duration-500 group-hover:-rotate-6" />
                </div>
                <div
                  className={`flex-1 rounded-2xl border p-4 transition duration-300 group-hover:-translate-y-1 group-hover:border-accent/50 group-hover:shadow-soft md:mt-4 ${
                    p.emphasized
                      ? "border-accent/50 bg-accent/10"
                      : "border-border bg-panel/55"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
                      {p.phase}
                    </div>
                    <div className="text-right">
                      <div className="text-[0.95rem] font-semibold leading-none tabular-nums text-text">
                        {p.metric}
                      </div>
                      <div className="mt-0.5 text-[0.52rem] uppercase tracking-[0.16em] text-text-dim">
                        {p.metricLabel}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-[1.02rem] font-semibold leading-snug text-text">
                    {p.headline}
                  </div>
                  <p className="mt-1.5 text-[0.8rem] leading-relaxed text-text-muted">
                    {p.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
