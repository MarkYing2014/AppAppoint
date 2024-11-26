import { create } from 'zustand';
import { SalesRep, Territory, Client, Appointment } from '@/types/app';
import { testSalesReps, testTerritories, testClients, testAppointments } from './test-data';

interface AppState {
  salesReps: SalesRep[];
  territories: Territory[];
  clients: Client[];
  appointments: Appointment[];
  
  // Sales Reps
  addSalesRep: (rep: SalesRep) => void;
  updateSalesRep: (id: string, data: Partial<SalesRep>) => void;
  deleteSalesRep: (id: string) => void;
  
  // Territories
  addTerritory: (territory: Territory) => void;
  
  // Clients
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Appointments
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state with test data
  salesReps: testSalesReps,
  territories: testTerritories,
  clients: testClients,
  appointments: testAppointments,

  // Sales Reps actions
  addSalesRep: (rep) =>
    set((state) => ({ salesReps: [...state.salesReps, rep] })),
  updateSalesRep: (id, data) =>
    set((state) => ({
      salesReps: state.salesReps.map((rep) =>
        rep.id === id ? { ...rep, ...data } : rep
      ),
    })),
  deleteSalesRep: (id) =>
    set((state) => ({
      salesReps: state.salesReps.filter((rep) => rep.id !== id),
    })),

  // Territories actions
  addTerritory: (territory) =>
    set((state) => ({ territories: [...state.territories, territory] })),

  // Clients actions
  addClient: (client) =>
    set((state) => ({ clients: [...state.clients, client] })),
  updateClient: (id, data) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...data } : client
      ),
    })),
  deleteClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    })),

  // Appointments actions
  addAppointment: (appointment) =>
    set((state) => ({ appointments: [...state.appointments, appointment] })),
  updateAppointment: (id, data) =>
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, ...data } : appointment
      ),
    })),
  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((appointment) => appointment.id !== id),
    })),
}));