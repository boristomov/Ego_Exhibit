import { ArrowUpRight, Clock, Compass, Database, Layers } from "lucide-react";
import { TaskInventory } from "../components/TaskGrid";
import { DatasetPackageSection } from "../components/DatasetPackageSection";
import { PipelineSection } from "../components/PipelineSection";
import { Footer } from "../components/Footer";
import type { TasksManifest } from "../lib/tasks";
import { formatHours } from "../lib/tasks";

const DATASET_BROWSER_URL = "https://boristomov.github.io/Ego_Dashboard";

/**
 * Pilot dataset — three viewport panels plus footer: task inventory, package
 * contents, session lifecycle.
 */
export function DatasetPage({ manifest }: { manifest: TasksManifest | null }) {
  const episodes = manifest?.totalSessions ?? 500;
  const tasks = manifest?.totalTasks ?? 23;
  const hours = manifest?.totalDurationSec
    ? formatHours(manifest.totalDurationSec)
    : "10+ h";

  return (
    <main className="snap-soft">
      {/* Panel 1 — Task inventory */}
      <section id="dataset" className="section-screen isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg" aria-hidden />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[45%] bg-[radial-gradient(ellipse_60%_50%_at_50%_18%,rgba(124,58,237,0.22),transparent_70%)]"
          aria-hidden
        />

        <div className="container-wide flex min-h-0 flex-1 flex-col py-4 md:py-6">
          <div className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-7">
              <h1
                className="reveal text-[clamp(1.6rem,3.2vw,2.6rem)] font-semibold leading-tight tracking-tight"
              >
                Task <span className="brand-grad">inventory</span>
              </h1>

              {/* Dataset Browser CTA */}
              <div className="reveal" style={{ transitionDelay: "120ms" }}>
                <a
                  href={DATASET_BROWSER_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-accent/50 bg-gradient-to-r from-accent/25 via-panel/60 to-cyan/20 px-5 py-2.5 text-[0.88rem] font-semibold text-white backdrop-blur transition duration-300 hover:border-accent-bright hover:shadow-glow"
                >
                  <Compass
                    size={15}
                    className="text-accent-bright transition-transform duration-500 group-hover:rotate-[60deg]"
                  />
                  Try out our Dataset Browser
                  <ArrowUpRight
                    size={14}
                    className="text-text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  />
                  {/* sheen sweep on hover */}
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                </a>
                <p className="mt-1.5 text-[0.7rem] leading-snug text-text-muted">
                  Download this data and test it out for yourself.
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-3 gap-2 sm:gap-2.5 lg:w-auto">
              <BigStat
                icon={Layers}
                value={episodes.toLocaleString()}
                label="Episodes"
                delay={60}
              />
              <BigStat
                icon={Database}
                value={tasks.toString()}
                label="Tasks"
                delay={120}
              />
              <BigStat icon={Clock} value={hours} label="Captured" delay={180} />
            </div>
          </div>

          <p
            className="reveal mt-2 shrink-0 text-[0.68rem] uppercase tracking-[0.18em] text-text-dim"
            style={{ transitionDelay: "100ms" }}
          >
            Hover to preview · click for full clip
          </p>

          <div
            className="reveal mt-4 min-h-0 md:flex-1 md:overflow-y-auto md:overscroll-contain"
            style={{ transitionDelay: "160ms" }}
          >
            <TaskInventory tasks={manifest?.tasks ?? []} />
          </div>
        </div>
      </section>

      <DatasetPackageSection />
      <PipelineSection />

      <div className="reveal">
        <Footer />
      </div>
    </main>
  );
}

function BigStat({
  icon: Icon,
  value,
  label,
  delay = 0,
}: {
  icon: typeof Layers;
  value: string;
  label: string;
  delay?: number;
}) {
  return (
    <div
      className="reveal relative overflow-hidden rounded-xl border border-border bg-panel/60 px-3 py-3 md:px-4"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Icon size={13} className="text-accent-bright" />
      <div className="mt-1.5 text-[clamp(1.25rem,2.2vw,1.85rem)] font-semibold leading-none tracking-tight text-text">
        {value}
      </div>
      <div className="mt-1 text-[0.58rem] uppercase tracking-[0.14em] text-text-muted">
        {label}
      </div>
    </div>
  );
}
