import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task tracker | Nutrixon" },
      { name: "description", content: "Organize tasks by status, set due dates and track your progress." },
      { property: "og:title", content: "Task tracker | Nutrixon" },
      { property: "og:description", content: "Organize tasks by status, set due dates and track your progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TasksPage,
});

type Status = "todo" | "doing" | "done";
interface Task {
  id: string;
  title: string;
  status: Status;
  due: string;
  progress: number;
}

const columns: { status: Status; label: string }[] = [
  { status: "todo", label: "To do" },
  { status: "doing", label: "In progress" },
  { status: "done", label: "Done" },
];

const KEY = "nutrixon-tasks";

function dueState(t: Task) {
  if (!t.due || t.status === "done") return null;
  const today = new Date().toISOString().slice(0, 10);
  if (t.due < today) return "overdue";
  if (t.due === today) return "today";
  return "upcoming";
}

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(tasks));
  }, [tasks, loaded]);

  const update = (id: string, patch: Partial<Task>) =>
    setTasks((ts) =>
      ts.map((t) => {
        if (t.id !== id) return t;
        const next = { ...t, ...patch };
        if (patch.status === "done") next.progress = 100;
        if (patch.progress === 100) next.status = "done";
        if (patch.progress !== undefined && patch.progress < 100 && t.status === "done") next.status = "doing";
        if (patch.progress !== undefined && patch.progress > 0 && next.status === "todo") next.status = "doing";
        return next;
      }),
    );

  const total = tasks.length;
  const overall = total ? Math.round(tasks.reduce((s, t) => s + t.progress, 0) / total) : 0;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Task tracker</h1>

      <div className="card-surface mt-6 p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold">Overall progress</span>
          <span className="text-sm text-muted-foreground">
            {doneCount} of {total} done · <span className="font-bold text-foreground">{overall}%</span>
          </span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${overall}%` }} />
        </div>
      </div>

      <form
        className="mt-6 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          setTasks((ts) => [
            { id: crypto.randomUUID(), title: title.trim(), status: "todo", due, progress: 0 },
            ...ts,
          ]);
          setTitle("");
          setDue("");
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task"
          aria-label="Task title"
          className="min-w-[200px] flex-1 rounded-full border bg-card px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          aria-label="Due date"
          className="rounded-full border bg-card px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"
        />
        <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Add task
        </button>
      </form>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {columns.map((c) => {
          const list = tasks.filter((t) => t.status === c.status);
          return (
            <section key={c.status} className="rounded-2xl bg-secondary/60 p-4">
              <h2 className="mb-3 flex items-center justify-between text-base font-bold">
                {c.label}
                <span className="rounded-full bg-card px-2 py-0.5 text-xs">{list.length}</span>
              </h2>
              <div className="space-y-3">
                {list.map((t) => {
                  const ds = dueState(t);
                  return (
                    <article key={t.id} className="card-surface p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-sm font-semibold ${t.status === "done" ? "text-muted-foreground line-through" : ""}`}>
                          {t.title}
                        </h3>
                        <button
                          aria-label={`Delete ${t.title}`}
                          onClick={() => setTasks((ts) => ts.filter((x) => x.id !== t.id))}
                          className="text-muted-foreground hover:text-bad"
                        >
                          ×
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <input
                          type="date"
                          value={t.due}
                          onChange={(e) => update(t.id, { due: e.target.value })}
                          aria-label="Due date"
                          className="rounded-md border bg-background px-2 py-1"
                        />
                        {ds === "overdue" && <span className="rounded-full bg-bad-soft px-2 py-0.5 font-semibold text-bad">Overdue</span>}
                        {ds === "today" && <span className="rounded-full bg-warn-soft px-2 py-0.5 font-semibold text-warn-foreground">Due today</span>}
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{t.progress}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={10}
                          value={t.progress}
                          onChange={(e) => update(t.id, { progress: Number(e.target.value) })}
                          aria-label="Progress"
                          className="mt-1 w-full accent-primary"
                        />
                      </div>
                      <select
                        value={t.status}
                        onChange={(e) => update(t.id, { status: e.target.value as Status })}
                        aria-label="Status"
                        className="mt-2 w-full rounded-md border bg-background px-2 py-1.5 text-xs"
                      >
                        {columns.map((o) => (
                          <option key={o.status} value={o.status}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </article>
                  );
                })}
                {list.length === 0 && <p className="py-4 text-center text-xs text-muted-foreground">Nothing here yet</p>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
