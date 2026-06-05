import { Boxes, Camera, Hand, FileJson, Activity } from "lucide-react";

/** Capture streams written into every session MCAP. */
const CAPTURE_STREAMS = [
  {
    label: "RGB video",
    body: "1080p / 30 fps H.264 — primary egocentric view for review and training.",
  },
  {
    label: "Depth map",
    body: "Derived from stereo at capture (ZED left + right); the right RGB channel is dropped after depth is computed. Neural depth with configurable confidence presets — we can match your quality vs. density preferences.",
  },
  {
    label: "IMU",
    body: "Inertial samples time-aligned to the RGB frame clock.",
  },
  {
    label: "Point cloud (optional)",
    body: "Dense 3D samples for depth validation and 3D hand pose — stride = 4.",
  },
];

const HAND_TRACKING = [
  "2D hand bounding boxes every frame (segmentation masks optional).",
  "3D hand pose from single-view computer vision, validated against depth — MANO mesh vertices and landmarks.",
];

const SESSION_FRAMING = [
  "TF tree for camera ↔ world frames",
  "Embedded metadata (task, session ID, depth mode, timestamps)",
];

const DELIVERABLES = [
  {
    name: "<sessionId>.mcap",
    desc: "Primary robotics container — all streams above, synchronized.",
  },
  {
    name: "<sessionId>.mp4",
    desc: "H.264 1080p review video for quick inspection and annotation.",
  },
  {
    name: "metadata.json",
    desc: "Recording config, task name, session ID, depth settings, run notes.",
  },
  {
    name: "<sessionId>.zip",
    desc: "Annotation export: hand / object boxes, IDs, action channels; optional masks.",
  },
];

/**
 * What each delivered session contains — human-readable MCAP highlights plus
 * the per-session file contract. Fits one full viewport below the inventory.
 */
export function DatasetPackageSection() {
  return (
    <section id="package" className="section-screen">
      <div className="container-wide flex min-h-0 flex-1 flex-col justify-center gap-5 py-4 md:gap-6 md:py-6">
        <div className="reveal max-w-[58ch]">
          <h2 className="text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-tight tracking-tight">
            What each <span className="brand-grad">recording ships with.</span>
          </h2>
          <p className="mt-2 text-[0.9rem] text-text-muted">
            Every session is a small, inspectable bundle — robotics-native MCAP
            plus review assets and annotations.
          </p>
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-5">
          {/* MCAP contents */}
          <div
            className="reveal rounded-2xl border border-border bg-panel/55 p-3 backdrop-blur-md md:p-4"
            style={{ transitionDelay: "80ms" }}
          >
            <div className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
              <Boxes size={12} className="text-cyan" /> Inside the MCAP
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-lg border border-cyan/30 bg-cyan/5 text-cyan">
                    <Camera size={13} />
                  </div>
                  <span className="text-[0.88rem] font-semibold text-text">
                    Capture streams
                  </span>
                </div>
                <ul className="mt-2 space-y-2 pl-9">
                  {CAPTURE_STREAMS.map((s) => (
                    <li key={s.label}>
                      <span className="text-[0.78rem] font-medium text-text">
                        {s.label}
                      </span>
                      <p className="mt-0.5 text-[0.76rem] leading-snug text-text-muted">
                        {s.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-lg border border-accent/40 bg-accent/10 text-accent-bright">
                    <Hand size={13} />
                  </div>
                  <span className="text-[0.88rem] font-semibold text-text">
                    Vision-based hand tracking
                  </span>
                </div>
                <ul className="mt-2 space-y-1.5 pl-9">
                  {HAND_TRACKING.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2 text-[0.76rem] leading-snug text-text-muted"
                    >
                      <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-text-dim" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-lg border border-amber/30 bg-amber/5 text-amber">
                    <FileJson size={13} />
                  </div>
                  <span className="text-[0.88rem] font-semibold text-text">
                    Session framing
                  </span>
                </div>
                <ul className="mt-2 space-y-1 pl-9">
                  {SESSION_FRAMING.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2 text-[0.76rem] leading-snug text-text-muted"
                    >
                      <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-text-dim" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-3 text-[0.68rem] leading-relaxed text-text-dim">
              Message schemas can be adapted during technical review. Glove
              streams plug in as manipulation ground truth when available.
            </p>
          </div>

          {/* Per-session files */}
          <div
            className="reveal rounded-2xl border border-border bg-panel/55 p-3 backdrop-blur-md md:p-4"
            style={{ transitionDelay: "160ms" }}
          >
            <div className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
              <Activity size={12} className="text-accent-bright" /> Per-session
              deliverables
            </div>
            <div className="mt-3 grid gap-2">
              {DELIVERABLES.map((f) => (
                <File key={f.name} name={f.name} desc={f.desc} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function File({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="grid grid-cols-[max-content_1fr] items-start gap-2.5 rounded-lg border border-border/70 bg-bg-elev/60 px-2.5 py-2">
      <code className="font-mono text-[0.7rem] text-accent-bright">{name}</code>
      <span className="text-[0.76rem] leading-snug text-text-muted">{desc}</span>
    </div>
  );
}
