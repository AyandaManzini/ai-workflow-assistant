import { useNavigate } from "@tanstack/react-router";
import {
  Bot,
  FileSearch,
  History,
  LayoutDashboard,
  ListChecks,
  Mail,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { clearHistory } from "@/lib/history";

export const PALETTE_EVENT = "awpa:open-palette";

export function openCommandPalette() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(PALETTE_EVENT));
}

const DESTINATIONS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, shortcut: "G D" },
  { to: "/email", label: "Email Generator", icon: Mail, shortcut: "G E" },
  { to: "/planner", label: "Task Planner", icon: ListChecks, shortcut: "G P" },
  { to: "/research", label: "Research Assistant", icon: FileSearch, shortcut: "G R" },
  { to: "/chat", label: "Chatbot", icon: Bot, shortcut: "G C" },
  { to: "/history", label: "History", icon: History, shortcut: "G H" },
] as const;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener(PALETTE_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(PALETTE_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // "g" then a letter jumps between sections when no input is focused.
  useEffect(() => {
    let armed = false;
    let timer: ReturnType<typeof setTimeout>;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if (armed) {
        const match = DESTINATIONS.find((item) => item.shortcut.toLowerCase().endsWith(key));
        armed = false;
        if (match) {
          event.preventDefault();
          void navigate({ to: match.to });
        }
        return;
      }
      if (key === "g") {
        armed = true;
        clearTimeout(timer);
        timer = setTimeout(() => {
          armed = false;
        }, 1200);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, [navigate]);

  const go = (to: string) => {
    setOpen(false);
    void navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Jump to a tool or run an action…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Go to">
          {DESTINATIONS.map((item) => (
            <CommandItem key={item.to} value={item.label} onSelect={() => go(item.to)}>
              <item.icon className="h-4 w-4" />
              {item.label}
              <CommandShortcut>{item.shortcut}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            value="Clear saved history"
            onSelect={() => {
              clearHistory();
              setOpen(false);
              toast.success("History cleared");
            }}
          >
            <Trash2 className="h-4 w-4" />
            Clear saved history
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
