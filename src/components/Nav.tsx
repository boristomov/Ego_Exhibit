import { useEffect, useState } from "react";

const LINKS: { label: string; href: string }[] = [
  { label: "Dataset", href: "#dataset" },
  { label: "Tasks", href: "#tasks" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Quality", href: "#quality" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-bg/75 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide flex h-14 items-center justify-between md:h-16">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-gradient shadow-glow">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-bg" fill="currentColor">
              <path d="M6 9 L12 6 L18 9 L18 15 L12 18 L6 15 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </span>
          <span className="text-[0.95rem] font-semibold tracking-tight">
            Thoth AI
          </span>
          <span className="hidden text-[0.72rem] uppercase tracking-[0.18em] text-text-muted sm:inline">
            · Data for Robotics
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[0.82rem] font-medium text-text-muted transition hover:text-text"
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn-primary !py-2 !px-4 !text-[0.78rem]">
            Get in touch
          </a>
        </nav>

        <button
          aria-label="Open menu"
          className="grid h-9 w-9 place-items-center rounded-md border border-border bg-panel/60 md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden">
          <div className="container-wide flex flex-col gap-1 border-t border-border/60 bg-bg/95 py-3 backdrop-blur-xl">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-md px-2 py-2 text-[0.95rem] font-medium text-text-muted transition hover:bg-panel hover:text-text"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-2 inline-flex justify-center rounded-full bg-text px-4 py-2 text-[0.85rem] font-semibold text-bg"
              onClick={() => setOpen(false)}
            >
              Get in touch
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
