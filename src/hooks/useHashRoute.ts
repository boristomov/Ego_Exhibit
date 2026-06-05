import { useEffect, useState } from "react";

/**
 * Tiny hash-based router. Hash routing keeps deep links working on GitHub
 * Pages (no server rewrite needed) and lets us nest the pilot dataset as its
 * own page while keeping the general capabilities site as the root.
 */
export type Route = "home" | "dataset";

export function parseRoute(): Route {
  if (typeof window === "undefined") return "home";
  const h = window.location.hash.replace(/^#\/?/, "");
  if (h.startsWith("dataset")) return "dataset";
  return "home";
}

/**
 * Navigate between routes. When going home with a `sectionId`, the page is
 * scrolled to that section (mounting first if we're coming from another route).
 */
export function navigate(route: Route, sectionId?: string) {
  const onHome = parseRoute() === "home";

  if (route === "home") {
    if (!onHome) window.location.hash = "/";
    const doScroll = () => {
      if (sectionId) {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    // If already home, scroll now; otherwise wait for the home page to mount.
    if (onHome) doScroll();
    else setTimeout(doScroll, 90);
    return;
  }

  window.location.hash = "/" + route;
  window.scrollTo({ top: 0 });
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(parseRoute);

  useEffect(() => {
    const onChange = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}
