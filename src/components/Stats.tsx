import { Database, Clock, Layers, Camera, Activity, Globe, type LucideIcon } from "lucide-react";
import type { TasksManifest } from "../lib/tasks";
import { formatHours } from "../lib/tasks";

const FIXED_STATS = [
  {
    icon: Camera,
    label: "RGB-D capture",
    value: "1080p / 30",
    unit: "fps",
    detail: "ZED 2i · Neural depth · H.264 review",
  },
  {
    icon: Activity,
    label: "Frame drop target",
    value: "<1",
    unit: "%",
    detail: "<10 drops / 1,000 frames in optimized workflow",
  },
  {
    icon: Globe,
    label: "Office network",
    value: "20+",
    unit: "sites",
    detail: "5 already running egocentric capture",
  },
];

export function Stats({ manifest }: { manifest: TasksManifest | null }) {
  const totalSessions = manifest?.totalSessions ?? 327;
  const totalTasks = manifest?.totalTasks ?? 17;
  const totalHours = manifest?.totalDurationSec
    ? formatHours(manifest.totalDurationSec)
    : "5+ h";

  return (
    <section className="relative py-20 md:py-28" id="dataset">
      <div className="container-wide">
        <div className="reveal grid gap-2">
          <span className="label-eyebrow w-fit">By the numbers</span>
          <h2 className="mt-3 max-w-[22ch] text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-tight tracking-tight">
            A pilot batch with{" "}
            <span className="brand-grad">production-grade specs.</span>
          </h2>
          <p className="mt-3 max-w-[60ch] text-text-muted">
            Every session is captured, encoded, and reviewed under the same
            standards we'll use in steady-state production. Numbers below are
            live from the operations dashboard.
          </p>
        </div>

        {/* Live row from manifest */}
        <div className="reveal mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
          <BigStat icon={Layers} value={totalSessions.toLocaleString()} label="Episodes captured" />
          <BigStat icon={Database} value={totalTasks.toString()} label="Task folders" />
          <BigStat icon={Clock} value={totalHours} label="Pilot duration" />
        </div>

        {/* Capture spec row */}
        <div className="reveal mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FIXED_STATS.map((s) => (
            <div
              key={s.label}
              className="panel-glass flex items-start gap-3 px-5 py-4"
            >
              <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-lg border border-accent/40 bg-accent/10 text-accent-bright">
                <s.icon size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
                  {s.label}
                </div>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-xl font-semibold tabular-nums text-text">
                    {s.value}
                  </span>
                  <span className="text-[0.72rem] uppercase tracking-wider text-text-muted">
                    {s.unit}
                  </span>
                </div>
                <div className="mt-1 text-[0.72rem] leading-snug text-text-muted">
                  {s.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scale band */}
        <div className="reveal mt-12 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent/15 via-panel/40 to-cyan/10 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-3 md:gap-10">
            <div className="md:col-span-1">
              <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
                Scale path
              </div>
              <div className="mt-3 text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
                From pilot to{" "}
                <span className="brand-grad">2,000&nbsp;hrs / month.</span>
              </div>
              <p className="mt-3 max-w-[42ch] text-[0.88rem] text-text-muted">
                The same operational footprint that produced this pilot — 50+
                trained annotators, 1:5 QA ratio, five active sites — is what
                ramps capacity into the thousands of hours.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 md:col-span-2 md:grid-cols-3">
              <PhaseCard phase="Pilot" headline="S3 review batch" sub="Acceptance criteria sign-off" />
              <PhaseCard phase="Phase 1" headline="200 hours" sub="Within 30 days of sign-off" emphasized />
              <PhaseCard phase="Phase 2 → 3" headline="1,000 → 2,000 hrs/mo" sub="Multi-site steady state" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BigStat({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-panel/60 p-5 md:p-6">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
      <Icon size={16} className="text-accent-bright" />
      <div className="mt-3 text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-none tracking-tight text-text">
        {value}
      </div>
      <div className="mt-2 text-[0.72rem] uppercase tracking-[0.18em] text-text-muted">
        {label}
      </div>
    </div>
  );
}

function PhaseCard({
  phase,
  headline,
  sub,
  emphasized,
}: {
  phase: string;
  headline: string;
  sub: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-4 ${
        emphasized
          ? "border-accent/50 bg-accent/15 shadow-glow"
          : "border-border bg-panel/60"
      }`}
    >
      <div className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
        {phase}
      </div>
      <div className="mt-1.5 text-[0.95rem] font-semibold leading-snug text-text">
        {headline}
      </div>
      <div className="mt-1 text-[0.72rem] text-text-muted">{sub}</div>
    </div>
  );
}
