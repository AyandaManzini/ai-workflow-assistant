import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  Command,
  FileSearch,
  History,
  Info,
  LayoutDashboard,
  Mail,
  Menu,
  Sparkles,
  ListChecks,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { CommandPalette, openCommandPalette } from "@/components/command-palette";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const DISCLAIMER =
  "This tool uses AI-assisted content generation. Outputs may be inaccurate or incomplete — please review and edit before professional use.";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/planner", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research Assistant", icon: FileSearch },
  { to: "/chat", label: "Chatbot", icon: Bot },
  { to: "/history", label: "History", icon: History },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-gradient-primary text-primary-foreground shadow-elegant"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Link to="/" className="mb-8 flex items-center gap-2.5 px-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
          </span>
          <span className="min-w-0 font-display text-sm font-semibold leading-tight">
            AI Workplace
            <span className="block font-sans text-xs font-normal text-muted-foreground">
              Productivity Assistant
            </span>
          </span>
        </Link>
        <NavLinks />
        <button
          type="button"
          onClick={openCommandPalette}
          className="mt-4 flex items-center justify-between rounded-xl border border-sidebar-border bg-background/40 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
        >
          <span className="flex items-center gap-2">
            <Command className="h-3.5 w-3.5" />
            Quick actions
          </span>
          <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </button>
        <p className="mt-auto rounded-xl bg-card p-3 text-[11px] leading-relaxed text-muted-foreground">
          Every output is a draft. Review and edit before you send it on.
        </p>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
              onClick={() => setOpen((value) => !value)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="truncate font-display text-sm font-semibold sm:text-base">
              AI Workplace Productivity Assistant
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open command palette"
              onClick={openCommandPalette}
            >
              <Command className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Responsible AI information"
              onClick={() => setInfo(true)}
            >
              <Info className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </header>

        {open ? (
          <div className="border-b border-border bg-sidebar px-4 py-3 lg:hidden">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        ) : null}

        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-12">{children}</main>

        <footer className="border-t border-border px-4 py-6 pb-24 text-center text-xs leading-relaxed text-muted-foreground sm:px-6 lg:pb-6">
          {DISCLAIMER}
        </footer>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-sidebar-border bg-sidebar/95 backdrop-blur lg:hidden">
        {NAV.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              <span className="w-full truncate text-center">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>

      <CommandPalette />

      <Dialog open={info} onOpenChange={setInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responsible AI</DialogTitle>
            <DialogDescription className="text-left leading-relaxed">
              {DISCLAIMER}
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Treat every generated draft as a starting point, not a final document.</li>
            <li>• Check facts, figures and names against a trusted source.</li>
            <li>• Avoid pasting confidential or personal information into prompts.</li>
            <li>• You remain accountable for anything you send or publish.</li>
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
