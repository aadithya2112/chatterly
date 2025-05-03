"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  BarChart3,
  MessageSquare,
  Plus,
  Users,
  RefreshCw,
  Loader2,
  LayoutDashboard,
  Globe,
  Zap,
} from "lucide-react";
import { WidgetCard } from "@/components/widget-card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Updated type for a widget to match the API response
type Widget = {
  id: string;
  name: string;
  domain: string;
  apiKey: string;
  conversations: any[];
  userCount: number;
  conversationCount: number;
  createdAt: string;
};

export default function Dashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [totalConversations, setTotalConversations] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentView, setCurrentView] = useState("grid");
  const currentDate = "2025-05-03 06:59:52"; // Using the provided date

  const fetchWidgets = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("You are not logged in. Please log in to continue.");
      setLoading(false);
      return;
    }

    try {
      setRefreshing(true);
      const response = await fetch("/api/widgets", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setWidgets(data.widgets);

        // Calculate totals using the counts from the API
        const totalUsers = data.widgets.reduce(
          (sum: number, widget: Widget) => sum + (widget.userCount || 0),
          0
        );
        setTotalUsers(totalUsers);

        const totalConversations = data.widgets.reduce(
          (sum: number, widget: Widget) =>
            sum + (widget.conversationCount || 0),
          0
        );
        setTotalConversations(totalConversations);
      } else {
        toast.error(data.error || "Failed to fetch widgets.");
      }
    } catch (error) {
      console.error("Error fetching widgets:", error);
      toast.error("An error occurred while fetching widgets.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWidgets();

    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(
      () => {
        fetchWidgets();
      },
      5 * 60 * 1000
    );

    return () => clearInterval(refreshInterval);
  }, []);

  // Handle widget deletion
  const handleWidgetDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("authToken");

      // First, update UI immediately for better UX
      const deletedWidget = widgets.find((w) => w.id === id);
      setWidgets(widgets.filter((widget) => widget.id !== id));

      if (deletedWidget) {
        setTotalUsers((prev) => prev - (deletedWidget.userCount || 0));
        setTotalConversations(
          (prev) => prev - (deletedWidget.conversationCount || 0)
        );
      }

      // Then actually delete from the backend
      const response = await fetch(`/api/widgets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Widget was successfully removed");
      } else {
        // If something went wrong, refresh to get accurate data
        toast.error(data.error || "Failed to delete widget");
        fetchWidgets();
      }
    } catch (error) {
      console.error("Error deleting widget:", error);
      toast.error("An error occurred while deleting the widget");
      fetchWidgets();
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Create and manage your AI-powered chat widgets."
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchWidgets()}
            disabled={refreshing}
            title="Refresh data"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <Link href="/dashboard/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Widget
            </Button>
          </Link>
        </div>
      </DashboardHeader>

      {/* Stats Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Widgets</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-blue-700 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20 mb-2" />
            ) : (
              <>
                <div className="text-3xl font-bold">{widgets.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active chat widgets
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Conversations
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-violet-700 dark:text-violet-400" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20 mb-2" />
            ) : (
              <>
                <div className="text-3xl font-bold">{totalConversations}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  User interactions
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <Users className="h-4 w-4 text-teal-700 dark:text-teal-400" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20 mb-2" />
            ) : (
              <>
                <div className="text-3xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Unique visitors
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Getting Started</CardTitle>
              <Badge variant="outline">Tips</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Create your widget</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize appearance and AI settings to match your brand.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                  <Globe className="h-5 w-5 text-violet-700 dark:text-violet-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Embed on your site</h3>
                  <p className="text-sm text-muted-foreground">
                    Add our lightweight script to your website with one line of
                    code.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                  <LayoutDashboard className="h-5 w-5 text-teal-700 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Monitor analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Track conversations and user engagement in real-time.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Widget List Section */}
      <div>
        {/* Widget List Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Widgets</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted rounded-md">
              <Button
                variant={currentView === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="h-8"
                onClick={() => setCurrentView("grid")}
              >
                Grid
              </Button>
              <Button
                variant={currentView === "list" ? "secondary" : "ghost"}
                size="sm"
                className="h-8"
                onClick={() => setCurrentView("list")}
              >
                List
              </Button>
            </div>
            <Link href="/dashboard/create">
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Widget
              </Button>
            </Link>
          </div>
        </div>

        {/* Widget List Content */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </CardFooter>
                </Card>
              ))}
          </div>
        ) : widgets.length > 0 ? (
          currentView === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2">
              {widgets.map((widget) => (
                <WidgetCard
                  key={widget.id}
                  widget={{
                    ...widget,
                    conversations: widget.conversationCount,
                  }}
                  onDelete={handleWidgetDelete}
                />
              ))}
            </div>
          ) : (
            <Card>
              <ScrollArea className="h-[400px]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Domain</th>
                      <th className="text-left p-3 font-medium">Users</th>
                      <th className="text-left p-3 font-medium">
                        Conversations
                      </th>
                      <th className="text-left p-3 font-medium">Created</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {widgets.map((widget) => (
                      <tr
                        key={widget.id}
                        className="border-b hover:bg-muted/40"
                      >
                        <td className="p-3">
                          <div className="font-medium">{widget.name}</div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{widget.domain}</Badge>
                        </td>
                        <td className="p-3">{widget.userCount}</td>
                        <td className="p-3">{widget.conversationCount}</td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {new Date(widget.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/dashboard/edit/${widget.id}`}>
                              <Button size="sm" variant="ghost">
                                Edit
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleWidgetDelete(widget.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </Card>
          )
        ) : (
          <Card className="p-8 text-center">
            <div className="mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 w-12 h-12 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-blue-700 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No widgets found</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              You haven't created any chat widgets yet. Get started by creating
              your first widget to engage with your website visitors.
            </p>
            <div className="flex justify-center">
              <Link href="/dashboard/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first widget
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
