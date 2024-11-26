"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesRepStats } from "@/components/dashboard/sales-rep-stats";
import { SalesRepManagement } from "@/components/dashboard/sales-rep-management";

export default function SalesRepsPage() {
  const [activeTab, setActiveTab] = useState("management");

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Sales Representatives</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="management">
            <SalesRepManagement />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <SalesRepStats />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
