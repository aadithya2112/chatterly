"use client";

import { useState, type ReactNode } from "react";
import { MessageSquare, Menu, X } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import { DashboardNav } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Menu"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <div className="hidden md:flex md:items-center md:gap-2">
              <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-1 rounded-md">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                Chatterly
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* <ThemeToggle /> */}
            <UserNav />
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Mobile sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:hidden",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="pt-16 h-full">
            <DashboardNav />
          </div>
        </aside>

        {/* Desktop sidebar */}
        <aside className="hidden md:block shrink-0 w-64 border-r">
          <DashboardNav />
        </aside>

        <main className="flex-1 overflow-auto">
          {/* Removed max-w-6xl to allow content to use full width on larger screens */}
          <div className="px-4 py-6 md:px-6 md:py-8 lg:px-8 xl:px-10 2xl:px-12">
            {children}
          </div>
        </main>
      </div>

      <footer className="border-t py-4 bg-muted/40">
        <div className="flex justify-between items-center px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="flex items-center gap-2">
            {/* <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-0.5 rounded-md">
              <MessageSquare className="h-3 w-3 text-white" />
            </div> */}
            <p className="text-xs text-muted-foreground">
              {/* © 2025 Chatterly. All rights reserved. */}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Made by aaditha and link to github */}
            <p className="text-xs text-muted-foreground">
              Made by{" "}
              <a
                href="https://www.github.com/aadithya2112"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                aadithya2112
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
