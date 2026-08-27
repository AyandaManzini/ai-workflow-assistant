import { createFileRoute } from "@tanstack/react-router";
import { Bot, SendHorizonal, User } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { chatReply, type ChatMessage } from "@/lib/ai/chat";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Ask for quick, practical guidance on meetings, email, deadlines, feedback and workload.",
      },
      { property: "og:title", content: "AI Chatbot" },
      {
        property: "og:description",
        content: "A workplace chatbot for quick, practical guidance.",
      },
    ],
  }),
  component: Chatbot,
});

const SUGGESTIONS = [
  "How do I run a shorter weekly meeting?",
  "I'm behind on a deadline — what do I tell my manager?",
  "Help me give feedback on a missed handover",
];

function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I can help with meetings, email, deadlines, feedback and workload. What's on your plate today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = async (text: string) => {
    const prompt = text.trim();
    if (!prompt || thinking) return;
    setMessages((current) => [
      ...current,
      { id: Math.random().toString(36).slice(2), role: "user", content: prompt },
    ]);
    setInput("");
    setThinking(true);
    try {
      const reply = await chatReply(prompt);
      setMessages((current) => [
        ...current,
        { id: Math.random().toString(36).slice(2), role: "assistant", content: reply },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void send(input);
  };

  return (
    <div>
      <PageHeader
        icon={<Bot className="h-5 w-5" />}
        title="AI Chatbot"
        description="Session-only conversation for quick workplace guidance. Nothing is stored."
      />

      <Card className="flex h-[calc(100vh-19rem)] min-h-[420px] flex-col overflow-hidden">
        <CardContent className="flex-1 space-y-4 overflow-y-auto pt-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {message.role === "assistant" ? (
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Bot className="h-4 w-4" />
                </span>
              ) : null}
              <p
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {message.content}
              </p>
              {message.role === "user" ? (
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                  <User className="h-4 w-4" />
                </span>
              ) : null}
            </div>
          ))}
          {thinking ? (
            <p className="text-sm text-muted-foreground">Thinking…</p>
          ) : null}
          <div ref={endRef} />
        </CardContent>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => void send(suggestion)}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about meetings, email, deadlines…"
              aria-label="Message"
            />
            <Button type="submit" size="icon" disabled={thinking || !input.trim()}>
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
