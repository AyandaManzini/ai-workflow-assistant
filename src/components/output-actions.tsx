import { Check, Copy, Download, FileDown, Printer, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadTextFile, printText, slugify, toMarkdown } from "@/lib/export";
import { saveHistoryItem, type HistoryKind } from "@/lib/history";

interface OutputActionsProps {
  /** Plain-text rendering of the current output. */
  value: string;
  /** Document title used for exports and saved history entries. */
  title: string;
  kind: HistoryKind;
}

export function OutputActions({ value, title, kind }: OutputActionsProps) {
  const [copied, setCopied] = useState(false);
  const disabled = !value.trim();

  const copy = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(message);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — select the text and copy manually.");
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        disabled={disabled}
        onClick={() => void copy(value, "Copied to clipboard")}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        Copy
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled} aria-label="Export options">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onClick={() => void copy(toMarkdown(title, value), "Markdown copied to clipboard")}
          >
            <Copy className="h-4 w-4" />
            Copy as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              downloadTextFile(`${slugify(title)}.md`, toMarkdown(title, value));
              toast.success("Markdown file downloaded");
            }}
          >
            <FileDown className="h-4 w-4" />
            Download .md
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              downloadTextFile(`${slugify(title)}.txt`, value);
              toast.success("Text file downloaded");
            }}
          >
            <FileDown className="h-4 w-4" />
            Download .txt
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => printText(title, value)}>
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              saveHistoryItem({ kind, title, content: value });
              toast.success("Saved to history");
            }}
          >
            <Save className="h-4 w-4" />
            Save to history
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
