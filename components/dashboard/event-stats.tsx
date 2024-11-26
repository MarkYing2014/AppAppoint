"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
}

export function EventStats() {
  const [stats, setStats] = useState<EventStats>({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchEventStats();
  }, []);

  const fetchEventStats = async () => {
    try {
      const response = await fetch('/api/events/stats');
      if (!response.ok) throw new Error('Failed to fetch event stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching event stats:', error);
    }
  };

  const cards = [
    {
      title: "Total Events",
      value: stats.total,
      icon: CalendarDays,
      description: "Total number of events",
      className: "bg-blue-50",
      iconClassName: "text-blue-500",
    },
    {
      title: "Scheduled",
      value: stats.scheduled,
      icon: Clock,
      description: "Upcoming events",
      className: "bg-yellow-50",
      iconClassName: "text-yellow-500",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      description: "Successfully completed events",
      className: "bg-green-50",
      iconClassName: "text-green-500",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      description: "Cancelled events",
      className: "bg-red-50",
      iconClassName: "text-red-500",
    },
  ];

  return (
    <>
      {cards.map((card) => (
        <Card key={card.title} className={card.className}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={cn("h-4 w-4", card.iconClassName)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
