"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, MapPin, FileText } from "lucide-react";

interface AppointmentDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    clientName: string;
    date: string;
    time: string;
    duration: string;
    location: string;
    notes: string;
  };
}

export function AppointmentDetails({ isOpen, onClose, appointment }: AppointmentDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{appointment.clientName}</p>
              <p className="text-sm text-muted-foreground">Client</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{appointment.date}</p>
              <p className="text-sm text-muted-foreground">Date</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{appointment.time}</p>
              <p className="text-sm text-muted-foreground">Duration: {appointment.duration}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{appointment.location}</p>
              <p className="text-sm text-muted-foreground">Location</p>
            </div>
          </div>

          {appointment.notes && (
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Notes</p>
                <p className="text-sm text-muted-foreground">{appointment.notes}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button>Edit Appointment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}