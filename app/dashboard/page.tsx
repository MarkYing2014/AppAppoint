"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesRepStats } from "@/components/dashboard/sales-rep-stats";
import { SalesRepManagement } from "@/components/dashboard/sales-rep-management";
import { EventStats } from "@/components/dashboard/event-stats";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales-reps">Sales Representatives</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <EventStats />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <SalesRepStats />
            </div>
          </TabsContent>

          <TabsContent value="sales-reps">
            <SalesRepManagement />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
