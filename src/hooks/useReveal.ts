import { useEffect } from "react";

/**
 * Light-weight scroll reveal — turns any element with the `.reveal` class
 * into a fade-in-up once it enters the viewport. Idempotent: re-runs safely
 * when new content mounts. Pass a `key` (e.g. the active route) so the
 * observer re-binds whenever the page swaps in fresh `.reveal` nodes.
 */
export function useReveal(key?: unknown) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document.querySelectorAll(".reveal").forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    // Defer one frame so freshly-mounted route content is in the DOM.
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((n) => io.observe(n));
    });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [key]);
}
