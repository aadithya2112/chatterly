"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Clock,
  User,
  Globe,
  ChevronDown,
  Download,
  ExternalLink,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow, format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageBubble } from "@/components/message-bubble";
import { ConversationMetaCard } from "@/components/conversation-meta-card";
import { ConversationLoadingState } from "@/components/conversation-loading-state";
import { ConversationErrorState } from "@/components/conversation-error-state";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of messages when they load
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length]);

  useEffect(() => {
    const fetchConversationDetails = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("You are not logged in. Please log in to continue.");
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
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

  // Helper functions for formatting
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  const getDuration = () => {
    if (!conversation) return "";

    const start = new Date(conversation.startedAt);
    const end = conversation.endedAt
      ? new Date(conversation.endedAt)
      : new Date();
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / 60000);

    if (minutes < 1) {
      return "Less than a minute";
    } else if (minutes === 1) {
      return "1 minute";
    } else {
      return `${minutes} minutes`;
    }
  };

  const handleExport = () => {
    if (!conversation) return;

    // Create transcript content
    const transcript = conversation.messages
      .map((msg) => {
        const sender = msg.isUserMessage
          ? conversation.user.name || "User"
          : "Assistant";
        const time = format(new Date(msg.timestamp), "yyyy-MM-dd HH:mm:ss");
        return `[${time}] ${sender}: ${msg.content}`;
      })
      .join("\n\n");

    const header = `Conversation with ${conversation.user.name || "Anonymous User"}\n`;
    const metadata = `Site: ${conversation.site.name} (${conversation.site.domain})\n`;
    const dateInfo = `Started: ${formatDate(conversation.startedAt)}\n`;
    const endInfo = conversation.endedAt
      ? `Ended: ${formatDate(conversation.endedAt)}\n`
      : "Status: Active\n";
    const separator = "=".repeat(50) + "\n\n";

    const fullTranscript =
      header + metadata + dateInfo + endInfo + separator + transcript;

    // Create download link
    const element = document.createElement("a");
    const file = new Blob([fullTranscript], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `conversation-${conversation.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("Conversation exported successfully!");
  };

  if (loading) {
    return <ConversationLoadingState />;
  }

  if (!conversation) {
    return <ConversationErrorState />;
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Conversation Details"
        text={`Viewing conversation from ${conversation.site.name}`}
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/widgets/${conversation.site.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Widget
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Transcript
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share Conversation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`https://${conversation.site.domain}`}
                  target="_blank"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Website
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DashboardHeader>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 px-3 py-1"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {conversation.messages.length} messages
          </Badge>
          <Badge
            variant={conversation.endedAt ? "outline" : "default"}
            className={
              conversation.endedAt
                ? ""
                : "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
            }
          >
            {conversation.endedAt ? "Ended" : "Active"}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Duration: {getDuration()}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Started{" "}
          {formatDistanceToNow(new Date(conversation.startedAt), {
            addSuffix: true,
          })}
          {conversation.endedAt &&
            ` • Ended ${formatDistanceToNow(new Date(conversation.endedAt), { addSuffix: true })}`}
        </p>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-3">
        <ConversationMetaCard
          icon={<User className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
          title="User"
          value={conversation.user.name || "Anonymous"}
          subtext={conversation.user.email || "No email provided"}
        />

        <ConversationMetaCard
          icon={
            <Globe className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          }
          title="Website"
          value={conversation.site.name}
          subtext={conversation.site.domain}
          badge={
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              asChild
            >
              <Link href={`/dashboard/widgets/${conversation.site.id}`}>
                View
              </Link>
            </Button>
          }
        />

        <ConversationMetaCard
          icon={
            <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          }
          title="Conversation Time"
          value={formatDate(conversation.startedAt)}
          subtext={
            conversation.endedAt
              ? `Ended: ${formatDate(conversation.endedAt)}`
              : "Currently active"
          }
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" /> Message History
        </h2>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="bg-background border rounded-lg p-5">
        <div className="space-y-6 max-w-4xl mx-auto">
          {conversation.messages.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground mb-2">
                No messages found in this conversation.
              </p>
              <p className="text-sm text-muted-foreground">
                This may be a connection that was started but no messages were
                exchanged.
              </p>
            </div>
          )}

          {conversation.messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              isUserMessage={message.isUserMessage}
              timestamp={message.timestamp}
              userName={conversation.user.name}
              aiModel={message.aiModel}
            />
          ))}

          <div ref={messagesEndRef} />

          {conversation.messages.length > 0 && !conversation.endedAt && (
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className="animate-pulse bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              >
                Conversation is active
              </Badge>
            </div>
          )}

          {conversation.messages.length > 0 && conversation.endedAt && (
            <div className="border-t pt-4 mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                This conversation ended{" "}
                {formatDistanceToNow(new Date(conversation.endedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
