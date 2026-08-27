import { createFileRoute } from "@tanstack/react-router";
import { FileSearch, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarise, summaryToText, type ResearchSummary } from "@/lib/ai/research";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Summarise a topic or pasted article into editable key points, insights and recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Structured, editable summaries: key points, insights and recommendations.",
      },
    ],
  }),
  component: ResearchAssistant,
});

const SECTIONS = [
  { key: "keyPoints", label: "Key Points" },
  { key: "insights", label: "Insights" },
  { key: "recommendations", label: "Recommendations" },
] as const;

function ResearchAssistant() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState<ResearchSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarise = async () => {
    if (!input.trim()) {
      toast.error("Enter a topic or paste some text first.");
      return;
    }
    setLoading(true);
    try {
      setSummary(await summarise(input));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={<FileSearch className="h-5 w-5" />}
        title="AI Research Assistant"
        description="Paste an article or name a topic — get a structured summary you can edit."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Source</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="source">Topic or article text</Label>
              <Textarea
                id="source"
                rows={16}
                placeholder="e.g. hybrid work policy trends — or paste the full article here"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </div>
            <Button onClick={handleSummarise} disabled={loading} className="w-full">
              <Wand2 className="h-4 w-4" />
              {loading ? "Summarising…" : "Summarise"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <CardTitle className="truncate text-base">Editable summary</CardTitle>
            <CopyButton value={summary ? summaryToText(summary) : ""} />
          </CardHeader>
          <CardContent className="space-y-4">
            {summary ? (
              SECTIONS.map((section) => (
                <div key={section.key} className="space-y-2">
                  <Label htmlFor={section.key}>{section.label}</Label>
                  <Textarea
                    id={section.key}
                    rows={6}
                    value={summary[section.key]}
                    onChange={(event) =>
                      setSummary({ ...summary, [section.key]: event.target.value })
                    }
                  />
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Key points, insights and recommendations will appear here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
