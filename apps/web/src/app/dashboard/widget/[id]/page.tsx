"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  ExternalLink,
  Key,
  MessageSquare,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type WidgetDetails = {
  id: string;
  name: string;
  domain: string;
  apiKey: string;
  createdAt: string;
  stats: {
    totalUsers: number;
    totalConversations: number;
    todayUsers: number;
    todayConversations: number;
  };
  recentUsers: {
    id: string;
    email: string | null;
    name: string | null;
    createdAt: string;
  }[];
  recentConversations: {
    id: string;
    startedAt: string;
    endedAt: string | null;
    messageCount: number;
    user: {
      id: string;
      name: string;
      email: string | null;
    };
  }[];
};

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64">
          <p>Loading widget details...</p>
        </div>
      </DashboardShell>
    );
  }

  if (!widget) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p>Widget not found or you don't have access to it.</p>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={widget.name}
        text={`Details and analytics for ${widget.domain}`}
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href={`https://${widget.domain}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Site
            </Link>
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{widget.stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {widget.stats.todayUsers} new today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Conversations
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {widget.stats.totalConversations}
            </div>
            <p className="text-xs text-muted-foreground">
              {widget.stats.todayConversations} new today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Domain</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium truncate">{widget.domain}</div>
            <p className="text-xs text-muted-foreground">
              Created {new Date(widget.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Key</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium truncate">{widget.apiKey}</div>
            <p className="text-xs text-muted-foreground">
              For widget integration
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="conversations">
          <TabsList>
            <TabsTrigger value="conversations">
              Recent Conversations
            </TabsTrigger>
            <TabsTrigger value="users">Recent Users</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {widget.recentUsers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {widget.recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name || "Anonymous"}
                          </TableCell>
                          <TableCell>{user.email || "Not provided"}</TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No users yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Recent Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {widget.recentConversations.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Started</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Messages</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {widget.recentConversations.map((convo) => (
                        <TableRow
                          key={convo.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() =>
                            router.push(`/dashboard/conversations/${convo.id}`)
                          }
                        >
                          <TableCell className="font-medium">
                            {convo.user.name || "Anonymous"}
                          </TableCell>
                          <TableCell>{formatDate(convo.startedAt)}</TableCell>
                          <TableCell>
                            {convo.endedAt ? (
                              <span className="text-muted-foreground">
                                Ended
                              </span>
                            ) : (
                              <span className="text-green-600">Active</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-between">
                              <span>{convo.messageCount}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(
                                    `/dashboard/conversations/${convo.id}`
                                  );
                                }}
                                className="text-green-700"
                              >
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No conversations yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
