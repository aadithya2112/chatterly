"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Home,
  MessageSquare,
  Globe,
  Plus,
  Loader2,
  AlertCircle,
  Clock,
  User,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type Widget = {
  id: string;
  name: string;
  domain: string;
  apiKey: string;
  createdAt: string;
  conversations: any[];
  userCount: number;
  conversationCount: number;
};

export function DashboardNav() {
  const pathname = usePathname();
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const isWidgetActive = (id: string) => {
    return (
      pathname === `/dashboard/widgets/${id}` ||
      pathname?.startsWith(`/dashboard/widgets/${id}/`)
    );
  };

  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Authentication token not found");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/widgets", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch widgets: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.widgets) {
          setWidgets(data.widgets);
        } else {
          setWidgets([]);
        }
      } catch (err) {
        console.error("Error fetching widgets:", err);
        setError("Failed to load widgets");
      } finally {
        setLoading(false);
      }
    };

    fetchWidgets();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="space-y-5 px-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              OVERVIEW
            </p>
            <div className="grid gap-1 px-2">
              <Link href="/dashboard">
                <Button
                  variant={
                    isActive("/dashboard") && !pathname?.includes("/widgets/")
                      ? "secondary"
                      : "ghost"
                  }
                  size="sm"
                  className={cn(
                    "w-full justify-start",
                    isActive("/dashboard") &&
                      !pathname?.includes("/widgets/") &&
                      "font-medium"
                  )}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              {/* <Link href="/dashboard/analytics">
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
              </Link> */}
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                WIDGETS
              </p>
              <Link href="/dashboard/create">
                <Button variant="outline" size="icon" className="h-6 w-6">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-1 px-2">
              {loading ? (
                // Loading state
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="px-2 py-1.5">
                      <Skeleton className="h-4 w-[70%] mb-1.5" />
                      <Skeleton className="h-3 w-[40%]" />
                    </div>
                  ))}
                </>
              ) : error ? (
                // Error state
                <div className="px-2 py-3 text-center">
                  <AlertCircle className="h-5 w-5 text-destructive mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{error}</p>
                </div>
              ) : widgets.length === 0 ? (
                // Empty state
                <div className="px-2 py-3 text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    No widgets found
                  </p>
                  <Link href="/dashboard/create">
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-1" />
                      Create Widget
                    </Button>
                  </Link>
                </div>
              ) : (
                // Widget list
                widgets.map((widget) => (
                  <Link key={widget.id} href={`/dashboard/widget/${widget.id}`}>
                    <Button
                      variant={
                        isWidgetActive(widget.id) ? "secondary" : "ghost"
                      }
                      size="sm"
                      className={cn(
                        "w-full justify-start flex-col items-start h-auto normal-case font-normal py-2",
                        isWidgetActive(widget.id) && "bg-secondary/50"
                      )}
                    >
                      <div className="flex items-center w-full">
                        <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{widget.name}</span>
                      </div>
                      {/* <div className="flex items-center gap-3 mt-1 w-full pl-6">
                        <div className="flex items-center text-[10px] text-muted-foreground">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          {widget.conversationCount}
                        </div>
                        <div className="flex items-center text-[10px] text-muted-foreground">
                          <User className="mr-1 h-3 w-3" />
                          {widget.userCount}
                        </div>
                        <div className="ml-auto text-[10px] text-muted-foreground">
                          {new Date(widget.createdAt).toLocaleDateString()}
                        </div>
                      </div> */}
                    </Button>
                  </Link>
                ))
              )}
            </div>
            {widgets.length > 0 && (
              <div className="mt-2 px-4">
                <Link href="/dashboard/create">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-7"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    New Widget
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
