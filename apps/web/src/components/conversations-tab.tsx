import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Eye, ChevronRight, MessageSquare } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { WidgetDetails } from "@/lib/types";

interface ConversationsTabProps {
  widget: WidgetDetails;
  router: AppRouterInstance;
}

export function ConversationsTab({ widget, router }: ConversationsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "ended">(
    "all"
  );

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getFilteredConversations = () => {
    return widget.recentConversations.filter((convo) => {
      // Apply active/ended filter
      if (activeFilter === "active" && convo.endedAt) return false;
      if (activeFilter === "ended" && !convo.endedAt) return false;

      // Apply search filter
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();

      return (
        (convo.user.name &&
          convo.user.name.toLowerCase().includes(searchLower)) ||
        (convo.user.email &&
          convo.user.email.toLowerCase().includes(searchLower)) ||
        convo.id.toLowerCase().includes(searchLower)
      );
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Conversations</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={activeFilter === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter("all")}
            >
              All
            </Button>
            <Button
              variant={activeFilter === "active" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={activeFilter === "ended" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter("ended")}
            >
              Ended
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {widget.recentConversations.length > 0 ? (
          <ScrollArea className="h-[420px] pr-4">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredConversations().map((convo) => (
                  <TableRow key={convo.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            className={
                              convo.endedAt
                                ? "bg-gray-200"
                                : "bg-blue-100 text-blue-700"
                            }
                          >
                            {getInitials(convo.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {convo.user.name || "Anonymous"}
                          </div>
                          {convo.user.email && (
                            <div className="text-xs text-muted-foreground">
                              {convo.user.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {new Date(convo.startedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(convo.startedAt).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {convo.endedAt ? (
                        <div className="text-sm">
                          {Math.round(
                            (new Date(convo.endedAt).getTime() -
                              new Date(convo.startedAt).getTime()) /
                              60000
                          )}{" "}
                          min
                        </div>
                      ) : (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {convo.messageCount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/conversations/${convo.id}`)
                        }
                        className="h-8"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {getFilteredConversations().length === 0 && (
              <div className="py-12 text-center">
                <Search className="h-8 w-8 mx-auto text-muted-foreground mb-4 opacity-40" />
                <p className="text-muted-foreground">
                  No matching conversations found
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </ScrollArea>
        ) : (
          <div className="py-32 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground mb-2">No conversations yet</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              When users interact with your widget, conversations will appear
              here.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Showing {getFilteredConversations().length} of{" "}
          {widget.recentConversations.length} conversations
        </div>
        <Button variant="outline" size="sm">
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
