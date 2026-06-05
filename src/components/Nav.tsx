import { useState } from "react";
import { navigate, type Route } from "../hooks/useHashRoute";

type NavLink =
  | { label: string; kind: "section"; id: string }
  | { label: string; kind: "route"; route: Route };

const LINKS: NavLink[] = [
  { label: "Dataset", kind: "route", route: "dataset" },
];

export function Nav({ route }: { route: Route }) {
  const [open, setOpen] = useState(false);

  const go = (l: NavLink) => {
    setOpen(false);
    if (l.kind === "route") navigate(l.route);
    else navigate("home", l.id);
  };

  const isActive = (l: NavLink) =>
    l.kind === "route" && l.route === route;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 bg-transparent pt-2 transition-all duration-300 md:pt-3`}
    >
      <div className="container-wide flex h-16 items-center justify-between md:h-[4.75rem]">
        <button
          onClick={() => navigate("home")}
          className="group flex items-center gap-3"
          aria-label="Thoth AI — home"
        >
          <img
            src={`${import.meta.env.BASE_URL}thoth-logo.jpg`}
            alt="Thoth AI"
            width={56}
            height={56}
            className="h-11 w-11 rounded-xl shadow-glow ring-1 ring-white/10 transition group-hover:ring-white/25 md:h-14 md:w-14"
          />
          <span className="text-[1.02rem] font-semibold tracking-tight text-text md:text-[1.15rem]">
            Thoth AI
          </span>
        </button>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <button
              key={l.label}
              onClick={() => go(l)}
              className={`text-[0.82rem] font-medium transition hover:text-text ${
                isActive(l) ? "text-text" : "text-text-muted"
              }`}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => navigate("home", "contact")}
            className="btn-primary !py-2 !px-4 !text-[0.78rem]"
          >
            Get in touch
          </button>
        </nav>

        <button
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-md border border-border bg-panel/60 md:hidden"
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
              <button
                key={l.label}
                onClick={() => go(l)}
                className={`rounded-md px-2 py-2 text-left text-[0.95rem] font-medium transition hover:bg-panel hover:text-text ${
                  isActive(l) ? "text-text" : "text-text-muted"
                }`}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                navigate("home", "contact");
              }}
              className="mt-2 inline-flex justify-center rounded-full bg-text px-4 py-2 text-[0.85rem] font-semibold text-bg"
            >
              Get in touch
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
