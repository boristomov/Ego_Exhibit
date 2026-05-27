export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="container-wide flex flex-col items-start justify-between gap-3 py-8 text-[0.72rem] text-text-muted md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded-md bg-brand-gradient">
            <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 text-bg" fill="currentColor">
              <circle cx="12" cy="12" r="3" />
            </svg>
          </span>
          <span className="font-semibold tracking-tight text-text">Thoth AI</span>
          <span className="text-text-dim">·</span>
          <span>Egocentric Data for Robotics</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://boristomov.github.io/Ego_Dashboard/"
            target="_blank"
            rel="noopener"
            className="hover:text-text"
          >
            Operations dashboard
          </a>
          <span className="text-text-dim">·</span>
          <span>© {new Date().getFullYear()} Thoth AI</span>
        </div>
      </div>
    </footer>
  );
}
