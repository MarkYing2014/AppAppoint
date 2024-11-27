"use client";

import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, addHours, startOfDay } from "date-fns";
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

interface WeekViewProps {
  date: Date;
  selectedReps: string[];
  salesReps: SalesRep[];
  events: Event[];
  onEventClick?: (event: Event) => void;
  onTimeSlotClick?: (date: Date, time: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function WeekView({ date, selectedReps, salesReps, events, onEventClick, onTimeSlotClick }: WeekViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventDetailOpen, setEventDetailOpen] = useState(false);
  
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Filter events for selected reps and current week
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const currentDate = new Date();
    const isInWeek = days.some(day => isSameDay(eventDate, day));
    const isSelectedRep = selectedReps.length === 0 || selectedReps.includes(event.salesRepId);
    
    console.log('Week view event filtering:', {
      event: event.title,
      eventDate: format(eventDate, 'yyyy-MM-dd'),
      currentDate: format(currentDate, 'yyyy-MM-dd'),
      isInWeek,
      isSelectedRep,
      eventSalesRepId: event.salesRepId,
      selectedReps,
      salesReps: salesReps.map(rep => ({ id: rep.id, name: rep.name }))
    });
    
    return isInWeek && isSelectedRep;
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setEventDetailOpen(true);
    onEventClick?.(event);
  };

  return (
    <div className="flex h-full">
      {/* Time labels */}
      <div className="w-16 flex-none border-r bg-background">
        <div className="sticky top-0 z-30 h-10 border-b bg-background" />
        <div>
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="relative h-12 text-right pr-2 text-sm text-muted-foreground"
            >
              {format(new Date().setHours(hour), "ha")}
            </div>
          ))}
        </div>
      </div>

      {/* Days */}
      <div className="flex flex-1">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn("flex-1 border-r", {
              "bg-muted/50": isSameDay(day, new Date()),
            })}
          >
            {/* Day header */}
            <div className="sticky top-0 z-30 bg-background">
              <div className="h-10 border-b px-2 py-1">
                <div className="text-sm font-medium">{format(day, "EEE")}</div>
                <div className="text-sm text-muted-foreground">
                  {format(day, "d")}
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="relative min-h-[1152px]">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="h-12 border-b hover:bg-accent/50 cursor-pointer group relative"
                  onClick={() => onTimeSlotClick?.(day, `${hour.toString().padStart(2, '0')}:00`)}
                >
                  <div className="absolute top-0 right-1 opacity-0 group-hover:opacity-100 text-muted-foreground">
                    +
                  </div>
                </div>
              ))}

              {/* Events */}
              {filteredEvents
                .filter(event => {
                  const eventDate = new Date(event.date);
                  const currentDate = day;
                  const matches = isSameDay(eventDate, currentDate);
                  console.log('Event date comparison:', {
                    event: event.title,
                    eventDate: format(eventDate, 'yyyy-MM-dd'),
                    currentDate: format(currentDate, 'yyyy-MM-dd'),
                    matches
                  });
                  return matches;
                })
                .sort((a, b) => {
                  if (a.startTime !== b.startTime) {
                    return a.startTime.localeCompare(b.startTime);
                  }
                  return (a.client?.name || '').localeCompare(b.client?.name || '');
                })
                .map((event, index, sameTimeEvents) => {
                  const [startHour, startMinute] = event.startTime.split(':').map(Number);
                  const [endHour, endMinute] = event.endTime.split(':').map(Number);
                  
                  const overlappingEvents = sameTimeEvents.filter(e => {
                    const [eStartHour, eStartMinute] = e.startTime.split(':').map(Number);
                    const [eEndHour, eEndMinute] = e.endTime.split(':').map(Number);
                    const eventStart = eStartHour * 60 + eStartMinute;
                    const eventEnd = eEndHour * 60 + eEndMinute;
                    const thisStart = startHour * 60 + startMinute;
                    const thisEnd = endHour * 60 + endMinute;
                    return (eventStart < thisEnd && eventEnd > thisStart);
                  });
                  
                  const position = overlappingEvents.findIndex(e => e.id === event.id);
                  const width = `${90 / overlappingEvents.length}%`;
                  const left = `${(90 / overlappingEvents.length) * position}%`;
                  
                  const top = (startHour * 48) + (startMinute / 60 * 48);
                  const duration = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;
                  const height = Math.max(duration * 48, 20); // Minimum height of 20px
                  
                  console.log('Event positioning:', {
                    event: event.title,
                    startTime: event.startTime,
                    endTime: event.endTime,
                    top,
                    height,
                    width,
                    left,
                    overlappingCount: overlappingEvents.length,
                    position
                  });

                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "absolute rounded-lg p-1.5 text-xs cursor-pointer overflow-hidden",
                        {
                          'bg-green-100 text-green-700': event.status === 'completed',
                          'bg-red-100 text-red-700': event.status === 'cancelled',
                          'bg-blue-100 text-blue-700': event.status === 'scheduled'
                        }
                      )}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        width,
                        left,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-xs truncate">
                        {event.startTime} - {event.endTime}
                      </div>
                      {event.client?.name && (
                        <div className="text-xs truncate mt-0.5 opacity-75">
                          {event.client.name}
                        </div>
                      )}
                      <div className="text-xs truncate mt-0.5 opacity-75">
                        {salesReps.find(rep => rep.id === event.salesRepId)?.name || 'Unknown Rep'}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <EventDetailDialog
        event={selectedEvent}
        isOpen={eventDetailOpen}
        onClose={() => {
          setEventDetailOpen(false);
          setSelectedEvent(null);
        }}
        onEdit={(event) => {
          onEventClick?.(event);
          setEventDetailOpen(false);
        }}
      />
    </div>
  );
}