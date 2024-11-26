"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { SalesRep } from "@/types/sales-rep";
import { useAppointments } from "@/hooks/use-appointments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salesReps?: SalesRep[];
  selectedDate?: Date;
  selectedTime?: string;
}

export function NewEventDialog({ 
  open, 
  onOpenChange, 
  selectedDate = new Date(),
  selectedTime,
  salesReps = []
}: NewEventDialogProps) {
  const { createAppointment, loading } = useAppointments();
  const [formData, setFormData] = useState({
    title: "",
    startTime: selectedTime && selectedDate 
      ? new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`) 
      : selectedDate,
    endTime: selectedTime && selectedDate
      ? new Date(new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`).getTime() + 60 * 60 * 1000)
      : new Date(selectedDate.getTime() + 60 * 60 * 1000),
    location: "",
    description: "",
    salesRepId: "",
    clientId: "1" // For demo purposes
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAppointment(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create appointment:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={selectedTime || format(formData.startTime, "HH:mm")}
              onChange={(e) => {
                const newTime = e.target.value;
                const [hours, minutes] = newTime.split(":");
                const newStartTime = new Date(formData.startTime);
                newStartTime.setHours(parseInt(hours), parseInt(minutes));
                const newEndTime = new Date(newStartTime.getTime() + 60 * 60 * 1000);
                setFormData({
                  ...formData,
                  startTime: newStartTime,
                  endTime: newEndTime,
                });
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salesRep">Sales Representative</Label>
            <Select
              value={formData.salesRepId}
              onValueChange={(value) => setFormData({ ...formData, salesRepId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a sales rep" />
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}