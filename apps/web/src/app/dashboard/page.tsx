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

// Define the type for a widget
type Widget = {
  id: string;
  name: string;
  domain: string;
  apiKey: string;
  conversations: number;
  createdAt: string;
};

export default function Dashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [totalConversations, setTotalConversations] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          const totalConversations = data.widgets.reduce(
            (sum: number, widget: Widget) => sum + (widget.conversations || 0),
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

    fetchWidgets();
  }, []);

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
            <p className="text-xs text-muted-foreground">+1 from last month</p>
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
            <p className="text-xs text-muted-foreground">+32 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+8 from last month</p>
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
              <WidgetCard key={widget.id} widget={widget} />
            ))}
          </div>
        ) : (
          <p>No widgets found. Create your first widget now!</p>
        )}
      </div>
    </DashboardShell>
  );
}
