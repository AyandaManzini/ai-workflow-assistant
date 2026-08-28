import { LayoutTemplate } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface TemplateOption {
  id: string;
  label: string;
  description: string;
}

export function TemplatePicker({
  templates,
  onSelect,
  label = "Templates",
}: {
  templates: TemplateOption[];
  onSelect: (id: string) => void;
  label?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <LayoutTemplate className="h-4 w-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Start from a preset</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {templates.map((template) => (
          <DropdownMenuItem
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="flex-col items-start gap-0.5"
          >
            <span className="text-sm font-medium">{template.label}</span>
            <span className="text-xs text-muted-foreground">{template.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
