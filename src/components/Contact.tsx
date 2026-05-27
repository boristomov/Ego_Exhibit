import { Mail, ArrowUpRight } from "lucide-react";

const PEOPLE = [
  {
    name: "Boris Tomov",
    role: "Embodied AI Engineer",
    email: "boris.tomov@aithoth.com",
  },
  {
    name: "Pedro Alves",
    role: "Chief Technology Officer",
    email: "pedro.alves@aithoth.com",
  },
];

export function Contact() {
  return (
    <section id="contact" className="relative py-20 md:py-28">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/20 via-bg-elev to-cyan/15 px-6 py-12 shadow-glow-strong md:px-12 md:py-16">
          {/* Decorative grid + glow */}
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" aria-hidden />
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.4),transparent_70%)]"
            aria-hidden
          />

          <div className="reveal relative flex flex-col items-start gap-6">
            <div className="max-w-[60ch]">
              <span className="label-eyebrow">Get in touch</span>
              <h2 className="mt-4 text-[clamp(2.2rem,4.5vw,3.8rem)] font-semibold leading-tight tracking-tight">
                Want this dataset shaped to{" "}
                <span className="brand-grad">your robot's policy?</span>
              </h2>
              <p className="mt-4 max-w-[58ch] text-text-muted">
                We'd love to walk you through the pilot batch, share the
                MCAP/Foxglove review, and discuss the task mix and capture
                profile that would map best to your manipulation training plan.
              </p>
            </div>
          </div>

          <div className="reveal relative mt-10 grid gap-4 md:grid-cols-2">
            {PEOPLE.map((p) => (
              <a
                key={p.email}
                href={`mailto:${p.email}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border-strong/80 bg-bg/60 px-5 py-5 backdrop-blur transition hover:-translate-y-0.5 hover:border-accent-bright hover:bg-bg-elev"
              >
                <div className="min-w-0">
                  <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
                    {p.role}
                  </div>
                  <div className="mt-1 text-[1.1rem] font-semibold tracking-tight text-text">
                    {p.name}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[0.85rem] text-text-muted group-hover:text-text">
                    <Mail size={12} /> {p.email}
                  </div>
                </div>
                <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl border border-border bg-panel transition group-hover:border-accent-bright group-hover:bg-accent/20">
                  <ArrowUpRight size={16} className="text-text-muted group-hover:text-white" />
                </div>
              </a>
            ))}
          </div>

          <div className="reveal relative mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.72rem] text-text-muted">
            <span>Thoth AI · Global Data for Robotics</span>
            <span className="hidden h-1 w-1 rounded-full bg-text-dim sm:block" />
            <span>Singapore · North America · Europe · Asia</span>
            <span className="hidden h-1 w-1 rounded-full bg-text-dim sm:block" />
            <span>20+ active offices</span>
          </div>
        </div>
      </div>
    </section>
  );
}
