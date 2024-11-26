import { SalesRep, Territory, Client, Appointment } from '@/types/app';

export const testSalesReps: SalesRep[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    phone: "+1234567890",
    territory: "north",
    availability: "available",
    workingHours: { start: "09:00", end: "17:00" },
    notificationPreferences: { email: true, sms: true, app: true }
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+1234567891",
    territory: "south",
    availability: "busy",
    workingHours: { start: "08:00", end: "16:00" },
    notificationPreferences: { email: true, sms: false, app: true }
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1234567892",
    territory: "east",
    availability: "tentative",
    workingHours: { start: "10:00", end: "18:00" },
    notificationPreferences: { email: true, sms: true, app: false }
  }
];

export const testTerritories: Territory[] = [
  { id: "north", name: "North Region", description: "Northern territories" },
  { id: "south", name: "South Region", description: "Southern territories" },
  { id: "east", name: "East Region", description: "Eastern territories" },
  { id: "west", name: "West Region", description: "Western territories" }
];

export const testClients: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1234567893",
    notes: "Prefers morning appointments"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    phone: "+1234567894",
    notes: "Requires detailed follow-ups"
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma@example.com",
    phone: "+1234567895",
    notes: "Virtual meetings only"
  }
];

export const testAppointments: Appointment[] = [
  {
    id: "1",
    title: "Initial Consultation",
    startTime: new Date("2024-03-21T14:30:00"),
    endTime: new Date("2024-03-21T15:30:00"),
    location: "Main Office",
    description: "First meeting to discuss requirements",
    clientId: "1",
    salesRepId: "1"
  },
  {
    id: "2",
    title: "Follow-up Meeting",
    startTime: new Date("2024-03-21T16:00:00"),
    endTime: new Date("2024-03-21T16:30:00"),
    location: "Virtual",
    description: "Review progress and next steps",
    clientId: "2",
    salesRepId: "2"
  },
  {
    id: "3",
    title: "Quarterly Review",
    startTime: new Date("2024-03-22T10:00:00"),
    endTime: new Date("2024-03-22T11:00:00"),
    location: "Conference Room A",
    description: "Regular quarterly check-in",
    clientId: "3",
    salesRepId: "3"
  }
];