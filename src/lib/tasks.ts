export type TaskEntry = {
  task: string;
  slug: string;
  env: string;
  episodes: number;
  durationSec: number;
  sessionId?: string;
};

export type TasksManifest = {
  generatedAt: string;
  totalSessions: number;
  totalDurationSec: number;
  totalTasks: number;
  tasks: TaskEntry[];
};

export function formatDuration(sec: number | null | undefined): string {
  if (!sec || !Number.isFinite(sec)) return "—";
  const total = Math.round(sec);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}

export function formatHours(sec: number | null | undefined): string {
  if (!sec || !Number.isFinite(sec)) return "—";
  const h = sec / 3600;
  if (h < 1) return `${Math.round(sec / 60)} min`;
  if (h < 10) return `${h.toFixed(1)} h`;
  return `${Math.round(h)} h`;
}
