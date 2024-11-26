"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Appointment {
  id: string;
  date: string;
  notes: string;
  status: string;
}

interface Client {
  id: string;
  name: string;
  appointments: Appointment[];
}

interface ViewHistoryDialogProps {
  client: Client;
}

export function ViewHistoryDialog({ client }: ViewHistoryDialogProps) {
  const [open, setOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View History</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Client History - {client.name}</DialogTitle>
          <DialogDescription>
            View all appointments and interactions with this client.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {client.appointments && client.appointments.length > 0 ? (
            <div className="space-y-4">
              {client.appointments.map((appointment) => (
                <div key={appointment.id} className="rounded-lg border p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{formatDate(appointment.date)}</p>
                      <p className="text-sm text-gray-500">Status: {appointment.status}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{appointment.notes}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No appointment history available.</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
