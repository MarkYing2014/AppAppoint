"use client";

import { Button } from "@/components/ui/button";

interface CalendarViewSelectorProps {
  view: "week" | "month";
  onViewChange: (view: "week" | "month") => void;
}

export function CalendarViewSelector({ view, onViewChange }: CalendarViewSelectorProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border p-1">
      <Button
        variant={view === "week" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("week")}
      >
        Week
      </Button>
      <Button
        variant={view === "month" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("month")}
      >
        Month
      </Button>
    </div>
  );
}