import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function StatCard({
  label,
  value,
  note,
  icon: Icon,
  progress,
}: {
  label: string;
  value: number | string;
  note: string;
  icon: LucideIcon;
  progress: number;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
          <Icon className="h-4 w-4 shrink-0" />
          <span className="truncate text-xs">{label}</span>
        </div>
        <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
        <Progress value={Math.min(100, progress)} className="mt-3 h-1.5" />
        <p className="mt-2 text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  );
}
