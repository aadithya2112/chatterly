"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BarChart3, Home } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DashboardNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  // Format date as YYYY-MM-DD HH:MM:SS
  const formatDate = () => {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    const hours = String(now.getUTCHours()).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    const seconds = String(now.getUTCSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <ScrollArea className="h-full py-2">
      <div className="space-y-4 px-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground px-2 py-1.5">
            OVERVIEW
          </p>
          <div className="grid gap-1 px-2">
            <Link href="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  isActive("/dashboard") && "font-medium"
                )}
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button
                variant={
                  isActive("/dashboard/analytics") ? "secondary" : "ghost"
                }
                size="sm"
                className={cn(
                  "w-full justify-start",
                  isActive("/dashboard/analytics") && "font-medium"
                )}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
