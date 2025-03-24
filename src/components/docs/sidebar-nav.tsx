"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarNavItem } from "@/types/docs"
import { cn } from "@/lib/utils"

export interface DocsSidebarNavProps {
  items: SidebarNavItem[]
}

export function DocsSidebarNav({ items }: DocsSidebarNavProps) {
  const pathname = usePathname()

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className={cn("pb-4")}>
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
            {item.title}
          </h4>
          {item.items?.length && (
            <DocsSidebarNavItems items={item.items} pathname={pathname} />
          )}
        </div>
      ))}
    </div>
  )
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
}

export function DocsSidebarNavItems({
  items,
  pathname,
}: DocsSidebarNavItemsProps) {
  return (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) => {
        const isActive = item.href === pathname
        return (
          item.href && (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline",
                isActive
                  ? "font-medium text-foreground bg-muted"
                  : "text-muted-foreground"
              )}
              target={item.external ? "_blank" : ""}
              rel={item.external ? "noreferrer" : ""}
            >
              {item.title}
              {item.label && (
                <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                  {item.label}
                </span>
              )}
            </Link>
          )
        )
      })}
    </div>
  )
} 