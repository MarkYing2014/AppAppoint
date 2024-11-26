"use client";

import { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, addHours } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EventDialog } from "@/components/calendar/event-dialog";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { WeekView } from "@/components/calendar/week-view";
import { MonthView } from "@/components/calendar/month-view";
import { RepSelector } from "@/components/sales/rep-selector";
import { SalesRep } from "@/types/sales-rep";
import { MainLayout } from "@/components/layout/main-layout";
import { CalendarViewSelector } from "@/components/calendar/view-selector";
import { EventDetailDialog } from "@/components/calendar/event-detail-dialog";

interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  clientId: string;
  salesRepId: string;
  client: {
    name: string;
  };
  salesRep: {
    name: string;
    territory?: {
      name: string;
    };
  };
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<"week" | "month">("week");
  const [selectedReps, setSelectedReps] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventDetailOpen, setEventDetailOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Log all events and their dates for debugging
      console.log('All events:', data.map(event => ({
        title: event.title,
        date: event.date,
        formattedDate: format(new Date(event.date), 'yyyy-MM-dd'),
        status: event.status
      })));
      
      // Calculate week range for debugging
      const weekStart = format(startOfWeek(date), 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(date), 'yyyy-MM-dd');
      console.log('Current week range:', { weekStart, weekEnd });
      
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesReps = async () => {
    try {
      const response = await fetch('/api/sales-reps');
      if (!response.ok) {
        throw new Error(`Failed to fetch sales reps: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      console.log('Fetched sales reps from database:', data);
      setSalesReps(data);
    } catch (error) {
      console.error('Error fetching sales reps:', error);
      toast.error('Failed to load sales representatives. Please try again.');
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchSalesReps();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [date]);

  const navigateToToday = () => {
    const today = new Date();
    console.log('Navigating to today:', today);
    setDate(today);
  };
  
  const navigatePrevious = () => {
    const newDate = new Date(date);
    if (view === "week") {
      newDate.setDate(date.getDate() - 7);
    } else {
      newDate.setMonth(date.getMonth() - 1);
    }
    console.log('Navigating to previous:', format(newDate, 'yyyy-MM-dd'));
    setDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(date);
    if (view === "week") {
      newDate.setDate(date.getDate() + 7);
    } else {
      newDate.setMonth(date.getMonth() + 1);
    }
    console.log('Navigating to next:', format(newDate, 'yyyy-MM-dd'));
    setDate(newDate);
  };

  const navigateToDate = (targetDate: Date) => {
    console.log('Navigating to date:', format(targetDate, 'yyyy-MM-dd'));
    setDate(targetDate);
  };

  // Find the earliest and latest events for date picker range
  const earliestEvent = events.length > 0 
    ? new Date(events.reduce((earliest, event) => 
        event.date < earliest.date ? event : earliest
      ).date)
    : startOfMonth(date);
  
  const latestEvent = events.length > 0
    ? new Date(events.reduce((latest, event) => 
        event.date > latest.date ? event : latest
      ).date)
    : endOfMonth(date);

  const days = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day.getDate() &&
             eventDate.getMonth() === day.getMonth() &&
             eventDate.getFullYear() === day.getFullYear() &&
             (selectedReps.length === 0 || selectedReps.includes(event.salesRepId));
    });
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    console.log('Time slot clicked:', { date, time });
    setSelectedEvent(null);
    setEventDialogOpen(true);
    // Pre-fill the event with the selected date and time
    setSelectedEvent({
      id: '',
      title: '',
      date: format(date, 'yyyy-MM-dd'),
      startTime: time,
      endTime: format(addHours(new Date(`${format(date, 'yyyy-MM-dd')}T${time}`), 1), 'HH:mm'),
      clientId: '',
      salesRepId: selectedReps[0] || '',
      client: { name: '' },
      salesRep: { name: '' },
      notes: '',
      status: 'scheduled'
    });
  };

  return (
    <MainLayout>
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={navigateToToday}>
              Today
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={navigatePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="min-w-[240px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, view === "week" ? "'Week of' MMM d, yyyy" : "MMMM yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && navigateToDate(date)}
                    fromDate={earliestEvent}
                    toDate={latestEvent}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="icon" onClick={navigateNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <RepSelector
                salesReps={salesReps}
                selectedReps={selectedReps}
                onSelectionChange={setSelectedReps}
              />
            </div>
            <CalendarViewSelector view={view} onViewChange={setView} />
            <Button onClick={() => setEventDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Event
            </Button>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Main Calendar Area */}
          <div className="flex-1 overflow-auto">
            {view === "week" ? (
              <WeekView
                date={date}
                selectedReps={selectedReps}
                salesReps={salesReps}
                events={events}
                onEventClick={(event) => {
                  setSelectedEvent(event);
                  setEventDetailOpen(true);
                }}
                onTimeSlotClick={handleTimeSlotClick}
              />
            ) : (
              <MonthView
                date={date}
                selectedReps={selectedReps}
                salesReps={salesReps}
                events={events}
                onEventClick={(event) => {
                  setSelectedEvent(event);
                  setEventDetailOpen(true);
                }}
                onTimeSlotClick={handleTimeSlotClick}
              />
            )}
          </div>

          {/* Dashboard */}
          <div className="w-80 border-l p-4 space-y-4 overflow-auto">
            {/* Statistics */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Events</span>
                  <span className="font-medium">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Scheduled</span>
                  <span className="font-medium">{events.filter(e => e.status === 'scheduled').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="font-medium">{events.filter(e => e.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cancelled</span>
                  <span className="font-medium">{events.filter(e => e.status === 'cancelled').length}</span>
                </div>
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Upcoming Events</h3>
              <div className="space-y-3">
                {events
                  .filter(event => {
                    const eventDate = new Date(event.date);
                    const today = new Date();
                    return eventDate >= today && event.status === 'scheduled';
                  })
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map(event => (
                    <div
                      key={event.id}
                      className="flex flex-col space-y-1 p-2 hover:bg-accent rounded-md cursor-pointer"
                      onClick={() => {
                        setSelectedEvent(event);
                        setEventDetailOpen(true);
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(event.date), 'MMM d')} • {event.startTime}
                      </div>
                      {event.client?.name && (
                        <div className="text-sm text-muted-foreground">{event.client.name}</div>
                      )}
                      {event.salesRep?.name && (
                        <div className="text-sm text-muted-foreground">{event.salesRep.name}</div>
                      )}
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>

        <EventDetailDialog
          event={selectedEvent}
          isOpen={eventDetailOpen}
          onClose={() => {
            setEventDetailOpen(false);
            setSelectedEvent(null);
          }}
          onEdit={(event) => {
            console.log("Editing event:", event);
            setSelectedEvent(event);
            setEventDetailOpen(false);
            setEventDialogOpen(true);
          }}
        />

        {eventDialogOpen && (
          <EventDialog
            event={selectedEvent}
            open={eventDialogOpen}
            onOpenChange={(open) => {
              console.log("Dialog open state changing to:", open);
              setEventDialogOpen(open);
              if (!open) {
                setSelectedEvent(null);
              }
            }}
            onEventSaved={() => {
              setEventDialogOpen(false);
              setSelectedEvent(null);
              fetchEvents();
            }}
            salesReps={salesReps}
          />
        )}
      </div>
    </MainLayout>
  );
}