"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SalesRepPerformance {
  id: string;
  name: string;
  totalEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  completionRate: number;
}

export function SalesRepStats() {
  const [performanceData, setPerformanceData] = useState<SalesRepPerformance[]>([]);

  useEffect(() => {
    fetchSalesRepPerformance();
  }, []);

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
    <>
      <Card className="col-span-2">
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

      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData
              .sort((a, b) => b.completionRate - a.completionRate)
              .slice(0, 5)
              .map((rep) => (
                <div key={rep.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{rep.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {rep.completedEvents} completed / {rep.totalEvents} total
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{(rep.completionRate * 100).toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Completion rate</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
