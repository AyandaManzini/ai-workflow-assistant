import { createFileRoute } from "@tanstack/react-router";
import { Mail, Wand2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { generateEmail, type EmailTone } from "@/lib/ai/email";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Generate a structured, editable email draft from your key points in a formal, friendly or persuasive tone.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Turn key points into a polished, editable email draft.",
      },
    ],
  }),
  component: EmailGenerator,
});

function EmailGenerator() {
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<EmailTone>("formal");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!context.trim()) {
      toast.error("Add some context or key points first.");
      return;
    }
    setLoading(true);
    try {
      const draft = await generateEmail({ recipient, context, tone });
      setSubject(draft.subject);
      setBody(draft.body);
    } finally {
      setLoading(false);
    }
  };

  const fullText = subject || body ? `Subject: ${subject}\n\n${body}` : "";

  return (
    <div>
      <PageHeader
        icon={<Mail className="h-5 w-5" />}
        title="Smart Email Generator"
        description="Give the recipient and your key points — get a structured draft you can edit before sending."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Thandi Nkosi"
                value={recipient}
                onChange={(event) => setRecipient(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Context / key points</Label>
              <Textarea
                id="context"
                rows={8}
                placeholder={"One point per line, e.g.\nProject kickoff moved to Monday\nNeed budget sign-off by Friday"}
                value={context}
                onChange={(event) => setContext(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(value) => setTone(value as EmailTone)}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              <Wand2 className="h-4 w-4" />
              {loading ? "Generating…" : "Generate Email"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <CardTitle className="truncate text-base">Editable draft</CardTitle>
            <CopyButton value={fullText} />
          </CardHeader>
          <CardContent className="space-y-4">
            {subject || body ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Message</Label>
                  <Textarea
                    id="body"
                    rows={16}
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                  />
                </div>
              </>
            ) : (
              <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Your generated draft will appear here, ready to edit.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
