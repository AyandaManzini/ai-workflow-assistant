export type Priority = "high" | "medium" | "low";
export type Timeframe = "daily" | "weekly";

export interface TaskInput {
  id: string;
  title: string;
  priority: Priority;
}

export interface ScheduleRow {
  id: string;
  slot: string;
  task: string;
  priority: Priority;
  focus: string;
}

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

const DAILY_SLOTS = [
  "08:00 – 09:30",
  "09:45 – 11:15",
  "11:30 – 12:30",
  "13:30 – 15:00",
  "15:15 – 16:30",
  "16:30 – 17:30",
];

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_BLOCKS = ["Morning block", "Afternoon block"];

const FOCUS_NOTES: Record<Priority, string> = {
  high: "Deep focus — protect this block, no meetings.",
  medium: "Steady progress — batch with related work.",
  low: "Light effort — delegate or defer if the day slips.",
};

/**
 * Structured, template-driven schedule generation.
 * Swap the body of this function for a real AI call; the shape stays the same.
 */
export async function generatePlan(
  tasks: TaskInput[],
  timeframe: Timeframe,
): Promise<ScheduleRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 550));

  const sorted = [...tasks]
    .filter((task) => task.title.trim().length > 0)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  const slots: string[] =
    timeframe === "daily"
      ? DAILY_SLOTS
      : WEEK_DAYS.flatMap((day) => DAY_BLOCKS.map((block) => `${day} — ${block}`));

  return sorted.map((task, index) => ({
    id: task.id,
    slot: slots[index % slots.length] ?? "Unscheduled",
    task: task.title.trim(),
    priority: task.priority,
    focus: FOCUS_NOTES[task.priority],
  }));
}

export function scheduleToText(rows: ScheduleRow[]): string {
  return rows
    .map((row) => `${row.slot} | ${row.task} | ${row.priority.toUpperCase()} | ${row.focus}`)
    .join("\n");
}
