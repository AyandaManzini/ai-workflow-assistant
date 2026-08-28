import type { EmailTone } from "@/lib/ai/email";
import type { Priority, Timeframe } from "@/lib/ai/planner";

export interface EmailTemplate {
  id: string;
  label: string;
  description: string;
  recipient: string;
  context: string;
  tone: EmailTone;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "status-update",
    label: "Weekly status update",
    description: "Progress, blockers and next steps for a stakeholder",
    recipient: "Project stakeholders",
    tone: "formal",
    context:
      "Sprint 12 shipped on schedule\nPayments integration is blocked on vendor credentials\nNext week: onboarding flow and QA pass\nNeed a decision on the launch date by Thursday",
  },
  {
    id: "meeting-request",
    label: "Meeting request",
    description: "Ask for time with a clear agenda",
    recipient: "Head of Operations",
    tone: "friendly",
    context:
      "Would like 30 minutes next week\nTopic: streamlining the monthly reporting process\nHappy to work around your calendar\nI will send an agenda beforehand",
  },
  {
    id: "client-proposal",
    label: "Client proposal follow-up",
    description: "Nudge a proposal forward without pressure",
    recipient: "Client contact",
    tone: "persuasive",
    context:
      "Following up on the proposal sent last Tuesday\nThe scope covers discovery, build and a month of support\nEarly start means delivery before the busy season\nHappy to adjust scope to fit the budget",
  },
  {
    id: "feedback",
    label: "Constructive feedback",
    description: "Balanced feedback to a team member",
    recipient: "Team member",
    tone: "friendly",
    context:
      "Strong ownership of the migration work\nDocumentation slipped on the last two tickets\nSuggest a 15 minute write-up before closing tickets\nHappy to pair on the first one",
  },
];

export interface PlanTemplate {
  id: string;
  label: string;
  description: string;
  timeframe: Timeframe;
  tasks: { title: string; priority: Priority }[];
}

export const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    id: "focus-day",
    label: "Deep focus day",
    description: "One big deliverable plus light admin",
    timeframe: "daily",
    tasks: [
      { title: "Draft the quarterly report", priority: "high" },
      { title: "Review pull requests", priority: "medium" },
      { title: "Clear inbox and reply to blockers", priority: "medium" },
      { title: "Update project tracker", priority: "low" },
    ],
  },
  {
    id: "launch-week",
    label: "Launch week",
    description: "Ship-critical work across five days",
    timeframe: "weekly",
    tasks: [
      { title: "Finalise release checklist", priority: "high" },
      { title: "Run end-to-end QA pass", priority: "high" },
      { title: "Brief support and sales teams", priority: "medium" },
      { title: "Prepare launch announcement", priority: "medium" },
      { title: "Schedule post-launch retro", priority: "low" },
    ],
  },
  {
    id: "catch-up",
    label: "Backlog catch-up",
    description: "Chip away at the pile without losing the day",
    timeframe: "weekly",
    tasks: [
      { title: "Triage overdue tickets", priority: "high" },
      { title: "Close out stale documentation", priority: "low" },
      { title: "Follow up on unanswered emails", priority: "medium" },
      { title: "Archive completed projects", priority: "low" },
    ],
  },
];

export interface ResearchTemplate {
  id: string;
  label: string;
  description: string;
  input: string;
}

export const RESEARCH_TEMPLATES: ResearchTemplate[] = [
  {
    id: "market-scan",
    label: "Market scan",
    description: "Landscape overview for a new category",
    input:
      "AI note-taking tools for professional services firms: current market, main vendors, pricing patterns and adoption blockers.",
  },
  {
    id: "competitor",
    label: "Competitor review",
    description: "Position a rival product against yours",
    input:
      "Competitor review: how our onboarding compares to the two leading alternatives on setup time, pricing and support quality.",
  },
  {
    id: "meeting-notes",
    label: "Meeting notes digest",
    description: "Turn raw notes into a shareable summary",
    input:
      "Team sync notes:\nRoadmap slipped by two weeks because of the vendor delay.\nSupport tickets up 18% month on month, mostly billing questions.\nHiring for one backend engineer approved.\nAgreed to revisit pricing in the next quarter.",
  },
];
