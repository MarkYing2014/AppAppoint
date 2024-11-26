"use client";

import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isSameDay, startOfWeek, endOfWeek, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { NewEventDialog } from "./new-event-dialog";
import { EventDetailDialog } from "./event-detail-dialog";
import { SalesRep } from "@/types/sales-rep";

interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  clientId: string;
  salesRepId: string;
  client?: {
    name: string;
  };
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface MonthViewProps {
  date: Date;
  selectedReps: string[];
  salesReps: SalesRep[];
  events: Event[];
  onEventClick?: (event: Event) => void;
  onTimeSlotClick?: (date: Date, time: string) => void;
}

export function MonthView({ date, selectedReps, salesReps, events, onEventClick, onTimeSlotClick }: MonthViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Filter events for selected reps and current month
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const isInMonth = isSameMonth(eventDate, date);
    const isSelectedRep = selectedReps.length === 0 || selectedReps.includes(event.salesRepId);
    
    console.log('Month view event filtering:', {
      event: event.title,
      eventDate: format(eventDate, 'yyyy-MM-dd'),
      currentMonth: format(date, 'yyyy-MM'),
      isInMonth,
      isSelectedRep
    });
    
    return isInMonth && isSelectedRep;
  });

  // Group events by date
  const eventsByDate = filteredEvents.reduce((acc, event) => {
    const eventDate = format(new Date(event.date), 'yyyy-MM-dd');
    if (!acc[eventDate]) {
      acc[eventDate] = [];
    }
    acc[eventDate].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const handleDayClick = (day: Date) => {
    // When clicking a day in month view, create event at 9 AM by default
    onTimeSlotClick?.(day, '09:00');
  };

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick?.(event);
  };

  return (
    <>
      <div className="grid grid-cols-7 border-l border-t">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="h-10 border-b border-r px-2 py-1 text-sm font-medium"
          >
            {day}
          </div>
        ))}
        
        {days.map((day) => {
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[120px] border-b border-r p-1 cursor-pointer transition-colors group relative",
                {
                  "bg-muted/50": isSameDay(day, new Date()),
                  "text-muted-foreground": !isSameMonth(day, date),
                  "hover:bg-accent/50": true,
                }
              )}
              onClick={() => handleDayClick(day)}
            >
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-muted-foreground z-10 text-lg font-medium">
                +
              </div>
              <div className="flex justify-between items-start mb-1">
                <div className={cn(
                  "text-sm font-medium",
                )}>
                  {format(day, "d")}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {eventsByDate[format(day, 'yyyy-MM-dd')]?.map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event, e);
                    }}
                    className={`px-2 py-1 mb-1 rounded text-xs cursor-pointer ${
                      event.status === 'completed' ? 'bg-green-100 text-green-700' :
                      event.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-xs truncate">
                      {event.startTime} - {event.endTime}
                      {event.client?.name && <span className="ml-1">({event.client.name})</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <EventDetailDialog
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={(event) => {
          console.log('Edit event:', event);
          setSelectedEvent(null);
        }}
      />
    </>
  );
}