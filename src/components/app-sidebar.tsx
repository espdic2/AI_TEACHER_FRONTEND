"use client"
import React from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { ChevronDown, LogOut, User, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { navigationConfig } from "@/config/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { logout } from "@/store/features/auth/authSlice"
import { Logo } from "@/components/ui/logo"

interface AppSidebarProps {
  role: "ADMIN" | "PROFESSOR" | "STUDENT"
}

export function AppSidebar({ role = "STUDENT" }: AppSidebarProps) {
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { isMobile } = useSidebar()
  
  // Get navigation items based on user role
  const navItems = user?.role ? navigationConfig[user.role] || [] : []

  const isActiveLink = (url: string) => {
    // Exact match for dashboard to prevent it from matching all paths
    if (url === '/dashboard') {
      return pathname === '/dashboard'
    }
    // For other routes, check if the current path starts with the URL
    return pathname === url;
  }

  const handleNavigation = (url: string) => {
    router.push(url)
  }

  const handleLogout = () => {
    dispatch(logout())
    router.push('/auth/login')
  }

  // Get user initials for avatar fallback
  const getInitials = (name: string = "User") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex flex-col">
            <Logo showText={true} size="sm" />
            <span className="text-xs text-muted-foreground">{role.charAt(0) + role.slice(1).toLowerCase()}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navItems.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items ? (
                  // Si l'item a des sous-éléments
                  item.items.map((subItem) => (
                    <SidebarMenuItem key={subItem.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActiveLink(subItem.url || '')}
                      >
                        <div 
                          onClick={() => handleNavigation(subItem.url || '')}
                          className="flex items-center font-medium"
                        >
                          {subItem.icon && <subItem.icon className="mr-2 size-4" />}
                          {subItem.title}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  // Si l'item n'a pas de sous-éléments
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActiveLink(item.url || '')}
                    >
                      <div 
                        onClick={() => handleNavigation(item.url || '')}
                        className="flex items-center font-medium"
                      >
                        {item.icon && <item.icon className="mr-2 size-4" />}
                        {item.title}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-pointer group">
                <Avatar className="h-8 w-8 border-2 border-transparent group-hover:border-primary transition-colors">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col text-left">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-current transition-colors" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-[200px] p-2 rounded-md border bg-popover text-popover-foreground shadow-md"
            >
              <DropdownMenuLabel className="font-semibold px-2 py-1.5">
                Mon compte
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 -mx-2" />
              <DropdownMenuItem 
                onClick={() => router.push('/dashboard/profile')}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
