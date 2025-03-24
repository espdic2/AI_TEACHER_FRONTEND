"use client"
import { AuthGuard } from '@/components/auth-guard';
import { ClientOnly } from '@/components/client-only';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { useAppSelector } from '@/store/hooks';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { user } = useAppSelector((state) => state.auth)
  
  return (
    <ClientOnly>
      <AuthGuard>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "350px",
            } as React.CSSProperties
          }
        >
          <div className="flex min-h-screen w-full">
            {/*<RoleBasedSidebar />*/}
            <SidebarProvider>
              <AppSidebar role={user?.role}/>
              <SidebarInset>
                <main className="flex-1">{children}</main>
              </SidebarInset>
            </SidebarProvider>          
          </div>
        </SidebarProvider>
      </AuthGuard>
    </ClientOnly>
  );
} 