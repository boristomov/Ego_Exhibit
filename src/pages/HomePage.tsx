import { Hero } from "../components/Hero";
import { Benefits } from "../components/Benefits";
import { Highlights } from "../components/Highlights";
import { Roadmap } from "../components/Roadmap";
import { Contact } from "../components/Contact";
import type { TasksManifest } from "../lib/tasks";

export function HomePage({ manifest }: { manifest: TasksManifest | null }) {
  return (
    <main className="snap-page">
      <Hero />
      <Benefits />
      <Highlights manifest={manifest} />
      <Roadmap />
      <Contact />
    </main>
  );
}
