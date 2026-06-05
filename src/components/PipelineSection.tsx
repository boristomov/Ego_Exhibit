import { Camera, Boxes, Eye, Tag, Send } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: Camera,
    title: "Record",
    sub: "ZED RGB-D + live preview",
    body: "1080p / 30 fps stereo capture with operator preview running in parallel. Operators trained for deliberate, slow motion that humanoid policies can actually learn from.",
  },
  {
    n: "02",
    icon: Boxes,
    title: "Process",
    sub: "MCAP + MP4 + metadata",
    body: "Robotics-native MCAP container with synchronized RGB, depth, IMU, transforms, hand tracking and optional point cloud. H.264 review video alongside.",
  },
  {
    n: "03",
    icon: Eye,
    title: "Inspect",
    sub: "Foxglove + video review",
    body: "Every session goes through a frame-stability, exposure and depth-continuity check before annotation begins. Issues are caught at the session level, not at delivery.",
  },
  {
    n: "04",
    icon: Tag,
    title: "Annotate",
    sub: "Hand / object / action labels",
    body: "In-house annotators with a 1:5 QA-to-annotator ratio. Hand boxes, object boxes, IDs and action channels — with a SAM2-style AI-assisted roadmap.",
  },
  {
    n: "05",
    icon: Send,
    title: "Deliver",
    sub: "S3 folder contract",
    body: "Per-session MP4 + MCAP + metadata + annotation ZIP, in a stable, inspectable folder layout. Ownership and consent finalized in the MSA.",
  },
];

export function PipelineSection() {
  return (
    <section id="pipeline" className="section-screen">
      <div className="container-wide flex min-h-0 flex-1 flex-col justify-center gap-5 py-4 md:gap-6 md:py-6">
        <div className="reveal max-w-[60ch]">
          <h2 className="text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-tight tracking-tight">
            Session <span className="brand-grad">lifecycle.</span>
          </h2>
          <p className="mt-2 text-[0.9rem] text-text-muted">
            Five steps on every capture — record through delivery.
          </p>
        </div>

        <div className="mt-6 md:mt-8">
          {/* Mobile: vertical list. Desktop: horizontal rail with connecting line. */}
          <div className="relative grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-3">
            <div
              className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border-strong to-transparent md:block"
              aria-hidden
            />
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className="reveal relative flex flex-col"
                style={{ transitionDelay: `${80 + i * 70}ms` }}
              >
                <div className="relative z-10 flex items-center gap-3 md:flex-col md:items-start md:gap-2">
                  <div className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-xl border border-accent/40 bg-bg-elev text-accent-bright shadow-glow">
                    <s.icon size={20} />
                  </div>
                  <div>
                    <div className="text-[0.6rem] font-mono uppercase tracking-[0.18em] text-text-muted">
                      Step {s.n}
                    </div>
                    <div className="text-[1.05rem] font-semibold text-text">
                      {s.title}
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-xl border border-border bg-panel/50 p-3 backdrop-blur md:mt-3 md:p-3.5">
                  <div className="text-[0.7rem] font-mono uppercase tracking-wider text-accent-bright">
                    {s.sub}
                  </div>
                  <p className="mt-2 text-[0.82rem] leading-relaxed text-text-muted">
                    {s.body}
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
