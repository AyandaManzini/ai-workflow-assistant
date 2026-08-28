import { createFileRoute } from "@tanstack/react-router";
import { History, Pin, PinOff, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { OutputActions } from "@/components/output-actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  clearHistory,
  deleteHistoryItem,
  formatWhen,
  togglePinHistoryItem,
  useHistory,
  KIND_LABEL,
  type HistoryKind,
} from "@/lib/history";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Saved History — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Browse, search, pin and re-export every email draft, task plan and research summary you saved.",
      },
      { property: "og:title", content: "Saved History" },
      {
        property: "og:description",
        content: "Every saved draft, plan and summary in one searchable place.",
      },
    ],
  }),
  component: HistoryPage,
});

const FILTERS = ["all", "email", "plan", "research", "chat"] as const;

function HistoryPage() {
  const items = useHistory();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items
      .filter((item) => (filter === "all" ? true : item.kind === (filter as HistoryKind)))
      .filter(
        (item) =>
          !needle ||
          item.title.toLowerCase().includes(needle) ||
          item.content.toLowerCase().includes(needle),
      )
      .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.createdAt - a.createdAt);
  }, [items, query, filter]);

  return (
    <div>
      <PageHeader
        icon={<History className="h-5 w-5" />}
        title="Saved History"
        description="Everything you saved, kept on this device only. Search it, pin it, export it again."
      />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search saved outputs…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search history"
            />
          </div>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
            <TabsList>
              {FILTERS.map((value) => (
                <TabsTrigger key={value} value={value} className="capitalize">
                  {value}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            size="sm"
            disabled={!items.length}
            onClick={() => {
              clearHistory();
              toast.success("History cleared");
            }}
          >
            <Trash2 className="h-4 w-4" />
            Clear all
          </Button>
        </CardContent>
      </Card>

      {filtered.length ? (
        <div className="space-y-4">
          {filtered.map((item) => (
            <Card key={item.id}>
              <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{item.title}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-primary">
                      {KIND_LABEL[item.kind]}
                    </span>
                    <span className="ml-2">{formatWhen(item.createdAt)}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={item.pinned ? "Unpin" : "Pin"}
                    onClick={() => togglePinHistoryItem(item.id)}
                  >
                    {item.pinned ? (
                      <PinOff className="h-4 w-4" />
                    ) : (
                      <Pin className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete"
                    onClick={() => {
                      deleteHistoryItem(item.id);
                      toast.success("Deleted");
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-xl bg-background/50 p-4 font-sans text-sm leading-relaxed text-muted-foreground">
                  {item.content}
                </pre>
                <OutputActions value={item.content} title={item.title} kind={item.kind} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Nothing saved yet. Generate something, then choose Export → Save to history.
        </p>
      )}
    </div>
  );
}
