import { Link, createFileRoute } from "@tanstack/react-router";
import { Bot, FileSearch, ListChecks, Mail, MessagesSquare, Timer, TrendingUp } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Your workspace for AI-assisted emails, task plans, research summaries and a workplace chatbot.",
      },
      { property: "og:title", content: "Dashboard — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Quick access to AI-assisted email, planning, research and chat tools.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Turn a few key points into a polished, editable draft in the tone you need.",
  },
  {
    to: "/planner",
    icon: ListChecks,
    title: "AI Task Planner",
    description: "Prioritise your task list and lay it out across time blocks or the week.",
  },
  {
    to: "/research",
    icon: FileSearch,
    title: "AI Research Assistant",
    description: "Summarise a topic or article into key points, insights and recommendations.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Chatbot",
    description: "Ask for quick guidance on meetings, feedback, deadlines and workload.",
  },
] as const;

const STATS = [
  { label: "Emails generated", value: "128", icon: Mail, note: "+12 this week" },
  { label: "Tasks planned", value: "342", icon: ListChecks, note: "+38 this week" },
  { label: "Summaries created", value: "57", icon: TrendingUp, note: "+6 this week" },
  { label: "Chat sessions", value: "94", icon: MessagesSquare, note: "+9 this week" },
] as const;

function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
          <Timer className="h-3.5 w-3.5" />
          Save an hour a day
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome back — what are we automating today?
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Four AI-assisted tools for the writing, planning and thinking work that fills your day.
          Every output arrives as an editable draft, so you stay in control of the final word.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Your tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link key={tool.to} to={tool.to} className="group">
              <Card className="h-full transition-colors group-hover:border-primary">
                <CardHeader>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                    <tool.icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="mt-3 text-base">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Activity
        </h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
                  <stat.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate text-xs">{stat.label}</span>
                </div>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-xs text-primary">{stat.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
