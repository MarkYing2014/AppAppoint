"use client";

import { Sidebar, MobileSidebar } from "@/components/sidebar";

export function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden border-r bg-background md:block md:w-64">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <div className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
        <MobileSidebar />
        <h1 className="font-semibold">Appointment System</h1>
      </div>

      {/* Main content */}
      <main className="flex-1">
        <div className="container mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}