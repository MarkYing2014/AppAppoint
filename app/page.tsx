"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, Building, CheckCircle, XCircle, CalendarDays, UserSquare2, Map } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface EventStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
}

interface SalesRepPerformance {
  name: string;
  completedEvents: number;
  cancelledEvents: number;
}

export default function Home() {
  const [eventStats, setEventStats] = useState<EventStats>({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  });
  const [performanceData, setPerformanceData] = useState<SalesRepPerformance[]>([]);

  useEffect(() => {
    fetchEventStats();
    fetchSalesRepPerformance();
  }, []);

  const fetchEventStats = async () => {
    try {
      const response = await fetch('/api/events/stats');
      if (!response.ok) throw new Error('Failed to fetch event stats');
      const data = await response.json();
      setEventStats(data);
    } catch (error) {
      console.error('Error fetching event stats:', error);
    }
  };

  const fetchSalesRepPerformance = async () => {
    try {
      const response = await fetch('/api/sales-reps/performance');
      if (!response.ok) throw new Error('Failed to fetch sales rep performance');
      const data = await response.json();
      setPerformanceData(data);
    } catch (error) {
      console.error('Error fetching sales rep performance:', error);
    }
  };

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{eventStats.total}</div>
              <p className="text-xs text-blue-600">All scheduled events</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">{eventStats.scheduled}</div>
              <p className="text-xs text-yellow-600">Upcoming events</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{eventStats.completed}</div>
              <p className="text-xs text-green-600">Successfully completed</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{eventStats.cancelled}</div>
              <p className="text-xs text-red-600">Cancelled events</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/calendar">
            <Card className="hover:bg-accent transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calendar</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">View Schedule</div>
                <p className="text-xs text-muted-foreground">
                  Manage your appointments
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/clients">
            <Card className="hover:bg-accent transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">View Clients</div>
                <p className="text-xs text-muted-foreground">
                  Manage your client base
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/sales-reps">
            <Card className="hover:bg-accent transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales Representatives</CardTitle>
                <UserSquare2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">View Sales Reps</div>
                <p className="text-xs text-muted-foreground">
                  Manage your sales team
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/territories">
            <Card className="hover:bg-accent transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Territories</CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">View Territories</div>
                <p className="text-xs text-muted-foreground">
                  Manage your sales regions
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Performance Chart */}
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Sales Representative Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completedEvents" name="Completed Events" fill="#22c55e" />
                    <Bar dataKey="cancelledEvents" name="Cancelled Events" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}