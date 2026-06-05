import { Eye, TrendingUp, Hand, Gauge } from "lucide-react";

const POINTS = [
  {
    icon: TrendingUp,
    title: "Pretraining that scales",
    body: "Large-scale egocentric pretraining follows a log-linear data-scaling law — more human hours predictably lower validation loss and lift real-robot success, far past what teleoperation can reach.",
  },
  {
    icon: Hand,
    title: "Reusable motor prior",
    body: "Hand and wrist motion learned from human video forms an embodiment-agnostic prior that transfers across robots and generalizes to new scenes and long-horizon tasks.",
  },
  {
    icon: Eye,
    title: "Matched viewpoint",
    body: "First-person capture mirrors a head- or wrist-mounted robot camera, so representations transfer with a minimal visual distribution gap.",
  },
];

/**
 * Plain explainer: why egocentric human data helps VLA training. The headline
 * sits on the right (asymmetry vs the other top-left headlines) and the chart on
 * the left, with an explicit "conceptual" label and a real literature source.
 */
export function Benefits() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden py-24 md:h-[100svh] md:py-0">
      {/* Purple squared texture at the top, echoing the hero, fading downward. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[55%] grid-bg [mask-image:linear-gradient(to_bottom,black,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-[-8%] -z-10 h-[45%] bg-[radial-gradient(ellipse_60%_50%_at_50%_18%,rgba(124,58,237,0.22),transparent_70%)]"
        aria-hidden
      />

      <div className="container-wide grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Visualization (left) */}
        <div className="reveal order-2 lg:order-1">
          <GrowthChart />
        </div>

        {/* Copy (sits right for asymmetry; text reads left-aligned) */}
        <div className="reveal order-1 flex flex-col text-left lg:order-2">
          <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.05] tracking-tight">
            Why <span className="brand-grad">egocentric human data</span>
          </h2>
          <p className="mt-4 max-w-[54ch] text-text-muted">
            Egocentric human video is the most scalable supervision source for
            manipulation. Pretraining vision-language-action models on
            large-scale first-person data builds a reusable motor prior; a small
            amount of aligned robot data then adapts it to your hardware —
            lifting generalization and cutting the robot demonstrations you need.
          </p>

          <div className="mt-8 grid w-full gap-5">
            {POINTS.map((p) => (
              <div key={p.title} className="flex gap-4">
                <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg border border-accent/40 bg-accent/10 text-accent-bright">
                  <p.icon size={16} />
                </div>
                <div>
                  <div className="text-[0.98rem] font-semibold text-text">
                    {p.title}
                  </div>
                  <p className="mt-1 max-w-[46ch] text-[0.88rem] leading-relaxed text-text-muted">
                    {p.body}
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

function GrowthChart() {
  // Conceptual saturating curve — NOT measured data. Used only to illustrate the
  // qualitative "more egocentric data → better policy" relationship.
  const W = 520;
  const H = 360;
  const pad = { l: 48, r: 24, t: 28, b: 44 };
  const x0 = pad.l;
  const x1 = W - pad.r;
  const y0 = H - pad.b;
  const y1 = pad.t;

  const pts = [0, 0.12, 0.26, 0.42, 0.58, 0.72, 0.83, 0.9, 0.94];
  const n = pts.length - 1;
  const toX = (i: number) => x0 + (i / n) * (x1 - x0);
  const toY = (v: number) => y0 - v * (y0 - y1);

  const line = pts.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x1},${y0} L${x0},${y0} Z`;
  const gridY = [0.25, 0.5, 0.75, 1];

  return (
    <div className="rounded-2xl border border-border bg-panel/50 p-5 backdrop-blur-md md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
          <Gauge size={11} className="text-cyan" /> Success scales with human-data hours
        </div>
        <span className="rounded-full border border-border/70 px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.16em] text-text-dim">
          conceptual
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Conceptual curve: policy quality rising with hours of egocentric data">
        <defs>
          <linearGradient id="benefit-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="benefit-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>

        {gridY.map((g) => (
          <line key={g} x1={x0} x2={x1} y1={toY(g)} y2={toY(g)} stroke="#23272f" strokeWidth={1} />
        ))}
        <line x1={x0} y1={y0} x2={x1} y2={y0} stroke="#363c46" strokeWidth={1.5} />
        <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="#363c46" strokeWidth={1.5} />

        <path d={area} fill="url(#benefit-area)" />
        <path d={line} fill="none" stroke="url(#benefit-line)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

        <circle cx={toX(n)} cy={toY(pts[n])} r={5} fill="#22d3ee" />
        <circle cx={toX(n)} cy={toY(pts[n])} r={11} fill="#22d3ee" opacity={0.18} />

        <text x={(x0 + x1) / 2} y={H - 10} textAnchor="middle" fill="#646b78" fontSize="12">
          Hours of egocentric data →
        </text>
        <text
          x={16}
          y={(y0 + y1) / 2}
          textAnchor="middle"
          fill="#646b78"
          fontSize="12"
          transform={`rotate(-90 16 ${(y0 + y1) / 2})`}
        >
          Downstream policy success →
        </text>
      </svg>

      {/* Honest source note */}
      <p className="mt-3 text-[0.68rem] leading-relaxed text-text-dim">
        Conceptual illustration, not measured data. Large-scale human
        pretraining shows a log-linear data-scaling law that tracks downstream
        success (EgoScale, NVIDIA, 2025), while{" "}
        <a
          href="https://ego4d-data.org"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-border-strong underline-offset-2 hover:text-text-muted"
        >
          Ego4D
        </a>
        -pretrained representations (R3M, Nair et al., 2022; VC-1, Majumdar et
        al., 2023) improve manipulation over ImageNet.
      </p>
    </div>
  );
}
