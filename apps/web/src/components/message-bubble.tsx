import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bot, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface MessageBubbleProps {
  content: string;
  isUserMessage: boolean;
  timestamp: string;
  userName?: string;
  aiModel?: string | null;
}

export function MessageBubble({
  content,
  isUserMessage,
  timestamp,
  userName,
  aiModel,
}: MessageBubbleProps) {
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

  const getModelColor = (model: string | null | undefined) => {
    if (!model) return "bg-primary/10";
    const models: Record<string, string> = {
      "gpt-4":
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "gpt-3.5":
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      claude:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      mistral:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    };

    // Find a matching model name
    for (const key in models) {
      if (model.toLowerCase().includes(key.toLowerCase())) {
        return models[key];
      }
    }

    return "bg-primary/10";
  };

  return (
    <div
      className={cn(
        "flex gap-3",
        isUserMessage ? "justify-end" : "justify-start",
        "group hover:bg-muted/50 rounded-lg py-1.5 px-2 -mx-2 transition-colors"
      )}
    >
      {!isUserMessage && (
        <div className="pt-1">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/20 text-primary dark:bg-primary/50">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      <div
        className={cn(
          "rounded-lg px-4 py-3 max-w-[85%] relative shadow-sm",
          isUserMessage
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-muted rounded-tl-none"
        )}
      >
        <div className="flex justify-between items-center mb-1.5">
          <span
            className={cn(
              "text-xs font-medium flex items-center gap-1",
              isUserMessage && "text-primary-foreground/90"
            )}
          >
            {isUserMessage ? "User" : "Assistant"}
            {!isUserMessage && aiModel && (
              <Badge
                variant="secondary"
                className={cn("text-[10px] py-0 h-4", getModelColor(aiModel))}
              >
                {aiModel}
              </Badge>
            )}
          </span>
        </div>
        <div className="whitespace-pre-wrap text-sm">{content}</div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-muted-foreground absolute bottom-1 right-3 flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" />
          {formattedTime} · {timeAgo}
        </div>
      </div>

      {isUserMessage && (
        <div className="pt-1">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {userName?.[0].toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
}
