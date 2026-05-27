export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="container-wide flex flex-col items-start justify-between gap-3 py-8 text-[0.72rem] text-text-muted md:flex-row md:items-center">
        <div className="flex items-center gap-2.5">
          <img
            src={`${import.meta.env.BASE_URL}thoth-logo.jpg`}
            alt="Thoth AI"
            width={28}
            height={28}
            className="h-7 w-7 rounded-md ring-1 ring-white/10"
          />
          <span>Egocentric Data for Robotics</span>
        </div>
        <div className="flex items-center gap-3">
          <span>© {new Date().getFullYear()} Thoth AI</span>
        </div>
      </div>
    </footer>
  );
}
