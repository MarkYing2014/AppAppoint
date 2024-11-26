// Since we're not using Prisma, we'll implement a simple data store
import { SalesRep, Territory } from '@/types/sales-rep';

class DataStore {
  private salesReps: SalesRep[] = [];
  private territories: Territory[] = [];

  // Sales Reps
  getSalesReps() {
    return this.salesReps;
  }

  addSalesRep(rep: SalesRep) {
    this.salesReps.push(rep);
    return rep;
  }

  updateSalesRep(id: string, data: Partial<SalesRep>) {
    const index = this.salesReps.findIndex(rep => rep.id === id);
    if (index !== -1) {
      this.salesReps[index] = { ...this.salesReps[index], ...data };
      return this.salesReps[index];
    }
    return null;
  }

  deleteSalesRep(id: string) {
    const index = this.salesReps.findIndex(rep => rep.id === id);
    if (index !== -1) {
      this.salesReps.splice(index, 1);
      return true;
    }
    return false;
  }

  // Territories
  getTerritories() {
    return this.territories;
  }

  addTerritory(territory: Territory) {
    this.territories.push(territory);
    return territory;
  }
}

export const db = new DataStore();