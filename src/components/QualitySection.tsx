import { Users, ShieldCheck, RefreshCcw, Building2, Cpu, Hand } from "lucide-react";

const PILLARS = [
  {
    icon: Users,
    title: "In-house operators & annotators",
    body: "No outsourcing. Site leads supervise capture, lead reviewers manage label quality. The team running this pilot is the team running Phase 1.",
    stat: "50+",
    statLabel: "Trained annotators",
  },
  {
    icon: ShieldCheck,
    title: "1:5 QA-to-annotator ratio",
    body: "One dedicated manager and QA reviewer for every five annotators. Supervision is locked in, not aspirational.",
    stat: "1 : 5",
    statLabel: "QA ratio",
  },
  {
    icon: Building2,
    title: "Five active sites in parallel",
    body: "The egocentric workflow already runs across five offices simultaneously, proving the model travels across locations without quality loss.",
    stat: "5",
    statLabel: "Active sites",
  },
  {
    icon: RefreshCcw,
    title: "Weekly feedback loop",
    body: "Site leads, annotation leads and technical QA share feedback each week. Capture issues are caught early and label rules updated before scaling volume.",
    stat: "weekly",
    statLabel: "Review cadence",
  },
];

const TRAINING = [
  "Deliberate, slow hand motion sustained throughout each demonstration.",
  "Avoidance of complex finger sequences that complicate policy learning.",
  "Smooth approach, grasp and release motions without unnecessary mid-task adjustments.",
  "Consistent posture and limb positioning across operators.",
  "Task checklists and reference videos standardize execution across sites.",
  "Objects kept visible to the stereo rig during manipulation.",
];

export function QualitySection() {
  return (
    <section id="quality" className="relative py-20 md:py-28">
      <div className="container-wide">
        <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[60ch]">
            <span className="label-eyebrow">Operations & quality</span>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-tight tracking-tight">
              The footprint that{" "}
              <span className="brand-grad">makes the scale claim hold.</span>
            </h2>
            <p className="mt-3 text-text-muted">
              We've already run this workflow at scale across multiple sites.
              The same operational structure delivers Phase 1 within 30 days of
              sign-off, and ramps to 2,000 hours per month from there.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="reveal mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-panel/60 p-5"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/15 blur-3xl transition group-hover:bg-accent/25" />
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-accent/40 bg-accent/10 text-accent-bright">
                  <p.icon size={16} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold tabular-nums leading-none text-text">
                    {p.stat}
                  </div>
                  <div className="mt-1 text-[0.58rem] uppercase tracking-[0.18em] text-text-muted">
                    {p.statLabel}
                  </div>
                </div>
              </div>
              <div className="text-[0.95rem] font-semibold leading-snug text-text">
                {p.title}
              </div>
              <p className="text-[0.8rem] leading-relaxed text-text-muted">
                {p.body}
              </p>
            </div>
          ))}
        </div>

        {/* Training + capture QA */}
        <div className="reveal mt-10 grid gap-4 lg:grid-cols-5">
          <div className="rounded-2xl border border-border bg-panel/50 p-6 lg:col-span-3">
            <div className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
              <Hand size={11} className="text-accent-bright" /> Motion discipline
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-text">
              Demonstrations engineered for policy learning.
            </h3>
            <ul className="mt-4 grid gap-2">
              {TRAINING.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-[0.85rem] leading-relaxed text-text-muted"
                >
                  <span className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-bright" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-to-br from-cyan/15 via-panel/40 to-accent/15 p-6 lg:col-span-2">
            <div className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
              <Cpu size={11} className="text-cyan" /> Capture QA
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-text">
              Sub-1% frame drop target.
            </h3>
            <p className="mt-3 text-[0.85rem] leading-relaxed text-text-muted">
              Targeting fewer than 10 frame drops per 1,000 frames in the
              optimized workflow. Stable 1080p / 30 fps with a live operator
              preview running in parallel. Frame timing, exposure, motion blur
              and depth continuity are reviewed on every session.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
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
