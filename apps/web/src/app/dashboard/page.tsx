"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { BarChart3, MessageSquare, Plus, Users } from "lucide-react";
import { WidgetCard } from "@/components/widget-card";
import { toast } from "sonner";

// Updated type for a widget to match the API response
type Widget = {
  id: string;
  name: string;
  domain: string;
  apiKey: string;
  conversations: any[]; // Array of conversation objects
  userCount: number; // Now includes the user count from the API
  conversationCount: number; // Also includes the conversation count
  createdAt: string;
};

export default function Dashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [totalConversations, setTotalConversations] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchWidgets = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("You are not logged in. Please log in to continue.");
      setLoading(false);
      return;
    }

    try {
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
    }
  };

  useEffect(() => {
    fetchWidgets();
  }, []);

  // Handle widget deletion
  const handleWidgetDelete = async (id: string) => {
    // Option 1: Remove the widget immediately from UI for responsive feel
    // setWidgets(widgets.filter(widget => widget.id !== id));

    // Option 2: Refresh the whole widget list
    // This ensures we have accurate data after deletion
    await fetchWidgets();

    toast.success("Widget was successfully removed");
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Create and manage your chat widgets."
      >
        <Link href="/dashboard/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Widget
          </Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Widgets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{widgets.length}</div>
            {/* <p className="text-xs text-muted-foreground">+1 from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Conversations
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversations}</div>
            {/* <p className="text-xs text-muted-foreground">+32 from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            {/* <p className="text-xs text-muted-foreground">+8 from last month</p> */}
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Widgets</h2>
          <Link href="/dashboard/create">
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Widget
            </Button>
          </Link>
        </div>
        {loading ? (
          <p>Loading widgets...</p>
        ) : widgets.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {widgets.map((widget) => (
              <WidgetCard
                key={widget.id}
                widget={{
                  ...widget,
                  conversations: widget.conversationCount, // Use the conversation count for the WidgetCard
                }}
                onDelete={handleWidgetDelete}
              />
            ))}
          </div>
        ) : (
          <p>No widgets found. Create your first widget now!</p>
        )}
      </div>
    </DashboardShell>
  );
}
