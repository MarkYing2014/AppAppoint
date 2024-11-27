"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, FileText, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
  clientId: string;
  salesRepId: string;
  client?: {
    id: string;
    name: string;
  };
  salesRep?: {
    id: string;
    name: string;
  };
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface EventDetailDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
}

export function EventDetailDialog({ event, isOpen, onClose, onEdit }: EventDetailDialogProps) {
  if (!event) return null;

  const getStatusBadgeVariant = (status?: string) => {
    if (!status) return 'default';
    
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const formatStatus = (status?: string) => {
    if (!status) return 'Scheduled';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDisplayDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDisplayTime = (time: string) => {
    return new Date(`1970-01-01T${time}Z`).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{event.title}</span>
            <Badge variant={getStatusBadgeVariant(event?.status)}>
              {formatStatus(event?.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">
                {formatDisplayDate(event.date)}
              </p>
              <p className="text-sm text-muted-foreground">Date</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">
                {formatDisplayTime(event.startTime)} - {formatDisplayTime(event.endTime)}
              </p>
              <p className="text-sm text-muted-foreground">Time</p>
            </div>
          </div>

          {event.client && (
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{event.client.name}</p>
                <p className="text-sm text-muted-foreground">Client</p>
              </div>
            </div>
          )}

          {event.salesRep && (
            <div className="flex items-start gap-3">
              <UserCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{event.salesRep.name}</p>
                <p className="text-sm text-muted-foreground">Sales Representative</p>
              </div>
            </div>
          )}

          {event.notes && (
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Notes</p>
                <p className="text-sm text-muted-foreground">{event.notes}</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              if (event) {
                onEdit(event);
              }
            }}
          >
            Edit Event
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}