"use client"

import { Metadata } from "next"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { DocsSidebarNav } from "@/components/docs/sidebar-nav"
import { docsConfig } from "@/config/docs"
import { Logo } from "@/components/ui/logo"
import { Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const metadata: Metadata = {
  title: "Documentation | ClassMatrix",
  description: "Documentation complète pour notre plateforme éducative",
}

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 md:hidden block w-full border-b bg-background">
        <div className="container flex h-14 items-center">
          <div className="md:hidden mr-2">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Ouvrir le menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] p-0">
                <div className="h-full py-6 pr-6 pl-6">
                  <div className="flex justify-center items-center mb-8">
                    <Logo size="lg" />
                  </div>
                  <DocsSidebarNav items={docsConfig.sidebarNav} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center">
            <Logo size="sm" />
            <span className="ml-2 font-medium">Documentation</span>
          </div>
        </div>
      </header>
      <div className="container flex-1 w-full items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8 pl-6">
            <div className="flex justify-center items-center mb-8">
              <Logo size="lg" />
            </div>
            <DocsSidebarNav items={docsConfig.sidebarNav} />
          </div>
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8">
          <div className="mx-auto w-full min-w-0">
            <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">Docs</div>
              <span className="mx-1">/</span>
              <div className="font-medium text-foreground">
                {metadata.title?.toString().split(" | ")[0]}
              </div>
            </div>
            <div className="space-y-2">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {children}
              </div>
            </div>
            <div className="flex justify-center py-6 lg:py-10">
              <Link
                href="/docs"
                className={cn(buttonVariants({ variant: "outline" }), "mx-3")}
              >
                Documentation Home
              </Link>
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "outline" }), "mx-3")}
              >
                Back to Platform
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 