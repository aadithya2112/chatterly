"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { ArrowLeft, Clock, ExternalLink, User } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { StatsCards } from "@/components/stats-card";
import { ActivityChart } from "@/components/activity-chart";
import { ConversationsTab } from "@/components/conversations-tab";
import { UsersTab } from "@/components/users-tab";
import { IntegrationTab } from "@/components/integration-tab";
import { WidgetDetails } from "@/lib/types";

export default function WidgetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [widget, setWidget] = useState<WidgetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const widgetId = params.id as string;

  useEffect(() => {
    const fetchWidgetDetails = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("You are not logged in. Please log in to continue.");
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/widgets/${widgetId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setWidget(data.widget);
        } else {
          toast.error(data.error || "Failed to fetch widget details.");
          if (response.status === 404) {
            router.push("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error fetching widget details:", error);
        toast.error("An error occurred while fetching widget details.");
      } finally {
        setLoading(false);
      }
    };

    if (widgetId) {
      fetchWidgetDetails();
    }
  }, [widgetId, router]);

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (!widget) {
    return <ErrorState />;
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={widget.name}
        text={`Analytics and performance data for your chat widget`}
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link
              href={`https://${widget.domain}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Website
            </Link>
          </Button>
        </div>
      </DashboardHeader>

      <div className="flex items-center mb-6 gap-2">
        <Badge
          variant="secondary"
          className="text-base font-normal py-1.5 px-3 flex items-center gap-1.5"
        >
          {widget.domain}
        </Badge>
        <Badge
          variant="outline"
          className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
        >
          Created {new Date(widget.createdAt).toLocaleDateString()}
        </Badge>
      </div>

      {/* Stats Cards Section */}
      {/* <div className="grid gap-6 mb-8">
        <StatsCards widget={widget} />
        <ActivityChart widget={widget} />
      </div> */}

      {/* Tabs Section */}
      <div className="mb-8">
        <Tabs defaultValue="conversations" className="w-full">
          <TabsList className="h-11">
            <TabsTrigger value="conversations" className="flex gap-2">
              Conversations
            </TabsTrigger>
            <TabsTrigger value="users" className="flex gap-2">
              Users
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex gap-2">
              Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conversations">
            <ConversationsTab widget={widget} router={router} />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab widget={widget} />
          </TabsContent>

          <TabsContent value="integration">
            <IntegrationTab widget={widget} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
