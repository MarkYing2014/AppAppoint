"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format, toISODateString } from 'date-fns';

interface Client {
  id: string;
  name: string;
  email: string;
}

interface SalesRep {
  id: string;
  name: string;
  email: string;
}

interface Event {
  id?: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  clientId: string;
  salesRepId: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface EventDialogProps {
  initialDate?: Date;
  event?: Event;
  trigger?: React.ReactNode;
  onEventSaved?: (event: Event) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  salesReps?: SalesRep[];
}

export function EventDialog({ initialDate, event, trigger, onEventSaved, open: controlledOpen, onOpenChange, salesReps: propSalesReps }: EventDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    title: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    clientId: '',
    salesRepId: '',
    notes: '',
    status: 'scheduled'
  });

  useEffect(() => {
    // Fetch clients and sales reps when dialog opens
    if (open) {
      fetchClients();
      if (!propSalesReps) {
        fetchSalesReps();
      } else {
        setSalesReps(propSalesReps);
      }
    }
  }, [open, propSalesReps]);

  useEffect(() => {
    // Initialize form data when event or initialDate changes
    if (event) {
      setFormData({
        title: event.title,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        clientId: event.clientId,
        salesRepId: event.salesRepId,
        notes: event.notes,
        status: event.status
      });
    } else if (initialDate) {
      setFormData(prev => ({
        ...prev,
        date: toISODateString(initialDate)
      }));
    }
  }, [event, initialDate]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    }
  };

  const fetchSalesReps = async () => {
    try {
      const response = await fetch('/api/sales-reps');
      if (!response.ok) throw new Error('Failed to fetch sales reps');
      const data = await response.json();
      setSalesReps(data);
    } catch (error) {
      console.error('Error fetching sales reps:', error);
      toast.error('Failed to load sales representatives');
    }
  };

  const handleChange = (field: keyof Event, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Keep the date as YYYY-MM-DD string, it will be converted to UTC in the API
      const formattedData = {
        ...(event?.id ? { id: event.id } : {}),
        ...formData,
      };
      
      console.log('Submitting form data:', formattedData);
      
      const response = await fetch(event ? `/api/events/${event.id}` : '/api/events', {
        method: event ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save event');
      }

      console.log('Event saved successfully:', responseData);
      toast.success(event ? 'Event updated successfully' : 'Event created successfully');
      onEventSaved?.(responseData);
      setOpen(false);
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (event) {
      setFormData({
        title: event.title,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        clientId: event.clientId,
        salesRepId: event.salesRepId,
        notes: event.notes,
        status: event.status
      });
    } else {
      setFormData({
        title: '',
        date: initialDate ? toISODateString(initialDate) : '',
        startTime: '09:00',
        endTime: '10:00',
        clientId: '',
        salesRepId: '',
        notes: '',
        status: 'scheduled'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create Event'}</DialogTitle>
          <DialogDescription>
            {event ? 'Edit the event details below.' : 'Fill in the details for your new event.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => handleChange('clientId', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salesRep">Sales Representative</Label>
            <Select
              value={formData.salesRepId}
              onValueChange={(value) => handleChange('salesRepId', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a sales representative" />
              </SelectTrigger>
              <SelectContent>
                {salesReps.map((rep) => (
                  <SelectItem key={rep.id} value={rep.id}>
                    {rep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'scheduled' | 'completed' | 'cancelled') => handleChange('status', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {event ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
