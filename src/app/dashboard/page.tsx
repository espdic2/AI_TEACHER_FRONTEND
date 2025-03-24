"use client"

import { useAppSelector } from "@/store/hooks"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { ProfessorDashboard } from "@/components/dashboards/professor-dashboard"
import { StudentDashboard } from "@/components/dashboards/student-dashboard"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth)
  const role = user?.role || 'STUDENT'

  const DashboardComponent = {
    ADMIN: AdminDashboard,
    PROFESSOR: ProfessorDashboard,
    STUDENT: StudentDashboard,
  }[role] || StudentDashboard

  return (
    <>
      <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Overview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <DashboardComponent />
      </div>
    </>
  )
}
