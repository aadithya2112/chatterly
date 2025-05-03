import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Key,
  UserCheck,
  MessageCircle,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { WidgetDetails } from "@/lib/types";

interface StatsCardsProps {
  widget: WidgetDetails;
}

export function StatsCards({ widget }: StatsCardsProps) {
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const copyApiKey = () => {
    if (widget?.apiKey) {
      navigator.clipboard.writeText(widget.apiKey);
      setApiKeyCopied(true);
      toast.success("API key copied to clipboard!");
      setTimeout(() => setApiKeyCopied(false), 2000);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <UserCheck className="h-4 w-4 text-blue-700 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{widget.stats.totalUsers}</div>
          <div className="flex items-center text-sm">
            <span className="text-muted-foreground mr-2">Today:</span>
            <Badge
              variant="outline"
              className={
                widget.stats.todayUsers > 0
                  ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : ""
              }
            >
              +{widget.stats.todayUsers}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-violet-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversations</CardTitle>
          <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-violet-700 dark:text-violet-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {widget.stats.totalConversations}
          </div>
          <div className="flex items-center text-sm">
            <span className="text-muted-foreground mr-2">Today:</span>
            <Badge
              variant="outline"
              className={
                widget.stats.todayConversations > 0
                  ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : ""
              }
            >
              +{widget.stats.todayConversations}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Messages</CardTitle>
          <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Activity className="h-4 w-4 text-amber-700 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {widget.stats.totalConversations > 0
              ? Math.round(
                  widget.recentConversations.reduce(
                    (sum, conv) => sum + conv.messageCount,
                    0
                  ) / widget.recentConversations.length
                )
              : 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Messages per conversation
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-emerald-500 relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">API Key</CardTitle>
          <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Key className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="font-mono text-sm truncate max-w-[150px]">
              {widget.apiKey.substring(0, 8)}••••••••
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyApiKey}
              className="h-8 px-2"
            >
              {apiKeyCopied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Widget authentication
          </p>
        </CardContent>
        <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-transparent to-emerald-100 dark:to-emerald-900/10 rounded-full"></div>
      </Card>
    </div>
  );
}
