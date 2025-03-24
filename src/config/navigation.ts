import { 
  BarChart, 
  Users, 
  GraduationCap, 
  FileText, 
  Medal, 
  Plus,
  List,
  PlusCircle,
  ClipboardList,
  BookOpen,
  CheckCircle,
  School
} from "lucide-react"
import type { NavItem } from "@/types/sidebar"

export const navigationConfig: Record<string, NavItem[]> = {
  ADMIN: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart,
    },
    {
      title: "Utilisateurs",
      url: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Classes",
      icon: GraduationCap,
      items: [
        {
          title: "Toutes les classes",
          icon: School,
          url: "/dashboard/classes",
        },
        {
          title: "Créer une classe",
          icon: PlusCircle,
          url: "/dashboard/my-classes/create",
        },
      ],
    },
  ],
  PROFESSOR: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart,
    },
    {
      title: "Mes Classes",
      icon: GraduationCap,
      items: [
        {
          title: "Liste des classes",
          icon: School,
          url: "/dashboard/my-classes",
        },
      ],
    },
    {
      title: "Mes Examens",
      icon: FileText,
      items: [
        {
          title: "Liste des examens",
          icon: ClipboardList,
          url: "/dashboard/exams",
        },
        {
          title: "Créer un examen",
          icon: PlusCircle,
          url: "/dashboard/exams/create",
        },
      ],
    },
  ],
  STUDENT: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart,
    },
    {
      title: "Mes Examens",
      url: "/dashboard/my-exams",
      icon: BookOpen,
    },
    {
      title: "Résultats",
      url: "/dashboard/results",
      icon: Medal,
    },
  ],
}