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
    <section id="pipeline" className="relative py-20 md:py-28">
      <div className="container-wide">
        <div className="reveal max-w-[60ch]">
          <span className="label-eyebrow">Session lifecycle</span>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-tight tracking-tight">
            From RGB-D capture to{" "}
            <span className="brand-grad">delivered package.</span>
          </h2>
          <p className="mt-3 text-text-muted">
            Five tightly coupled steps run on every session — the same pipeline
            from pilot to 2,000 hrs / month.
          </p>
        </div>

        <div className="reveal mt-10">
          {/* Mobile: vertical list. Desktop: horizontal rail with connecting line. */}
          <div className="relative grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-3">
            <div
              className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border-strong to-transparent md:block"
              aria-hidden
            />
            {STEPS.map((s) => (
              <div key={s.n} className="relative flex flex-col">
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
                <div className="mt-3 rounded-xl border border-border bg-panel/50 p-4 backdrop-blur md:mt-4">
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

        {/* Per-session contract */}
        <div className="reveal mt-14 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-panel/50 p-6">
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
              Per-session deliverables
            </div>
            <div className="mt-4 grid gap-3">
              <File name="<sessionId>.mcap" desc="Primary robotics container: synchronized RGB, depth, calibration, IMU, transforms, hand tracking and optional point cloud." />
              <File name="<sessionId>.mp4" desc="H.264-encoded 1080p / 30 fps review video for quick inspection and annotation workflows." />
              <File name="metadata.json" desc="Task name, session ID, recording configuration, timestamps, depth settings and run notes." />
              <File name="<sessionId>.zip" desc="Annotation package: hand and object boxes, IDs, action channels and mask placeholders." />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-panel/50 p-6">
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
              MCAP topic map
            </div>
            <div className="mt-4 grid gap-1.5 font-mono text-[0.72rem]">
              <Topic name="/zed/left/image_compressed" type="CompressedImage" tone="cyan" />
              <Topic name="/zed/depth/image_raw" type="Image" tone="cyan" />
              <Topic name="/zed/imu/data" type="Imu" tone="cyan" />
              <Topic name="/zed/left/camera_info" type="CameraInfo" tone="cyan" />
              <Topic name="/zed/points" type="PointCloud" tone="cyan" optional />
              <div className="h-2" />
              <Topic name="/hand_tracking/hand_boxes_2d" type="String" tone="violet" />
              <Topic name="/hand_tracking/joints" type="String" tone="violet" />
              <Topic name="/hand_tracking/landmarks" type="PointCloud" tone="violet" />
              <Topic name="/hand_tracking/mano_vertices" type="String" tone="violet" />
              <Topic name="/hand_tracking/meshes" type="PointCloud" tone="violet" />
              <div className="h-2" />
              <Topic name="/tf" type="TFMessage" tone="amber" />
              <Topic name="/metadata" type="String" tone="amber" />
            </div>
            <div className="mt-4 text-[0.7rem] text-text-muted">
              Schemas can be adapted to your preferred message types during the
              technical review. Glove streams plug in as preferred manipulation
              ground truth when available.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function File({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="grid grid-cols-[max-content_1fr] items-start gap-3 rounded-lg border border-border/70 bg-bg-elev/60 px-3 py-2.5">
      <code className="font-mono text-[0.72rem] text-accent-bright">{name}</code>
      <span className="text-[0.78rem] leading-snug text-text-muted">{desc}</span>
    </div>
  );
}

function Topic({
  name,
  type,
  tone,
  optional,
}: {
  name: string;
  type: string;
  tone: "cyan" | "violet" | "amber";
  optional?: boolean;
}) {
  const dot =
    tone === "cyan" ? "bg-cyan" : tone === "violet" ? "bg-accent-bright" : "bg-amber";
  return (
    <div className="flex items-center gap-2 rounded-md border border-border/40 bg-bg-elev/60 px-2 py-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className="flex-1 truncate text-text-muted">{name}</span>
      <span className="rounded bg-panel px-1.5 py-[1px] text-[0.62rem] uppercase tracking-wider text-text-dim">
        {type}
      </span>
      {optional && (
        <span className="rounded border border-border bg-bg px-1.5 py-[1px] text-[0.55rem] uppercase tracking-wider text-text-dim">
          opt
        </span>
      )}
    </div>
  );
}
