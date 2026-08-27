import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Plus, Trash2, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  generatePlan,
  scheduleToText,
  type Priority,
  type ScheduleRow,
  type TaskInput,
  type Timeframe,
} from "@/lib/ai/planner";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Turn a task list with priorities into an editable daily or weekly schedule with colour-coded priority tags.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Prioritise tasks into an editable daily or weekly time-blocked schedule.",
      },
    ],
  }),
  component: TaskPlanner,
});

const PRIORITY_STYLES: Record<Priority, string> = {
  high: "bg-priority-high/15 text-priority-high border-priority-high/40",
  medium: "bg-priority-medium/15 text-priority-medium border-priority-medium/40",
  low: "bg-priority-low/15 text-priority-low border-priority-low/40",
};

const newId = () => Math.random().toString(36).slice(2, 10);

function TaskPlanner() {
  const [tasks, setTasks] = useState<TaskInput[]>([
    { id: newId(), title: "", priority: "high" },
  ]);
  const [timeframe, setTimeframe] = useState<Timeframe>("daily");
  const [rows, setRows] = useState<ScheduleRow[]>([]);
  const [loading, setLoading] = useState(false);

  const updateTask = (id: string, patch: Partial<TaskInput>) =>
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...patch } : task)));

  const updateRow = (id: string, patch: Partial<ScheduleRow>) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const handleGenerate = async () => {
    if (!tasks.some((task) => task.title.trim())) {
      toast.error("Add at least one task.");
      return;
    }
    setLoading(true);
    try {
      setRows(await generatePlan(tasks, timeframe));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={<ListChecks className="h-5 w-5" />}
        title="AI Task Planner"
        description="List what needs doing, set priorities, and get an editable time-blocked schedule."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <CardTitle className="truncate text-base">Tasks</CardTitle>
            <div className="flex shrink-0 items-center gap-2">
              <Label htmlFor="timeframe" className="hidden text-xs text-muted-foreground sm:block">
                Timeframe
              </Label>
              <Select value={timeframe} onValueChange={(value) => setTimeframe(value as Timeframe)}>
                <SelectTrigger id="timeframe" className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
              >
                <Input
                  className="col-span-2 sm:col-span-1"
                  placeholder={`Task ${index + 1}`}
                  value={task.title}
                  onChange={(event) => updateTask(task.id, { title: event.target.value })}
                />
                <Select
                  value={task.priority}
                  onValueChange={(value) => updateTask(task.id, { priority: value as Priority })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove task"
                  disabled={tasks.length === 1}
                  onClick={() =>
                    setTasks((current) => current.filter((entry) => entry.id !== task.id))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                variant="secondary"
                onClick={() =>
                  setTasks((current) => [...current, { id: newId(), title: "", priority: "medium" }])
                }
              >
                <Plus className="h-4 w-4" />
                Add task
              </Button>
              <Button onClick={handleGenerate} disabled={loading}>
                <Wand2 className="h-4 w-4" />
                {loading ? "Planning…" : "Generate Schedule"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <CardTitle className="truncate text-base">
              {timeframe === "daily" ? "Daily schedule" : "Weekly schedule"}
            </CardTitle>
            <CopyButton value={scheduleToText(rows)} />
          </CardHeader>
          <CardContent>
            {rows.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="pb-2 pr-3 font-medium">Time block</th>
                      <th className="pb-2 pr-3 font-medium">Task</th>
                      <th className="pb-2 pr-3 font-medium">Priority</th>
                      <th className="pb-2 font-medium">Focus note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id} className="border-b border-border/60 align-top">
                        <td className="py-2 pr-3">
                          <Input
                            className="h-9"
                            value={row.slot}
                            onChange={(event) => updateRow(row.id, { slot: event.target.value })}
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <Input
                            className="h-9"
                            value={row.task}
                            onChange={(event) => updateRow(row.id, { task: event.target.value })}
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                              PRIORITY_STYLES[row.priority],
                            )}
                          >
                            {row.priority}
                          </span>
                        </td>
                        <td className="py-2">
                          <Input
                            className="h-9"
                            value={row.focus}
                            onChange={(event) => updateRow(row.id, { focus: event.target.value })}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Your prioritised schedule will appear here, ready to edit.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
