export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  label?: string
}

export interface SidebarNavItem extends NavItem {
  items?: NavItem[]
} 