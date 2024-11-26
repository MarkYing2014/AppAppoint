"use client";

import { TerritoryManagement } from "@/components/dashboard/territory-management";
import { MainLayout } from "@/components/layout/main-layout";

export default function TerritoriesPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Territories</h1>
        <TerritoryManagement />
      </div>
    </MainLayout>
  );
}
