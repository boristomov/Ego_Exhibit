import { useEffect, useState } from "react";
import { Nav } from "./components/Nav";
import { HomePage } from "./pages/HomePage";
import { DatasetPage } from "./pages/DatasetPage";
import { useReveal } from "./hooks/useReveal";
import { useHashRoute } from "./hooks/useHashRoute";
import type { TasksManifest } from "./lib/tasks";

export function App() {
  const [manifest, setManifest] = useState<TasksManifest | null>(null);
  const route = useHashRoute();

  useEffect(() => {
    const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
    fetch(`${base}tasks.json`, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setManifest)
      .catch(() => setManifest(null));
  }, []);

  // Re-bind reveal observers and reset scroll whenever the route swaps.
  useReveal(`${route}:${manifest ? "ready" : "loading"}`);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.documentElement.dataset.route = route;
  }, [route]);

  return (
    <>
      <Nav route={route} />
      {route === "home" && <HomePage manifest={manifest} />}
      {route === "dataset" && <DatasetPage manifest={manifest} />}
    </>
  );
}
