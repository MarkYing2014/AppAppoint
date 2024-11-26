"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

interface SalesRep {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [reminderTime, setReminderTime] = useState(24);
  const [workingHours, setWorkingHours] = useState({
    start: "09:00",
    end: "17:00",
  });

  // Sales Rep states
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [newSalesRep, setNewSalesRep] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editingSalesRep, setEditingSalesRep] = useState<SalesRep | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Settings states
  const [settings, setSettings] = useState({
    workingHoursStart: "09:00",
    workingHoursEnd: "17:00",
    defaultTerritory: "",
    notifyEmail: true,
    notifySms: false,
    notifyApp: true,
    reminderTime: 24
  });

  // Fetch sales reps and settings on component mount
  useEffect(() => {
    const initializePage = async () => {
      try {
        await Promise.all([
          fetchSalesReps(),
          loadSettings()
        ]);
      } catch (error) {
        console.error('Error initializing page:', error);
        toast.error('Failed to load page data');
      }
    };

    initializePage();
  }, []);

  const fetchSalesReps = async () => {
    try {
      const response = await fetch("/api/sales-reps");
      if (!response.ok) {
        throw new Error('Failed to fetch sales representatives');
      }
      const data = await response.json();
      setSalesReps(data);
    } catch (error) {
      console.error("Error fetching sales representatives:", error);
      toast.error("Failed to fetch sales representatives");
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success("Settings saved successfully");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    }
  };

  const handleAddSalesRep = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSalesRep.name || !newSalesRep.email || !newSalesRep.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("/api/sales-reps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSalesRep),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add sales representative");
      }

      toast.success("Sales representative added successfully");
      setNewSalesRep({ name: "", email: "", phone: "" });
      fetchSalesReps();
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error adding sales rep:", error);
    }
  };

  const handleEditSalesRep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSalesRep) return;

    try {
      const response = await fetch(`/api/sales-reps/${editingSalesRep.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingSalesRep),
      });

      if (!response.ok) {
        throw new Error("Failed to update sales representative");
      }

      const updatedSalesRep = await response.json();
      setSalesReps(salesReps.map(rep => 
        rep.id === updatedSalesRep.id ? updatedSalesRep : rep
      ));
      setIsEditDialogOpen(false);
      setEditingSalesRep(null);
      toast.success("Sales representative updated successfully");
    } catch (error) {
      toast.error("Failed to update sales representative");
    }
  };

  const handleDeleteSalesRep = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sales representative?")) {
      return;
    }

    try {
      const response = await fetch(`/api/sales-reps/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete sales representative");
      }

      setSalesReps(salesReps.filter(rep => rep.id !== id));
      toast.success("Sales representative deleted successfully");
    } catch (error) {
      toast.error("Failed to delete sales representative");
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="grid gap-6">
          {/* Sales Representatives Section */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Representatives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleAddSalesRep} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newSalesRep.name}
                      onChange={(e) =>
                        setNewSalesRep({ ...newSalesRep, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newSalesRep.email}
                      onChange={(e) =>
                        setNewSalesRep({ ...newSalesRep, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newSalesRep.phone}
                      onChange={(e) =>
                        setNewSalesRep({ ...newSalesRep, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <Button type="submit">Add Sales Representative</Button>
              </form>

              <Separator />

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesReps.map((rep) => (
                      <TableRow key={rep.id}>
                        <TableCell>{rep.name}</TableCell>
                        <TableCell>{rep.email}</TableCell>
                        <TableCell>{rep.phone}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingSalesRep(rep);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSalesRep(rep.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Edit Sales Rep Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Sales Representative</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSalesRep} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      value={editingSalesRep?.name}
                      onChange={(e) =>
                        setEditingSalesRep(prev => 
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingSalesRep?.email}
                      onChange={(e) =>
                        setEditingSalesRep(prev => 
                          prev ? { ...prev, email: e.target.value } : null
                        )
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={editingSalesRep?.phone}
                      onChange={(e) =>
                        setEditingSalesRep(prev => 
                          prev ? { ...prev, phone: e.target.value } : null
                        )
                      }
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Notification Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Working Hours</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={settings.workingHoursStart}
                      onChange={(e) =>
                        setSettings({ ...settings, workingHoursStart: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={settings.workingHoursEnd}
                      onChange={(e) =>
                        setSettings({ ...settings, workingHoursEnd: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Default Territory</Label>
                <Input
                  type="text"
                  value={settings.defaultTerritory}
                  onChange={(e) => setSettings({...settings, defaultTerritory: e.target.value})}
                  placeholder="Enter default territory"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Reminder Time</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={settings.reminderTime}
                    onChange={(e) => setSettings({...settings, reminderTime: Number(e.target.value)})}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">hours before appointment</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Notification Preferences</Label>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email-notifications"
                      checked={settings.notifyEmail}
                      onCheckedChange={(checked) => setSettings({...settings, notifyEmail: checked})}
                    />
                    <Label htmlFor="email-notifications">Email</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sms-notifications"
                      checked={settings.notifySms}
                      onCheckedChange={(checked) => setSettings({...settings, notifySms: checked})}
                    />
                    <Label htmlFor="sms-notifications">SMS</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="app-notifications"
                      checked={settings.notifyApp}
                      onCheckedChange={(checked) => setSettings({...settings, notifyApp: checked})}
                    />
                    <Label htmlFor="app-notifications">App</Label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input type="tel" placeholder="+1 234 567 890" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}