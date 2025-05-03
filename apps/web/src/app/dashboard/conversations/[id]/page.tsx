"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { ArrowLeft, Calendar, ExternalLink, User } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Message = {
  id: string;
  content: string;
  isUserMessage: boolean;
  aiModel: string | null;
  timestamp: string;
};

type ConversationDetails = {
  id: string;
  startedAt: string;
  endedAt: string | null;
  site: {
    id: string;
    name: string;
    domain: string;
  };
  user: {
    id: string;
    name: string;
    email: string | null;
  };
  messages: Message[];
};

export default function ConversationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [conversation, setConversation] = useState<ConversationDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const conversationId = params.id as string;

  useEffect(() => {
    const fetchConversationDetails = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("You are not logged in. Please log in to continue.");
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`/api/conversations/${conversationId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setConversation(data.conversation);
        } else {
          toast.error(data.error || "Failed to fetch conversation details.");
          if (response.status === 404) {
            router.push("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error fetching conversation details:", error);
        toast.error("An error occurred while fetching conversation details.");
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchConversationDetails();
    }
  }, [conversationId, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64">
          <p>Loading conversation...</p>
        </div>
      </DashboardShell>
    );
  }

  if (!conversation) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p>Conversation not found or you don't have access to it.</p>
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
        heading="Conversation Details"
        text={`Conversation from ${conversation.site.name}`}
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/widgets/${conversation.site.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Widget
            </Link>
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-4 mb-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4" />
              <span className="font-medium">User</span>
            </div>
            <p>{conversation.user.name}</p>
            {conversation.user.email && (
              <p className="text-sm text-muted-foreground">
                {conversation.user.email}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Date</span>
            </div>
            <p>{formatDate(conversation.startedAt)}</p>
            <p className="text-sm text-muted-foreground">
              {conversation.endedAt
                ? `Ended: ${formatDate(conversation.endedAt)}`
                : "Conversation active"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <ExternalLink className="h-4 w-4" />
              <span className="font-medium">Site</span>
            </div>
            <p>{conversation.site.name}</p>
            <p className="text-sm text-muted-foreground">
              {conversation.site.domain}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Messages</h2>
        <Badge variant={conversation.endedAt ? "outline" : "default"}>
          {conversation.endedAt ? "Ended" : "Active"}
        </Badge>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isUserMessage ? "justify-end" : "justify-start"}`}
          >
            {!message.isUserMessage && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  AI
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.isUserMessage
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <div className="mb-1">
                <span className="text-xs font-medium">
                  {message.isUserMessage ? "User" : message.aiModel || "AI"}
                </span>
                <span className="text-xs ml-2 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div>{message.content}</div>
            </div>

            {message.isUserMessage && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {conversation.user.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {conversation.messages.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">
            No messages found in this conversation.
          </p>
        )}
      </div>
    </DashboardShell>
  );
}
