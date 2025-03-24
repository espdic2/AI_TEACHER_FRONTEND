import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string
  url?: string
  icon?: LucideIcon
  items?: NavItem[]
  isActive?: boolean
}


export interface SidebarItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  status?: string;
  date?: string;
  classId?: string;
}

export interface NavItemContent {
  items: NavItem[];
} 