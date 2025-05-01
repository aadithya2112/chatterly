"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BarChart3, Home, MessageSquare, Plus, Settings } from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-2 py-4">
      <Link href="/dashboard" className="flex items-center mb-8 px-4">
        <MessageSquare className="mr-2 h-4 w-4" />
        <span className="font-medium">Dashboard</span>
      </Link>
      <div className="grid gap-1">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              pathname === "/dashboard" && "bg-accent"
            )}
          >
            <Home className="mr-2 h-4 w-4" />
            Overview
          </Button>
        </Link>
        <Link href="/dashboard/create">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              pathname === "/dashboard/create" && "bg-accent"
            )}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Widget
          </Button>
        </Link>
        <Link href="/dashboard/analytics">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              pathname === "/dashboard/analytics" && "bg-accent"
            )}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </Link>
        <Link href="/dashboard/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              pathname === "/dashboard/settings" && "bg-accent"
            )}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>
    </nav>
  );
}
