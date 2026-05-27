import { useEffect, useState } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { TaskGrid } from "./components/TaskGrid";
import { PipelineSection } from "./components/PipelineSection";
import { QualitySection } from "./components/QualitySection";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { useReveal } from "./hooks/useReveal";
import type { TasksManifest } from "./lib/tasks";

export function App() {
  const [manifest, setManifest] = useState<TasksManifest | null>(null);

  useEffect(() => {
    const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
    fetch(`${base}tasks.json`, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setManifest)
      .catch(() => setManifest(null));
  }, []);

  useReveal();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats manifest={manifest} />
        <TaskGrid tasks={manifest?.tasks ?? []} />
        <PipelineSection />
        <QualitySection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
