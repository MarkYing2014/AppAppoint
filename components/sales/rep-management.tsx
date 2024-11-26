"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SalesRep, Territory } from "@/types/sales-rep";
import { Plus, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface RepManagementProps {
  territories: Territory[];
}

export function RepManagement({ territories }: RepManagementProps) {
  const [reps, setReps] = useState<SalesRep[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 234 567 890",
      territory: "North",
      availability: "available",
      workingHours: {
        start: "09:00",
        end: "17:00"
      },
      notificationPreferences: {
        email: true,
        sms: true,
        app: true
      }
    }
  ]);

  const [editingRep, setEditingRep] = useState<SalesRep | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newRep: SalesRep = {
      id: editingRep?.id || Date.now().toString(),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      territory: formData.get("territory") as string,
      availability: "available",
      workingHours: {
        start: formData.get("workStart") as string,
        end: formData.get("workEnd") as string
      },
      notificationPreferences: {
        email: formData.get("notifyEmail") === "on",
        sms: formData.get("notifySms") === "on",
        app: formData.get("notifyApp") === "on"
      }
    };

    if (editingRep) {
      setReps(reps.map(rep => rep.id === editingRep.id ? newRep : rep));
    } else {
      setReps([...reps, newRep]);
    }

    setIsDialogOpen(false);
    setEditingRep(null);
  };

  const deleteRep = (id: string) => {
    setReps(reps.filter(rep => rep.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Sales Representatives</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Sales Rep
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingRep ? "Edit Sales Representative" : "Add Sales Representative"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingRep?.name}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={editingRep?.email}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={editingRep?.phone}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="territory">Territory</Label>
                <select
                  id="territory"
                  name="territory"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={editingRep?.territory}
                  required
                >
                  {territories.map(territory => (
                    <option key={territory.id} value={territory.id}>
                      {territory.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workStart">Work Start Time</Label>
                  <Input
                    id="workStart"
                    name="workStart"
                    type="time"
                    defaultValue={editingRep?.workingHours.start}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workEnd">Work End Time</Label>
                  <Input
                    id="workEnd"
                    name="workEnd"
                    type="time"
                    defaultValue={editingRep?.workingHours.end}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Notification Preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifyEmail">Email Notifications</Label>
                    <Switch
                      id="notifyEmail"
                      name="notifyEmail"
                      defaultChecked={editingRep?.notificationPreferences.email}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifySms">SMS Notifications</Label>
                    <Switch
                      id="notifySms"
                      name="notifySms"
                      defaultChecked={editingRep?.notificationPreferences.sms}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifyApp">App Notifications</Label>
                    <Switch
                      id="notifyApp"
                      name="notifyApp"
                      defaultChecked={editingRep?.notificationPreferences.app}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  setEditingRep(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRep ? "Save Changes" : "Add Sales Rep"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {reps.map(rep => (
          <Card key={rep.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{rep.name}</h3>
                  <p className="text-sm text-muted-foreground">{rep.territory}</p>
                  <div className="mt-1 space-y-1 text-sm">
                    <p>{rep.email}</p>
                    <p>{rep.phone}</p>
                    <p>Working hours: {rep.workingHours.start} - {rep.workingHours.end}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingRep(rep);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteRep(rep.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}