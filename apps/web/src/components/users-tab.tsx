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
import { Search, Eye, ChevronRight, Users } from "lucide-react";
import { useState } from "react";
import { WidgetDetails } from "@/lib/types";

interface UsersTabProps {
  widget: WidgetDetails;
}

export function UsersTab({ widget }: UsersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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

  const getFilteredUsers = () => {
    if (!searchTerm) return widget.recentUsers;

    const searchLower = searchTerm.toLowerCase();
    return widget.recentUsers.filter((user) => {
      return (
        (user.name && user.name.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        user.id.toLowerCase().includes(searchLower)
      );
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Widget Users</CardTitle>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {widget.recentUsers.length > 0 ? (
          <ScrollArea className="h-[420px] pr-4">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Conversations</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredUsers().map((user) => {
                  // Count conversations for this user
                  const userConversations = widget.recentConversations.filter(
                    (c) => c.user.id === user.id
                  ).length;

                  return (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-violet-100 text-violet-700">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.name || "Anonymous"}
                            </div>
                            {user.email && (
                              <div className="text-xs text-muted-foreground">
                                {user.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {userConversations}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {getFilteredUsers().length === 0 && (
              <div className="py-12 text-center">
                <Search className="h-8 w-8 mx-auto text-muted-foreground mb-4 opacity-40" />
                <p className="text-muted-foreground">No matching users found</p>
                <Button variant="link" onClick={() => setSearchTerm("")}>
                  Clear search
                </Button>
              </div>
            )}
          </ScrollArea>
        ) : (
          <div className="py-32 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground mb-2">No users yet</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              When users interact with your widget, they'll appear here.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Showing {getFilteredUsers().length} of {widget.stats.totalUsers} users
        </div>
        <Button variant="outline" size="sm">
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
